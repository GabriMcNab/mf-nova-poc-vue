import { Story } from "@storybook/vue3";
import NovaImageUpload, { Props } from "./NovaImageUpload.vue";

export default {
  title: "Display/ImageUpload",
  component: NovaImageUpload,
  argTypes: {
    modelValue: { control: "object" },
    isCover: { control: "boolean" },
    ctaText: { control: "text" },
    "onUpdate:modelValue": { action: "update", table: { disable: true } },
    "update:modelValue": { table: { disable: true } },
    onError: { action: "error", table: { disable: true } },
    error: { table: { disable: true } },
  },
};

const Template: Story<Props> = (args) => ({
  components: { NovaImageUpload },
  setup() {
    return { args };
  },
  template: `
    <div style="width: 700px; height: 300px">
      <nova-image-upload v-bind="args" />
    </div>`,
});

export const Default: Story<Props> = Template.bind({});
Default.args = {
  modelValue: null,
  isCover: false,
  ctaText: "+ Add image",
};
