import { Story } from "@storybook/vue3";
import NovaModal, { Props } from "./NovaModal.vue";

export default {
  title: "Modal/Modal",
  component: NovaModal,
  argTypes: {
    "onClick:on-overlay": { action: "event", table: { disable: true } },
    show: "boolean",
  },
};
const Template: Story<Props> = (args) => ({
  components: { NovaModal },
  setup() {
    return { args };
  },
  template: `<NovaModal v-bind="args"><div :style="{width: '400px', height: '300px'}"></div></NovaModal>`,
});

export const Default = Template.bind({});
Default.args = {
  show: true,
};
