/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-promise-reject-errors */
import { setActivePinia, createPinia } from "pinia";
import {
  describe,
  expect,
  test,
  beforeEach,
  vi,
  beforeAll,
  afterEach,
} from "vitest";
import { createMockContentQueryPayload } from "./utils/mock-content-query-payload";
import { useExperienceCuration } from "@/stores/experience-curation";
import { AvailableLanguage } from "@/types/Language";
import { ExperienceContent } from "~~/types/generated/ContentQueryApi";
import { ExperienceTranslation } from "~~/types/generated/ContentCommandApi";

const availableLanguages = new Set<AvailableLanguage>([
  "en",
  "es",
  "it",
  "de",
  "fr",
  "nl",
  "pl",
  "pt",
  "ru",
  "dk",
  "no",
  "fi",
  "se",
]);

const automaticTranslationLanguages = new Set<AvailableLanguage>(["es"]);

const mockCommercialContent = {
  experience_translations: [
    {
      id: "id-translation",
      language_code: "en",
    },
  ],
};

const mockContentCommandPayload = {
  id: "id-translation",
  title: "test title",
  seo_title: "test seo title",
  text1: "test description",
  seo_description: "test seo description",
  info_voucher: "test info voucher",
};

const masterdataStoreMock = {
  getStatusByCode: () => ({
    code: "IN_REVIEW",
    creation_date: "2022-07-19T09:24:13.358",
    description: "In Review",
    id: "e68ffd9a-bbf3-4bb7-9082-3ef4abaeeabc",
    language_code: "en",
    name: "In Review",
    updated_date: "2022-07-19T09:24:13.36",
  }),
  getFlowByCode: () => ({
    id: "a8b6245d-429c-4eae-b7c1-123",
    code: "DUMMY",
    init_status: "bc67d0c5-7458-463b-96a8-4344d26dd079",
    end_status: "bc67d0c5-7458-463b-96a8-4344d26dd079",
    creation_date: "2022-07-28T14:13:44.787283",
    updated_date: "2022-07-28T14:13:44.787283",
  }),
  availableLanguages,
  automaticTranslationLanguages,
};
const mockContentQueryPayload: ExperienceContent[] =
  createMockContentQueryPayload(availableLanguages);

const contentCommandApiMock = {
  getTranslation: vi.fn(),
  getTranslations: vi.fn(),
  putTranslation: vi.fn(),
  postTranslation: vi.fn(),
  getExperienceCommercialContent: vi.fn(),
};

const contentQueryApiMock = {
  getAllExperienceContents: vi.fn(() => ({ data: mockContentQueryPayload })),
};

const metadataExperienceApiMock = {
  get: vi.fn(),
  put: vi.fn(),
  post: vi.fn(),
};

const notificationStoreMock = {
  addNotification: vi.fn(),
  deleteNotification: vi.fn(),
  fetchError: {
    theme: "error",
    message: "notifications.error.fetching.document",
  },
  saveError: {
    theme: "error",
    message: "notifications.error.saving.document",
  },
  saveSuccess: {
    theme: "success",
    message: "notifications.success.saving.document",
  },
};

vi.mock("#imports", () => ({
  useNuxtApp: () => ({ $t: (s: string) => s }),
}));

vi.mock("@/stores/master-data", () => ({
  useMasterData: () => masterdataStoreMock,
}));

vi.mock("@/composables/useContentCommandApi", () => ({
  useContentCommandApi: () => contentCommandApiMock,
}));

vi.mock("@/composables/useContentQueryApi", () => ({
  useContentQueryApi: () => contentQueryApiMock,
}));

vi.mock("@/composables/useMetadataExperienceApi", () => ({
  useMetadataExperienceApi: () => metadataExperienceApiMock,
}));

vi.mock("@/stores/notifications", () => ({
  useNotifications: () => notificationStoreMock,
}));

describe("Experience Curation Store", () => {
  setActivePinia(createPinia());
  const store = useExperienceCuration();

  beforeAll(() => {
    store.$reset();
  });

  beforeEach(() => {
    vi.spyOn(contentCommandApiMock, "getTranslation").mockImplementationOnce(
      () =>
        Promise.resolve({
          data: mockContentCommandPayload,
        })
    );
    vi.spyOn(contentCommandApiMock, "getTranslations").mockImplementationOnce(
      () =>
        Promise.resolve({
          data: [mockContentCommandPayload],
        })
    );
    vi.spyOn(
      contentCommandApiMock,
      "getExperienceCommercialContent"
    ).mockImplementationOnce(() =>
      Promise.resolve({
        data: [mockCommercialContent],
      })
    );
    vi.spyOn(metadataExperienceApiMock, "get").mockImplementationOnce(() =>
      Promise.resolve({
        data: [
          {
            additional_services: ["additional-services"],
            id: "id-additional-services",
          },
        ],
      })
    );
    vi.spyOn(metadataExperienceApiMock, "get").mockImplementationOnce(() =>
      Promise.resolve({
        data: [
          {
            important_information: ["important-information"],
            id: "id-important-information",
          },
        ],
      })
    );
    vi.spyOn(metadataExperienceApiMock, "get").mockImplementationOnce(() =>
      Promise.resolve({
        data: [{ non_included: ["non-included"], id: "id-non-included" }],
      })
    );
    vi.spyOn(metadataExperienceApiMock, "get").mockImplementationOnce(() =>
      Promise.resolve({
        data: [{ included: ["included"], id: "id-included" }],
      })
    );
    vi.spyOn(metadataExperienceApiMock, "get").mockImplementationOnce(() =>
      Promise.resolve({
        data: [{ highlights: ["highlight"], id: "id-highlights" }],
      })
    );

    store.$reset();
  });

  afterEach(() => {
    vi.clearAllMocks();
    store.$reset();
  });

  describe("actions", () => {
    describe("getCurationDocument", () => {
      test("it should fetch the curation document based on the id", async () => {
        await store.getCurationDocument("random-id");

        expect(store.curationDocuments["random-id"]).toBeTruthy();
        expect(store.curationDocuments["random-id"].fields.title).toStrictEqual(
          {
            value: mockContentCommandPayload.title,
            category: "experience_settings",
            required: true,
          }
        );
        expect(
          store.curationDocuments["random-id"].fields.included
        ).toStrictEqual({
          value: ["included"],
          category: "experience_info",
          required: true,
        });
        expect(
          store.curationDocuments["random-id"].fields.info_voucher
        ).toStrictEqual({
          value: mockContentCommandPayload.info_voucher,
          category: "voucher",
          required: false,
        });

        expect(store.curationDocuments["random-id"].data).toStrictEqual(
          mockContentCommandPayload
        );
      });

      describe("when there is an error during the api call", () => {
        beforeEach(() => {
          vi.spyOn(
            contentCommandApiMock,
            "getTranslations"
          ).mockImplementationOnce(() => Promise.reject());
        });
        test("it should not create the document in the store", async () => {
          try {
            await store.getCurationDocument("random-id");
          } catch (error) {
            // do nothing...
          }
          expect(store.curationDocuments["random-id"]).toBeFalsy();
        });

        test("it should push an error message in the notification store", async () => {
          try {
            await store.getCurationDocument("random-id");
          } catch (error) {
            // do nothing...
          }
          expect(notificationStoreMock.addNotification).toHaveBeenCalledWith(
            notificationStoreMock.fetchError
          );
        });
      });

      describe("when the optional fields are missing", () => {
        beforeEach(() => {
          vi.spyOn(
            contentCommandApiMock,
            "getTranslations"
          ).mockImplementationOnce(() =>
            Promise.resolve({ data: [{ title: "test title" }] })
          );
          vi.spyOn(metadataExperienceApiMock, "get").mockImplementation(() =>
            Promise.resolve({
              data: {
                highlights: [{ highlights: "highlight" }],
                included: [{ included: "included" }],
                non_included: [{ non_included: "non-included" }],
              },
            })
          );

          store.$reset();
        });

        test("it should apply the default values", async () => {
          await store.getCurationDocument("random-id");

          expect(store.curationDocuments["random-id"]).toBeTruthy();
          expect(
            store.curationDocuments["random-id"].fields.seo_title.value
          ).toBe("");
          expect(
            store.curationDocuments["random-id"].fields.description.value
          ).toBe("");
          expect(
            store.curationDocuments["random-id"].fields.seo_description.value
          ).toBe("");
          expect(
            store.curationDocuments["random-id"].fields.important_information
              .value
          ).toStrictEqual([]);
        });
      });
    });

    describe("update curation document", () => {
      test("it should correctly save the document", async () => {
        await store.getCurationDocument("random-id");

        store.curationDocuments["random-id"].fields.title.value = "new title";
        store.curationDocuments["random-id"].fields.description.value =
          "new description";

        store.curationDocuments["random-id"].fields.highlights.value = [
          "new highlight",
        ];
        store.curationDocuments["random-id"].fields.included.value = [
          "new included",
        ];
        store.curationDocuments["random-id"].fields.non_included.value = [
          "new non-included",
        ];
        store.curationDocuments[
          "random-id"
        ].fields.important_information.value = ["new important-information"];
        store.curationDocuments["random-id"].fields.additional_services.value =
          ["new additional-service"];

        expect(store.curationDocuments["random-id"].modified).toBe(false);

        await store.updateCurationDocument("random-id", {
          publish: true,
        });

        expect(contentCommandApiMock.putTranslation).toHaveBeenCalled();
        expect(contentCommandApiMock.putTranslation).toHaveBeenCalledWith(
          "experience-translations/id-translation",
          {
            curation_quality: false,
            experience_id: "random-id",
            language_code: "en",
            seo_description: "test seo description",
            seo_title: "test seo title",
            text1: "new description",
            info_voucher: "test info voucher",
            title: "new title",
            status_id: "e68ffd9a-bbf3-4bb7-9082-3ef4abaeeabc",
            flow_id: "b2fd6818-e10e-4197-bea7-9f2c48a12647",
          }
        );
        expect(metadataExperienceApiMock.put).toHaveBeenCalled();

        expect(metadataExperienceApiMock.put).toHaveBeenCalledTimes(5);
        expect(metadataExperienceApiMock.put).toHaveBeenNthCalledWith(
          1,
          "experience-highlights/id-highlights",
          {
            experience_id: "random-id",
            highlights: ["new highlight"],
          }
        );
        expect(metadataExperienceApiMock.put).toHaveBeenNthCalledWith(
          2,
          "experience-included/id-included",
          {
            experience_id: "random-id",
            included: ["new included"],
          }
        );
        expect(metadataExperienceApiMock.put).toHaveBeenNthCalledWith(
          3,
          "experience-non-included/id-non-included",
          {
            experience_id: "random-id",
            non_included: ["new non-included"],
          }
        );
        expect(metadataExperienceApiMock.put).toHaveBeenNthCalledWith(
          4,
          "experience-important-information/id-important-information",
          {
            experience_id: "random-id",
            important_information: ["new important-information"],
          }
        );
        expect(metadataExperienceApiMock.put).toHaveBeenNthCalledWith(
          5,
          "experience-additional-services/id-additional-services",
          {
            experience_id: "random-id",
            additional_services: ["new additional-service"],
          }
        );

        expect(notificationStoreMock.addNotification).toHaveBeenCalledWith(
          notificationStoreMock.saveSuccess
        );
      });

      test("if a call fail it should display the error", async () => {
        await store.getCurationDocument("random-id");

        vi.spyOn(metadataExperienceApiMock, "put").mockImplementationOnce(() =>
          Promise.reject()
        );

        await store.updateCurationDocument("random-id", {
          publish: true,
        });

        expect(notificationStoreMock.addNotification).toHaveBeenCalledWith(
          notificationStoreMock.saveError
        );
      });

      describe("if the id of one relation is missing", () => {
        test("it should do a post request", async () => {
          vi.spyOn(metadataExperienceApiMock, "get").mockImplementationOnce(
            () =>
              Promise.resolve({
                data: [{ highlights: ["highlight"] }],
              })
          );

          await store.getCurationDocument("random-id");

          store.curationDocuments["random-id"].fields.highlights.value = [
            "new value",
          ];

          await store.updateCurationDocument("random-id", {
            publish: true,
          });

          expect(metadataExperienceApiMock.post).toHaveBeenCalledWith(
            "experience-highlights",
            { experience_id: "random-id", highlights: ["new value"] }
          );

          expect(notificationStoreMock.addNotification).toHaveBeenCalledWith(
            notificationStoreMock.saveSuccess
          );
        });

        test("if the post fail it should display the error", async () => {
          vi.spyOn(metadataExperienceApiMock, "get").mockImplementationOnce(
            () =>
              Promise.resolve({
                data: [{ highlights: ["highlight"] }],
              })
          );
          await store.getCurationDocument("random-id");

          store.curationDocuments["random-id"].fields.highlights.value = [
            "new value",
          ];

          vi.spyOn(metadataExperienceApiMock, "post").mockImplementationOnce(
            () => Promise.reject()
          );

          await store.updateCurationDocument("random-id", {
            publish: true,
          });

          expect(notificationStoreMock.addNotification).toHaveBeenCalledWith(
            notificationStoreMock.saveError
          );
        });
      });
      describe("sendToReviewCurationDocument", () => {
        test("if all languages are translated, it should only update the english document", async () => {
          await store.getCurationDocument("random-id");

          await store.sendToTranslationCurationDocument("random-id");

          expect(contentCommandApiMock.postTranslation).toHaveBeenCalledTimes(
            0
          ); // add test here
          expect(contentCommandApiMock.putTranslation).toHaveBeenCalled();

          expect(notificationStoreMock.addNotification).toHaveBeenCalledWith(
            notificationStoreMock.saveSuccess
          );
        });

        test("if no translations are present, it should create them all", async () => {
          await store.getCurationDocument("random-id");

          vi.spyOn(
            contentQueryApiMock,
            "getAllExperienceContents"
          ).mockResolvedValue({
            data: [],
          });

          await store.sendToTranslationCurationDocument("random-id");

          expect(contentCommandApiMock.postTranslation).toHaveBeenCalledTimes(
            12
          );

          // test that the automatic translation is called with the correct parameters
          const automaticTranslations =
            // @ts-expect-error this is actually correct https://jestjs.io/docs/mock-functions
            contentCommandApiMock.postTranslation.calls.filter(
              (call: [key: string, data: ExperienceTranslation]) =>
                call[1].to_be_translated
            );

          expect(automaticTranslations.length).toBe(1);

          expect(contentCommandApiMock.putTranslation).toHaveBeenCalled();

          expect(notificationStoreMock.addNotification).toHaveBeenCalledWith(
            notificationStoreMock.saveSuccess
          );
        });

        test("if some translation are present, it should not create them", async () => {
          await store.getCurationDocument("random-id");

          const currentTranslations = createMockContentQueryPayload(
            new Set(["se", "ru", "it"])
          );

          vi.spyOn(
            contentQueryApiMock,
            "getAllExperienceContents"
          ).mockResolvedValue({
            data: currentTranslations,
          });

          await store.sendToTranslationCurationDocument("random-id");

          // test that the automatic translation is called with the correct parameters
          const automaticTranslations =
            // @ts-expect-error this is actually correct https://jestjs.io/docs/mock-functions
            contentCommandApiMock.postTranslation.calls.filter(
              (call: [key: string, data: ExperienceTranslation]) =>
                call[1].to_be_translated
            );

          expect(automaticTranslations.length).toBe(1);

          expect(contentCommandApiMock.postTranslation).toHaveBeenCalledTimes(
            9
          );

          expect(contentCommandApiMock.putTranslation).toHaveBeenCalled();

          expect(notificationStoreMock.addNotification).toHaveBeenCalledWith(
            notificationStoreMock.saveSuccess
          );
        });

        test("if a call go wrong should appear the error notification", async () => {
          await store.getCurationDocument("random-id");

          vi.spyOn(
            contentCommandApiMock,
            "putTranslation"
          ).mockImplementationOnce(() => Promise.reject());

          await store.sendToTranslationCurationDocument("random-id");

          expect(notificationStoreMock.addNotification).toHaveBeenCalledWith(
            notificationStoreMock.saveError
          );
        });
      });
    });
  });

  describe("getters", () => {
    test("requiredFields", async () => {
      await store.getCurationDocument("random-id");
      expect(store.requiredFields("random-id")).toStrictEqual({
        title: {
          value: "test title",
          required: true,
          category: "experience_settings",
        },
        seo_title: {
          value: "test seo title",
          required: true,
          category: "experience_settings",
        },
        description: {
          value: "test description",
          required: true,
          category: "experience_info",
        },
        seo_description: {
          value: "test seo description",
          required: true,
          category: "experience_info",
        },
        highlights: {
          value: ["highlight"],
          required: true,
          category: "experience_info",
        },
        included: {
          value: ["included"],
          required: true,
          category: "experience_info",
        },
        additional_services: {
          value: ["additional-services"],
          required: true,
          category: "property_and_relevance",
        },
      });
      expect(store.submitEnabled("random-id")).toBe(true);
    });
    test("submitEnabled", async () => {
      await store.getCurationDocument("random-id");
      expect(store.submitEnabled("random-id")).toBe(true);
      store.curationDocuments["random-id"].fields.title.value = "";
      expect(store.submitEnabled("random-id")).toBe(false);
    });
  });
});
