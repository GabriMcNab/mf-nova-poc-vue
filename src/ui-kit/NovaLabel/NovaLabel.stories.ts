import NovaLabel, { NovaLabelProps } from "./NovaLabel.vue";

interface StoryArgs extends NovaLabelProps {
  default: string;
}
export default {
  title: "Forms/Label",
  component: NovaLabel,
  argTypes: {
    theme: {
      control: { type: "select" },
      options: [
        "primary",
        "secondary",
        "red",
        "green",
        "yellow",
        "light-grey",
        "dark-grey",
        "solid-dark",
        "solid-secondary",
      ],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md"],
    },
    default: {
      description: "Label Text",
      control: { type: "text" },
      table: {
        category: "SLOT",
        type: {
          summary: "html",
        },
      },
    },
  },
};

const Template = (args: StoryArgs) => ({
  components: { NovaLabel },
  setup() {
    return { args };
  },
  template: `<NovaLabel v-bind="args">${args.default}</NovaLabel>`,
});

export const Default = Template.bind({});

Default.args = {
  default: "Required",
  theme: "primary",
};
