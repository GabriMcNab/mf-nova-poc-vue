<template>
  <button
    class="Button"
    :disabled="disabled || loading"
    :size="size || null"
    :variant="variant || null"
    :loading="loading || null"
    :fullWidth="fullWidth || null"
    data-testid="nova-button"
  >
    <div v-if="loading" class="LoadingOverlay">
      <NovaSpinner :size="size === 'xs' ? 15 : 20" />
    </div>
    <span
      class="TextContainer"
      :class="loading ? 'TextContainer--hide-text' : null"
    >
      <slot></slot>
    </span>
  </button>
</template>
<script lang="ts" setup>
import NovaSpinner from "../NovaSpinner/NovaSpinner.vue";

export type ButtonVariant = "contained" | "outline" | "text" | "underlined";

export interface Props {
  disabled?: boolean;
  size?: "xxs" | "xs" | "sm" | "lg";
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  size: "lg",
  variant: "contained",
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utilities";

.Button {
  margin: 0;
  padding: rem(10) rem(16);
  border: 2px solid transparent;
  border-radius: var(--border-radius-default);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  @include font-medium(14);

  &:disabled {
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary-50);
  }

  &[fullWidth] {
    width: 100%;
  }

  .LoadingOverlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &[variant="contained"] {
    color: white;
    background-color: var(--button-background-color);

    .LoadingOverlay {
      background-color: var(--button-background-color);
    }

    &:disabled:not([loading]) {
      color: var(--color-text-70);
      background-color: var(--color-grey-90);
    }

    &:hover:not(:active):not([loading]):not(:disabled) {
      background-color: var(--button-background-hover);
    }
  }

  &[variant="outline"] {
    color: var(--button-background-color);
    background-color: white;
    border-color: var(--button-background-color);

    .LoadingOverlay {
      background-color: white;
    }

    &:disabled:not([loading]) {
      color: var(--color-text-70);
      border-color: var(--color-grey-90);
    }

    &:hover:not(:active):not([loading]):not(:disabled) {
      color: var(--color-primary-100);
      border-color: var(--color-primary-100);
      background-color: var(--color-primary-10);
    }
  }

  &[variant="text"] {
    color: var(--color-text-100);
  }

  &[variant="underlined"] {
    text-decoration: underline;
    color: var(--color-primary-100);
  }

  &[variant="text"],
  &[variant="underlined"] {
    background-color: transparent;

    .LoadingOverlay {
      color: var(--color-primary-100);
      background-color: var(--color-primary-10);
    }

    &:disabled:not([loading]) {
      color: var(--color-text-70);
    }

    &:hover:not(:active):not(:disabled) {
      background-color: var(--color-primary-10);
    }
  }

  &[size="xxs"] {
    padding: 0 rem(4);
    border-radius: var(--border-radius-xs);

    @include font-medium(10);
  }

  &[size="xs"] {
    padding: rem(5) rem(10);

    @include font-medium(12);
  }

  &[size="sm"] {
    padding: rem(7) rem(16);
  }

  .TextContainer {
    display: flex;
    justify-content: center;
    align-items: center;

    &--hide-text {
      opacity: 0;
    }
  }
}
</style>
