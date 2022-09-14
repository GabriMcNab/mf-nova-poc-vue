<template>
  <tr
    class="NovaTableRow"
    :style="{
      'grid-template-columns': gridTemplateColumns,
    }"
    data-testid="nova-table-row"
  >
    <td
      v-for="header in headers"
      :key="header.key"
      class="NovaTableRow__row_cell"
    >
      {{ item[header.key] }}
    </td>
  </tr>
</template>

<script setup lang="ts">
import { NovaTableHeader, NovaTableItem } from "../NovaTable.vue";

export interface NovaTableRowProps {
  item: NovaTableItem;
  headers: NovaTableHeader[];
  gridTemplateColumns: string;
}

defineProps<NovaTableRowProps>();
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utilities";

.NovaTableRow {
  display: grid;
  border-bottom: 1px solid var(--color-grey-100);

  &__row_cell {
    padding: rem(12) rem(12);
  }
}
</style>
