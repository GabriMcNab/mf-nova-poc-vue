import { ref } from "vue";
import { config, mount, RouterLinkStub } from "@vue/test-utils";
import { test, expect, describe, vi, beforeEach, afterEach } from "vitest";
import DocumentSidebar, { Props } from "./DocumentSidebar.vue";
import * as useMediaQueryComposable from "@/composables/useMediaQuery";

config.global.mocks = {
  $t: (text: string) => text,
  $route: {
    hash: "#field_2",
  },
};

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

config.global.stubs = {
  NuxtLink: RouterLinkStub,
};

const masterDataStoreMock = {
  getStatusCodeById: () => "TO_BE_EDIT",
  getFlowCodeById: () => "CURATION",
};

vi.mock("@/stores/master-data", () => ({
  useMasterData: () => masterDataStoreMock,
}));

vi.mock("nuxt/app", () => ({
  useNuxtApp: () => ({
    $t: (text: string) => text,
  }),
}));

const props: Props = {
  documentFlowId: "test-flow",
  documentStatusId: "test-status",
  documentFields: {
    first_field: {
      value: "",
      required: false,
      category: "category_1",
    },
    second_field: {
      value: "test value",
      required: true,
      category: "category_1",
    },
    third_field: {
      value: "",
      required: false,
      category: "category_2",
    },
  },
};

const sidebarSelector = "[data-testid='document-sidebar']";
const searchSelector = "[data-testid='list-search-input-text']";
const navGroupTitle = "[data-testid='document-sidebar-group']";
const navSelector = "[data-testid='document-sidebar-nav']";
const navLinkSelector = "[data-testid='document-sidebar-nav-link']";
const refCode = "[data-testid='document-sidebar-refcode']";
const label = "[data-testid='document-sidebar-label']";
const visualizationToggle = "[data-testid='document-sidebar-toggle-btn']";
const collapseBtnSelector = "[data-testid='sidebar-btn-collapse']";
const expandBtnSelector = "[data-testid='sidebar-btn-expand']";

describe("DocumentSidebar", () => {
  beforeEach(() => {
    vi.spyOn(useMediaQueryComposable, "useMediaQuery").mockReturnValueOnce({
      isBigDesktop: ref(false),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("it should mount and render correctly", () => {
    const wrapper = mount(DocumentSidebar, {
      props,
    });

    expect(wrapper).toBeTruthy();

    expect(wrapper.find(sidebarSelector).exists()).toBe(true);
    expect(wrapper.find(refCode).exists()).toBe(true);
    expect(wrapper.find(label).exists()).toBe(false);
    expect(wrapper.find(visualizationToggle).exists()).toBe(false);
    expect(wrapper.find(refCode).text()).toBe("experience.new.experience");
    expect(wrapper.find(navSelector).exists()).toBe(true);
    expect(wrapper.findAll(navLinkSelector).length).toBe(3);
    expect(wrapper.find(collapseBtnSelector).exists()).toBe(true);
  });

  describe("when the user searches for a field", () => {
    test("the fields get filtered correctly by the search bar", async () => {
      const wrapper = mount(DocumentSidebar, {
        props,
      });

      await wrapper.find(searchSelector).setValue("ir");

      expect(wrapper.findAll(navLinkSelector).length).toBe(2);
      expect(wrapper.findAll(navGroupTitle)[0].text()).toContain("category_1");
      expect(wrapper.findAll(navLinkSelector)[0].text()).toContain(
        "first_field"
      );
      expect(wrapper.findAll(navGroupTitle)[1].text()).toContain("category_2");
      expect(wrapper.findAll(navLinkSelector)[1].text()).toContain(
        "third_field"
      );

      await wrapper.find(searchSelector).setValue("second");

      expect(wrapper.findAll(navLinkSelector).length).toBe(1);
      expect(wrapper.findAll(navGroupTitle)[0].text()).toContain("category_1");
      expect(wrapper.findAll(navLinkSelector)[0].text()).toContain(
        "second_field"
      );
    });
  });

  describe("if the refCode and document is passed", () => {
    test("RefCode and label should appear", () => {
      const wrapper = mount(DocumentSidebar, {
        props: {
          ...props,
          refCode: "123",
          documentData: {
            go_commercial: true,
            commercial: {
              title: "Hello there!",
            },
          },
        },
      });

      expect(wrapper.find(label).text()).toBe(
        "status.flow.curation - status.code.to_be_edit"
      );
      expect(wrapper.find(label).exists()).toBe(true);
      expect(wrapper.find(refCode).text()).toBe("Ref. code 123");
    });
  });

  describe("when the visualizationToggle prop is passed", () => {
    test("it should render the toggle button", () => {
      const wrapper = mount(DocumentSidebar, {
        props: { ...props, visualizationToggle: "BOTH" },
      });

      expect(wrapper.find(visualizationToggle).exists()).toBe(true);
    });
  });

  describe("when the visualization toggle button is clicked", () => {
    test("it should emit an event", async () => {
      const wrapper = mount(DocumentSidebar, {
        props: { ...props, visualizationToggle: "BOTH" },
      });

      await wrapper.find(visualizationToggle).trigger("click");

      const events = wrapper.emitted<Event[]>()["click:toggle"];
      expect(events).toBeTruthy();
      expect(events.length).toBe(1);
    });
  });

  describe("when the collapse button is clicked", () => {
    test("it should collapse the sidebar", async () => {
      const wrapper = mount(DocumentSidebar, {
        props,
      });

      await wrapper.find(collapseBtnSelector).trigger("click");
      expect(wrapper.find(refCode).exists()).toBe(false);
      expect(wrapper.find(navSelector).exists()).toBe(false);

      await wrapper.find(expandBtnSelector).trigger("click");
      expect(wrapper.find(refCode).exists()).toBe(true);
      expect(wrapper.find(navSelector).exists()).toBe(true);
    });
  });

  describe("when the screen is bigger than 1920px", () => {
    test("the sidebar should be forced open", async () => {
      vi.spyOn(useMediaQueryComposable, "useMediaQuery").mockReturnValueOnce({
        isBigDesktop: ref(true),
      });

      const wrapper = mount(DocumentSidebar, {
        props,
      });

      await wrapper.find(collapseBtnSelector).trigger("click");
      expect(wrapper.find(refCode).exists()).toBe(true);
      expect(wrapper.find(navSelector).exists()).toBe(true);
    });
  });
});
