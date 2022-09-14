import { defineStore } from "pinia";
import { useContentQueryApi } from "@/composables/useContentQueryApi";
import { useContentCommandApi } from "@/composables/useContentCommandApi";
import { useNotifications } from "@/stores/notifications";
import { useUser } from "@/stores/user";
import { useMasterData } from "@/stores/master-data";
import { ExperienceMedia, Image } from "@/types/generated/ContentQueryApi";
import {
  Image as ImageObj,
  ExperienceMedia as ExperienceMediaObj,
} from "@/types/generated/ContentCommandApi";
import { DocumentFlow, DocumentStatus } from "@/types/DocumentStatuses";

export interface ExperienceImage extends Image {
  original_file?: File;
}

type FormField<T> = {
  value: T;
  category: "media";
};

type RequiredField = "cover_image" | "gallery";

type SetRequired<A, K extends string> = {
  [property in keyof A]: {
    value: A[property]["value" & keyof A[property]];
    category: A[property]["category" & keyof A[property]];
    required: property extends K ? true : false;
  };
};
interface ExperienceMediaFormBase {
  cover_image: FormField<ExperienceImage | null>;
  gallery: FormField<ExperienceImage[]>;
}

export type ExperienceMediaForm = SetRequired<
  ExperienceMediaFormBase,
  RequiredField
>;

interface ExperienceMediaState {
  media: {
    [id: string]: {
      fields: ExperienceMediaForm;
      data: ExperienceMedia;
      modified: boolean;
      experience_title: string;
    };
  };
}

function mapPayloadToForm(images?: Image[]): ExperienceMediaForm {
  return {
    cover_image: {
      value: images?.filter((i) => i.is_cover)[0] ?? null,
      category: "media",
      required: true,
    },
    gallery: {
      value: images?.filter((i) => !i.is_cover) ?? [],
      category: "media",
      required: true,
    },
  };
}

export const useExperienceMedia = defineStore("experience-media", {
  state: (): ExperienceMediaState => ({ media: {} }),
  getters: {
    publishEnabled() {
      return (refCode: string) =>
        !!(
          this.media[refCode].fields.cover_image.value &&
          this.media[refCode].fields.gallery.value.length > 0
        );
    },
  },
  actions: {
    async loadExperienceMedia(experienceId: string) {
      const { getExperienceContent } = useContentQueryApi();
      const { addNotification } = useNotifications();

      try {
        const { data } = await getExperienceContent(
          `experience-content/${experienceId}`,
          { params: { language_code: "en" } }
        );

        const images = data.experience_media?.images;

        if (images) {
          images.sort((a, b) => {
            if (a.visualization_order && b.visualization_order) {
              return a.visualization_order - b.visualization_order;
            }
            return 1;
          });
        }

        const mediaDocument = {
          fields: mapPayloadToForm(images),
          modified: false,
          data: data.experience_media || {
            flow_id: DocumentFlow.MEDIA,
            status_id: DocumentStatus.DRAFT,
          },
          experience_title: data.experience_translation?.title as string,
        };

        this.media[data.experience_id] = mediaDocument;
      } catch (error) {
        addNotification({
          theme: "error",
          message: "notifications.error.fetching.media",
        });
        throw error;
      }
    },

    /**
     * Updates the experience-media entity. It also uploads new images and deletes the unused ones
     * @param experienceId ID of the experience
     * @param publish Optional - If set to true it will set the published status
     */
    async updateExperienceMedia(experienceId: string, publish = false) {
      const { putExperienceMedia, _axiosInstance } = useContentCommandApi();
      const { getFlowByCode, getStatusByCode } = useMasterData();
      const { addNotification } = useNotifications();

      try {
        const mediaDocument = this.media[experienceId].fields;
        const originalImages = this.media[experienceId].data.images;
        const updatedImages = [...mediaDocument.gallery.value];

        if (mediaDocument.cover_image.value) {
          updatedImages.push(mediaDocument.cover_image.value);
        }

        const imagesToUpload = updatedImages.filter(
          (i) => !originalImages?.map(({ id }) => id).includes(i.id)
        );
        const imagesToDelete = originalImages?.filter(
          (i) => !updatedImages.map(({ id }) => id).includes(i.id)
        );

        for (const image of imagesToUpload) {
          if (image.original_file) {
            const url = await this.uploadImage(image.original_file);
            image.id = url.split("/images/")[1];
          }
        }

        // Workaround - currently we don't have media id in the content-query
        const { data } = await _axiosInstance.get<ExperienceMediaObj[]>(
          "experience-media",
          {
            params: {
              filters: `experience_id==${experienceId}`,
            },
          }
        );

        const newExperienceMedia = {
          experience_id: data[0].experience_id,
          flow_id: getFlowByCode(DocumentFlow.MEDIA).id,
          status_id: getStatusByCode(DocumentStatus.IN_REVIEW).id,
          images: updatedImages.map((img) => ({
            id: img.id,
            is_cover: img.is_cover,
            visualization_order: img.visualization_order,
          })),
          publish,
        };

        if (publish) {
          newExperienceMedia.status_id = getStatusByCode(
            DocumentStatus.PUBLISHED
          ).id;
        }

        await putExperienceMedia(
          `experience-media/${data[0].id}`,
          newExperienceMedia
        );
        this.media[experienceId].data = {
          ...newExperienceMedia,
          images: updatedImages,
        };

        if (imagesToDelete) {
          for (const image of imagesToDelete) {
            await this.deleteImage(image.id);
          }
        }

        this.media[experienceId].modified = false;
        addNotification({
          theme: "success",
          message: "notifications.success.saving.media",
        });
      } catch (error) {
        addNotification({
          theme: "error",
          message: "notifications.error.saving.media",
        });
        throw error;
      }
    },

    /**
     * Uploads an image to the S3 bucket
     * @param image Image to upload
     * @returns Location of the uploaded image (relative url)
     */
    async uploadImage(image: File): Promise<string> {
      const { getFlowByCode, getStatusByCode } = useMasterData();
      const { addNotification } = useNotifications();
      const { postImage } = useContentCommandApi();

      try {
        const imageObj: ImageObj = {
          name: image.name,
          media_type: image.type,
          status_id: getStatusByCode(DocumentStatus.PUBLISHED).id,
          flow_id: getFlowByCode(DocumentFlow.MEDIA).id,
          supplier_id: useUser().user_uuid,
        };
        const encodedData = new TextEncoder().encode(JSON.stringify(imageObj));

        const formData = new FormData();
        formData.append("content_file", image);
        formData.append(
          "image",
          new Blob([encodedData], { type: "application/json" })
        );

        const { headers } = await postImage("images", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        return headers.location;
      } catch (error) {
        addNotification({
          theme: "error",
          message: "notifications.error.uploading.image",
        });
        throw error;
      }
    },

    /**
     * Used to delete an image from the S3 bucket
     * @param imageId ID of the image to delete
     */
    async deleteImage(imageId: string) {
      const { addNotification } = useNotifications();
      const { deleteImage } = useContentCommandApi();

      try {
        await deleteImage(`images/${imageId}`);
      } catch (error) {
        addNotification({
          theme: "error",
          message: "notifications.error.deleting.image",
        });
        throw error;
      }
    },
  },
});
