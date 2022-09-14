import { Story } from "@storybook/vue3";
import NovaTabs, { Props } from "./NovaTabs.vue";

export default {
  title: "Navigation/Tabs",
  component: NovaTabs,
  argTypes: {
    "onSelect:option": { action: "option selected", table: { disable: true } },
    default: {
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
  },
};

const Template: Story<Props> = (args) => ({
  components: { NovaTabs },

  setup() {
    return { args };
  },
  template: `<NovaTabs v-bind="args" style="width: 220px" />`,
});
export const Default = Template.bind({});
Default.args = {
  options: [
    { title: "Curation", value: "http://experience-curation" },
    { title: "Media", value: "http://experience-media" },
  ],
  selected: { title: "Curation", value: "http://experience-curation" },
};
