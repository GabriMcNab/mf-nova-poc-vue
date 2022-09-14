import { Story } from "@storybook/vue3";
import NovaDropZone, { Props } from "./NovaDropZone.vue";

export default {
  title: "Forms/Dropzone",
  component: NovaDropZone,
  argTypes: {
    "onFile:added": { action: "file added", table: { disable: true } },
    "onFile:rejected": { action: "file rejected", table: { disable: true } },
    onError: { action: "file error", table: { disable: true } },
    "file:added": { table: { disable: true } },
    "file:rejected": { table: { disable: true } },
    error: { table: { disable: true } },
    options: { control: "object" },
  },
};

const Template: Story<Props> = (args) => ({
  components: { NovaDropZone },
  setup() {
    return { args };
  },
  template: `
      <nova-drop-zone v-bind="args" style="border: 1px dashed orangered; padding: 100px; border-radius: 6px">
        Drop file, or click here
      </nova-drop-zone>
      `,
});

export const Default: Story<Props> = Template.bind({});
Default.args = {
  options: {
    maxSize: 5000000,
    acceptedFiles: "image/*",
  },
};
