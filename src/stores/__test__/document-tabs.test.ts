import {
  setActivePinia,
  createPinia,
  Store,
  _GettersTree,
  _ActionsTree,
} from "pinia";
import { beforeAll, beforeEach, describe, test, expect, vi } from "vitest";
import { DocumentTabState, useDocumentTabs } from "../document-tabs";

const mockRoute = {
  fullPath: "/test-path-1/test-id",
};

const mockRouter = {
  push: vi.fn(),
};

describe("Document tabs Store", () => {
  let store: Store<
    "document-tabs",
    DocumentTabState,
    _GettersTree<DocumentTabState>,
    _ActionsTree
  >;

  vi.stubGlobal("useRouter", () => mockRouter);
  vi.stubGlobal("useRoute", () => mockRoute);

  beforeAll(() => {
    setActivePinia(createPinia());
    store = useDocumentTabs();
    store.$nuxt = {
      $t: vi.fn((k) => k),
    };
  });

  beforeEach(() => {
    vi.resetAllMocks();

    store.$reset();
    store.$state = {
      tabs: [
        {
          label: "Test Value",
          path: "/test-path-1/test-id",
        },
        {
          label: "Test Value 2",
          path: "/test-path-2/test-id",
        },
        {
          label: "Test Value 3",
          path: "/test-path-3/test-id",
        },
      ],
    };
  });
  describe("actions", () => {
    test("it finds an opened tab", () => {
      expect(store.isOpen("/test-path-1/test-id")).toBe(true);
      expect(store.isOpen("/will-fail/test-id")).toBe(false);
    });

    test("the current route is selected", () => {
      expect(store.isSelected("/test-path-1/test-id")).toBe(true);
      expect(store.isSelected("/test-path-2/test-id")).toBe(false);
    });

    test("it correctly adds a tab", () => {
      store.addTab({
        label: "Test Value 4",
        path: "/test-path-4/test-id",
      });

      expect(store.tabs.length).toBe(4);
      expect(store.tabs[3].label).toBe("Test Value 4");
      expect(store.tabs[3].path).toBe("/test-path-4/test-id");
    });

    test("it correctly updates a tab", () => {
      store.updateTab({
        label: "Updated Value 3",
        path: "/test-path-3/test-id",
      });

      expect(store.tabs.length).toBe(3);
      expect(store.tabs[2].label).toBe("Updated Value 3");
      expect(store.tabs[2].path).toBe("/test-path-3/test-id");
    });

    test("it correctly removes a tab", () => {
      store.closeTab("/test-path-1/test-id");

      expect(store.tabs.length).toBe(2);
      expect(store.tabs[0].label).toBe("Test Value 2");
      expect(mockRouter.push).toBeCalledWith("/test-path-2/test-id");

      // if the argument removeTab is false it shouldn't remove the tab
      store.closeTab("/test-path-2/test-id", false);
      expect(store.tabs[0].label).toBe("Test Value 2");
    });

    test("it does not close if we have only a tab opened", () => {
      store.$state = {
        tabs: [
          {
            label: "Test Value",
            path: "/test-path-1/test-id",
          },
        ],
      };

      store.closeTab("/test-path-1/test-id");

      expect(mockRouter.push).not.toBeCalled();
    });

    test("it does not navigate if we close a tab that is not the current", () => {
      store.closeTab("/test-path-3/test-id");

      expect(mockRouter.push).not.toBeCalled();
    });

    test("if we try to go on the media page but we already have the experience in the store it should switch them", () => {
      store.$state = {
        tabs: [
          {
            label: "Test Value",
            path: "/experience-curation/test-id",
          },
        ],
      };

      store.addTab({
        label: "Test Value",
        path: "/experience-curation/test-id/media",
      });

      expect(store.$state.tabs.length).toBe(1);
      expect(store.$state.tabs[0].path).toBe(
        "/experience-curation/test-id/media"
      );
      // and viceversa
      store.addTab({
        label: "Test Value",
        path: "/experience-curation/test-id",
      });

      expect(store.$state.tabs.length).toBe(1);
      expect(store.$state.tabs[0].path).toBe("/experience-curation/test-id");

      expect(mockRouter.push).not.toBeCalled();
    });
  });
});
