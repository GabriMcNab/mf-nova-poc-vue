import { Story } from "@storybook/vue3";
import NovaImageGallery, { Props } from "./NovaImageGallery.vue";

export default {
  title: "Display/ImageGallery",
  component: NovaImageGallery,
  argTypes: {
    modelValue: { control: "object" },
    ctaText: { control: "text" },
    "onUpdate:modelValue": { action: "update", table: { disable: true } },
    "update:modelValue": { table: { disable: true } },
  },
};

const Template: Story<Props> = (args) => ({
  components: { NovaImageGallery },
  setup() {
    return { args };
  },
  template: `<nova-image-gallery v-bind="args" />`,
});

export const Default: Story<Props> = Template.bind({});
Default.args = {
  modelValue: [1, 2, 3, 4, 5, 6].map((i) => ({
    id: `image-${i}`,
    name: `image-${i}.jpg`,
    media_type: "image/jpg",
    url: "https://fakeimg.pl/350x200",
    visualization_order: i,
    is_cover: false,
    original_file: new File(["test"], `image-${i}.jpg`),
  })),
  ctaText: "Add images",
};
