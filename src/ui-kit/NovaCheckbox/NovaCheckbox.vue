<template>
  <span class="main-container">
    <div
      data-testid="nova-checkbox-container"
      class="checkbox-container"
      :size="size"
    >
      <nova-icon
        v-if="status === 'checked'"
        data-testid="nova-checkbox-check"
        class="checkbox-container__icon"
        name="check"
        :disabled="disabled"
        :size="size === 'lg' ? 12.5 : 10"
      />
      <nova-icon
        v-if="status === 'indeterminate'"
        data-testid="nova-checkbox-minus"
        class="checkbox-container__icon"
        name="minus"
        :disabled="disabled"
        :size="size === 'lg' ? 11.5 : 9.25"
      />
      <input
        :id="`checkbox-${value}`"
        :aria-checked="status === 'checked'"
        :value="value"
        :class="{
          'checkbox-container__checkbox': true,
          'checkbox-container__checkbox-checked':
            status === ('checked' || 'indeterminate'),
        }"
        type="checkbox"
        :disabled="disabled"
        :indeterminate="status === 'indeterminate'"
        @click.prevent="(e) => checking(e)"
        @keydown.space.prevent="(e) => checking(e)"
      />
    </div>
    <label
      v-if="label"
      data-testid="nova-checkbox-label"
      class="label"
      :size="size"
      :for="`checkbox-${value}`"
      ><span class="label__text">{{ label }}</span>
      <div v-if="description" class="label__description">{{ description }}</div>
    </label>
  </span>
</template>

<script setup lang="ts">
import NovaIcon from "@/ui-kit/NovaIcon/NovaIcon.vue";

export interface Props {
  size: "sm" | "lg";
  disabled?: boolean;
  label?: null | string;
  description?: null | string;
  status: "checked" | "unchecked" | "indeterminate";
  value: string;
}

function checking(e: Event) {
  e.stopPropagation();
  emits("update:status", props.value);
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  label: null,
  description: null,
});

interface Events {
  (e: "update:status", value: string): void;
}

const emits = defineEmits<Events>();
</script>

<style scoped lang="scss">
@import "@/assets/scss/utilities";

.main-container {
  display: flex;

  .label {
    margin-left: rem(8px);

    &__text {
      font-size: rem(14px);
      color: var(--color-text-100);
      cursor: pointer;
    }

    &__description {
      font-size: rem(10px);
      color: var(--color-text-80);
    }

    &[size="lg"] {
      .label__text {
        font-size: rem(16px);
      }

      .label__description {
        font-size: rem(12px);
      }
    }
  }

  .checkbox-container {
    width: rem(16px);
    height: rem(16px);
    position: relative;

    &__checkbox {
      cursor: pointer;
      appearance: none;
      height: rem(16px);
      width: rem(16px);
      margin: 0;
      border-radius: 4px;
      border: var(--border-default);

      &-checked {
        border: none;
        background-color: var(--color-primary-100);

        &:hover {
          border: none;
          background-color: var(--color-primary-110);
        }

        &:disabled {
          cursor: not-allowed;
          border: none;
          background-color: var(--color-grey-90);

          &:hover {
            background-color: var(--color-grey-90);
          }
        }
      }

      &:disabled {
        cursor: not-allowed;
        border: none;
        background-color: var(--color-grey-90);
      }

      &[size="lg"] {
        width: rem(20);
        height: rem(20);

        .checkbox-container__checkbox {
          width: rem(20);
          height: rem(20);
        }
      }

      &:hover:not(:disabled),
      &:focus-visible:not(:disabled) {
        border: var(--border-primary);
      }

      /* stylelint-disable-next-line no-descending-specificity */
    }

    &__icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      color: var(--color-white);

      &[disabled="true"] {
        color: var(--color-grey-100);
      }
    }
  }
}
</style>
