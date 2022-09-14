import { mount } from "@vue/test-utils";
import { test, expect, describe } from "vitest";
import NovaTooltip from "./NovaTooltip.vue";

describe("Novatooltip", () => {
  const selectors = {
    tooltip: "[data-testid='nova-tooltip']",
    arrow: "[data-testid='nova-tooltip-arrow']",
    tip: "[data-testid='nova-tooltip-tip']",
  };
  const wrapper = mount(NovaTooltip, {
    props: {
      position: "bottom-left",
      theme: "light",
    },
    slots: {
      default: "Hello world!",
      content: "Tooltip content",
    },
  });

  test("it should mount and render correctly", () => {
    expect(NovaTooltip).toBeTruthy();

    const element = wrapper.find(selectors.tooltip);

    expect(element.html()).toContain("Hello world!");
    expect(element.html()).not.toContain("Tooltip content");
    expect(wrapper.attributes().theme).toBe("light");
  });

  test("it should display the tooltip content on hover", async () => {
    const component = wrapper.findComponent(selectors.tooltip);

    await component.trigger("mouseenter");

    expect(component.html()).toContain("Hello world!");
    expect(component.html()).toContain("Tooltip content");

    await component.trigger("mouseleave");

    expect(component.html()).not.toContain("Tooltip content");
  });

  test("it should apply the correct classes", async () => {
    const component = wrapper.findComponent(selectors.tooltip);
    await component.trigger("mouseenter");

    const arrow = component.find(selectors.arrow);
    const tip = component.find(selectors.tip);

    expect(arrow.classes().toString()).toContain("bottom-left");
    expect(tip.classes().toString()).toContain("bottom-left");
  });
});
