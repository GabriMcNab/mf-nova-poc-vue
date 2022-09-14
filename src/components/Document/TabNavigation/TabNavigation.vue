<template>
  <div class="TabNavigation" data-testid="document-tab-navigation">
    <button
      v-for="tab in tabsStore.tabs"
      :key="tab.label"
      class="TabNavigation__item"
      :selected="tabsStore.isSelected(tab.path) || null"
      :data-testid="`document-tab-navigation-link`"
    >
      <RouterLink
        class="TabNavigation__text"
        :to="tab.path"
        :data-testid="`document-tab-navigation-nuxt-link`"
      >
        <span>
          {{ $t(tab.label) }}
        </span>
      </RouterLink>

      <div
        class="TabNavigation__icon"
        data-testid="document-tab-navigation-close"
        @click="tabsStore.closeTab(tab.path, !documentIsModified)"
      >
        <NovaIcon v-if="tabsStore.tabs.length > 1" name="close" :size="10" />
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import NovaIcon from "@/ui-kit/NovaIcon/NovaIcon.vue";
import { useDocumentTabs } from "@/stores/document-tabs";

export interface DocumentTabProps {
  label?: string;
  documentIsModified?: boolean;
}

const props = defineProps<DocumentTabProps>();
const tabsStore = useDocumentTabs();
const { path } = useRoute();

// attaches the current page if it's not present
if (!tabsStore.isOpen(path)) {
  tabsStore.addTab({ label: props.label as string, path });
}

watch(
  () => props.label,
  () => {
    tabsStore.updateTab({
      label: props.label as string,
      path,
    });
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
@import "@/assets/scss/utilities";

.TabNavigation {
  position: sticky;
  top: var(--header-height);
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: var(--color-grey-80);
  border-bottom: 4px solid var(--color-primary-10);
  z-index: var(--z-index-document-tab-navigation);

  &__item {
    all: initial;
    position: relative;
    display: flex;
    flex-shrink: 2;
    flex-grow: 1;
    justify-content: space-between;
    align-items: center;
    max-width: rem(170);
    height: rem(32);
    color: var(--color-text-80);
    cursor: pointer;
    overflow: hidden;

    @include font-medium(12);

    & + & {
      border-right: 1px solid var(--color-primary-10);
    }

    &[selected] {
      color: var(--color-text-100);
      background-color: var(--color-primary-10);
    }

    &:hover {
      background-color: var(--color-primary-10);
    }
  }

  &__text {
    position: absolute;
    width: 80%;
    height: 100%;
    overflow: hidden;
    padding-left: 8px;
    display: flex;
    align-items: center;
    text-decoration: none;
    color: inherit;

    span {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }

  &__icon {
    position: absolute;
    right: 0;
    width: 30%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__debug {
    margin: 0 8px;

    .IconButton {
      height: 30px;
      width: 30px;
    }
  }

  .ExitModal {
    padding: rem(24px);
    width: rem(311px);

    &__title {
      @include font-bold(16);

      color: var(--color-text-100);
    }

    &__description {
      @include font-medium(12);

      margin-top: 4px;
    }

    &__buttons {
      margin-top: rem(16px);
      display: flex;
      justify-content: space-evenly;

      button {
        width: rem(109px);
      }
    }
  }
}
</style>
