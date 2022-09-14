<template>
  <div
    class="NovaTextEditor"
    :theme="hasError ? 'error' : null"
    :disabled="disabled || null"
    :loading="loading || null"
    data-testid="nova-text-editor"
  >
    <div v-if="loading" class="NovaTextEditor__skeleton skeleton_item" />
    <div v-if="editor" class="NovaTextEditor__header">
      <div
        class="NovaTextEditor__buttons"
        data-testid="nova-text-editor-buttons"
      >
        <NovaButtonIcon
          class="mr-1"
          name="bold"
          :size="20"
          :disabled="disabled"
          theme="dark"
          shape="square"
          :selected="editor.isActive('bold')"
          data-testid="nova-text-editor-buttons-bold"
          @click="editor?.chain().focus().toggleBold().run()"
        />
        <NovaButtonIcon
          class="mr-1"
          name="italic"
          :size="20"
          :disabled="disabled"
          theme="dark"
          shape="square"
          :selected="editor.isActive('italic')"
          data-testid="nova-text-editor-buttons-italic"
          @click="editor?.chain().focus().toggleItalic().run()"
        />
        <NovaButtonIcon
          class="mr-1"
          name="underline"
          :size="20"
          :disabled="disabled"
          theme="dark"
          shape="square"
          :selected="editor.isActive('underline')"
          data-testid="nova-text-editor-buttons-underline"
          @click="editor?.commands.toggleUnderline()"
        />
        <NovaButtonIcon
          class="mr-1"
          name="ordered-list"
          :size="20"
          :disabled="disabled"
          theme="dark"
          shape="square"
          :selected="editor.isActive('orderedList')"
          data-testid="nova-text-editor-buttons-ordered-list"
          @click="editor?.commands.toggleOrderedList()"
        />
        <NovaButtonIcon
          name="unordered-list"
          :size="20"
          :disabled="disabled"
          theme="dark"
          shape="square"
          :selected="editor.isActive('bulletList')"
          data-testid="nova-text-editor-buttons-unordered-list"
          @click="editor?.commands.toggleBulletList()"
        />
      </div>
      <div
        v-if="maxLength"
        class="NovaTextEditor__characters"
        data-testid="nova-text-editor-characters"
      >
        {{ editor.storage.characterCount.characters() }}/{{ maxLength }}
      </div>
    </div>
    <EditorContent
      data-testid="nova-text-editor-tiptap-editor"
      :editor="editor"
    />
  </div>
</template>

<script lang="ts" setup>
import { useEditor, EditorContent } from "@tiptap/vue-3";
import { Document } from "@tiptap/extension-document";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Text } from "@tiptap/extension-text";
import { Bold } from "@tiptap/extension-bold";
import { Italic } from "@tiptap/extension-italic";
import { ListItem } from "@tiptap/extension-list-item";
import { BulletList } from "@tiptap/extension-bullet-list";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { Placeholder } from "@tiptap/extension-placeholder";
import { CharacterCount } from "@tiptap/extension-character-count";
import { History } from "@tiptap/extension-history";
import { Underline } from "@tiptap/extension-underline";
import NovaButtonIcon from "../NovaButtonIcon/NovaButtonIcon.vue";

export interface NovaTextEditorProps {
  modelValue: string;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
  loading?: boolean;
  maxLength?: number;
}

interface Events {
  (e: "update:modelValue", value: string): void;
}

const props = withDefaults(defineProps<NovaTextEditorProps>(), {
  placeholder: "Insert your text here...",
  maxLength: 0,
});
const emit = defineEmits<Events>();

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    Document,
    Paragraph,
    Text,
    Bold,
    Italic,
    ListItem,
    BulletList,
    OrderedList,
    History,
    Underline,
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
    CharacterCount.configure({
      limit: props.maxLength,
    }),
  ],
  editorProps: {
    attributes: {
      class: "NovaTextEditor__content",
    },
  },
  onUpdate: () => {
    if (editor.value) {
      emit("update:modelValue", editor.value.getHTML());
    }
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utilities";

.NovaTextEditor {
  --border-color: var(--border-default-color);
  --background-color: #fff;
  --text-color: var(--color-text-100);
  --character-count-color: var(--color-text-80);

  width: 100%;
  border: var(--border-default);
  border-color: var(--border-color);
  border-radius: var(--border-radius-default);
  background-color: var(--background-color);
  color: var(--text-color);
  position: relative;
  @include font-medium(14);

  &:hover:not([disabled]),
  &:focus-visible:not([disabled]) {
    outline: none;

    --border-color: var(--color-primary-100);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: rem(10);
    border-bottom: var(--border-default);
  }

  &__buttons {
    display: flex;
  }

  &__characters {
    color: var(--character-count-color);
  }

  &[theme="error"] {
    --border-color: var(--color-error-100);
  }

  &[disabled] {
    cursor: not-allowed;

    --background-color: var(--color-grey-70);
    --text-color: var(--color-grey-100);
    --character-count-color: var(--color-grey-100);

    * {
      pointer-events: none;
    }
  }
}

// use the global options when possible
.skeleton_item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: linear-gradient(
    90deg,
    var(--color-grey-90) 40%,
    var(--color-text-60) 50%,
    var(--color-grey-90) 60%
  );
  background-size: 400% 100%;
  border-color: transparent !important;
  animation: shine-skeleton 2s infinite ease-in-out;
  overflow: hidden;
}

@keyframes shine-skeleton {
  0% {
    background-position: 0;
  }

  40%,
  100% {
    background-position: 100%;
  }
}
</style>

<style lang="scss">
.ProseMirror {
  padding: 10px;
  height: 200px;

  em {
    font-style: italic;
  }

  ul {
    padding: 0 1rem;
    list-style: disc;
  }

  ol {
    padding: 0 1rem;
    list-style: decimal;
  }

  &:focus-visible {
    outline: none;
  }

  // placeholder
  // https://tiptap.dev/api/extensions/placeholder
  p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #adb5bd;
    pointer-events: none;
    height: 0;
  }
}
</style>
