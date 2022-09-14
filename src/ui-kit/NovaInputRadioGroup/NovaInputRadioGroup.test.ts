import { mount } from "@vue/test-utils";
import { test, expect, describe } from "vitest";
import NovaInputRadio from "../NovaInputRadio/NovaInputRadio.vue";
import NovaInputRadioGroup, { Props } from "./NovaInputRadioGroup.vue";

const props: Props = {
  label: "Choose one:",
  name: "test-group",
  options: [
    { label: "Test Option 1", value: "test_option_1" },
    { label: "Test Option 2", value: "test_option_2" },
    { label: "Test Option 3", value: "test_option_3" },
  ],
};

const selectors = {
  label: "[data-testid='radio-group-test-group-label']",
  radio1: "[data-testid='input-radio-test_option_1']",
  radio2: "[data-testid='input-radio-test_option_2']",
  radio3: "[data-testid='input-radio-test_option_3']",
};

describe("NovaInputRadioGroup", () => {
  test("it should mount and render correctly", () => {
    const wrapper = mount(NovaInputRadioGroup, { props });

    expect(wrapper).toBeTruthy();
    expect(wrapper.find(selectors.label).text()).toBe(props.label);
    expect(wrapper.find(selectors.radio1).exists()).toBe(true);
    expect(wrapper.find(selectors.radio2).exists()).toBe(true);
    expect(wrapper.find(selectors.radio3).exists()).toBe(true);
  });

  describe("when the label text is not passed as prop", () => {
    test("it should not be rendered", () => {
      const propsOverride: Partial<Props> = { label: undefined };
      const wrapper = mount(NovaInputRadioGroup, {
        props: { ...props, ...propsOverride },
      });
      expect(wrapper.find(selectors.label).exists()).toBe(false);
    });
  });

  describe("when the disabled prop is set to true", () => {
    test("it should disable all radio inputs", () => {
      const propsOverride: Partial<Props> = { disabled: true };
      const wrapper = mount(NovaInputRadioGroup, {
        props: { ...props, ...propsOverride },
      });

      const radioInputs = wrapper.findAllComponents(NovaInputRadio);
      expect(radioInputs.every((r) => r.props().disabled)).toBe(true);
    });
  });

  describe("when the one of the inputs is clicked", () => {
    test("it should emit an event", async () => {
      const wrapper = mount(NovaInputRadioGroup, { props });

      const input = wrapper.find(selectors.radio2);
      await input.trigger("change");

      const events = wrapper.emitted<Event[]>()["select:option"];
      expect(events).toBeTruthy();
      expect(events[0][0]).toBe(props.options[1].value);
    });
  });
});
