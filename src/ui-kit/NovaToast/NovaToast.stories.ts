import NovaToast, { NovaToastProps } from "./NovaToast.vue";

export default {
  title: "Messages/Toasts",
  component: NovaToast,
  argTypes: {
    "onNotification:delete": {
      action: "close notification",
      table: { disable: true },
    },
    theme: {
      control: {
        type: "select",
        options: ["success", "warning", "error", "info"],
      },
    },
  },
};

const Template = (args: NovaToastProps) => ({
  components: { NovaToast },
  setup() {
    return { args };
  },
  template: `
      <NovaToast v-bind="args" />
  `,
});

export const Default = Template.bind({});

Default.args = {
  theme: "success",
  title: "Hello World",
  message: "Lorem ipsum dolor sit amet...",
  type: "toast",
};
