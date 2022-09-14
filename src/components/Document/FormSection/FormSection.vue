<template>
  <section :id="id">
    <form
      :aria-required="required"
      class="FormSection"
      data-testid="document-form-section"
      @submit.prevent
    >
      <label :for="id" class="FormSection__label" data-testid="form-title">
        {{ $t(`experience.${id}.title`) }}
        <NovaLabel v-if="required">{{ $t("common.required") }}</NovaLabel>
      </label>
      <p class="FormSection__description" data-testid="form-description">
        {{ $t(`experience.${id}.description`) }}
      </p>
      <div v-if="examples" class="FormSection__examples">
        <p>{{ $t("common.examples") }}:</p>
        <ul>
          <li
            v-for="example in examples"
            :key="example"
            data-testid="form-example"
          >
            {{ example }}
          </li>
        </ul>
      </div>
      <div
        :style="{ maxWidth: `${slotMaxWidth}px` || '100%' }"
        data-testid="form-slot-container"
      >
        <slot />
      </div>
    </form>
  </section>
</template>

<script lang="ts" setup>
import NovaLabel from "@/ui-kit/NovaLabel/NovaLabel.vue";

export interface Props {
  id: string;
  required?: boolean;
  examples?: string[];
  slotMaxWidth?: number;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utilities";

.FormSection {
  &__label {
    margin-bottom: rem(8);
    display: flex;
    align-items: center;
    gap: rem(8);
    @include font-bold(16);
  }

  &__description,
  &__examples {
    margin-bottom: rem(15);
    color: var(--color-text-90);
    @include font-light(12);
  }

  &__examples > ul {
    list-style: circle;
    padding-left: rem(20);
  }
}
</style>
