import { Story } from "@storybook/vue3";
import { action } from "@storybook/addon-actions";
import NovaIcon from "../NovaIcon/NovaIcon.vue";
import NovaButton, { Props } from "./NovaButton.vue";

interface Slots {
  default: string;
}

export default {
  title: "Navigation/Button",
  component: NovaButton,
  argTypes: {
    disabled: "boolean",
    loading: "boolean",
    size: {
      control: "select",
      options: ["xs", "sm", "lg"],
    },
    variant: {
      control: "select",
      options: ["contained", "outline", "text", "underlined"],
    },
    default: {
      description: "The default Vue slot",
      control: {
        type: "text",
      },
      table: {
        category: "Slots",
        type: {
          summary: "html",
        },
      },
    },
    onClick: { action: "click", table: { disable: true } },
  },
};

const Template: Story<Props & Slots> = (args) => ({
  components: { NovaButton, NovaIcon },
  setup() {
    return { args, action };
  },
  template: `
    <div style="width: 300px; display: flex; justify-content: center;">
      <nova-button v-bind="args">${args.default}</nova-button>
    </div>
  `,
});

export const Default: Story<Props & { default: string }> = Template.bind({});
Default.args = {
  default: "Hello World! <nova-icon name='chevron-right' class='ml-2' /> ",
  disabled: false,
};

export const FullWidth: Story<Props & Slots> = Template.bind({});
FullWidth.args = {
  default: "Hello World! <nova-icon name='chevron-right' class='ml-2' /> ",
  disabled: false,
  fullWidth: true,
};

export const Loading: Story<Props & Slots> = Template.bind({});
Loading.args = {
  default: "Hello World! <nova-icon name='chevron-right' class='ml-2' /> ",
  disabled: false,
  loading: true,
};
export const Outline: Story<Props & { default: string }> = Template.bind({});
Outline.args = {
  default: "Hello World!",
  disabled: false,
  variant: "outline",
};

export const Text: Story<Props & Slots> = Template.bind({});

Text.args = {
  default: "<nova-icon name='check' class='mr-2' /> Hello World!",
  disabled: false,
  variant: "text",
};

export const Underlined: Story<Props & Slots> = Template.bind({});

Underlined.args = {
  default: " Hello World!",
  disabled: false,
  variant: "underlined",
};
