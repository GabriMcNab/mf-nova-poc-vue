<template>
  <span class="label" :theme="theme" :size="size" data-testid="nova-label">
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
import { withDefaults } from "vue";

export type LabelTheme =
  | "primary"
  | "secondary"
  | "red"
  | "green"
  | "yellow"
  | "light-grey"
  | "dark-grey"
  | "solid-dark"
  | "solid-secondary";

export interface NovaLabelProps {
  theme?: LabelTheme;
  size?: "sm" | "md";
}

withDefaults(defineProps<NovaLabelProps>(), {
  theme: "primary",
  size: "sm",
});
</script>

<style scoped lang="scss">
@import "@/assets/scss/utilities";

.label {
  display: inline-flex;
  border-radius: 4px;
  padding: 0 rem(8);
  align-items: center;
  @include font-medium(10);

  &[theme="primary"] {
    background: var(--color-primary-10);
    color: var(--color-primary-110);
  }

  &[theme="secondary"] {
    background: var(--color-secondary-10);
    color: var(--color-secondary-110);
  }

  &[theme="red"] {
    background: var(--color-error-90);
    color: var(--color-error-110);
  }

  &[theme="green"] {
    background: var(--color-success-10);
    color: var(--color-success-110);
  }

  &[theme="yellow"] {
    background: var(--color-warning-10);
    color: var(--color-warning-110);
  }

  &[theme="light-grey"] {
    background: var(--color-text-10);
    color: var(--color-text-90);
  }

  &[theme="dark-grey"] {
    background: var(--color-text-10);
    color: var(--color-text-100);
  }

  &[theme="solid-dark"] {
    background: var(--color-text-100);
    color: var(--color-white);
  }

  &[theme="solid-secondary"] {
    background: var(--color-secondary-110);
    color: var(--color-white);
  }

  &[size="md"] {
    padding: rem(2) rem(8);
    @include font-medium(12);
  }
}
</style>
