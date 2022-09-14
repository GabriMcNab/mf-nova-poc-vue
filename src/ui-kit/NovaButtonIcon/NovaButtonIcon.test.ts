import { mount } from "@vue/test-utils";
import { test, expect, describe } from "vitest";
import NovaIconButton from "./NovaButtonIcon.vue";

const selector = "button[data-testid='nova-button-icon']";

describe("NovaIconButton", () => {
  test("it should mount and render correctly", () => {
    const wrapper = mount(NovaIconButton, {
      props: {
        name: "search",
      },
    });

    const button = wrapper.find(selector);

    expect(wrapper).toBeTruthy();
    expect(button.exists()).toBe(true);
    expect(button.attributes().theme).toBe("primary");
  });

  test("it should be disabled", () => {
    const wrapper = mount(NovaIconButton, {
      props: {
        disabled: true,
        name: "search",
      },
    });

    const button = wrapper.find(selector);
    expect(button.attributes().disabled).toBe("");
  });
});
