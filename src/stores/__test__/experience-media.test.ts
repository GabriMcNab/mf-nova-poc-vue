/* eslint-disable prefer-promise-reject-errors */
import { setActivePinia, createPinia } from "pinia";
import { describe, expect, test, beforeEach, vi, afterEach } from "vitest";
import { createMockContentQueryPayload } from "./utils/mock-content-query-payload";
import { useExperienceMedia } from "@/stores/experience-media";
import { AvailableLanguage } from "@/types/Language";
import { ExperienceContent, Images } from "@/types/generated/ContentQueryApi";

const availableLanguages = new Set<AvailableLanguage>(["en"]);

const masterdataStoreMock = {
  getStatusByCode: (code: string) => ({
    id: `test-status-${code}`,
  }),
  getFlowByCode: () => ({
    id: "test-flow-id",
  }),
};

const mockContentQueryPayload: ExperienceContent[] =
  createMockContentQueryPayload(availableLanguages);
const mockImages = mockContentQueryPayload[0].experience_media
  ?.images as Images;

const contentQueryApiMock = {
  getExperienceContent: vi.fn(() => ({ data: mockContentQueryPayload[0] })),
};

const contentCommandApiMock = {
  postImage: vi.fn(() => ({ headers: { location: "/images/new-img" } })),
  putImage: vi.fn(),
  deleteImage: vi.fn(),
  putExperienceMedia: vi.fn(),
  _axiosInstance: {
    get: vi.fn(() => ({
      data: [{ experience_id: "en-experience-id", id: "media-id" }],
    })),
  },
};

const notificationStoreMock = {
  addNotification: vi.fn(),
};

const imageMock = new File(["test"], "test.jpg", { type: "image/jpg" });

vi.mock("@/composables/useContentQueryApi", () => ({
  useContentQueryApi: () => contentQueryApiMock,
}));

vi.mock("@/composables/useContentCommandApi", () => ({
  useContentCommandApi: () => contentCommandApiMock,
}));

vi.mock("@/stores/notifications", () => ({
  useNotifications: () => notificationStoreMock,
}));

vi.mock("@/stores/notifications", () => ({
  useUser: () => ({ user_uuid: "test-user" }),
}));

vi.mock("@/stores/master-data", () => ({
  useMasterData: () => masterdataStoreMock,
}));

describe("Experience Media Store", () => {
  setActivePinia(createPinia());
  const store = useExperienceMedia();

  afterEach(() => {
    vi.clearAllMocks();
    store.$reset();
  });

  describe("getters", () => {
    test("publishEnabled", async () => {
      await store.loadExperienceMedia("en-experience-id");
      expect(store.publishEnabled("en-experience-id")).toBe(true);

      store.media["en-experience-id"].fields.cover_image.value = null;
      expect(store.publishEnabled("en-experience-id")).toBe(false);
    });
  });

  describe("actions", () => {
    describe("loadExperienceMedia", () => {
      test("it should fetch the media content based on the experience id", async () => {
        await store.loadExperienceMedia("en-experience-id");

        const mediaDocument = store.media["en-experience-id"];

        expect(mediaDocument).toBeTruthy();
        expect(mediaDocument.fields.cover_image).toStrictEqual({
          value: mockImages[0],
          category: "media",
          required: true,
        });
        expect(mediaDocument.fields.gallery).toStrictEqual({
          value: [mockImages[1], mockImages[2], mockImages[3]],
          category: "media",
          required: true,
        });
      });

      describe("when there are no images", () => {
        beforeEach(() => {
          vi.spyOn(
            contentQueryApiMock,
            "getExperienceContent"
          ).mockResolvedValueOnce({
            data: {
              ...mockContentQueryPayload[0],
              experience_media: undefined,
            },
          });
        });

        test("it should create a document with empty values", async () => {
          await store.loadExperienceMedia("en-experience-id");

          const mediaDocument = store.media["en-experience-id"];

          expect(mediaDocument.fields.cover_image).toStrictEqual({
            value: null,
            category: "media",
            required: true,
          });
          expect(mediaDocument.fields.gallery).toStrictEqual({
            value: [],
            category: "media",
            required: true,
          });
        });
      });

      describe("when there is an error during the api call", () => {
        beforeEach(() => {
          vi.spyOn(
            contentQueryApiMock,
            "getExperienceContent"
          ).mockImplementationOnce(() => Promise.reject());
        });

        test("it should not create the document in the store", async () => {
          try {
            await store.loadExperienceMedia("en-experience-id");
          } catch (error) {
            // do nothing...
          }
          expect(store.media["en-experience-id"]).toBeFalsy();
        });

        test("it should push an error message in the notification store", async () => {
          try {
            await store.loadExperienceMedia("en-experience-id");
          } catch (error) {
            // do nothing...
          }
          expect(notificationStoreMock.addNotification).toHaveBeenCalledWith({
            theme: "error",
            message: "notifications.error.fetching.media",
          });
        });
      });
    });

    describe("updateExperienceMedia", () => {
      beforeEach(async () => {
        await store.loadExperienceMedia("en-experience-id");
        store.media["en-experience-id"].fields.cover_image.value = {
          id: "new-img",
          name: "new-img.jpg",
          is_cover: true,
          media_type: "image/jpg",
          original_file: new File(["test"], "new-img.jpg"),
        };
      });

      test("it should update the experience-media entity", async () => {
        await store.updateExperienceMedia("en-experience-id");

        expect(contentCommandApiMock.putExperienceMedia).toHaveBeenCalledWith(
          "experience-media/media-id",
          {
            ...store.media["en-experience-id"].data,
            images: [
              { id: "image-id-2", is_cover: false, visualization_order: 1 },
              { id: "image-id-3", is_cover: false, visualization_order: 2 },
              { id: "image-id-4", is_cover: false },
              { id: "new-img", is_cover: true },
            ],
          }
        );
      });

      test("it should upload the new images", async () => {
        await store.updateExperienceMedia("en-experience-id");

        expect(contentCommandApiMock.postImage).toHaveBeenCalledWith(
          "images",
          expect.any(FormData),
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      });

      test("it should delete the images that have been removed", async () => {
        await store.updateExperienceMedia("en-experience-id");

        expect(contentCommandApiMock.deleteImage).toHaveBeenCalledWith(
          "images/image-id-1"
        );
      });

      describe("if 'publish' is set to true", () => {
        test("it should set the 'published' status", async () => {
          await store.updateExperienceMedia("en-experience-id", true);

          expect(contentCommandApiMock.putExperienceMedia).toHaveBeenCalledWith(
            "experience-media/media-id",
            {
              ...store.media["en-experience-id"].data,
              status_id: "test-status-PUBLISHED",
              images: [
                { id: "image-id-2", is_cover: false, visualization_order: 1 },
                { id: "image-id-3", is_cover: false, visualization_order: 2 },
                { id: "image-id-4", is_cover: false },
                { id: "new-img", is_cover: true },
              ],
            }
          );
        });
      });

      describe("when there is an error during the api call", () => {
        beforeEach(() => {
          vi.spyOn(
            contentCommandApiMock,
            "putExperienceMedia"
          ).mockImplementationOnce(() => Promise.reject());
        });

        test("it should push an error message in the notification store", async () => {
          try {
            await store.updateExperienceMedia("en-experience-id");
          } catch (error) {
            // do nothing...
          }
          expect(notificationStoreMock.addNotification).toHaveBeenCalledWith({
            theme: "error",
            message: "notifications.error.saving.media",
          });
        });
      });
    });

    describe("uploadImage", () => {
      test("it should post a new image", async () => {
        await store.uploadImage(imageMock);

        expect(contentCommandApiMock.postImage).toHaveBeenCalledWith(
          "images",
          expect.any(FormData),
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      });

      describe("when there is an error during the api call", () => {
        beforeEach(() => {
          vi.spyOn(contentCommandApiMock, "postImage").mockImplementationOnce(
            () => Promise.reject()
          );
        });

        test("it should push an error message in the notification store", async () => {
          try {
            await store.uploadImage(imageMock);
          } catch (error) {
            // do nothing...
          }
          expect(notificationStoreMock.addNotification).toHaveBeenCalledWith({
            theme: "error",
            message: "notifications.error.uploading.image",
          });
        });
      });
    });

    describe("deleteImage", () => {
      test("it should post a new image", async () => {
        await store.deleteImage("test-id");

        expect(contentCommandApiMock.deleteImage).toHaveBeenCalledWith(
          "images/test-id"
        );
      });

      describe("when there is an error during the api call", () => {
        beforeEach(() => {
          vi.spyOn(contentCommandApiMock, "deleteImage").mockImplementationOnce(
            () => Promise.reject()
          );
        });

        test("it should push an error message in the notification store", async () => {
          try {
            await store.deleteImage("test-id");
          } catch (error) {
            // do nothing...
          }
          expect(notificationStoreMock.addNotification).toHaveBeenCalledWith({
            theme: "error",
            message: "notifications.error.deleting.image",
          });
        });
      });
    });
  });
});
