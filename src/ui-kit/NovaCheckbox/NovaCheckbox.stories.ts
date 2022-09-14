import { Story } from "@storybook/vue3";
import NovaCheckbox, { Props } from "./NovaCheckbox.vue";

export default {
  title: "Forms/InputCheckbox",
  component: NovaCheckbox,
  argTypes: {
    "onUpdate:status": { action: "value", table: { disable: true } },
    disabled: "boolean",
    status: {
      control: "inline-radio",
      options: ["checked", "unchecked", "indeterminate"],
    },
    label: "string",
    description: "string",
    size: {
      control: "select",
      options: ["sm", "lg"],
    },
  },
};
const Template: Story<Props> = (args) => ({
  components: { NovaCheckbox },
  setup() {
    return { args };
  },
  template: `<NovaCheckbox v-bind="args"></NovaCheckbox>`,
});

export const Default = Template.bind({});
Default.args = {
  status: "unchcked",
  size: "lg",
  disabled: false,
  label: "label",
  description: "this is the description",
  value: "value",
};
