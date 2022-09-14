import { mount, config, RouterLinkStub } from "@vue/test-utils";
import { test, expect, describe, vi } from "vitest";
import TabNavigation, { DocumentTabProps } from "./TabNavigation.vue";

const mockStore = {
  tabs: [
    {
      label: "Test Value",
      path: "/test-path-1",
    },
    {
      label: "Test Value",
      path: "/test-path-2",
    },
  ],
  isOpen: vi.fn(),
  isSelected: vi.fn(() => true),
  addTab: vi.fn(),
  closeTab: vi.fn(),
  updateTab: vi.fn(),
};

const mockRoute = {
  push: vi.fn(),
  path: "/test-path-1",
};

config.global.stubs = {
  NuxtLink: RouterLinkStub,
};

config.global.mocks = {
  $t: (text: string) => text,
};

vi.stubGlobal("useRoute", () => mockRoute);

vi.mock("@/stores/document-tabs", () => ({
  useDocumentTabs: () => mockStore,
}));

const selectors = {
  tabNavigation: "[data-testid='document-tab-navigation']",
  tabButtons: "[data-testid='document-tab-navigation-link']",
  nuxtLinkButtons: "[data-testid='document-tab-navigation-nuxt-link']",
  closeButtons: "[data-testid='document-tab-navigation-close']",
};

const props: DocumentTabProps = {
  label: "Test Value",
};

describe("Tab Navigation", () => {
  test("it should mount and render correctly", () => {
    const wrapper = mount(TabNavigation, {
      props,
    });

    const tabs = wrapper.find(selectors.tabNavigation);
    const buttons = wrapper.findAll(selectors.tabButtons);

    expect(wrapper).toBeTruthy();
    expect(tabs.exists()).toBe(true);
    expect(buttons.length).toBe(2);
    expect(buttons[0].attributes().selected).toBeTruthy();

    expect(mockStore.isOpen).toBeCalledTimes(1);
    expect(mockStore.addTab).toBeCalledWith({
      label: "Test Value",
      path: "/test-path-1",
    });

    expect(mockStore.isSelected).toHaveBeenCalledWith("/test-path-1");

    expect(wrapper.html()).toContain("Test Value");
    expect(wrapper.findComponent(RouterLinkStub).props().to).toContain(
      "/test-path-1"
    );
  });
  test("it should update the tab when the label changes", async () => {
    const wrapper = mount(TabNavigation, {
      props,
    });

    await wrapper.setProps({
      label: "Updated Label",
    });

    expect(mockStore.updateTab).toHaveBeenCalledWith({
      label: "Updated Label",
      path: "/test-path-1",
    });
  });

  test("it should close the tab when clicked", () => {
    const wrapper = mount(TabNavigation, {
      props,
    });

    const closeButtons = wrapper.findAll(selectors.closeButtons);

    closeButtons[0].trigger("click");

    expect(mockStore.closeTab).toHaveBeenCalledWith("/test-path-1", true);
  });

  test("if the props documentIsModified is true it shouldn't remove the tab", () => {
    const wrapper = mount(TabNavigation, {
      props: {
        ...props,
        documentIsModified: true,
      },
    });

    const closeButtons = wrapper.findAll(selectors.closeButtons);

    closeButtons[0].trigger("click");

    expect(mockStore.closeTab).toHaveBeenCalledWith("/test-path-1", false);
  });
});
