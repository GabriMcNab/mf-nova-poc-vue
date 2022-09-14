import { Story } from "@storybook/vue3";
import NovaInputRadioGroup, { Props } from "./NovaInputRadioGroup.vue";

export default {
  title: "Forms/InputRadioGroup",
  component: NovaInputRadioGroup,
  argTypes: {
    onSelectOption: { action: "select-option", table: { disable: true } },
  },
};

const Template: Story<Props> = (args) => ({
  components: { NovaInputRadioGroup },
  setup() {
    return { args };
  },
  template: `<nova-input-radio-group v-bind="args" />`,
});

export const Default: Story<Props> = Template.bind({});
Default.args = {
  options: [
    { value: "option_1", label: "Option 1" },
    { value: "option_2", label: "Option 2" },
  ],
  label: "Choose one option:",
  name: "custom-radio-group",
  disabled: false,
};
