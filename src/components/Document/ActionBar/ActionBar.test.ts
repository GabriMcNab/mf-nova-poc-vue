import { ref } from "vue";
import { config, mount } from "@vue/test-utils";
import { test, expect, describe, vi, beforeEach, afterEach } from "vitest";
import ActionBar from "./ActionBar.vue";
import * as useMediaQueryComposable from "@/composables/useMediaQuery";

config.global.mocks = {
  $t: (text: string) => text,
};

const selectors = {
  sidebar: "[data-testid='document-action-bar']",
  toggle: "[data-testid='document-action-bar-toggle']",
  content: "[data-testid='document-action-bar-content']",
};

describe("DocumentActionBar", () => {
  beforeEach(() => {
    vi.spyOn(useMediaQueryComposable, "useMediaQuery").mockReturnValueOnce({
      isBigDesktop: ref(false),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("it should mount and render correctly", () => {
    const wrapper = mount(ActionBar as never, {
      slots: {
        default: "actionbar-cta",
      },
    });
    expect(wrapper).toBeTruthy();
    expect(wrapper.find(selectors.sidebar).exists()).toBe(true);
  });

  describe("when toggle button is clicked", () => {
    test("it should toggle the menu", async () => {
      const wrapper = mount(ActionBar as never, {
        slots: {
          default: "actionbar-cta",
        },
      });
      await wrapper.find(selectors.toggle).trigger("click");
      expect(wrapper.find(selectors.content).exists()).toBe(false);

      await wrapper.find(selectors.toggle).trigger("click");
      expect(wrapper.find(selectors.content).exists()).toBe(true);
    });
  });

  describe("when the screen is bigger than 1920px", () => {
    test("the sidebar should be forced open", async () => {
      vi.spyOn(useMediaQueryComposable, "useMediaQuery").mockReturnValueOnce({
        isBigDesktop: ref(true),
      });

      const wrapper = mount(ActionBar as never, {
        slots: {
          default: "actionbar-cta",
        },
      });

      await wrapper.find(selectors.toggle).trigger("click");
      expect(wrapper.find(selectors.content).exists()).toBe(true);
    });
  });
});
