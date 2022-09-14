import { Story } from "@storybook/vue3";
import NovaOptionsList, { Props } from "./NovaOptionsList.vue";

export default {
  title: "Forms/OptionList",
  component: NovaOptionsList,
  argTypes: {
    "onSelect:option": { action: "option selected", table: { disable: true } },
    options: {
      table: {
        type: {
          summary: "Array<Option>",
        },
      },
    },
  },
};

const Template: Story<Props> = (args) => ({
  components: { NovaOptionsList },
  setup() {
    return { args };
  },
  template: `
    <nova-checklist v-bind="args" />

   `,
});

export const Default: Story<Props> = Template.bind({});
Default.args = {
  options: [
    { label: "Option 1", value: "option_1" },
    { label: "Option 2", value: "option_2" },
    { label: "Option 3", value: "option_3" },
    { label: "Option 4", value: "option_4" },
    { label: "Option 5", value: "option_5" },
    { label: "Option 6", value: "option_6" },
  ],
  disabled: false,
  selected: [{ label: "Option 6", value: "option_6" }],
};
