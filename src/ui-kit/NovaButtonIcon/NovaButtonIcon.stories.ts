import { Story } from "@storybook/vue3";
import { action } from "@storybook/addon-actions";
import NovaIcon from "../NovaIcon/NovaIcon.vue";
import NovaButtonIcon, { Props } from "./NovaButtonIcon.vue";

export default {
  title: "Navigation/ButtonIcon",
  component: NovaButtonIcon,
  argTypes: {
    disabled: "boolean",
    loading: "boolean",
    selected: "boolean",
    theme: {
      control: "select",
      options: ["primary", "light", "dark"],
    },
    shape: {
      control: "select",
      options: ["circle", "square"],
    },
    onClick: { action: "click", table: { disable: true } },
  },
};

const Template: Story<Props> = (args) => ({
  components: { NovaButtonIcon, NovaIcon },
  setup() {
    return { args, action };
  },
  template: `
    <div>
     <nova-button-icon v-bind="args" name="${args.name}" />
    </div>
  `,
});

export const Default: Story<Props> = Template.bind({});
Default.args = {
  disabled: false,
  name: "search",
};

export const Loading: Story<Props> = Template.bind({});
Loading.args = {
  disabled: false,
  loading: true,
  name: "search",
};
