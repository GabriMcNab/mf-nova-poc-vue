<template>
  <component
    :is="dynamicIcon"
    :style="{
      height: `${size ?? 16}px`,
      width: `${size ?? 16}px`,
      fill: 'currentColor',
    }"
  />
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from "vue";

export type Icon =
  | "alert"
  | "arrow-left"
  | "arrow-right"
  | "arrow-rotate-left"
  | "bars"
  | "bell"
  | "book-check"
  | "calendar"
  | "chat"
  | "check"
  | "chevron-down"
  | "chevron-expand"
  | "chevron-left"
  | "chevron-right"
  | "chevron-up"
  | "chevrons-left"
  | "chevrons-right"
  | "circle-info"
  | "close"
  | "edit"
  | "floppy-disk"
  | "grid"
  | "grip-dots"
  | "minus"
  | "plus"
  | "search"
  | "sliders"
  | "spinner"
  | "ticket"
  | "trash"
  | "flow-curation"
  | "flow-translation"
  | "flow-media"
  | "circle-dotted"
  | "underline"
  | "bold"
  | "italic"
  | "ordered-list"
  | "unordered-list"
  | "image";

export interface Props {
  name: Icon;
  size?: number;
}

const props = defineProps<Props>();

const dynamicIcon = defineAsyncComponent(
  () => import(/* @vite-ignore */ `../../assets/svg/icon-${props.name}.svg`)
);
</script>
