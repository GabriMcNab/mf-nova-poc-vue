import { Story } from "@storybook/vue3";
import NovaSelectSearch, { Props } from "./NovaSelectSearch.vue";

const options = {
  option_1: { label: "Option 1", value: "option_1" },
  option_2: { label: "Option 2", value: "option_2" },
  option_3: { label: "Option 3", value: "option_3" },
  option_4: { label: "Option 4", value: "option_4" },
  option_5: { label: "Option 5", value: "option_5" },
  option_6: { label: "Option 6", value: "option_6" },
};

export default {
  title: "Forms/SelectSearch",
  component: NovaSelectSearch,
  argTypes: {
    "onSelect:option": { action: "option selected", table: { disable: true } },
    "onUpdate:inputValue": {
      action: "update input value",
      table: { disable: true },
    },
    selected: {
      options: Object.keys(options),
      mapping: options,
      control: {
        type: "select",
        labels: {
          option_1: "Option 1",
          option_2: "Option 2",
          option_3: "Option 3",
          option_4: "Option 4",
          option_5: "Option 5",
          option_6: "Option 6",
        },
      },
    },
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
  components: { NovaSelectSearch },
  setup() {
    return { args };
  },
  template: `
    <nova-select-search v-bind="args" />`,
});

export const Default: Story<Props> = Template.bind({});
Default.args = {
  id: "select-search",
  placeholder: "Select one option",
  inputValue: "",
  disabled: false,
  error: "",
  maxHeight: 150,
  selected: [],
  options: Object.values(options),
  label: "Label",
};

export const MultiSelect: Story<Props> = Template.bind({});
MultiSelect.args = {
  id: "multiselect-search",
  placeholder: "Select one option",
  inputValue: "",
  disabled: false,
  error: "",
  maxHeight: 150,
  options: Object.values(options),
  selected: [],
  multi: true,
  label: "Label",
};
