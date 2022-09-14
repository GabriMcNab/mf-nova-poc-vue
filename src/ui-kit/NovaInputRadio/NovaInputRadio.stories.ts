import { Story } from "@storybook/vue3";
import NovaInputRadio, { Props } from "./NovaInputRadio.vue";

export default {
  title: "Forms/InputRadio",
  component: NovaInputRadio,
  argTypes: {
    onInput: { action: "input", table: { disable: true } },
  },
};

const Template: Story<Props> = (args) => ({
  components: { NovaInputRadio },
  setup() {
    return { args };
  },
  template: `<nova-input-radio v-bind="args" />`,
});

export const Default: Story<Props> = Template.bind({});
Default.args = {
  option: { value: "option_1", label: "Option 1" },
  disabled: false,
};
