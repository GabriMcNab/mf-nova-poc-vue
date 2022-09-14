import { mount } from "@vue/test-utils";
import { test, expect, describe } from "vitest";
import NovaInputRadio, { Props } from "./NovaInputRadio.vue";

const props: Props = {
  name: "test-group",
  option: { label: "Test Option", value: "test_option" },
};

const selectors = {
  radio: "[data-testid='input-radio-test_option']",
};

describe("NovaInputRadio", () => {
  test("it should mount and render correctly", () => {
    const wrapper = mount(NovaInputRadio, { props });

    expect(wrapper).toBeTruthy();
    expect(wrapper.find(selectors.radio).exists()).toBe(true);
    expect(wrapper.text()).toBe(props.option.label);
  });

  describe("when the disabled prop is set to true", () => {
    test("the input should not be clickable", async () => {
      const wrapper = mount(NovaInputRadio, {
        props: { ...props, disabled: true },
      });

      const input = wrapper.find(selectors.radio);
      await input.trigger("change");

      const events = wrapper.emitted<Event[]>().input;
      expect(events).toBeFalsy();
    });
  });

  describe("when the input radio is clicked", () => {
    test("it should emit an event", async () => {
      const wrapper = mount(NovaInputRadio, { props });

      const input = wrapper.find(selectors.radio);
      await input.trigger("change");

      const events = wrapper.emitted<Event[]>().input;
      expect(events).toBeTruthy();
      expect(events[0][0]).toBe(props.option.value);
    });
  });
});
