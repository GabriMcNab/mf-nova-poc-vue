<template>
  <nova-dropdown
    :options="options"
    :show="dropdownOpen"
    :max-height="maxHeight"
    :selected="selected && [selected]"
    @select:option="handleSelectOption"
    @keydown:esc="toggleDropdown(false)"
  >
    <template #toggle>
      <button
        class="Select"
        aria-haspopup="listbox"
        aria-labelledby="dropdown-label"
        data-testid="select-button"
        :disabled="disabled"
        :error="error || null"
        :open="dropdownOpen || null"
        @click="toggleDropdown(!dropdownOpen)"
        @keydown.esc="toggleDropdown(false)"
      >
        <span v-if="selected" id="dropdown-label">{{ selected.label }}</span>
        <span v-else id="dropdown-label" class="Select__placeholder">{{
          placeholder
        }}</span>
        <nova-icon
          name="chevron-down"
          class="Select__icon"
          :open="dropdownOpen || null"
          :size="14"
        />
        <span
          v-if="error"
          class="Select__error-msg"
          data-testid="select-error"
          >{{ error }}</span
        >
      </button>
    </template>
  </nova-dropdown>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import NovaDropdown from "../NovaDropdown/NovaDropdown.vue";
import NovaIcon from "../NovaIcon/NovaIcon.vue";
import { Option } from "@/types/Option";

export interface Props {
  options: Option[];
  selected?: Option;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  maxHeight?: number;
}

interface Events {
  (e: "select:option", opt: Option): void;
}

defineProps<Props>();
const emits = defineEmits<Events>();

const dropdownOpen = ref(false);
const toggleDropdown = (show: boolean) => {
  dropdownOpen.value = show;
};

const handleSelectOption = (opt: Option) => {
  toggleDropdown(false);
  emits("select:option", opt);
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utilities";

.Select {
  position: relative;
  cursor: pointer;
  width: 100%;
  background-color: transparent;
  outline: none;
  border: var(--border-default);
  border-radius: var(--border-radius-default);
  padding: rem(5) rem(10);

  @include font-medium(14);

  display: flex;
  align-items: center;
  justify-content: space-between;

  &:disabled {
    cursor: not-allowed;
    background-color: var(--color-grey-70);

    & > svg {
      color: var(--color-text-70);
    }
  }

  &:hover:not(:disabled),
  &:focus-visible:not(:disabled),
  &[open] {
    border: var(--border-primary);
  }

  &[error] {
    border: 1px solid var(--color-error-100);
  }

  &__placeholder {
    font-style: italic;
    color: var(--color-text-70);
  }

  &__icon {
    margin-left: rem(10);
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
