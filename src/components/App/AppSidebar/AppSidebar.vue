<template>
  <div
    class="AppSidebar__container"
    data-testid="app-sidebar-container"
    :open="show || null"
  >
    <nav class="AppSidebar">
      <ul class="AppSidebar__ul">
        <li
          v-for="element in navElements"
          :key="element.title"
          class="AppSidebar__li"
        >
          <RouterLink class="AppSidebar__anchor" :to="element.path">
            <NovaButtonIcon
              theme="light"
              :selected="$route.fullPath.includes(element.path)"
              :name="element.icon"
              class="AppSidebar__icon"
              data-testid="app-sidebar-button-icon"
            />
            <p
              v-show="show"
              class="AppSidebar__text"
              data-testid="app-sidebar-text"
            >
              {{ element.title }}
            </p>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <div class="AppSidebar__footer" :open="show || null">
      <NovaButton
        v-show="show"
        :style="{ color: 'var(--color-white)' }"
        variant="text"
        size="xs"
        data-testid="app-sidebar-collapse-icon-opened"
        @click="$emit('click:collapsing')"
      >
        <NovaIcon
          class="mr-1 AppSidebar__collapse-icon"
          name="chevrons-right"
        />
        {{ $t("sidebar.button.close") }}
      </NovaButton>

      <NovaButtonIcon
        v-show="!show"
        name="chevrons-right"
        theme="light"
        data-testid="app-sidebar-collapse-icon-closed"
        @click="$emit('click:collapsing')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import NovaButtonIcon from "@/ui-kit/NovaButtonIcon/NovaButtonIcon.vue";
import NovaButton from "@/ui-kit/NovaButton/NovaButton.vue";
import NovaIcon, { Icon } from "@/ui-kit/NovaIcon/NovaIcon.vue";

export interface NavElement {
  icon: Icon;
  title: string;
  path: string;
}

interface Props {
  show: boolean;
  navElements: NavElement[];
}

interface Events {
  (e: "click:collapsing"): void;
}

defineProps<Props>();
defineEmits<Events>();
</script>

<style scoped lang="scss">
@import "@/assets/scss/utilities";

.AppSidebar {
  &__container {
    position: sticky;
    top: var(--header-height);
    background: var(--color-text-100);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100vh - var(--header-height));
    width: rem(40px);

    &[open] {
      width: rem(136px);
    }
  }

  &__ul {
    height: 100%;
    padding-top: rem(14px);
    padding-left: rem(1px);
  }

  &__icon {
    margin: rem(2px);
  }

  &__text {
    @include font-bold(12);

    margin-left: rem(10);
    white-space: nowrap;
    transform: translateX(-5px);
    transition: transform 0.2s ease-in-out;
  }

  &__anchor {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: var(--color-white);

    &:hover {
      & > .AppSidebar__text {
        transform: translateX(0);
      }
    }
  }

  &__btn {
    width: fit-content;
    margin: 0 auto;
    background: none;
    color: var(--color-white);
    border: none;
    cursor: pointer;
  }

  &__footer {
    padding: rem(2px);
    display: flex;
    justify-content: center;
    margin-top: auto;
    margin-bottom: rem(6);

    &[open] {
      justify-content: flex-end;
    }
  }

  &__collapse-icon {
    transform: rotate(180deg);
  }
}

@include start-from(desktop-md) {
  .AppSidebar {
    &__container {
      width: rem(48px);

      &[open] {
        width: rem(144px);
      }
    }

    &__ul {
      padding-left: rem(5px);
    }
  }
}

@include start-from(desktop-lg) {
  .AppSidebar {
    &__container {
      width: rem(64px);

      &[open] {
        width: rem(160px);
      }
    }

    &__ul {
      padding-left: rem(13px);
    }
  }
}
</style>
