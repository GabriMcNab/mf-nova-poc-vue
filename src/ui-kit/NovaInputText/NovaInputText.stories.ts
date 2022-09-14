import { Story } from "@storybook/vue3";
import NovaInputText, { Props } from "./NovaInputText.vue";

export default {
  title: "Forms/InputText",
  component: NovaInputText,
  argTypes: {
    theme: {
      control: "select",
      options: ["success", "error", "warning", "default"],
    },
    "onUpdate:modelValue": { action: "updated", table: { disable: true } },
    "onClick:clearBtn": { action: "id", table: { disable: true } },
    disabled: { control: "boolean" },
    leftIcon: { control: "select", options: ["search", "default"] },
    size: { control: "select", options: ["sm", "lg"] },
  },
};

const Template: Story<Props> = (args) => ({
  components: { NovaInputText },
  setup() {
    return { args };
  },
  template: `<nova-input-text v-bind="args" />`,
});

export const Default: Story<Props> = Template.bind({});
Default.args = {
  modelValue: "",
  placeholder: "Enter some text here...",
  disabled: false,
  error: "",
  label: "",
  id: "id",
};

export const Search: Story<Props> = Template.bind({});
Search.args = {
  modelValue: "",
  placeholder: "Search for...",
  disabled: false,
  leftIcon: "search",
  error: "",
  label: "",
  id: "id",
};
