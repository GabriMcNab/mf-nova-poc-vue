import { Story } from "@storybook/vue3";
import NovaTable, { NovaTableProps } from "./NovaTable.vue";

const props: NovaTableProps = {
  headers: [
    {
      key: "commercial.title",
    },
    {
      key: "id",
    },
  ],
  gridTemplateColumns: "1fr 1fr",
  items: [
    {
      "commercial.title": "4 days trip in Milan",
      id: "aaa",
    },
    {
      "commercial.title": "0 days trip in Milan",
      id: "bbb",
    },
    {
      "commercial.title": "-1 day trip in Milan",
      id: "ccc",
    },
  ],
};

export default {
  title: "Tables/Table",
  component: NovaTable,
};

const Template: Story<NovaTableProps> = (args) => ({
  components: { NovaTable },

  setup() {
    return { args };
  },
  template: `<NovaTable style='width: 420px' v-bind="args" />`,
});

const TemplateWithSlot: Story<NovaTableProps> = (args) => ({
  components: { NovaTable },

  setup() {
    return { args };
  },
  template: `
    <NovaTable style='width: 420px' v-bind="args">
      <template #row>
        <div style="background-color: aliceblue">Custom Row</div>
      </template>
    </NovaTable>`,
});

export const Default = Template.bind({});
Default.args = props;
export const WithSlot = TemplateWithSlot.bind({});
WithSlot.args = props;
export const Loading = Template.bind({});
Loading.args = {
  ...props,
  loading: true,
};
