import { config, mount } from "@vue/test-utils";
import { test, expect, describe } from "vitest";
import HighlightsManager, { Props } from "./HighlightsManager.vue";

config.global.mocks = {
  $t: (text: string) => text,
};

const props: Props = {
  id: "test-id",
  loading: false,
  highlights: [
    {
      id: "highlight-1",
      code: "HIGHLIGHT1",
      name: "first highlight",
      language_code: "en",
      description: "Description if it needs",
    },
    {
      id: "highlight-2",
      code: "HIGHLIGHT2",
      name: "second highlight",
      language_code: "en",
      description: "Description if it needs",
    },
    {
      id: "highlight-3",
      code: "HIGHLIGHT2",
      name: "third highlight",
      language_code: "en",
      description: "Description if it needs",
    },
  ],
  modelValue: [],
};

const selectors = {
  textInput: "input#test-id-text-input",
  tabAll: "button[data-testid='test-id-tabs-all']",
  tabSelected: "button[data-testid='test-id-tabs-selected']",
  tabNotSelected: "button[data-testid='test-id-tabs-notSelected']",
  highlight: "li[data-testid='test-id-highlight']",
  spinner: "[data-testid='nova-spinner']",
};

describe("HighlightsManager", () => {
  test("it should mount and render correctly", () => {
    const wrapper = mount(HighlightsManager, { props });

    expect(wrapper).toBeTruthy();
    expect(wrapper.find(selectors.textInput).exists()).toBe(true);
    expect(wrapper.find(selectors.tabAll).exists()).toBe(true);
    expect(wrapper.find(selectors.tabSelected).exists()).toBe(true);
    expect(wrapper.find(selectors.tabNotSelected).exists()).toBe(true);
    expect(wrapper.findAll(selectors.highlight).length).toBe(3);
  });

  describe("when a value is passed as prop", () => {
    test("the corresponding highlight should be selected", () => {
      const wrapper = mount(HighlightsManager, {
        props: { ...props, modelValue: ["highlight-1"] },
      });

      expect(
        wrapper.findAll(selectors.highlight)[0].attributes().selected
      ).toBe("true");
    });
  });

  describe("when loading is set to true", () => {
    test("it should display a spinner", () => {
      const wrapper = mount(HighlightsManager, {
        props: { ...props, loading: true },
      });

      expect(wrapper.find(selectors.highlight).exists()).toBe(false);
      expect(wrapper.find(selectors.spinner).exists()).toBe(true);
    });
  });

  describe("when the user search for a specific highlight", () => {
    test("it should filter the list of highlights", async () => {
      const wrapper = mount(HighlightsManager, { props });

      const input = wrapper.find(selectors.textInput);
      await input.setValue("first");

      expect(wrapper.findAll(selectors.highlight).length).toBe(1);
      expect(wrapper.findAll(selectors.highlight)[0].text()).toBe(
        "first highlight"
      );

      await input.setValue("ir");

      expect(wrapper.findAll(selectors.highlight).length).toBe(2);
      expect(wrapper.findAll(selectors.highlight)[0].text()).toBe(
        "first highlight"
      );
      expect(wrapper.findAll(selectors.highlight)[1].text()).toBe(
        "third highlight"
      );
    });
  });

  describe("when the user selects an highlight", () => {
    test("it should emit an event", async () => {
      const wrapper = mount(HighlightsManager, { props });

      const highlight = wrapper.findAll(selectors.highlight)[1];
      await highlight.trigger("click");

      const events = wrapper.emitted<Event[]>()["update:modelValue"];
      expect(events).toBeTruthy();
      expect(events[0][0]).toStrictEqual(["highlight-2"]);
    });
  });

  describe("when the user de-selects an highlight", () => {
    test("it should emit an event", async () => {
      const wrapper = mount(HighlightsManager, {
        props: {
          ...props,
          modelValue: ["highlight-1", "highlight-2"],
        },
      });

      const highlight = wrapper.findAll(selectors.highlight)[1];
      await highlight.trigger("click");

      const events = wrapper.emitted<Event[]>()["update:modelValue"];
      expect(events).toBeTruthy();
      expect(events[0][0]).toStrictEqual(["highlight-1"]);
    });
  });

  describe("when the user navigates on different tabs", () => {
    test("it should display the correct highlights", async () => {
      const wrapper = mount(HighlightsManager, {
        props: { ...props, modelValue: ["highlight-1"] },
      });

      await wrapper.find(selectors.tabSelected).trigger("click");
      expect(wrapper.findAll(selectors.highlight).length).toBe(1);
      expect(wrapper.findAll(selectors.highlight)[0].text()).toBe(
        "first highlight"
      );

      await wrapper.find(selectors.tabNotSelected).trigger("click");
      expect(wrapper.findAll(selectors.highlight).length).toBe(2);
      expect(wrapper.findAll(selectors.highlight)[0].text()).toBe(
        "second highlight"
      );
      expect(wrapper.findAll(selectors.highlight)[1].text()).toBe(
        "third highlight"
      );

      await wrapper.find(selectors.tabAll).trigger("click");
      expect(wrapper.findAll(selectors.highlight).length).toBe(3);
    });
  });
  describe("when is disabled", () => {
    test("it should display only the selected highlights", () => {
      const wrapper = mount(HighlightsManager, {
        props: {
          ...props,
          modelValue: ["highlight-1"],
          disabled: true,
        },
      });
      expect(
        wrapper.find(selectors.tabSelected).attributes("active")
      ).toBeTruthy();
      expect(wrapper.findAll(selectors.highlight)[0].text()).toBe(
        "first highlight"
      );
      expect(
        wrapper.findAll(selectors.highlight)[0].attributes("selected")
      ).toBeTruthy();
    });
    test("it shouldn't allow the user to navigate in a different tab", async () => {
      const wrapper = mount(HighlightsManager, {
        props: {
          ...props,
          modelValue: ["highlight-1"],
          disabled: true,
        },
      });
      expect(
        wrapper.find(selectors.tabSelected).attributes("active")
      ).toBeTruthy();
      await wrapper.find(selectors.tabAll).trigger("click");
      expect(wrapper.find(selectors.tabAll).attributes("active")).toBeFalsy();
      expect(
        wrapper.find(selectors.tabSelected).attributes("active")
      ).toBeTruthy();
    });
    test("it shouldn't emit any event if you click on the highlights", async () => {
      const wrapper = mount(HighlightsManager, {
        props: {
          ...props,
          modelValue: ["highlight-1"],
          disabled: true,
        },
      });
      const highlight = wrapper.findAll(selectors.highlight)[0];
      await highlight.trigger("click");

      const events = wrapper.emitted<Event[]>()["update:modelValue"];
      expect(events).toBeFalsy();
    });
  });
});
