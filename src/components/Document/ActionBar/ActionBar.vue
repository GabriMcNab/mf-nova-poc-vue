<template>
  <div class="ActionBar" data-testid="document-action-bar">
    <div class="ActionBar__menu">
      <NovaButtonIcon
        name="grid"
        :selected="show"
        data-testid="document-action-bar-toggle"
        @click="show = !show"
      />
    </div>

    <div
      v-if="isBigDesktop || show"
      class="ActionBar__content"
      data-testid="document-action-bar-content"
    >
      <div class="ActionBar__header">
        <h2 class="ActionBar__title">{{ $t("action.bar.header.title") }}</h2>

        <div v-if="!isBigDesktop" class="ActionBar__icon" @click="show = !show">
          <NovaIcon name="close" :size="12" />
        </div>
      </div>
      <div class="ActionBar__body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import NovaButtonIcon from "@/ui-kit/NovaButtonIcon/NovaButtonIcon.vue";
import NovaIcon from "@/ui-kit/NovaIcon/NovaIcon.vue";
import { useMediaQuery } from "@/composables/useMediaQuery";

const { isBigDesktop } = useMediaQuery();

const show = ref(true);
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utilities";

.ActionBar {
  position: sticky;
  top: calc(var(--header-height) + var(--tab-navigation-height));
  display: flex;
  width: fit-content;
  height: var(--window-height);
  background-color: white;
  border-left: 1px solid var(--color-grey-90);

  &__menu {
    padding-top: rem(4px);
    width: rem(40px);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
  }

  &__content {
    width: rem(232px);
    border-left: 1px solid var(--color-grey-90);
  }

  &__header {
    padding: rem(12);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--color-grey-90);
  }

  &__title {
    color: var(--color-text-80);

    @include font-medium(14);
  }

  &__icon {
    cursor: pointer;
    padding: rem(2);

    &:hover {
      opacity: 0.7;
    }
  }

  &__body {
    padding: 0 rem(12);
  }
}
@include start-from(desktop-md) {
  .ActionBar {
    &__menu {
      width: rem(48px);
    }

    &__content {
      width: rem(240px);
    }
  }
}
@include start-from(desktop-lg) {
  .ActionBar {
    &__menu {
      width: rem(64px);
    }

    &__content {
      width: rem(256px);
    }
  }
}
</style>
