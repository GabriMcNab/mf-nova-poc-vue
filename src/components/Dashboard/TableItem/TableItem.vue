<template>
  <tr
    class="DashboardTableItem"
    data-testid="dashboard-table-item"
    :expanded="shouldExpandRow || null"
    @click="handleRowClick"
  >
    <td class="DashboardTableItem__cell">
      <button
        class="DashboardTableItem__toggle"
        :aria-checked="shouldExpandRow"
      >
        <NovaIcon name="chevron-down" :size="9" /></button
      >{{ item.title }}
    </td>
    <td class="DashboardTableItem__cell">{{ item.id }}</td>
    <NovaButtonIcon
      v-show="!shouldExpandRow"
      name="edit"
      theme="dark"
      @click.stop="$emit('click:edit', item.id, 'en')"
    />
    <div v-if="shouldExpandRow" class="ExpandedRow" data-testid="expanded-row">
      <table class="ExpandedRow__table" aria-label="expanded row content">
        <thead class="ExpandedRow__table__header">
          <th scope="col">
            {{ $t("dashboard.table.row.header.translation") }}
          </th>
          <th scope="col">{{ $t("dashboard.table.row.header.created") }}</th>
          <th scope="col">
            {{ $t("dashboard.table.row.header.last.modified") }}
          </th>
          <th scope="col">{{ $t("dashboard.table.row.header.status") }}</th>
        </thead>

        <tbody class="ExpandedRow__table__body">
          <template v-if="!loadingExpandedRowItems">
            <tr
              v-for="expItem in expandedRowItems"
              :key="`expanded-${expItem.id}-${expItem.language_code}`"
              data-testid="expanded-row-item"
              @click.stop="$emit('click:edit', item.id, expItem.language_code)"
            >
              <CurvedLineSvg class="ExpandedRow__curved-line" />
              <td>
                <NovaIconFlag
                  :country-code="(expItem.language_code as AvailableLanguage) ?? 'en'"
                  :size="15"
                />{{
                  $t(
                    `dashboard.table.row.language.${
                      expItem.language_code ?? "en"
                    }`
                  )
                }}
              </td>
              <td>
                {{ formatDate(expItem.creation_date) }}
              </td>
              <td>
                {{ formatDate(expItem.updated_date) }}
              </td>
              <td>
                <StatusLabel
                  v-for="({ flow_id, status_id }, idx) in expItem.statuses"
                  :key="`${flow_id} - ${status_id} - ${idx}`"
                  :flow-id="flow_id"
                  :status-id="status_id"
                />
              </td>
              <NovaButtonIcon name="edit" theme="dark" />
            </tr>
          </template>
          <template v-else>
            <tr>
              <CurvedLineSvg class="ExpandedRow__curved-line" />
              <div
                v-for="c in 5"
                :key="`skeleton-item-${c}`"
                class="skeleton_item"
              ></div>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </tr>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import StatusLabel from "@/components/Document/StatusLabel/StatusLabel.vue";
import NovaButtonIcon from "@/ui-kit/NovaButtonIcon/NovaButtonIcon.vue";
import NovaIcon from "@/ui-kit/NovaIcon/NovaIcon.vue";
import NovaIconFlag from "@/ui-kit/NovaIconFlag/NovaIconFlag.vue";
import CurvedLineSvg from "@/assets/svg/dashboard-table-row-curved-line.svg";
import type { AvailableLanguage } from "@/types/Language";
import type { NovaTableItem } from "@/ui-kit/NovaTable/NovaTable.vue";

export interface DashboardTableItem extends NovaTableItem {
  title: string;
  id: string;
  creation_date?: string;
  updated_date?: string;
  language_code?: string;
  statuses: Array<{ flow_id?: string; status_id?: string }>;
}

export interface Props {
  item: DashboardTableItem;
  expandedRowItems: DashboardTableItem[];
  handleRowExpand?: () => Promise<void>;
}

interface Events {
  (e: "click:edit", id: string, lang?: string): void;
}

const props = defineProps<Props>();
defineEmits<Events>();

const expandRow = ref(false);
const loadingExpandedRowItems = ref(true);

const shouldExpandRow = computed(
  () =>
    expandRow.value &&
    (props.expandedRowItems.length > 0 || loadingExpandedRowItems.value)
);

const formatDate = (date?: string) => {
  if (date) {
    return new Intl.DateTimeFormat("en-gb").format(new Date(date));
  } else return "";
};

const handleRowClick = async () => {
  loadingExpandedRowItems.value = true;
  expandRow.value = !expandRow.value;
  if (props.handleRowExpand) {
    await props.handleRowExpand();
  }
  loadingExpandedRowItems.value = false;
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utilities";

.DashboardTableItem {
  cursor: pointer;
  display: grid;
  grid-template-columns: 1fr 1fr 40px;
  align-items: center;
  border-bottom: 1px solid var(--color-grey-100);

  &__cell {
    padding: rem(12) rem(12);
    display: flex;
    align-items: center;
  }

  &__toggle {
    cursor: pointer;
    padding: 0;
    border: none;
    border-radius: 2px;
    height: rem(14);
    width: rem(14);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: rem(12);
    background-color: var(--color-primary-10);
    color: var(--color-primary-100);

    &[aria-checked="true"] {
      background-color: var(--color-primary-100);
      color: var(--color-white);

      & > .svg-icon {
        transform: rotate(180deg);
      }
    }
  }

  &[expanded] {
    box-shadow: var(--box-shadow-row);
  }
}

.ExpandedRow {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  height: 100%;

  &__curved-line {
    position: absolute;
    left: rem(10);
    top: rem(-30);
  }

  &__table {
    &__header {
      padding-top: 12px;
      padding-left: rem(45);
      display: grid;
      grid-template-columns: 150px 125px 155px 1fr 40px;
      text-align: left;
      color: var(--color-text-100);
      background-color: var(--color-grey-70);
      @include font-bold(12);
    }

    &__body {
      tr {
        padding-left: rem(45);
        position: relative;
        display: grid;
        justify-items: start;
        align-items: center;
        grid-template-columns: 150px 125px 155px 1fr 40px;
        height: rem(30);

        &:first-child {
          background-color: var(--color-grey-70);
        }

        &:hover {
          box-shadow: var(--box-shadow-row);
        }
      }

      td {
        color: var(--color-text-90);
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .svg-flag {
        margin-bottom: -1px;
        margin-right: 6px;
      }

      .skeleton_item {
        justify-self: stretch;
        height: rem(15);
        margin-right: rem(12);
      }
    }
  }

  &__status-label {
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    gap: rem(5);

    & > svg {
      margin-top: -2px;
      border-bottom: 1px solid var(--color-secondary-110);
    }
  }

  &__skeleton {
    height: rem(15);
    width: 100%;
  }
}
</style>
