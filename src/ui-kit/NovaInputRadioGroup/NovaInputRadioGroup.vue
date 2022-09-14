<template>
  <div class="NovaInputRadioGroup">
    <span
      v-if="label"
      class="NovaInputRadioGroup__label"
      :data-testid="`radio-group-${name}-label`"
      >{{ label }}</span
    >
    <nova-input-radio
      v-for="(option, index) in options"
      :key="option.value"
      :option="option"
      :label="option.label"
      :name="name"
      :disabled="disabled"
      :style="{ gridColumn: `${index + 1} / ${index + 1}` }"
      @input="$emit('select:option', option.value)"
    />
  </div>
</template>

<script lang="ts" setup>
import NovaInputRadio, {
  RadioOption,
} from "@/ui-kit/NovaInputRadio/NovaInputRadio.vue";

export interface Props {
  options: RadioOption[];
  name: string;
  label?: string;
  disabled?: boolean;
}

interface Events {
  (e: "select:option", value: string): void;
}

defineProps<Props>();
defineEmits<Events>();
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utilities";

.NovaInputRadioGroup {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: rem(10) rem(30);

  &__label {
    font-size: rem(10);
    color: var(--color-text-90);
  }
}
</style>
