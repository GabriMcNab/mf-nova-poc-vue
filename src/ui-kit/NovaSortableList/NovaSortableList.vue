<template>
  <draggable
    :list="[...modelValue].sort((i) => i.visualization_order ?? -1)"
    class="NovaSortableList"
    chosen-class="NovaSortableList__ghost-img"
    ghost-class="NovaSortableList__dragging"
    handle=".drag-handle"
    :animation="150"
    :style="containerStyle"
    item-key="id"
    data-testid="nova-sortable-list"
    @sort="updateListSorting($event.oldIndex, $event.newIndex)"
  >
    <template #item="{ element }">
      <div class="NovaSortableList__item" data-testid="nova-sortable-list-item">
        <slot :item="element"></slot>
        <div
          class="NovaSortableList__grip drag-handle"
          data-testid="nova-sortable-list-drag-handle"
        >
          <NovaIcon name="grip-dots" :size="20" />
        </div>
      </div>
    </template>
  </draggable>
</template>

<script lang="ts" setup>
import { withDefaults, computed } from "vue";
import draggable from "vuedraggable";
import NovaIcon from "@/ui-kit/NovaIcon/NovaIcon.vue";

export interface ListItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  id: string;
  visualization_order?: number;
}

export interface Props {
  modelValue: ListItem[];
  layout: "grid" | "list";
  gridColumns?: number;
}

interface Events {
  (e: "update:modelValue", items: ListItem[]): void;
}

const emit = defineEmits<Events>();
const props = withDefaults(defineProps<Props>(), {
  gridColumns: 4,
});

const updateListSorting = (oldIndex: number, newIndex: number) => {
  const movedItem = props.modelValue.find((_, index) => index === oldIndex);
  const remainingItems = props.modelValue.filter(
    (_, index) => index !== oldIndex
  );

  if (!movedItem) {
    throw new Error("Error while sorting the list. Item not found");
  }

  const reorderedItems = [
    ...remainingItems.slice(0, newIndex),
    movedItem,
    ...remainingItems.slice(newIndex),
  ];

  emit(
    "update:modelValue",
    reorderedItems.map((item, idx) => ({
      ...item,
      visualization_order: idx + 1,
    }))
  );
};

const containerStyle = computed(() => {
  if (props.layout === "grid") {
    return {
      display: "grid",
      gridTemplateColumns: `repeat(${props.gridColumns}, 1fr)`,
      gap: "16px",
    };
  } else {
    // We could reuse this component for the list of sortable highlights
    return {};
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utilities";

.NovaSortableList {
  &__item {
    position: relative;
    cursor: move;
    border-radius: var(--border-radius-xs);
  }

  &__grip {
    position: absolute;
    width: 20px;
    height: 18px;
    bottom: 5px;
    left: 44%;
    border-radius: var(--border-radius-xs);

    &:hover {
      background-color: var(--color-primary-10);
    }
  }

  &__dragging {
    &::after {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-color: var(--color-grey-80);
      border: 1px dashed var(--color-grey-100);
      border-radius: var(--border-radius-xs);
    }
  }

  &__ghost-img {
    opacity: 1;
    box-shadow: var(--box-shadow-popover);
  }
}
</style>
