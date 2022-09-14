/* eslint-disable prefer-promise-reject-errors */
import {
  setActivePinia,
  createPinia,
  Store,
  _GettersTree,
  _ActionsTree,
} from "pinia";
import { describe, expect, test, beforeEach, vi, beforeAll } from "vitest";
import { useExperienceRaw, ExperienceRawState } from "@/stores/experience-raw";

const mockPayload = {
  id: "cc2700f7-09e9-4085-8efb-084991479970",
  go_commercial: false,
  functional: {
    asterix_id: "asterix-id",
    included: ["highlight 2"],
  },
  commercial: {
    title: "Test title",
    description: "Test description",
  },
  creation_date: "2022-06-16T14:25:52.529",
  updated_date: "2022-06-16T14:25:52.529",
};
const experienceApiMock = {
  postRawExperience: vi.fn(),
  putRawExperience: vi.fn(),
  getRawExperience: vi.fn(),
  getRawExperiences: vi.fn(),
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

vi.mock("@/composables/useExperienceRawApi", () => ({
  useExperienceRawApi: () => experienceApiMock,
}));

vi.mock("@/stores/notifications", () => ({
  useNotifications: () => notificationStoreMock,
}));

describe("Experience Raw Store", () => {
  let store: Store<
    "experience-raw",
    ExperienceRawState,
    _GettersTree<ExperienceRawState>,
    _ActionsTree
  >;

  beforeAll(() => {
    setActivePinia(createPinia());
    store = useExperienceRaw();
    store.$nuxt = {
      $t: vi.fn((k) => k),
    };
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(experienceApiMock, "postRawExperience").mockImplementationOnce(
      () =>
        Promise.resolve({
          headers: { location: "/experience-raw/generated-test-id" },
        })
    );
    vi.spyOn(experienceApiMock, "putRawExperience").mockImplementationOnce(() =>
      Promise.resolve()
    );
    vi.spyOn(experienceApiMock, "getRawExperience").mockResolvedValueOnce({
      data: mockPayload,
    });

    store.$state = {
      rawContents: {
        "test-id": {
          modified: true,
          fields: {
            asterix_id: {
              value: "",
              required: true,
              category: "experience_settings",
            },
            title: {
              value: "",
              required: true,
              category: "experience_settings",
            },
            description: {
              value: "",
              required: true,
              category: "experience_info",
            },
            highlights: {
              value: [],
              required: true,
              category: "experience_info",
            },
            included: {
              value: [],
              required: true,
              category: "experience_info",
            },
            non_included: {
              value: [],
              required: false,
              category: "experience_info",
            },
            important_information: {
              value: [],
              required: false,
              category: "experience_info",
            },
            additional_services: {
              value: [],
              required: true,
              category: "property_and_relevance",
            },
            info_voucher: { value: "", required: false, category: "voucher" },
          },
        },
      },
    };
  });

  describe("getters", () => {
    test("requiredFields", () => {
      expect(store.requiredFields("test-id")).toStrictEqual({
        asterix_id: {
          value: "",
          required: true,
          category: "experience_settings",
        },
        title: { value: "", required: true, category: "experience_settings" },
        description: { value: "", required: true, category: "experience_info" },
        highlights: { value: [], required: true, category: "experience_info" },
        included: { value: [], required: true, category: "experience_info" },
        additional_services: {
          value: [],
          required: true,
          category: "property_and_relevance",
        },
      });
    });

    test("submitEnabled", () => {
      expect(store.submitEnabled("test-id")).toBe(false);

      store.$state = {
        rawContents: {
          "test-id": {
            modified: true,
            fields: {
              asterix_id: {
                value: "test-asterix-id",
                required: true,
                category: "experience_settings",
              },
              title: {
                value: "test-title",
                required: true,
                category: "experience_settings",
              },
              description: {
                value: "test-description",
                required: true,
                category: "experience_info",
              },
              highlights: {
                value: ["highlight_1"],
                required: true,
                category: "experience_info",
              },
              included: {
                value: ["included_1"],
                required: true,
                category: "experience_info",
              },
              non_included: {
                value: [],
                required: false,
                category: "experience_info",
              },
              important_information: {
                value: [],
                required: false,
                category: "experience_info",
              },
              additional_services: {
                value: ["additional_1"],
                required: true,
                category: "property_and_relevance",
              },
              info_voucher: { value: "", required: false, category: "voucher" },
            },
          },
        },
      };

      expect(store.submitEnabled("test-id")).toBe(true);
    });
  });

  describe("actions", () => {
    describe("createDocument", () => {
      test("it should create a new document in the store based on the data passed", () => {
        store.createDocument("new-document", mockPayload);

        expect(store.rawContents["new-document"]).toBeTruthy();
        expect(store.rawContents["new-document"].fields.asterix_id.value).toBe(
          mockPayload.functional.asterix_id
        );
        expect(store.rawContents["new-document"].fields.title.value).toBe(
          mockPayload.commercial.title
        );
        expect(store.rawContents["new-document"].fields.description.value).toBe(
          mockPayload.commercial.description
        );
        expect(
          store.rawContents["new-document"].fields.included.value
        ).toStrictEqual(mockPayload.functional.included);

        expect(store.rawContents["new-document"].data).toStrictEqual(
          mockPayload
        );
      });

      describe("when no data is passed", () => {
        test("it should create an empty document", () => {
          store.createDocument("new-document");

          expect(store.rawContents["new-document"]).toBeTruthy();
          expect(
            store.rawContents["new-document"].fields.asterix_id.value
          ).toBe("");
          expect(store.rawContents["new-document"].fields.title.value).toBe("");
          expect(
            store.rawContents["new-document"].fields.description.value
          ).toBe("");
          expect(
            store.rawContents["new-document"].fields.included.value
          ).toStrictEqual([]);
        });
      });
    });

    describe("submitNewRawDocument", () => {
      test("it should correctly submit the new document", async () => {
        store.rawContents["test-id"].fields.title.value = "test title";

        await store.submitNewRawDocument("test-id");

        expect(store.rawContents["test-id"].modified).toBe(false);
        expect(experienceApiMock.postRawExperience).toHaveBeenCalled();
        expect(experienceApiMock.postRawExperience).toHaveBeenCalledWith(
          "experience-raw",
          {
            go_commercial: false,
            functional: {
              asterix_id: "",
              highlights: [],
              included: [],
              non_included: [],
              important_information: [],
              additional_services: [],
            },
            commercial: {
              title: "test title",
              description: "",
              info_voucher: "",
            },
          }
        );

        expect(notificationStoreMock.addNotification).toHaveBeenCalledWith(
          notificationStoreMock.saveSuccess
        );
      });

      test("it should return a header with the generated ID", async () => {
        const id = await store.submitNewRawDocument("test-id");

        expect(id).toBe("generated-test-id");
      });

      describe("when the document id doesn't exist in the store", () => {
        test("it should not call the api", async () => {
          try {
            await store.submitNewRawDocument("wrong-id");
          } catch (error) {
            // do nothing...
          }

          expect(experienceApiMock.postRawExperience).not.toHaveBeenCalled();
        });
      });

      describe("when there is an error during the api call", () => {
        test("it should not reset the modified flag", async () => {
          vi.spyOn(
            experienceApiMock,
            "postRawExperience"
          ).mockImplementationOnce(() => Promise.reject());

          try {
            await store.submitNewRawDocument("test-id");
          } catch (error) {
            // do nothing...
          }

          expect(store.rawContents["test-id"].modified).toBe(true);

          expect(notificationStoreMock.addNotification).toHaveBeenCalledWith({
            theme: "error",
            message: "notifications.error.creating.document",
          });
        });
      });
    });

    describe("updateRawDocument", () => {
      test("it should correctly submit the updated document", async () => {
        store.rawContents["test-id"].fields.title.value = "test title";
        await store.updateRawDocument("test-id");

        expect(store.rawContents["test-id"].modified).toBe(false);
        expect(experienceApiMock.putRawExperience).toHaveBeenCalled();
        expect(experienceApiMock.putRawExperience).toHaveBeenCalledWith(
          "experience-raw/test-id",
          {
            go_commercial: false,
            functional: {
              asterix_id: "",
              highlights: [],
              included: [],
              non_included: [],
              important_information: [],
              additional_services: [],
            },
            commercial: {
              title: "test title",
              description: "",
              info_voucher: "",
            },
          }
        );

        expect(notificationStoreMock.addNotification).toHaveBeenCalledWith(
          notificationStoreMock.saveSuccess
        );
      });

      describe("when the document id doesn't exist in the store", () => {
        test("it should not call the api", async () => {
          await store.updateRawDocument("wrong-id");

          expect(experienceApiMock.putRawExperience).not.toHaveBeenCalled();
        });
      });

      describe("when there is an error during the api call", () => {
        test("it should not reset the modified flag", async () => {
          vi.spyOn(
            experienceApiMock,
            "putRawExperience"
          ).mockImplementationOnce(() => Promise.reject());

          try {
            await store.updateRawDocument("test-id");
          } catch (error) {
            // do nothing...
          }

          expect(store.rawContents["test-id"].modified).toBe(true);

          expect(notificationStoreMock.addNotification).toHaveBeenCalledWith(
            notificationStoreMock.saveError
          );
        });
      });
    });

    describe("getRawDocument", () => {
      test("it should fetch the raw document based on the id", async () => {
        await store.getRawDocument("random-id");

        expect(store.rawContents["random-id"]).toBeTruthy();
        expect(store.rawContents["random-id"].fields.asterix_id.value).toBe(
          mockPayload.functional.asterix_id
        );
        expect(store.rawContents["random-id"].fields.title.value).toBe(
          mockPayload.commercial.title
        );
      });

      describe("when there is an error during the api call", () => {
        test("it should not create the document in the store", async () => {
          vi.spyOn(
            experienceApiMock,
            "getRawExperience"
          ).mockImplementationOnce(() => Promise.reject());

          try {
            await store.getRawDocument("random-id");
          } catch (error) {
            // do nothing...
          }
          expect(store.rawContents["random-id"]).toBeFalsy();

          expect(notificationStoreMock.addNotification).toHaveBeenCalledWith(
            notificationStoreMock.fetchError
          );
        });
      });
    });
  });
});
