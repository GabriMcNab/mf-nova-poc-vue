import NovaTooltip, { NovaTooltipProps } from "./NovaTooltip.vue";

interface StoryArgs extends NovaTooltipProps {
  default: string;
  content: string;
}

export default {
  title: "Display/Tooltip",
  component: NovaTooltip,
  argTypes: {
    theme: {
      control: {
        type: "select",
        options: ["light", "dark"],
      },
    },
    position: {
      control: {
        type: "select",
        options: [
          "top-left",
          "top-center",
          "top-right",
          "bottom-left",
          "bottom-center",
          "bottom-right",
          "center-left",
          "center-right",
        ],
      },
    },
  },
};

const Template = (args: StoryArgs) => ({
  components: { NovaTooltip },
  setup() {
    return { args };
  },
  template: `
   <NovaTooltip v-bind="args">
    ${args.default}
      <template #content>
        ${args.content}
      </template>
    </NovaTooltip>`,
});

export const Default = Template.bind({});

Default.args = {
  position: "top-left",
  default: "Hover me!",
  content:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae exercitationem, laborum fugiat quasi ut saepe inventore debitis consequatur impedit amet tempora modi odio corrupti neque quibusdam. Consectetur reprehenderit quos amet.",
};
