<template>
  <label
    :for="option.value"
    class="NovaInputRadio__label"
    :disabled="disabled || null"
  >
    <input
      :id="option.value"
      type="radio"
      :name="name"
      :disabled="disabled"
      class="NovaInputRadio__input"
      :data-testid="`input-radio-${option.value}`"
      @change="$emit('input', option.value)"
    />
    {{ option.label }}
  </label>
</template>

<script lang="ts" setup>
export interface RadioOption {
  label: string;
  value: string;
}

export interface Props {
  option: RadioOption;
  name?: string;
  disabled?: boolean;
}

interface Events {
  (e: "input", value: string): void;
}

defineProps<Props>();
defineEmits<Events>();
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utilities";

.NovaInputRadio {
  &__label {
    display: flex;
    align-items: center;
    cursor: pointer;

    @include font-medium(14);

    &[disabled] {
      cursor: not-allowed;
      color: var(--color-text-70);
    }
  }

  &__input {
    cursor: pointer;
    position: relative;
    appearance: none;
    outline: none;
    margin: 0 rem(8) 0 0;
    height: rem(16);
    width: rem(16);
    border: var(--border-default);
    border-radius: 50%;

    &:disabled {
      cursor: not-allowed;
      background-color: var(--color-grey-90);
    }

    &::before {
      content: "";
      border-radius: 50%;
      width: rem(6);
      height: rem(6);
      position: absolute;
      top: rem(4);
      right: rem(4);
    }

    &:checked {
      border: var(--border-primary);

      &::before {
        background-color: var(--color-primary-100);
      }

      &:hover:not(:disabled),
      &:focus-visible:not(:disabled) {
        border: 1px solid var(--color-primary-110);

        &::before {
          background-color: var(--color-primary-110);
        }
      }
    }

    /* stylelint-disable-next-line no-descending-specificity */
    &:hover:not(:disabled),
    &:focus-visible:not(:disabled) {
      border: var(--border-primary);
    }
  }
}
</style>
