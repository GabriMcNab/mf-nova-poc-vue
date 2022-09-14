<template>
  <div
    class="DocumentSidebar"
    data-testid="document-sidebar"
    :show="isBigDesktop || show || null"
  >
    <template v-if="isBigDesktop || show">
      <slot name="sidebar-tab" />
      <div class="DocumentSidebar__header">
        <h2
          class="DocumentSidebar__title"
          data-testid="document-sidebar-refcode"
        >
          {{
            refCode ? `Ref. code ${refCode}` : $t("experience.new.experience")
          }}
        </h2>
        <DocumentStatusLabel
          v-if="refCode"
          class="mt-2"
          data-testid="document-sidebar-label"
          :flow-id="documentFlowId"
          :status-id="documentStatusId"
          size="md"
        />
        <div v-if="visualizationToggle" class="DocumentSidebar__toggle">
          {{ $t("sidebar.toggle.description") }}
          <NovaButtonToggle
            data-testid="document-sidebar-toggle-btn"
            :checked="visualizationToggle === 'BOTH'"
            @click:toggle="$emit('click:toggle')"
          >
            <template #firstOption
              >{{ $t("common.raw") }} & {{ $t("common.editorial") }}</template
            >
            <template #secondOption>{{ $t("common.editorial") }}</template>
          </NovaButtonToggle>
        </div>
      </div>

      <div class="DocumentSidebar__input-text">
        <NovaInputText
          id="list-search"
          v-model="searchValue"
          left-icon="search"
          :placeholder="$t('sidebar.search.placeholder')"
        />
      </div>
      <div
        v-if="Object.keys(filteredNavigationGroup).length"
        class="DocumentSidebar__fields-list"
      >
        <div
          v-for="(fields, group) in filteredNavigationGroup"
          :key="group"
          class="ListGroup"
          data-testid="document-sidebar-nav"
        >
          <h6 class="ListGroup__title" data-testid="document-sidebar-group">
            {{ $t(`experience.sidebar.${group}`) }}
          </h6>

          <ul>
            <li v-for="field in fields" :key="field.id">
              <NuxtLink
                class="ListItem"
                :to="`#${field.id}`"
                :selected="$route.hash === `#${field.id}` || null"
                data-testid="document-sidebar-nav-link"
              >
                <span class="ListItem__text">
                  {{ field.title }}
                </span>

                <span
                  class="IconRight"
                  :valid="field.filled || null"
                  :required="field.required || null"
                >
                  <NovaIcon
                    v-if="field.filled"
                    class="IconRight__icon-check"
                    name="check"
                    :size="8"
                  />
                  <NovaIcon
                    v-if="!field.required && !field.filled"
                    class="IconRight__icon-dotted"
                    name="circle-dotted"
                    :size="14"
                  />
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="DocumentSidebar__no-items">
        <p>{{ $t("common.no.items.found") }}</p>
      </div>
    </template>
    <template v-else>
      <div class="DocumentSidebar__collapsed">
        <NovaIcon
          class="DocumentSidebar__collapsed__btn"
          name="search"
          @click="show = true"
        />
      </div>
    </template>

    <div
      v-if="isBigDesktop || show"
      class="DocumentSidebar__footer DocumentSidebar__footer--open"
    >
      <NovaTooltip position="top-left">
        <NovaButton variant="text" size="xs">
          <NovaIcon class="mr-1" name="circle-info" />
        </NovaButton>
        <template #content>
          <ul class="DocumentSidebar__legend">
            <li>
              <span class="mr-2 IconRight">
                <NovaIcon
                  class="IconRight__icon-dotted"
                  name="circle-dotted"
                  :size="14"
                />
              </span>
              {{ $t("sidebar.legend.not.required.not.completed") }}
            </li>
            <li>
              <span class="mr-2 IconRight IconRight--required" required />
              {{ $t("sidebar.legend.required.not.completed") }}
            </li>
            <li>
              <span class="mr-2 IconRight IconRight--completed" valid>
                <NovaIcon
                  class="IconRight__icon-check"
                  name="check"
                  :size="8"
                />
              </span>
              {{ $t("sidebar.legend.completed") }}
            </li>
          </ul>
        </template>
      </NovaTooltip>

      <NovaButton
        data-testid="sidebar-btn-collapse"
        variant="text"
        class="DocumentSidebar__footer__btn--open"
        size="xs"
        @click="show = false"
      >
        <NovaIcon class="mr-1" name="chevrons-left" />
        {{ $t("sidebar.button.close") }}
      </NovaButton>
    </div>
    <div v-else class="DocumentSidebar__footer DocumentSidebar__footer--close">
      <button
        class="DocumentSidebar__footer__btn--close"
        data-testid="sidebar-btn-expand"
        @click="show = true"
      >
        <NovaIcon name="chevrons-right" :size="20" />
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useNuxtApp } from "nuxt/app";
import NovaIcon from "@/ui-kit/NovaIcon/NovaIcon.vue";
import NovaInputText from "@/ui-kit/NovaInputText/NovaInputText.vue";
import NovaButton from "@/ui-kit/NovaButton/NovaButton.vue";
import NovaButtonToggle from "@/ui-kit/NovaButtonToggle/NovaButtonToggle.vue";
import NovaTooltip from "@/ui-kit/NovaTooltip/NovaTooltip.vue";
import DocumentStatusLabel from "@/components/Document/StatusLabel/StatusLabel.vue";
import { useMediaQuery } from "@/composables/useMediaQuery";

export interface SidebarField {
  id: string;
  title: string;
  required: boolean;
  filled: boolean;
}

export interface DocumentField {
  value: unknown;
  required: boolean;
  category: string;
}

export interface Props {
  documentFlowId?: string;
  documentStatusId?: string;
  documentFields: {
    [key: string]: DocumentField;
  };
  refCode?: string;
  visualizationToggle?: "BOTH" | "EDITORIAL";
}

interface Events {
  (e: "click:toggle"): void;
}

const props = defineProps<Props>();
defineEmits<Events>();

const { $t } = useNuxtApp();
const { isBigDesktop } = useMediaQuery();

const searchValue = ref("");
const show = ref(true);

const filteredNavigationGroup = computed(() => {
  return Object.entries(props.documentFields).reduce((group, [key, field]) => {
    const translatedKey = $t(`experience.${key}.title`);

    if (cleanString(translatedKey).includes(cleanString(searchValue.value))) {
      const sidebarField = {
        id: key,
        title: translatedKey,
        required: field.required,
        filled: Array.isArray(field.value)
          ? field.value.length > 0
          : !!field.value,
      };

      if (!group[field.category]) {
        group[field.category] = [sidebarField];
      } else {
        group[field.category].push(sidebarField);
      }
    }

    return group;
  }, {} as { [key: string]: SidebarField[] });
});

function cleanString(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/gi, "");
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utilities";

.DocumentSidebar {
  position: sticky;
  top: calc(var(--header-height) + var(--tab-navigation-height));
  height: var(--window-height);
  width: rem(24px);
  background-color: white;
  border-right: 1px solid var(--color-grey-90);
  display: flex;
  flex-direction: column;

  &[show] {
    width: var(--document-sidebar-width-md);
  }

  &__collapsed {
    padding: rem(4);
    width: rem(24px);

    &__btn {
      cursor: pointer;
      margin-top: 7px;
      color: var(--color-text-100);
    }
  }

  &__header {
    padding: rem(22) rem(12) rem(8);
  }

  &__title {
    @include font-medium(14);

    color: var(--color-text-90);
  }

  &__toggle {
    margin-top: rem(10);
    color: var(--color-text-80);
    @include font-medium(10);

    & > button {
      width: 100%;
    }
  }

  &__fields-list {
    overflow-y: scroll;
  }

  &__footer {
    padding: 2px;
    display: flex;
    justify-content: space-between;
    margin-top: auto;
    margin-bottom: rem(6);

    &__btn--close {
      cursor: pointer;
      background-color: transparent;
      border: none;
      padding: 0;
      margin-bottom: 4px;
      color: var(--color-text-100);
    }
  }

  &__legend {
    li {
      display: flex;
      padding: rem(4);
      align-items: center;
    }
  }

  &__no-items {
    @include font-medium(12);

    color: var(--color-text-100);
    margin: rem(37px) auto;
  }

  &__input-text {
    margin: rem(24) 0 rem(8);
    padding: 0 rem(12);
  }
}

.ListGroup {
  margin-bottom: rem(10);

  &__title {
    @include font-medium(12);

    padding: rem(6) rem(12);
    color: var(--color-text-80);
  }
}

.ListItem {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding: rem(6) rem(12);
  background-color: white;
  text-decoration: none;
  color: var(--color-text-100);
  @include font-medium(12);

  cursor: pointer;

  &__text {
    text-decoration: none;
  }

  &:disabled {
    cursor: not-allowed;
  }

  &[selected] {
    position: relative;
    color: var(--color-primary-100);
    background-color: var(--color-grey-70);

    &::after {
      content: "";
      position: absolute;
      width: 3px;
      height: 16px;
      left: 0;
      top: 50%;
      transform: translateY(-47%);
      border-radius: 0 3px 3px 0;
      background-color: var(--color-primary-100);
    }
  }

  &:active:not(:disabled) {
    background-color: var(--color-grey-90);
  }

  focus-visible,
  &:hover:not(:disabled):not(:active) {
    background-color: var(--color-grey-70);
  }
}

.IconRight {
  position: relative;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  overflow: hidden;
  border-style: dotted;

  &[required] {
    border-style: solid;
    border: var(--border-default);
  }

  &[valid] {
    border-color: transparent;
    background-color: var(--color-success-100);
  }

  &__icon-check {
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

@include start-from(desktop-lg) {
  .DocumentSidebar {
    &[show] {
      width: var(--document-sidebar-width-lg);
    }

    &__footer {
      &__btn--open {
        display: none;
      }
    }
  }
}
</style>
