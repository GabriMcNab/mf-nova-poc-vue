import { Story } from "@storybook/vue3";
import NovaImagePreview, { Props } from "./NovaImagePreview.vue";

export default {
  title: "Display/ImagePreview",
  component: NovaImagePreview,
  argTypes: {
    image: { control: "object" },
    "onClick:edit": { action: "edit", table: { disable: true } },
    "onClick:delete": { action: "delete", table: { disable: true } },
    "click:edit": { table: { disable: true } },
    "click:delete": { table: { disable: true } },
  },
};

const Template: Story<Props> = (args) => ({
  components: { NovaImagePreview },
  setup() {
    return { args };
  },
  template: `<nova-image-preview v-bind="args" style="width: 700px; height: 300px" />`,
});

export const Default: Story<Props> = Template.bind({});
Default.args = {
  image: {
    name: "example.jpg",
    id: "id",
    url: "https://fakeimg.pl/1200x300",
  },
};
