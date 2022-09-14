<template>
  <div class="Dropdown">
    <slot name="toggle" />
    <div
      v-if="show"
      class="Dropdown__list"
      :style="{ maxHeight: `${maxHeight}px` }"
    >
      <NovaOptionsList
        :options="options"
        :multi="multi"
        :selected="selected"
        @click:clear="$emit('click:clear')"
        @keydown:esc="$emit('keydown:esc')"
        @select:option="(opt) => $emit('select:option', opt)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import NovaOptionsList from "../NovaOptionsList/NovaOptionsList.vue";
import { Option } from "@/types/Option";

export interface Props {
  options: Option[];
  selected?: Option[];
  show?: boolean;
  maxHeight?: number;
  multi?: boolean;
}

interface Events {
  (e: "select:option", option: Option): void;
  (e: "click:clear"): void;
  (e: "keydown:esc"): void;
}

defineProps<Props>();
defineEmits<Events>();
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utilities";

.Dropdown {
  position: relative;
  z-index: var(--z-index-dropdown);

  &__list {
    width: 100%;
    overflow-x: hidden;
    position: absolute;
    top: calc(100% + 4px);
    border: var(--border-default);
    border-radius: var(--border-radius-default);
    box-shadow: var(--box-shadow-popover);
    background-color: var(--color-white);
  }
}
</style>
