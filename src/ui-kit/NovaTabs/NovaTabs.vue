<template>
  <ul data-testid="nova-tabs" class="NovaTabs">
    <li
      v-for="item of options"
      :key="item.title"
      class="NovaTabs__tab"
      @click="$emit('select:option', item)"
    >
      <button
        data-testid="nova-tabs-item"
        class="NovaTabs__tab"
        :selected="item.value === selected?.value || null"
      >
        {{ item.title }}
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
export interface Option {
  title: string;
  value: string;
}
export interface Props {
  options: Option[];
  selected?: Partial<Option>;
}

interface Events {
  (e: "select:option", option: Option): void;
}

defineEmits<Events>();
defineProps<Props>();
</script>

<style lang="scss">
@import "@/assets/scss/utilities";

.NovaTabs {
  border-bottom: 1px solid var(--color-grey-100);
  display: flex;

  &__tab {
    background: none;
    border: none;
    height: rem(32);
    width: 100%;
    cursor: pointer;
    position: relative;

    @include font-light(12);

    &:hover {
      color: var(--color-primary-100);
    }

    &[selected] {
      color: var(--color-primary-100);

      &::before {
        content: "";
        position: absolute;
        height: 3px;
        bottom: 0;
        left: 0;
        width: 100%;
        border-radius: 3px 3px 0 0;
        background-color: var(--color-primary-100);
      }
    }
  }
}
</style>
