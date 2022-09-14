<template>
  <button
    class="NovaButtonToggle"
    role="switch"
    :aria-checked="checked"
    @click="$emit('click:toggle')"
  >
    <span><slot name="firstOption" /></span>
    <span><slot name="secondOption" /></span>
  </button>
</template>

<script lang="ts" setup>
export interface Props {
  checked: boolean;
}
interface Events {
  (e: "click:toggle"): void;
}

defineProps<Props>();
defineEmits<Events>();
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utilities";

.NovaButtonToggle {
  cursor: pointer;
  padding: rem(4) rem(5);
  background-color: var(--color-grey-90);
  border: none;
  border-radius: var(--border-radius-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  @include font-medium(12);

  & > span {
    padding: 0 rem(8);
    white-space: nowrap;
    position: relative;
    z-index: 1;
  }

  & :first-child::before,
  & :last-child::before {
    content: "";
    position: absolute;
    z-index: -1;
    height: 100%;
    width: 100%;
    background-color: var(--color-white);
    border-radius: var(--border-radius-lg);
    transition: all 0.1s ease-out;
    box-shadow: var(--box-shadow-light);
  }

  & :first-child::before {
    opacity: 1;
    left: 0;
  }

  & :last-child::before {
    opacity: 0;
    right: 0;
    transform: translateX(-80%);
  }

  &[aria-checked="true"] :first-child,
  &[aria-checked="false"] :last-child {
    color: var(--color-text-100);
  }

  &[aria-checked="true"] :last-child,
  &[aria-checked="false"] :first-child {
    color: var(--color-text-80);
  }

  &[aria-checked="false"] :first-child::before {
    transform: translateX(80%);
    opacity: 0;
  }

  &[aria-checked="false"] :last-child::before {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
