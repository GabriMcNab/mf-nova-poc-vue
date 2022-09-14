import NovaTextEditor, { NovaTextEditorProps } from "./NovaTextEditor.vue";

export default {
  title: "Forms/TextEditor",
  component: NovaTextEditor,

  argTypes: {
    modelValue: "string",
    placeholder: "string",
    disabled: "boolean",
    hasError: "boolean",
    loading: "boolean",
    maxLength: "number",
  },
};

const Template = (args: NovaTextEditorProps) => ({
  components: { NovaTextEditor },
  setup() {
    return { args };
  },
  template: `
    <div style="width: 500px;">
      <NovaTextEditor v-bind="args" />
    </div>
  `,
});

export const Default = Template.bind({});
