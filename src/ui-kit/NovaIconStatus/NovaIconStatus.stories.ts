import NovaIconStatus, { NovaIconStatusProps } from "./NovaIconStatus.vue";

export default {
  title: "Display/Status Icon",
  component: NovaIconStatus,
  argTypes: {
    theme: {
      control: {
        type: "select",
        options: ["success", "warning", "error", "info"],
      },
    },
  },
};

const Template = (args: NovaIconStatusProps) => ({
  components: { NovaIconStatus },
  setup() {
    return { args };
  },
  template: `<NovaIconStatus v-bind="args" />`,
});

export const Default = Template.bind({});

Default.args = {
  size: "20",
};
