<template>
  <div class="HighlightsManager" :disabled="disabled || null">
    <nova-input-text
      :id="`${id}-text-input`"
      v-model="inputValue"
      :placeholder="$t('highlight.manager.input.placeholder')"
      :label="$t('highlight.manager.input.label')"
      left-icon="search"
    />
    <div class="HighlightsManager__tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        :active="selectedTab === tab || null"
        :data-testid="`${id}-tabs-${tab}`"
        :isDisabled="disabled || null"
        @click="if (!disabled) selectedTab = tab;"
      >
        {{ $t(`highlight.manager.tab.${tab}`) }}
      </button>
    </div>
    <ul v-if="!loading" class="HighlightsManager__list">
      <li
        v-for="highlight in filteredHighlights[selectedTab]"
        :key="highlight.id"
        :selected="isHighlightSelected(highlight.id) || null"
        class="HighlightsManager__list-item"
        tabindex="0"
        :disabled="disabled || null"
        :data-testid="`${id}-highlight`"
        @click="if (!disabled) handleHighlightSelect(highlight.id);"
        @keydown.enter.space="handleHighlightSelect(highlight.id)"
      >
        {{ highlight.name }}
        <nova-icon
          v-show="isHighlightSelected(highlight.id)"
          name="minus"
          :size="8"
        />
        <nova-icon
          v-show="!isHighlightSelected(highlight.id)"
          name="plus"
          :size="8"
        />
      </li>
    </ul>
    <div v-else class="HighlightsManager__spinner">
      <nova-spinner :size="28" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { Highlights } from "@/types/generated/ExperienceMasterDataApi";
import NovaInputText from "@/ui-kit/NovaInputText/NovaInputText.vue";
import NovaIcon from "@/ui-kit/NovaIcon/NovaIcon.vue";
import NovaSpinner from "@/ui-kit/NovaSpinner/NovaSpinner.vue";

export interface Props {
  id: string;
  loading: boolean;
  highlights: Highlights[];
  modelValue: string[];
  disabled?: boolean;
}

interface Events {
  (e: "update:modelValue", value: string[]): void;
}

type Tab = "all" | "selected" | "notSelected";

const props = defineProps<Props>();
const emits = defineEmits<Events>();

const tabs: Tab[] = ["all", "selected", "notSelected"];
const selectedTab = ref<Tab>(props.disabled ? "selected" : "all");

const inputValue = ref("");
const filteredHighlights = computed(() => {
  const filteredByText = props.highlights.filter(({ name }) =>
    name.toLowerCase().includes(inputValue.value.toLowerCase())
  );

  return {
    all: filteredByText,
    selected: filteredByText.filter(({ id }) => isHighlightSelected(id)),
    notSelected: filteredByText.filter(({ id }) => !isHighlightSelected(id)),
  };
});

const isHighlightSelected = (highlight: string) => {
  return props.modelValue.includes(highlight);
};

const handleHighlightSelect = (highlightId: string) => {
  let newHighlights = props.modelValue;

  if (!isHighlightSelected(highlightId)) {
    newHighlights.push(highlightId);
  } else {
    newHighlights = newHighlights.filter((id) => id !== highlightId);
  }

  emits("update:modelValue", newHighlights);
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utilities";

.HighlightsManager {
  min-width: rem(425);
  height: rem(550);
  padding: rem(25) rem(15) rem(18);
  border: var(--border-default);
  border-radius: var(--border-radius-default);
  display: flex;
  flex-direction: column;

  &__tabs {
    border-bottom: var(--border-default);
    padding: 0 rem(5);
    margin-top: rem(15);
    display: flex;

    & > button {
      cursor: pointer;
      padding: 0;
      min-width: rem(20);
      margin-right: rem(25);
      background-color: transparent;
      border: none;
      color: var(--color-text-80);
      @include font-light(14);

      display: flex;
      flex-direction: column;
      align-items: center;

      &[active] {
        color: var(--color-primary-100);

        &::after {
          content: "";
          height: 3px;
          width: 20px;
          background-color: var(--color-primary-100);
          border-radius: 2px 2px 0 0;
        }

        &[isDisabled] {
          color: var(--color-text-80);

          &::after {
            background-color: var(--color-text-80);
          }
        }
      }
    }
  }

  &__list {
    overflow-y: scroll;
    flex-grow: 1;
    padding: rem(15) 0;

    // Hiding the scrollbar since it's not required by the design
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__list-item {
    cursor: pointer;
    padding: rem(10) rem(8);
    border-bottom: var(--border-default);
    @include font-medium(14);

    display: grid;
    align-items: center;
    grid-template-columns: auto 18px;
    gap: rem(10);

    & > svg {
      padding: rem(5);
      border-radius: 50%;
      color: var(--color-primary-100);
      background-color: var(--color-primary-10);
    }

    &:hover {
      background-color: var(--color-grey-70);

      & > svg {
        color: var(--color-white);
        background-color: var(--color-primary-50);
      }
    }

    &[selected] {
      background-color: var(--color-grey-80);

      & > svg {
        color: var(--color-text-70);
        background-color: var(--color-primary-100);
      }

      &[disabled] > svg {
        color: var(--color-white);
        background-color: var(--color-grey-100);
      }
    }

    &[selected]:hover {
      background-color: var(--color-grey-90);

      & > svg {
        color: var(--color-white);
        background-color: var(--color-primary-110);
      }

      &[disabled] {
        background-color: var(--color-grey-70);
        cursor: initial;

        & > svg {
          color: var(--color-white);
          background-color: var(--color-grey-100);
        }
      }
    }
  }

  &__spinner {
    color: var(--color-primary-100);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
