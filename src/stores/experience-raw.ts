import { defineStore } from "pinia";
import { useNotifications } from "@/stores/notifications";
import { useExperienceRawApi } from "@/composables/useExperienceRawApi";
import { RawElement } from "@/types/generated/ExperienceRawServiceApi";

type FormCategory =
  | "experience_info"
  | "experience_settings"
  | "voucher"
  | "property_and_relevance";

type FormField<T> = {
  category: FormCategory;
  value: T;
};

type RequiredField =
  | "asterix_id"
  | "title"
  | "description"
  | "included"
  | "highlights"
  | "additional_services";

type SetRequired<A, K extends string> = {
  [property in keyof A]: {
    value: A[property]["value" & keyof A[property]];
    required: property extends K ? true : false;
    category: A[property]["category" & keyof A[property]];
  };
};
interface ExperienceRawContentFormBase {
  asterix_id: FormField<string>;
  title: FormField<string>;
  description: FormField<string>;
  highlights: FormField<string[]>;
  included: FormField<string[]>;
  non_included: FormField<string[]>;
  important_information: FormField<string[]>;
  info_voucher: FormField<string>;
  additional_services: FormField<string[]>;
}

export type ExperienceRawContentForm = SetRequired<
  ExperienceRawContentFormBase,
  RequiredField
>;

export interface ExperienceRawState {
  rawContents: {
    [key: string]: {
      fields: ExperienceRawContentForm;
      modified: boolean;
      data?: RawElement;
    };
  };
}

function mapFormToPayload(fields: ExperienceRawContentForm): RawElement {
  return {
    functional: {
      asterix_id: fields.asterix_id.value,
      highlights: fields.highlights.value,
      included: fields.included.value,
      non_included: fields.non_included.value,
      important_information: fields.important_information.value,
      additional_services: fields.additional_services.value,
    },
    commercial: {
      title: fields.title.value,
      description: fields.description.value,
      info_voucher: fields.info_voucher.value,
    },
  };
}

function mapPayloadToForm(data: RawElement): ExperienceRawContentForm {
  return {
    asterix_id: {
      value: data.functional?.asterix_id ?? "",
      required: true,
      category: "experience_settings",
    },
    title: {
      value: data.commercial.title,
      required: true,
      category: "experience_settings",
    },
    description: {
      value: data.commercial.description ?? "",
      required: true,
      category: "experience_info",
    },
    highlights: {
      value: data.functional?.highlights ?? [],
      required: true,
      category: "experience_info",
    },
    included: {
      value: data.functional?.included ?? [],
      required: true,
      category: "experience_info",
    },
    non_included: {
      value: data.functional?.non_included ?? [],
      required: false,
      category: "experience_info",
    },
    important_information: {
      value: data.functional?.important_information ?? [],
      required: false,
      category: "experience_info",
    },
    info_voucher: {
      value: data.commercial.info_voucher ?? "",
      required: false,
      category: "voucher",
    },
    additional_services: {
      value: data.functional?.additional_services ?? [],
      required: true,
      category: "property_and_relevance",
    },
  };
}

export const useExperienceRaw = defineStore("experience-raw", {
  state: (): ExperienceRawState => {
    return {
      rawContents: {},
    };
  },
  getters: {
    requiredFields:
      (state) =>
      (experienceId: string): Partial<ExperienceRawContentForm> => {
        return Object.entries(state.rawContents[experienceId].fields).reduce(
          (res, [field, value]) => {
            if (value.required) {
              res[field] = value;
            }
            return res;
          },
          {} as { [key: string]: FormField<string | string[]> }
        );
      },
    submitEnabled() {
      return (experienceId: string) =>
        Object.values(this.requiredFields(experienceId)).every(
          (field) => field.value && field.value.length > 0
        );
    },
  },
  actions: {
    createDocument(id: string, data?: RawElement) {
      this.rawContents[id] = {
        modified: false,
        fields: mapPayloadToForm(data ?? { commercial: { title: "" } }),
        data,
      };
    },
    async getRawDocument(id: string) {
      const { getRawExperience } = useExperienceRawApi();
      const notificationStore = useNotifications();

      await getRawExperience(`experience-raw/${id}`)
        .then(({ data }) => {
          this.createDocument(id, data);
        })
        .catch(() => {
          notificationStore.addNotification({
            theme: "error",
            message: "notifications.error.fetching.document",
          });
        });
    },
    submitNewRawDocument(id: string, goCommercial = false) {
      const document = this.rawContents[id];

      if (!document) {
        throw new Error(`Document '${id}' was not found in Raw Documents`);
      }

      const notificationStore = useNotifications();
      const { postRawExperience } = useExperienceRawApi();

      return postRawExperience("experience-raw", {
        go_commercial: goCommercial,
        ...mapFormToPayload(document.fields),
      })
        .then((res) => {
          document.modified = false;

          if (!res.headers?.location) {
            throw new Error("Could not extract location from headers");
          }

          const contentId = res.headers.location.split("/")[2];

          notificationStore.addNotification({
            theme: "success",
            message: "notifications.success.saving.document",
          });
          return contentId;
        })
        .catch((error) => {
          notificationStore.addNotification({
            theme: "error",
            message: "notifications.error.creating.document",
          });
          throw error;
        });
    },
    async updateRawDocument(id: string, goCommercial = false) {
      const notificationStore = useNotifications();

      const document = this.rawContents[id];

      if (document) {
        const { putRawExperience } = useExperienceRawApi();

        await putRawExperience(`experience-raw/${id}`, {
          go_commercial: goCommercial,

          ...mapFormToPayload(document.fields),
        })
          .then(() => {
            document.modified = false;
            notificationStore.addNotification({
              theme: "success",
              message: "notifications.success.saving.document",
            });
          })
          .catch((error) => {
            notificationStore.addNotification({
              theme: "error",
              message: "notifications.error.saving.document",
            });
            throw error;
          });
      }
    },
  },
});
