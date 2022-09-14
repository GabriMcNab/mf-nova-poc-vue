<template>
  <nova-dropdown
    :options="options"
    :show="dropdownOpen"
    :multi="multi"
    :max-height="maxHeight"
    :selected="selected"
    @select:option="handleSelectOption"
    @keydown:esc="toggleDropdown(false)"
    @click:clear="$emit('clear:options')"
  >
    <template #toggle>
      <label v-if="label" :for="id" class="SelectSearch__label">{{
        label
      }}</label>
      <div
        class="SelectSearch"
        :disabled="disabled || null"
        :open="dropdownOpen || null"
        @click="toggleDropdown(!dropdownOpen)"
      >
        <nova-icon name="search" :size="18" class="SelectSearch__left-icon" />
        <input
          :id="id"
          type="text"
          class="SelectSearch__input"
          data-testid="select-search-input"
          :value="inputValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :error="error || null"
          :open="dropdownOpen || null"
          @input="handleInput"
          @keydown.esc="toggleDropdown(false)"
        />
        <nova-icon
          name="chevron-down"
          class="SelectSearch__right-icon"
          :open="dropdownOpen || null"
          :size="14"
        />
        <span
          v-if="error"
          class="SelectSearch__error-msg"
          data-testid="select-search-error"
          >{{ error }}</span
        >
      </div>
    </template>
  </nova-dropdown>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import NovaDropdown from "../NovaDropdown/NovaDropdown.vue";
import NovaIcon from "../NovaIcon/NovaIcon.vue";
import { Option } from "@/types/Option";

export interface Props {
  id: string;
  options: Option[];
  selected?: Option[];
  inputValue?: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  error?: string;
  maxHeight?: number;
  multi?: boolean;
}

interface Events {
  (e: "update:inputValue", value: string): void;
  (e: "select:option", opt: Option): void;
  (e: "clear:options"): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Events>();

const dropdownOpen = ref(false);
const toggleDropdown = (show: boolean) => {
  dropdownOpen.value = show;
};

const handleInput = (event: Event) => {
  toggleDropdown(true);

  if (event.target) {
    const { value } = event.target as HTMLInputElement;
    emits("update:inputValue", value);
  }
};

const handleSelectOption = (opt: Option) => {
  if (!props.multi) {
    toggleDropdown(false);
  }
  emits("select:option", opt);
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utilities";

.SelectSearch {
  position: relative;
  cursor: pointer;
  width: 100%;
  border: var(--border-default);
  border-radius: var(--border-radius-default);
  padding: rem(5);
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > svg {
    flex-shrink: 0;
  }

  &__input {
    width: 100%;
    margin: 0 rem(5);
    background-color: transparent;
    outline: none;
    border: none;

    @include font-medium(14);

    &::placeholder {
      font-style: italic;
      color: var(--color-text-70);
    }

    &:disabled {
      cursor: not-allowed;
    }
  }

  &__label {
    position: relative;
    bottom: 5px;

    @include font-medium(12);

    color: var(--color-text-90);
  }

  &:hover:not([disabled]),
  &:focus-visible:not([disabled]),
  &[open] {
    border: var(--border-primary);
  }

  &[disabled] {
    cursor: not-allowed;
    background-color: var(--color-grey-70);

    & > svg {
      color: var(--color-text-70);
    }
  }

  &[error] {
    border: 1px solid var(--color-error-100);
  }

  &__right-icon {
    transition: transform 0.2s;

    &[open] {
      transform: rotate(180deg);
    }
  }

  &__error-msg {
    position: absolute;
    right: 5px;
    top: calc(100% + 2px);
    color: var(--color-error-100);

    @include font-medium(10);
  }
}
</style>
