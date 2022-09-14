import { Story } from "@storybook/vue3";
import NovaDropdown, { Props } from "./NovaDropdown.vue";

export default {
  title: "Forms/Dropdown",
  component: NovaDropdown,
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
  components: { NovaDropdown },
  setup() {
    return { args };
  },
  template: `
    <nova-dropdown v-bind="args">
      <template #toggle>
        <div style="width: 250px"></div>
      </template>
    </nova-dropdown>`,
});

export const Default: Story<Props> = Template.bind({});
Default.args = {
  show: true,
  maxHeight: 200,
  options: [
    { label: "Option 1", value: "option_1" },
    { label: "Option 2", value: "option_2" },
    { label: "Option 3", value: "option_3" },
    { label: "Option 4", value: "option_4" },
    { label: "Option 5", value: "option_5" },
    { label: "Option 6", value: "option_6" },
  ],
  selected: [{ label: "Option 3", value: "option_3" }],
  multi: false,
};
