import { mount } from "@vue/test-utils";
import { test, expect, describe } from "vitest";
import NovaSelect, { Props } from "./NovaSelect.vue";

const props: Props = {
  options: [
    { label: "Option 1", value: "option_1" },
    { label: "Option 2", value: "option_2" },
    { label: "Option 3", value: "option_3" },
    { label: "Option 4", value: "option_4" },
    { label: "Option 5", value: "option_5" },
    { label: "Option 6", value: "option_6" },
  ],
  placeholder: "Select Option",
};

const selectors = {
  button: "button[data-testid='select-button']",
  text: "#dropdown-label",
  errorMsg: "span[data-testid='select-error']",
  optionsList: "ul[data-testid='options-list-list']",
  options: "li[data-testid='options-list-list-item']",
};

describe("NovaSelect", () => {
  test("it should mount and render correctly", () => {
    const wrapper = mount(NovaSelect, { props });

    expect(wrapper).toBeTruthy();
    expect(wrapper.find(selectors.button).exists()).toBe(true);
    expect(wrapper.find(selectors.text).text()).toBe(props.placeholder);
    expect(wrapper.find(selectors.optionsList).exists()).toBe(false);
  });

  describe("when the select button is clicked", () => {
    test("it should open the options list", async () => {
      const wrapper = mount(NovaSelect, { props });

      await wrapper.find(selectors.button).trigger("click");

      expect(wrapper.find(selectors.optionsList).exists()).toBe(true);
    });
  });

  describe("when the selected option is passed as prop", () => {
    test("it should display the selected option text", () => {
      const wrapper = mount(NovaSelect, {
        props: { ...props, selected: props.options[1] },
      });

      expect(wrapper.find(selectors.text).text()).toBe(props.options[1].label);
    });
  });

  describe("when the user selects an option", () => {
    test("it should emit an event", async () => {
      const wrapper = mount(NovaSelect, { props });

      await wrapper.find(selectors.button).trigger("click");
      await wrapper.findAll(selectors.options)[2].trigger("click");

      const events = wrapper.emitted<Event[]>()["select:option"];
      expect(events[0][0]).toStrictEqual(props.options[2]);
    });

    test("it should close the dropdown", async () => {
      const wrapper = mount(NovaSelect, { props });

      await wrapper.find(selectors.button).trigger("click");
      expect(wrapper.find(selectors.optionsList).exists()).toBe(true);

      await wrapper.findAll(selectors.options)[2].trigger("click");
      expect(wrapper.find(selectors.optionsList).exists()).toBe(false);
    });
  });

  describe("when the disabled prop is set to true", () => {
    test("it should not be clickable", async () => {
      const wrapper = mount(NovaSelect, {
        props: { ...props, disabled: true },
      });

      await wrapper.find(selectors.button).trigger("click");

      expect(wrapper.find(selectors.optionsList).exists()).toBe(false);
      expect(wrapper.emitted().click).toBeFalsy();
    });
  });

  describe("when an error message is passed as prop", () => {
    test("it should render it", () => {
      const wrapper = mount(NovaSelect, {
        props: { ...props, error: "test error" },
      });

      expect(wrapper.find(selectors.errorMsg).text()).toBe("test error");
    });
  });
});
