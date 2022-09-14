import { describe, test, expect, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import NovaImagePreviewCard from "../NovaImagePreviewCard/NovaImagePreviewCard.vue";
import NovaImageGallery, { Props } from "./NovaImageGallery.vue";

const props: Props = {
  modelValue: [1, 2, 3, 4, 5, 6].map((i) => ({
    id: `image-${i}`,
    name: `image-${i}.jpg`,
    media_type: "image/jpg",
    url: `test-image-${i}-url`,
    visualization_order: i,
    is_cover: false,
    original_file: new File(["test"], `image-${i}.jpg`),
  })),
  ctaText: "test cta",
};

const selectors = {
  imageCard: NovaImagePreviewCard,
  button: "[data-testid='nova-image-gallery-button']",
};

const useFileDialogMock = {
  openDialog: vi.fn(),
  files: {
    value: [
      {
        name: "newImage1.jpg",
        type: "image/jpg",
        original_file: new File(["test"], "newImage1.jpg"),
      },
    ],
  },
};

vi.mock("@/composables/useFileDialog", () => ({
  useFileDialog: () => useFileDialogMock,
}));

vi.stubGlobal("URL", {
  createObjectURL: vi.fn(),
});

describe("NovaImageGallery", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("it should render correctly", () => {
    const wrapper = mount(NovaImageGallery, { props });

    expect(wrapper).toBeTruthy();
    expect(wrapper.findAllComponents(selectors.imageCard).length).toBe(6);
    expect(wrapper.find(selectors.button).text()).toBe(props.ctaText);
  });

  describe("when a new image is added", () => {
    test("it should emit an event", async () => {
      const wrapper = mount(NovaImageGallery, {
        props: { ...props, modelValue: [] },
      });

      await wrapper.find(selectors.button).trigger("click");

      expect(useFileDialogMock.openDialog).toHaveBeenCalledWith({
        multiple: true,
        accept: "image/*",
      });
      const events = wrapper.emitted<Event[]>()["update:modelValue"];
      expect(events[0][0]).toStrictEqual([
        {
          id: "newImage1.jpg",
          is_cover: false,
          media_type: "image/jpg",
          name: "newImage1.jpg",
          original_file: {
            name: "newImage1.jpg",
            original_file: new File(["test"], "newImage1.jpg"),
            type: "image/jpg",
          },
          url: undefined,
          visualization_order: 1,
        },
      ]);
    });
  });

  describe("when an image is edited", () => {
    test("it should emit an event with the new images", async () => {
      const filteredList = [...props.modelValue];
      filteredList.shift();

      const wrapper = mount(NovaImageGallery, { props });
      const imageCards = wrapper.findAllComponents(selectors.imageCard);
      const editButton = imageCards[0].findAll(
        "[data-testid='nova-button-icon']"
      )[0];

      await editButton.trigger("click");

      expect(useFileDialogMock.openDialog).toHaveBeenCalledWith({
        accept: "image/*",
      });
      const events = wrapper.emitted<Event[]>()["update:modelValue"];
      expect(events[0][0]).toStrictEqual([
        {
          id: "newImage1.jpg",
          is_cover: false,
          media_type: "image/jpg",
          name: "newImage1.jpg",
          original_file: {
            name: "newImage1.jpg",
            original_file: new File(["test"], "newImage1.jpg"),
            type: "image/jpg",
          },
          url: undefined,
          visualization_order: 1,
        },
        ...filteredList,
      ]);
    });
  });

  describe("when an image is deleted", () => {
    test("it should emit an event with the remaining images", async () => {
      const filteredList = [...props.modelValue];
      filteredList.shift();

      const wrapper = mount(NovaImageGallery, { props });
      const imageCards = wrapper.findAllComponents(selectors.imageCard);
      const deleteButton = imageCards[0].findAll(
        "[data-testid='nova-button-icon']"
      )[1];

      await deleteButton.trigger("click");

      const events = wrapper.emitted<Event[]>()["update:modelValue"];
      expect(events[0][0]).toStrictEqual(
        filteredList.map((i, idx) => ({
          ...i,
          visualization_order: idx + 1,
        }))
      );
    });
  });
});
