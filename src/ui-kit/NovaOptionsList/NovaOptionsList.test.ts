import { config, mount, shallowMount } from "@vue/test-utils";
import { test, expect, describe } from "vitest";
import NovaOptionsList, { Props } from "./NovaOptionsList.vue";

config.global.mocks = {
  $t: (text: string) => text,
};

let props: Props = {
  options: [
    { label: "Option 1", value: "option_1" },
    { label: "Option 2", value: "option_2" },
    { label: "Option 3", value: "option_3" },
    { label: "Option 4", value: "option_4" },
    { label: "Option 5", value: "option_5" },
    { label: "Option 6", value: "option_6" },
  ],
  selected: [{ label: "Option 3", value: "option_3" }],
};

const selectors = {
  optionsList: "ul[data-testid='options-list-list']",
  options: "li[data-testid='options-list-list-item']",
  checkbox: "nova-checkbox-stub",
  selectedCount: "span[data-testid='options-list-selected']",
  clearAllBtn: "button[data-testid='options-list-clear-button']",
};

describe("NovaDropdown", () => {
  test("it should mount and render correctly", () => {
    const wrapper = mount(NovaOptionsList, { props });

    expect(wrapper).toBeTruthy();
    expect(wrapper.find(selectors.optionsList).exists()).toBe(true);
    expect(wrapper.findAll(selectors.options).length).toBe(6);
    expect(
      wrapper.findAll(selectors.options)[2].attributes().selected
    ).toBeTruthy();
  });

  describe("when one of the option is clicked", () => {
    test("it should emit an event", () => {
      const wrapper = mount(NovaOptionsList, { props });

      wrapper.findAll(selectors.options)[1].trigger("click");

      const events = wrapper.emitted<Event[]>()["select:option"];
      expect(events[0][0]).toEqual(props.options[1]);
    });
  });

  describe("when one of the option is selected with the keyboard", () => {
    test("it should emit an event", () => {
      const wrapper = mount(NovaOptionsList, { props });

      wrapper.findAll(selectors.options)[2].trigger("keydown.enter");

      let events = wrapper.emitted<Event[]>()["select:option"];
      expect(events[0][0]).toEqual(props.options[2]);

      wrapper.findAll(selectors.options)[3].trigger("keydown.space");

      events = wrapper.emitted<Event[]>()["select:option"];
      expect(events[1][0]).toEqual(props.options[3]);
    });
  });

  describe("when the user press the esc key", () => {
    test("it should emit an event", () => {
      const wrapper = mount(NovaOptionsList, { props });

      wrapper.findAll(selectors.options)[1].trigger("keydown.esc");

      expect(wrapper.emitted<Event[]>()["keydown:esc"]).toBeTruthy();
    });
  });

  describe("multi select", () => {
    props = { ...props, multi: true };

    describe("when one of the options is selected", () => {
      test("the checkbox should be checked", () => {
        const wrapper = shallowMount(NovaOptionsList, { props });

        expect(wrapper.findAll(selectors.checkbox)[2].attributes().status).toBe(
          "checked"
        );
      });
    });

    describe("when multiple options are checked", () => {
      test("it should display the correct selected count in the header", () => {
        const selected = [props.options[0], props.options[1], props.options[2]];
        const wrapper = shallowMount(NovaOptionsList, {
          props: { ...props, selected },
        });

        expect(wrapper.find(selectors.selectedCount).text()).toContain("3");
      });
    });

    describe("when the user clicks on the 'clear all' button", () => {
      test("it should emit an event", async () => {
        const wrapper = mount(NovaOptionsList, {
          props: { ...props, multi: true },
        });

        await wrapper.find(selectors.clearAllBtn).trigger("click");

        const events = wrapper.emitted<Event[]>()["click:clear"];
        expect(events).toBeTruthy();
      });
    });
  });
});
