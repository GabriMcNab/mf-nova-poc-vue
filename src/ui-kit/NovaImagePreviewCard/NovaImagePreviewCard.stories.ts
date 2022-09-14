import { Story } from "@storybook/vue3";
import NovaImagePreviewCard, { Props } from "./NovaImagePreviewCard.vue";

export default {
  title: "Display/ImagePreviewCard",
  component: NovaImagePreviewCard,
  argTypes: {
    image: { control: "object" },
    "onClick:edit": { action: "edit", table: { disable: true } },
    "onClick:delete": { action: "delete", table: { disable: true } },
    "click:edit": { table: { disable: true } },
    "click:delete": { table: { disable: true } },
  },
};

const Template: Story<Props> = (args) => ({
  components: { NovaImagePreviewCard },
  setup() {
    return { args };
  },
  template: `<nova-image-preview-card v-bind="args" />`,
});

export const Default: Story<Props> = Template.bind({});
Default.args = {
  image: {
    name: "example.jpg",
    id: "id",
    url: "https://fakeimg.pl/250x200",
    visualization_order: 1,
  },
};
