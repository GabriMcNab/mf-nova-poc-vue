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
import { useExperienceTranslation } from "../experience-translation";
import { ExperienceTranslation } from "@/types/generated/ContentCommandApi";
import { AvailableLanguage } from "@/types/Language";

const mockContentCommandPayload: ExperienceTranslation & {
  language_code: AvailableLanguage;
} = {
  id: "translation-id",
  title: "test title",
  seo_title: "test seo title",
  text1: "test description",
  seo_description: "test seo description",
  info_voucher: "test info voucher",
  experience_id: "experience-id",
  language_code: "en",
  status_id: "test-status",
  flow_id: "test-flow",
};
const contentCommandApiMock = {
  getTranslation: vi.fn(),
  getTranslations: vi.fn(),
  putTranslation: vi.fn(),
  postTranslation: vi.fn(),
};

const notificationStoreMock = {
  addNotification: vi.fn(),
  deleteNotification: vi.fn(),
  fetchError: {
    theme: "error",
    message: "notifications.error.fetching.single.translation",
  },
  multipleFetchError: {
    theme: "error",
    message: "notifications.error.fetching.multiple.translations",
  },
  saveError: {
    theme: "error",
    message: "notifications.error.saving.single.translation",
  },
  saveSuccess: {
    theme: "success",
    message: "notifications.success.saving.single.translation",
  },
};

const useMasterDataMock = {
  getStatusByCode: vi.fn(() => ({
    id: "review-status-id",
  })),
  getFlowByCode: () => ({
    id: "6b802d63-76a5-482f-b5aa-b194dc7f32b1",
    code: "DUMMY",
    init_status: "bc67d0c5-7458-463b-96a8-4344d26dd079",
    end_status: "bc67d0c5-7458-463b-96a8-4344d26dd079",
    creation_date: "2022-07-28T14:13:44.787283",
    updated_date: "2022-07-28T14:13:44.787283",
  }),
};

vi.mock("@/composables/useContentCommandApi", () => ({
  useContentCommandApi: () => contentCommandApiMock,
}));

vi.mock("@/stores/notifications", () => ({
  useNotifications: () => notificationStoreMock,
}));

vi.mock("@/stores/master-data", () => ({
  useMasterData: () => useMasterDataMock,
}));

describe("Experience Translation Store", () => {
  setActivePinia(createPinia());
  const store = useExperienceTranslation();

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

    store.$reset();
  });

  afterEach(() => {
    vi.clearAllMocks();
    store.$reset();
  });

  describe("getters", () => {
    describe("getDocument", () => {
      test("it should return a translation document", async () => {
        await store.loadTranslationDocument("translation-id");

        const document = store.getTranslation(
          mockContentCommandPayload.experience_id,
          mockContentCommandPayload.language_code
        );

        expect(document).toBeTruthy();
        expect(document?.data.language_code).toBe("en");
        expect(document?.data.id).toBe("translation-id");
        expect(document?.data.experience_id).toBe("experience-id");
      });

      test("it should error when a document is not found", () => {
        try {
          store.getTranslation("will-fail", "en");
        } catch (error: any) {
          expect(error.message).toBe(
            'Translation document will-fail/en is not loaded into the store. Remember to use "loadTranslationDocument" first.'
          );
        }
      });
    });
  });

  describe("actions", () => {
    describe("loadTranslationDocument", () => {
      test("it should load the curation document based on the id", async () => {
        const mock = mockContentCommandPayload;
        await store.loadTranslationDocument("translation-id");

        const document =
          store.translationDocuments[mock.language_code][mock.experience_id];

        expect(document).toBeTruthy();

        expect(document.fields.title).toStrictEqual({
          value: mock.title,
          category: "experience_settings",
          required: true,
        });

        expect(document.fields.seo_title).toStrictEqual({
          value: mock.seo_title,
          category: "experience_settings",
          required: true,
        });
        expect(document.fields.seo_description).toStrictEqual({
          value: mock.seo_description,
          category: "experience_info",
          required: true,
        });

        expect(document.fields.description).toStrictEqual({
          value: mock.text1,
          category: "experience_info",
          required: true,
        });

        expect(document.fields.info_voucher).toStrictEqual({
          value: mock.info_voucher,
          category: "voucher",
          required: false,
        });
      });

      describe("when there is an error during the api call", () => {
        beforeEach(() => {
          vi.spyOn(
            contentCommandApiMock,
            "getTranslation"
          ).mockImplementationOnce(() => Promise.reject("Uh oh!"));
        });
        test("it should not create the document in the store", async () => {
          try {
            await store.loadTranslationDocument("translation-id");
          } catch (error) {
            expect(error).toBe("Uh oh!");
            expect(store.translationDocuments.en["experience-id"]).toBeFalsy();
          }
        });

        test("it should push an error message in the notification store", async () => {
          try {
            await store.loadTranslationDocument("translation-id");
          } catch (error) {
            expect(notificationStoreMock.addNotification).toHaveBeenCalledWith(
              notificationStoreMock.fetchError
            );
          }
        });
      });

      describe("when the optional fields are missing", () => {
        beforeEach(() => {
          vi.spyOn(
            contentCommandApiMock,
            "getTranslations"
          ).mockImplementationOnce(() =>
            Promise.resolve({
              data: [
                {
                  title: "test title",
                  language_code: "en",
                  id: "translation-id",
                  experience_id: "experience-id",
                },
              ],
            })
          );

          store.$reset();
        });

        test("it should apply the default values", async () => {
          await store.loadTranslationDocument("translation-id");

          const document =
            store.translationDocuments[mockContentCommandPayload.language_code][
              mockContentCommandPayload.experience_id
            ];

          expect(document).toBeTruthy();

          expect(document.fields.info_voucher.value).toBe("test info voucher");
        });
      });
    });

    describe("loadExperienceTranslation", () => {
      test("it should load the curation document based on the experience id and language code", async () => {
        const mock = mockContentCommandPayload;

        await store.loadExperienceTranslation(
          mock.experience_id,
          mock.language_code
        );

        const document = store.getTranslation(
          mock.experience_id,
          mock.language_code
        );

        expect(document).toBeTruthy();

        expect(document.fields.title).toStrictEqual({
          value: mock.title,
          category: "experience_settings",
          required: true,
        });

        expect(document.fields.seo_title).toStrictEqual({
          value: mock.seo_title,
          category: "experience_settings",
          required: true,
        });

        expect(document.fields.seo_description).toStrictEqual({
          value: mock.seo_description,
          category: "experience_info",
          required: true,
        });

        expect(document.fields.description).toStrictEqual({
          value: mock.text1,
          category: "experience_info",
          required: true,
        });

        expect(document.fields.info_voucher).toStrictEqual({
          value: mock.info_voucher,
          category: "voucher",
          required: false,
        });
      });
    });
    test("it should throw and error and display a toast if the request fails", async () => {
      vi.spyOn(contentCommandApiMock, "getTranslations").mockImplementationOnce(
        () => Promise.reject("Uh oh!")
      );

      try {
        await store.loadExperienceTranslation("experience-id", "en");
      } catch (error) {
        expect(error).toBe("Uh oh!");
        expect(notificationStoreMock.addNotification).toHaveBeenCalledWith(
          notificationStoreMock.multipleFetchError
        );
      }
    });

    describe("update translation document", () => {
      test("it should correctly save the document", async () => {
        vi.spyOn(
          contentCommandApiMock,
          "putTranslation"
        ).mockImplementationOnce(() =>
          Promise.resolve({
            data: mockContentCommandPayload,
          })
        );

        await store.loadTranslationDocument("translation-id");
        const document = store.translationDocuments.en["experience-id"];

        document.fields.title.value = "new title";
        document.fields.description.value = "new description";

        document.fields.info_voucher.value = "new voucher-information";

        expect(document.modified).toBe(false);

        await store.updateExperienceTranslation("experience-id", "en");

        expect(contentCommandApiMock.putTranslation).toHaveBeenCalledWith(
          "experience-translations/translation-id",
          {
            curation_quality: false,
            language_code: "en",
            experience_id: "experience-id",
            seo_description: "test seo description",
            seo_title: "test seo title",
            text1: "new description",
            info_voucher: "new voucher-information",
            title: "new title",
            automatic_translation: false,
            to_be_translated: false,
            status_id: "review-status-id",
            flow_id: "6b802d63-76a5-482f-b5aa-b194dc7f32b1",
          }
        );

        expect(notificationStoreMock.addNotification).toHaveBeenCalledWith(
          notificationStoreMock.saveSuccess
        );
      });

      test("if a call fail it should display the error", async () => {
        vi.spyOn(
          contentCommandApiMock,
          "putTranslation"
        ).mockImplementationOnce(() => Promise.reject("Uh oh!"));
        await store.loadTranslationDocument("translation-id");

        try {
          await store.updateExperienceTranslation("experience-id", "en");
        } catch (error) {
          expect(error).toBe("Uh oh!");
          expect(notificationStoreMock.addNotification).toHaveBeenCalledWith(
            notificationStoreMock.saveError
          );
        }
      });
    });
  });
});
