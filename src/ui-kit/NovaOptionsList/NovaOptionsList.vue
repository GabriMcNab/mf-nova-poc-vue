<template>
  <div class="OptionsList">
    <ul
      role="listbox"
      class="OptionsList__list"
      data-testid="options-list-list"
    >
      <div v-if="multi" class="OptionsList__header">
        <span data-testid="options-list-selected"
          >{{ selected?.length || "0" }} selected</span
        >
        <nova-button
          variant="underlined"
          size="xs"
          data-testid="options-list-clear-button"
          :disabled="disabled"
          @click="$emit('click:clear')"
          >Clear all</nova-button
        >
      </div>
      <li
        v-for="option in options"
        :key="option.value"
        role="option"
        :tabindex="multi ? -1 : 0"
        class="OptionsList__list-item"
        data-testid="options-list-list-item"
        :disabled="disabled || null"
        :selected="isOptionSelected(option) || null"
        @click="$emit('select:option', option)"
        @keydown.enter.space="$emit('select:option', option)"
        @keydown.esc="$emit('keydown:esc')"
      >
        <template v-if="multi">
          <nova-checkbox
            size="sm"
            :value="option.value"
            class="mr-4"
            :status="isOptionSelected(option) ? 'checked' : 'unchecked'"
            :disabled="disabled"
            @update:status="$emit('select:option', option)"
          />
          {{ option.label }}
        </template>
        <template v-else>
          {{ option.label }}
        </template>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import NovaCheckbox from "@/ui-kit/NovaCheckbox/NovaCheckbox.vue";
import NovaButton from "@/ui-kit/NovaButton/NovaButton.vue";
import { Option } from "@/types/Option";

export interface Props {
  options: Option[];
  selected?: Option[];
  multi?: boolean;
  disabled?: boolean;
}

interface Events {
  (e: "select:option", option: Option): void;
  (e: "click:clear"): void;
  (e: "keydown:esc"): void;
}

const props = defineProps<Props>();
defineEmits<Events>();

const isOptionSelected = (opt: Option): boolean => {
  if (props.selected) {
    return props.selected.some((o) => o.value === opt.value);
  }
  return false;
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utilities";

.OptionsList {
  &__header {
    padding: rem(2) rem(16) rem(2) rem(16);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--color-grey-90);
    color: var(--color-text-90);
    @include font-medium(12);
  }

  &__list {
    width: 100%;

    @include font-light(14);
  }

  &__list-item {
    cursor: pointer;
    padding: rem(8) rem(16);
    display: flex;
    align-items: center;

    &:hover {
      background-color: var(--color-grey-80);
    }

    &[disabled] {
      cursor: not-allowed;

      &:hover {
        background-color: inherit;
      }
    }

    &[selected] {
      color: var(--color-primary-100);

      &[disabled] {
        color: var(--color-text-100);
      }
    }
  }
}
</style>
