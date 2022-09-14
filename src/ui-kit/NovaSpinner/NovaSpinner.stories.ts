import NovaSpinner, { NovaSpinnerProps } from "./NovaSpinner.vue";

export default {
  title: "Loaders/Spinner",
  component: NovaSpinner,
  argTypes: {
    size: {
      control: {
        type: "text",
      },
    },
  },
};

const Template = (args: NovaSpinnerProps) => ({
  components: { NovaSpinner },
  setup() {
    return { args };
  },
  template: `<NovaSpinner v-bind="args" />`,
});

export const Default = Template.bind({});

Default.args = {
  size: "40",
};
