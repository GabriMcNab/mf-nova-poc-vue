import { mount } from "@vue/test-utils";
import { test, expect, describe } from "vitest";
import NovaLabel from "./NovaLabel.vue";

const label = `span[data-testid="nova-label"]`;

describe("NovaLabel", () => {
  test("it should mount and render correctly", () => {
    expect(NovaLabel).toBeTruthy();

    const wrapper = mount(NovaLabel, {
      slots: {
        default: "Hello World",
      },
      props: {
        theme: "primary",
      },
    });

    expect(wrapper.find(label).text()).toBe("Hello World");
    expect(wrapper.find(label).attributes().theme).toBe("primary");
    expect(wrapper.find(label).attributes().size).toContain("sm");

    describe("if the props are md and secondary", () => {
      test("it should have the md and secondary classes", () => {
        expect(NovaLabel).toBeTruthy();

        const wrapper = mount(NovaLabel, {
          slots: {
            default: "Hello World",
          },
          props: {
            theme: "secondary",
            size: "md",
          },
        });

        expect(wrapper.find(".label").text()).toBe("Hello World");
        expect(wrapper.find(label).attributes().theme).toBe("secondary");
        expect(wrapper.find(label).attributes().size).toContain("md");
      });
    });
  });
});
