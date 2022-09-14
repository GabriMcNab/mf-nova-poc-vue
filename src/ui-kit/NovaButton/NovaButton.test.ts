import { mount } from "@vue/test-utils";
import { test, expect, describe } from "vitest";
import NovaButton from "./NovaButton.vue";

const slots = {
  default: "Hello World!",
};
describe("NovaButton", () => {
  test("it should mount and render correctly", () => {
    const wrapper = mount(NovaButton, {
      props: {
        variant: "contained",
        size: "lg",
      },
      slots,
    });

    const button = wrapper.find("button[data-testid='nova-button']");

    expect(wrapper).toBeTruthy();
    expect(button.exists()).toBe(true);
    expect(button.text()).toContain(slots.default);
    expect(button.attributes().variant).toBe("contained");
    expect(button.attributes().size).toBe("lg");
  });

  test("it should be disabled", () => {
    const wrapper = mount(NovaButton, {
      props: {
        disabled: true,
      },
      slots,
    });

    const button = wrapper.find("button[data-testid='nova-button']");
    expect(button.attributes().disabled).toBe("");
  });
});
