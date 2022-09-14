import { mount } from "@vue/test-utils";
import { test, expect, describe, vi } from "vitest";
import NovaTextEditor, { NovaTextEditorProps } from "./NovaTextEditor.vue";

const props: NovaTextEditorProps = {
  modelValue: "Lorem ipsum",
  maxLength: 250,
};

const selectors = {
  novaEditor: "[data-testid='nova-text-editor']",
  tipTapEditor: ".ProseMirror, .NovaTextEditor__content",
  buttons: "[data-testid='nova-text-editor-buttons']",
  buttonBold: "[data-testid='nova-text-editor-buttons-bold']",
  buttonItalic: "[data-testid='nova-text-editor-buttons-italic']",
  buttonUnderline: "[data-testid='nova-text-editor-buttons-underline']",
  buttonOrderedList: "[data-testid='nova-text-editor-buttons-ordered-list']",
  buttonUnorderedList:
    "[data-testid='nova-text-editor-buttons-unordered-list']",
} as const;

describe("NovaTextEditor", () => {
  test("it should mount and render correctly", async () => {
    expect(NovaTextEditor).toBeTruthy();

    const wrapper = mount(NovaTextEditor, { props });
    await vi.dynamicImportSettled();

    Object.keys(selectors).forEach((selector) => {
      // @ts-expect-error complains about indexing by string...
      const element = wrapper.find(selectors[selector]);
      expect(element.exists()).toBe(true);
    });

    expect(wrapper.html()).toContain("Lorem ipsum");
  });

  test("it should display the character count correctly", async () => {
    const wrapper = mount(NovaTextEditor, { props });
    await vi.dynamicImportSettled();

    // 11 is the passed prop + the p tags,
    // 250 is the max length passed
    expect(wrapper.html()).toContain("11/250");
  });

  test("it should be correctly disabled", () => {
    const wrapper = mount(NovaTextEditor, {
      props: {
        ...props,
        disabled: true,
      },
    });

    const novaEditor = wrapper.find(selectors.novaEditor);

    expect(novaEditor.attributes().disabled).toBe("true");
  });

  test("it should correctly error", () => {
    const wrapper = mount(NovaTextEditor, {
      props: {
        ...props,
        hasError: true,
      },
    });

    const novaEditor = wrapper.find(selectors.novaEditor);

    expect(novaEditor.attributes().theme).toBe("error");
  });

  test("it should show the loading state", () => {
    const wrapper = mount(NovaTextEditor, {
      props: {
        ...props,
        loading: true,
      },
    });

    const novaEditor = wrapper.find(selectors.novaEditor);

    expect(novaEditor.attributes().loading).toBe("true");
  });
});
