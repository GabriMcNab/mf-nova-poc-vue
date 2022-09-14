/* eslint-disable prefer-promise-reject-errors */
import { setActivePinia, createPinia } from "pinia";
import { describe, expect, test, beforeEach, vi, beforeAll } from "vitest";
import { useMasterData } from "@/stores/master-data";
import { DocumentStatus } from "@/types/DocumentStatuses";

const mockStatuses = [
  {
    id: "e68ffd9a-bbf3-4bb7-9082-3ef4abaeeabc",
    code: "IN_REVIEW",
    name: "In Review",
    language_code: "en",
  },
];

const mockFlows = [
  {
    id: "test-flow-1",
    code: "CURATION",
  },
  {
    id: "test-flow-2",
    code: "MANUAL",
  },
];

const notificationStoreMock = {
  addNotification: vi.fn(),
  deleteNotification: vi.fn(),
  error: {
    theme: "error",
    message: "notifications.error.fetching.master.data",
  },
  success: {
    theme: "success",
    message: "notifications.error.fetching.master.data",
  },
};

const masterDataApiMock = {
  get: vi.fn(),
};

const contentCommandApiMock = {
  getFlows: vi.fn(),
};

vi.mock("@/stores/notifications", () => ({
  useNotifications: () => notificationStoreMock,
}));

vi.mock("@/composables/useContentMasterDataApi", () => ({
  useContentMasterDataApi: () => masterDataApiMock,
}));

vi.mock("@/composables/useContentCommandApi", () => ({
  useContentCommandApi: () => contentCommandApiMock,
}));

vi.mock("@/composables/useExperienceMasterDataApi", () => ({
  useExperienceMasterDataApi: () => masterDataApiMock,
}));

describe("Experience Master Data", () => {
  setActivePinia(createPinia());
  const store = useMasterData();

  beforeAll(() => {
    store.$nuxt = {
      $t: vi.fn((k) => k),
    };
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(masterDataApiMock, "get").mockResolvedValue({
      data: mockStatuses,
    });
    vi.spyOn(contentCommandApiMock, "getFlows").mockResolvedValue({
      data: mockFlows,
    });

    store.$reset();
  });

  describe("actions", () => {
    describe("getMasterData", () => {
      test("it should fetch the raw document based on the id", async () => {
        await store.getMasterData();

        expect(store.highlights).toBeTruthy();
        expect(store.highlights.length).toBe(1);
        expect(store.included).toBeTruthy();
        expect(store.included.length).toBe(1);
        expect(store.importantInformation).toBeTruthy();
        expect(store.importantInformation.length).toBe(1);
        expect(store.contentStatuses).toBeTruthy();
        expect(store.contentStatuses.length).toBe(1);
        expect(store.contentFlows).toBeTruthy();
        expect(store.contentFlows.length).toBe(2);
      });

      describe("when there is an error during the api call", () => {
        test("it should not update the state", async () => {
          vi.spyOn(masterDataApiMock, "get").mockImplementationOnce(() =>
            Promise.reject()
          );

          try {
            await store.getMasterData();
          } catch (error) {
            // do nothing...
          }

          expect(store.highlights.length).toBe(0);
          expect(store.included.length).toBe(0);
          expect(store.importantInformation.length).toBe(0);
          expect(store.contentStatuses.length).toBe(0);
          expect(store.contentFlows.length).toBe(0);

          expect(notificationStoreMock.addNotification).toHaveBeenCalledWith(
            notificationStoreMock.error
          );
        });
      });
    });
  });
  describe("getter", () => {
    test("getStatusCodeById works correctly", async () => {
      await store.getMasterData();

      const status = store.getStatusCodeById(
        "e68ffd9a-bbf3-4bb7-9082-3ef4abaeeabc"
      );
      expect(status).toBe("IN_REVIEW");
    });

    test("getStatusCodeById throws the correct error", async () => {
      await store.getMasterData();

      try {
        store.getStatusCodeById("will-error");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        expect(error.message).toBe(
          "Could not find status master data with id: will-error"
        );
      }
    });

    test("getStatusByCode works correctly", async () => {
      await store.getMasterData();

      const status = store.getStatusByCode(DocumentStatus.IN_REVIEW);
      expect(status).toStrictEqual(mockStatuses[0]);
    });

    test("getStatusByCode throws the correct error", async () => {
      await store.getMasterData();

      try {
        // @ts-expect-error it should be caught by ts
        store.getStatusByCode("will-error");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        expect(error.message).toBe(
          "Could not find status master data with code: will-error"
        );
      }
    });

    describe("getFlowCodeById", () => {
      test("it should return the correct flow code", async () => {
        await store.getMasterData();

        expect(store.getFlowCodeById("test-flow-1")).toBe("CURATION");
        expect(store.getFlowCodeById("test-flow-2")).toBe("MANUAL");
      });

      describe("if there is no flow with the id passed", () => {
        test("it should throw an error", async () => {
          await store.getMasterData();

          try {
            store.getFlowCodeById("will-error");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            expect(error.message).toBe(
              "Could not find flow master data with id: will-error"
            );
          }
        });
      });
    });
  });
});
