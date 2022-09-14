import { Story } from "@storybook/vue3";
import NovaSortableList, { Props } from "./NovaSortableList.vue";

export default {
  title: "Display/SortableList",
  component: NovaSortableList,
  argTypes: {
    modelValue: { control: "object" },
    layout: { control: { type: "select", options: ["grid", "list"] } },
    "onUpdate:modelValue": { action: "update", table: { disable: true } },
    "update:modelValue": { table: { disable: true } },
  },
};

const Template: Story<Props> = (args) => ({
  components: { NovaSortableList },
  setup() {
    return { args };
  },
  template: `
    <nova-sortable-list v-bind="args" v-slot="{item}">
      <div style="width: 100px; height: 230px; background-color: aliceblue;" >{{item.id}}</div>
    </nova-sortable-list>`,
});

export const Default: Story<Props> = Template.bind({});
Default.args = {
  modelValue: [
    { id: "item-1", visualization_order: 1 },
    { id: "item-2", visualization_order: 2 },
    { id: "item-3", visualization_order: 3 },
    { id: "item-4", visualization_order: 4 },
  ],
  layout: "grid",
};
