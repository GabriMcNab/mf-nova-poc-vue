import { setActivePinia, createPinia, Store } from "pinia";
import { beforeAll, beforeEach, describe, test, expect, vi } from "vitest";
import { NotificationStoreState, useNotifications } from "../notifications";

describe("App notifications Store", () => {
  let store: Store<"notifications", NotificationStoreState, any, any>;

  beforeAll(() => {
    setActivePinia(createPinia());
    store = useNotifications();
    store.$nuxt = {
      $t: vi.fn((k) => k),
    };
  });

  beforeEach(() => {
    store.$reset();
    store.$state = {
      notifications: [
        {
          id: 1111,
          theme: "success",
          timeout: 4500,
          title: "Hello world!",
          type: "toast",
          message: "Lorem ipsum dolor sit amet...",
        },
        {
          id: 2222,
          theme: "success",
          timeout: 4500,
          title: "My second notification!",
          type: "toast",
          message: "Lorem ipsum dolor sit amet...",
        },
      ],
    };
  });
  describe("getters", () => {
    test("gets the correct notifications types", () => {
      expect(store.getToastNotifications.length).toBe(2);
      expect(store.getToastNotifications[0].title).toBe("Hello world!");
      expect(store.getToastNotifications[0].type).toBe("toast");
    });
  });
  describe("actions", () => {
    test("it correctly adds a notification", () => {
      store.addNotification({
        id: 3333,
        title: "My notification!",
      });

      expect(store.getToastNotifications.length).toBe(3);
      expect(store.getToastNotifications[2].id).toBe(3333);
      expect(store.getToastNotifications[2].title).toBe("My notification!");
    });

    test("it correctly removes a notification", () => {
      store.deleteNotification(1111);

      expect(store.getToastNotifications.length).toBe(1);
      expect(store.getToastNotifications[0].title).toBe(
        "My second notification!"
      );
    });
  });
});
