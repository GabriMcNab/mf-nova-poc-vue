<template>
  <div
    class="NovaTooltip"
    data-testid="nova-tooltip"
    :theme="theme || null"
    @mouseenter="open = true"
    @mouseleave="open = false"
  >
    <slot />

    <div
      v-if="open"
      class="NovaTooltip__arrow"
      :class="`NovaTooltip__arrow--${position}`"
      data-testid="nova-tooltip-arrow"
    >
      <div class="NovaTooltip__triangle" />
    </div>
    <div
      v-if="open"
      class="NovaTooltip__tip"
      :class="`NovaTooltip__tip--${position}`"
      data-testid="nova-tooltip-tip"
    >
      <div class="NovaTooltip__bubble">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

export interface NovaTooltipProps {
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right"
    | "center-left"
    | "center-right";
  theme?: "light" | "dark";
}

withDefaults(defineProps<NovaTooltipProps>(), {
  position: "top-center",
  theme: "light",
});

const open = ref(false);
</script>

<style scoped lang="scss">
@import "@/assets/scss/utilities";

.NovaTooltip {
  display: inline-block;
  position: relative;
  overflow: visible;
  filter: drop-shadow(var(--box-shadow-popover));

  --triangle-offset: 10px;
  --background-color: white;
  --text-color: var(--color-text-100);
  --shadow: var(--box-shadow-popover);

  &[theme="dark"] {
    --background-color: var(--color-text-100);
    --text-color: white;
    --shadow: none;
  }

  &__bubble {
    padding: rem(8) rem(16);
    border: 2px solid transparent;
    border-radius: var(--border-radius-default);
    color: var(--text-color);
    background-color: var(--background-color);

    @include font-medium(12);
  }

  &__tip {
    display: flex;
    position: absolute;
    width: max-content;
    max-width: 300px;
    pointer-events: none;
    z-index: var(--z-index-tooltip-content);

    &--top-left {
      top: 0;
      left: 0;
      flex-direction: column-reverse;
      transform: translateY(-100%);
      padding-bottom: var(--triangle-offset);
    }

    &--top-center {
      top: 0;
      left: 50%;
      flex-direction: column-reverse;
      align-items: center;
      transform: translate(-50%, -100%);
      padding-bottom: var(--triangle-offset);
    }

    &--top-right {
      top: 0;
      right: 0;
      align-items: flex-end;
      flex-direction: column-reverse;
      transform: translateY(-100%);
      padding-bottom: var(--triangle-offset);
    }

    &--bottom-left {
      bottom: 0;
      left: 0;
      flex-direction: column;
      transform: translateY(100%);
      padding-top: var(--triangle-offset);
    }

    &--bottom-center {
      bottom: 0;
      left: 50%;
      flex-direction: column;
      align-items: center;
      transform: translate(-50%, 100%);
      padding-top: var(--triangle-offset);
    }

    &--bottom-right {
      bottom: 0;
      right: 0;
      align-items: flex-end;
      flex-direction: column;
      transform: translateY(100%);
      padding-top: var(--triangle-offset);
    }

    &--center-left {
      top: 50%;
      left: 0;
      transform: translate(-100%, -50%);
      flex-direction: row-reverse;
      align-items: center;
      padding-right: var(--triangle-offset);
    }

    &--center-right {
      top: 50%;
      right: 0;
      transform: translate(100%, -50%);
      flex-direction: row;
      align-items: center;
      padding-left: var(--triangle-offset);
    }
  }

  &__triangle {
    width: 0;
    height: 0;
    flex-shrink: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 7px solid var(--background-color);
  }

  &__arrow {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;

    // avoid the bubble shadow overlapping the arrow
    z-index: calc(var(--z-index-tooltip-content) + 1);

    &--top-left {
      top: 0;
      left: 0;
      transform: translateY(-100%);

      .NovaTooltip__triangle {
        margin-bottom: 3px;
        transform: rotate(180deg);
      }
    }

    &--top-center {
      top: 0;
      left: 50%;
      transform: translate(-50%, -100%);

      .NovaTooltip__triangle {
        margin-bottom: 3px;
        transform: rotate(180deg);
      }
    }

    &--top-right {
      top: 0;
      right: 0;
      transform: translateY(-100%);

      .NovaTooltip__triangle {
        margin-bottom: 3px;
        transform: rotate(180deg);
      }
    }

    &--bottom-left {
      bottom: 0;
      left: 0;
      transform: translateY(100%);

      .NovaTooltip__triangle {
        margin-top: 3px;
      }
    }

    &--bottom-center {
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 100%);

      .NovaTooltip__triangle {
        margin-top: 3px;
      }
    }

    &--bottom-right {
      bottom: 0;
      right: 0;
      transform: translateY(100%);

      .NovaTooltip__triangle {
        margin-top: 3px;
      }
    }

    &--center-left {
      top: 50%;
      left: 0;
      transform: translate(-100%, -50%);
      flex-direction: row-reverse;
      align-items: center;
      width: initial;
      height: 100%;

      .NovaTooltip__triangle {
        margin-right: 5px;
        transform: translateX(5px) rotate(90deg);
      }
    }

    &--center-right {
      top: 50%;
      right: 0;
      transform: translate(100%, -50%);
      flex-direction: row;
      align-items: center;
      width: initial;
      height: 100%;

      .NovaTooltip__triangle {
        margin-left: 5px;
        transform: translateX(-5px) rotate(-90deg);
      }
    }
  }
}
</style>
