import { Story } from "@storybook/vue3";
import { action } from "@storybook/addon-actions";
import NovaButtonToggle, { Props } from "./NovaButtonToggle.vue";

interface Slots {
  firstOption: unknown;
  secondOption: unknown;
}

export default {
  title: "Navigation/ButtonToggle",
  component: NovaButtonToggle,
  argTypes: {
    checked: "boolean",
    firstOption: {
      control: "text",
      description: "Slot content",
      defaultValue: "Option One",
    },
    secondOption: {
      control: "text",
      description: "Slot content",
      defaultValue: "Option Two",
    },
    "onClick:toggle": { action: "click:toggle", table: { disable: true } },
    "click:toggle": { table: { disable: true } },
  },
};

const Template: Story<Props & Slots> = (args) => ({
  components: { NovaButtonToggle },
  setup() {
    return { args, action };
  },
  template: `
    <div>
     <nova-button-toggle v-bind="args">
      <template #firstOption>{{ args.firstOption }}</template>
      <template #secondOption>{{ args.secondOption }}</template>
     </nova-button-toggle>
    </div>
  `,
});

export const Default: Story<Props> = Template.bind({});
Default.args = {
  checked: true,
};
