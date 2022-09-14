<template>
  <table class="NovaTable" aria-label="" data-testid="nova-table">
    <thead
      class="NovaTable__head"
      :style="{
        'grid-template-columns': gridTemplateColumns,
      }"
    >
      <th v-for="header in headers" :key="header.key" class="NovaTable__header">
        <div class="NovaTable__header_cell">
          <div
            data-testid="nova-table-sort"
            class="NovaTable__toggle"
            @click="$emit('update:sort', header.key)"
          >
            {{ header.label }}<NovaIcon class="ml-1" name="chevron-expand" />
          </div>
        </div>
      </th>
    </thead>
    <div v-if="loading" class="NovaTable__overlay"><NovaSpinner /></div>
    <div
      v-if="items.length === 0"
      data-testid="nova-table-no-items-warning"
      class="NovaTable__overlay"
    >
      <div class="NovaTable__noItemsWarning">
        {{ $t("dashboard.table.no.items.warning") }}
      </div>
    </div>
    <tbody class="NovaTable__body">
      <template v-for="item in items" :key="JSON.stringify(item)">
        <slot name="row" :item="item">
          <NovaTableRow
            :item="item"
            :loading="loading"
            :grid-template-columns="gridTemplateColumns"
            :headers="headers"
          />
        </slot>
      </template>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import NovaIcon from "../NovaIcon/NovaIcon.vue";
import NovaSpinner from "../NovaSpinner/NovaSpinner.vue";
import NovaTableRow from "./components/NovaTableRow.vue";

export type NovaTableItem = Record<string, unknown>;

export interface NovaTableHeader {
  key: string;
  label: string;
}

export interface NovaTableProps {
  items: NovaTableItem[];
  headers: NovaTableHeader[];
  loading?: boolean;
  gridTemplateColumns: string;
  description?: string;
}

interface NovaTableEvents {
  (e: "update:sort", value: NovaTableHeader["key"]): void;
}

defineProps<NovaTableProps>();
defineEmits<NovaTableEvents>();
</script>

<style scoped lang="scss">
@import "@/assets/scss/utilities";

.NovaTable {
  border-radius: var(--border-radius-default);
  border: 1px solid var(--color-grey-70);
  box-shadow: var(--box-shadow-table);
  overflow: hidden;
  background-color: white;
  position: relative;
  display: flex;
  flex-direction: column;

  @include font-medium(12);

  &__head {
    display: grid;
    border-bottom: 1px solid var(--color-grey-100);
  }

  &__header {
    text-align: left;
  }

  &__header_cell {
    color: var(--color-primary-100);
  }

  &__overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    z-index: 1;
  }

  &__toggle {
    padding: rem(8) rem(12);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    user-select: none;
  }
}
</style>
