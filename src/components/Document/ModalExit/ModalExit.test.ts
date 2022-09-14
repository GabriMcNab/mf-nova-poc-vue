import { mount, config } from "@vue/test-utils";
import { createRouter, createWebHistory, Router } from "vue-router";

import { describe, test, expect, beforeEach, vi } from "vitest";
import ModalExit, {
  Props,
} from "@/components/Document/ModalExit/ModalExit.vue";

config.global.mocks = {
  $t: (text: string) => text,
  $route: {
    path: "test-id",
  },
};

const routes = [
  {
    path: "/",
    component: {
      template: "Welcome to the first page",
    },
  },
  {
    path: "/second-page",
    component: {
      template: "Welcome to the second page",
    },
  },
];

let router: Router;

vi.stubGlobal("useRouter", () => router);

const documentTabStoreMock = {
  closeTab: () => vi.fn,
};

vi.mock("@/stores/document-tabs", () => ({
  useDocumentTabs: () => documentTabStoreMock,
}));

beforeEach(async () => {
  router = createRouter({
    history: createWebHistory(),
    routes,
  });

  router.push("/");
  await router.isReady();
});

const selectors = {
  modal: "[data-testid='modal']",
  saveBtn: "[data-testid='modal-save-btn']",
  leaveBtn: "[data-testid='modal-leave-btn']",
};

const props: Props = {
  documentIsModified: true,
};

describe("Modal Exit with prop documentIsModified true", () => {
  test("if you go to another route it should be opened", async () => {
    const wrapper = mount(ModalExit, {
      global: {
        plugins: [router],
      },
      props,
    });

    expect(wrapper.find(selectors.leaveBtn).exists()).toBeFalsy();
    expect(wrapper.find(selectors.saveBtn).exists()).toBeFalsy();
    expect(wrapper.find(selectors.modal).exists()).toBeFalsy();

    await router.push("/second-page");

    expect(wrapper.find(selectors.saveBtn).exists()).toBeTruthy();
    expect(wrapper.find(selectors.leaveBtn).exists()).toBeTruthy();
    expect(wrapper.find(selectors.modal).exists()).toBeTruthy();
  });
  test("if you click on 'save' it should not redirect you and it should disappear", async () => {
    const wrapper = mount(ModalExit, {
      global: {
        plugins: [router],
      },
      props,
    });

    await router.push("/second-page");

    await wrapper.find(selectors.saveBtn).trigger("click");

    expect(wrapper.find(selectors.leaveBtn).exists()).toBeFalsy();
    expect(wrapper.find(selectors.saveBtn).exists()).toBeFalsy();
    expect(wrapper.find(selectors.modal).exists()).toBeFalsy();
    expect(router.currentRoute.value.fullPath).toBe("/");
  });
  test("if you click on 'yes, leave' it should redirect you and disappear", async () => {
    const wrapper = mount(ModalExit, {
      global: {
        plugins: [router],
      },
      props,
    });

    await router.push("/second-page");
    await wrapper.find(selectors.leaveBtn).trigger("click");
    await router.push("/second-page");

    expect(wrapper.find(selectors.leaveBtn).exists()).toBeFalsy();
    expect(wrapper.find(selectors.saveBtn).exists()).toBeFalsy();
    expect(wrapper.find(selectors.modal).exists()).toBeFalsy();
    expect(router.currentRoute.value.fullPath).toBe("/second-page");
  });
});
describe("Modal Exit with prop documentIsModified false", () => {
  test("if you go to another route it should not open", async () => {
    const wrapper = mount(ModalExit, {
      global: {
        plugins: [router],
      },
      props: {
        documentIsModified: false,
      },
    });

    expect(wrapper.find(selectors.leaveBtn).exists()).toBeFalsy();
    expect(wrapper.find(selectors.saveBtn).exists()).toBeFalsy();
    expect(wrapper.find(selectors.modal).exists()).toBeFalsy();

    await router.push("/second-page");

    expect(wrapper.find(selectors.saveBtn).exists()).toBeFalsy();
    expect(wrapper.find(selectors.leaveBtn).exists()).toBeFalsy();
    expect(wrapper.find(selectors.modal).exists()).toBeFalsy();

    expect(router.currentRoute.value.fullPath).toBe("/second-page");
  });
});
