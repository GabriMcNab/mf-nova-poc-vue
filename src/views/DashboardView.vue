<template>
  <div class="Dashboard">
    <div class="Dashboard__wrapper">
      <div class="Dashboard__header">
        <NovaButton
          size="sm"
          class="Dashboard__button"
          @click="$router.push('/experience-raw/new')"
        >
          <p class="Dashboard__button__text">
            {{ $t("dashboard.btn.create.new.raw.content") }}
          </p>
        </NovaButton>

        <div class="Dashboard__search-bar">
          <NovaInputText
            id="dashboard-search-bar"
            v-model="searchQuery"
            left-icon="search"
            :placeholder="$t('dashboard.search.bar.placeholder')"
            @update:model-value="debouncedGetTableItems()"
          />
        </div>

        <NovaButtonToggle
          data-testid="dashboard-toggle"
          :checked="showRawItems"
          @click:toggle="showRawItems = !showRawItems"
        >
          <template #firstOption>{{ $t("common.btn.toggle.raw") }}</template>
          <template #secondOption>{{
            $t("common.btn.toggle.editorial")
          }}</template>
        </NovaButtonToggle>
      </div>

      <NovaTable
        v-show="showRawItems"
        grid-template-columns="1fr 1fr 50px"
        class="Dashboard__table mt-8"
        aria-label="experience raw content table"
        :loading="loadingRawItems"
        :headers="[
          {
            key: 'commercial.title',
            label: $t('dashboard.table.header.title'),
          },
          { key: 'id', label: $t('dashboard.table.header.id') },
        ]"
        :items="tableRawItems"
        @update:sort="updateRawItemsSorting"
      >
        <template #row="{ item }">
          <TableItem
            :item="(item as DashboardTableItem)"
            :expanded-row-items="[(item as DashboardTableItem)]"
            @click:edit="(id: string) => $router.push(`/experience-raw/${id}`)"
          />
        </template>
      </NovaTable>
      <NovaTable
        v-show="!showRawItems"
        grid-template-columns="1fr 1fr 50px"
        class="Dashboard__table mt-8"
        aria-label="experience commercial content table"
        :loading="loadingEditorialItems"
        :headers="[
          {
            key: 'experience_translation.title',
            label: $t('dashboard.table.header.title'),
          },
          { key: 'id', label: $t('dashboard.table.header.id') },
        ]"
        :items="Array.from(tableEditorialItems.keys())"
        @update:sort="updateEditorialItemsSorting"
      >
        <template #row="{ item }">
          <TableItem
            :item="(item as DashboardTableItem)"
            :expanded-row-items="tableEditorialItems.get(item as DashboardTableItem) ?? []"
            :handle-row-expand="() => getExpandedRowContent(item as DashboardTableItem)"
            @click:edit="handleItemRedirect"
          />
        </template>
      </NovaTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import debounce from "lodash.debounce";
import builder from "@rsql/builder";
import { emit } from "@rsql/emitter";
import { useContentQueryApi } from "@/composables/useContentQueryApi";
import TableItem from "@/components/Dashboard/TableItem/TableItem.vue";
import NovaButton from "@/ui-kit/NovaButton/NovaButton.vue";
import NovaTable from "@/ui-kit/NovaTable/NovaTable.vue";
import NovaInputText from "@/ui-kit/NovaInputText/NovaInputText.vue";
import NovaButtonToggle from "@/ui-kit/NovaButtonToggle/NovaButtonToggle.vue";
import type { DashboardTableItem } from "@/components/Dashboard/TableItem/TableItem.vue";
import { useNotifications } from "@/stores/notifications";

const CONTAINS = "=re=";

const router = useRouter();
const notificationStore = useNotifications();
const { getAllRawContents, getAllExperienceContents } = useContentQueryApi();

const showRawItems = ref(true);

const searchQuery = ref("");
const debouncedGetTableItems = debounce(() => {
  getTableRawItems();
  getTableEditorialItems();
}, 500);

const handleItemRedirect = (id: string, lang?: string) => {
  if (lang === "en") {
    router.push(`/experience-curation/${id}`);
  } else if (lang) {
    router.push(`/experience-translation/${id}/${lang}`);
  }
};

const tableRawItems = ref<DashboardTableItem[]>([]);
const loadingRawItems = ref(true);
const rawItemsSorting = reactive<{ key: string; direction: "+" | "-" }>({
  key: "commercial.title",
  direction: "+",
});
async function updateRawItemsSorting(update: string) {
  if (rawItemsSorting.key === update) {
    rawItemsSorting.direction = rawItemsSorting.direction === "+" ? "-" : "+";
  }
  rawItemsSorting.key = update;

  await getTableRawItems();
}

getTableRawItems();

async function getTableRawItems() {
  try {
    loadingRawItems.value = true;
    const { data } = await getAllRawContents("experience-raw-content", {
      params: {
        sort: rawItemsSorting.direction + rawItemsSorting.key,
        filters: emit(
          builder.and(
            builder.eq("go_commercial", "false"),
            builder.comparison(
              "commercial.title",
              CONTAINS,
              `.*${searchQuery.value}.*`
            )
          )
        ),
      },
    });

    tableRawItems.value = data.map((i) => ({
      title: i.commercial.title,
      id: i.id ?? "",
      creation_date: i.creation_date,
      updated_date: i.updated_date,
      statuses: [{}],
    }));
    loadingRawItems.value = false;
  } catch {
    notificationStore.addNotification({
      theme: "error",
      message: "notifications.error.fetching.experiences",
    });
  }
}

const tableEditorialItems = ref<Map<DashboardTableItem, DashboardTableItem[]>>(
  new Map()
);
const loadingEditorialItems = ref(true);
const editorialItemsSorting = reactive<{ key: string; direction: "+" | "-" }>({
  key: "experience_translation.title",
  direction: "+",
});
function updateEditorialItemsSorting(update: string) {
  if (editorialItemsSorting.key === update) {
    editorialItemsSorting.direction =
      editorialItemsSorting.direction === "+" ? "-" : "+";
  }
  editorialItemsSorting.key = update;

  getTableEditorialItems();
}

getTableEditorialItems();

async function getTableEditorialItems() {
  try {
    loadingEditorialItems.value = true;
    const { data } = await getAllExperienceContents("experience-content", {
      params: {
        sort: editorialItemsSorting.direction + editorialItemsSorting.key,
        filters: emit(
          builder.and(
            builder.eq("language_code", "en"),
            builder.comparison(
              "experience_translation.title",
              CONTAINS,
              `.*${searchQuery.value}.*`
            )
          )
        ),
      },
    });

    tableEditorialItems.value = new Map();

    for (const i of data) {
      tableEditorialItems.value.set(
        {
          title: i.experience_translation?.title ?? "",
          id: i.experience_id,
          creation_date: i.experience_translation?.creation_date,
          updated_date: i.experience_translation?.updated_date,
          language_code: i.language_code,
          statuses: [],
        },
        []
      );
    }

    loadingEditorialItems.value = false;
  } catch {
    notificationStore.addNotification({
      theme: "error",
      message: "notifications.error.fetching.experiences",
    });
  }
}

async function getExpandedRowContent(item: DashboardTableItem) {
  try {
    if (tableEditorialItems.value.get(item)?.length === 0) {
      const { data } = await getAllExperienceContents("experience-content", {
        params: {
          sort: "language_code",
          filters: emit(builder.eq("experience_id", item.id)),
        },
      });

      const englishLangIndex = data.findIndex((c) => c.language_code === "en");
      if (englishLangIndex !== -1) {
        data.unshift(...data.splice(englishLangIndex, 1));
      }

      tableEditorialItems.value.set(
        item,
        data.map((c) => {
          const newItem: DashboardTableItem = {
            title: c.experience_translation?.title ?? "",
            id: c.experience_id,
            creation_date: c.experience_translation?.creation_date,
            updated_date: c.experience_translation?.updated_date,
            language_code: c.language_code,
            statuses: [
              {
                status_id: c.experience_translation?.status_id,
                flow_id: c.experience_translation?.flow_id,
              },
            ],
          };

          if (c.language_code === "en" && c.experience_media) {
            newItem.statuses.push({
              status_id: c.experience_media?.status_id,
              flow_id: c.experience_media?.flow_id,
            });
          }

          return newItem;
        })
      );
    }
  } catch {
    notificationStore.addNotification({
      theme: "error",
      message: "notifications.error.fetching.experiences",
    });
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/utilities";

.Dashboard {
  background: var(--color-grey-80);
  padding: rem(23px) rem(12px);
  height: 100%;

  &__wrapper {
    max-width: 1240px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__table {
    flex-grow: 1;
  }

  &__button {
    max-height: 32px;

    &__text {
      @include font-bold(14);
    }
  }

  &__search-bar {
    width: 100%;
    max-width: 400px;
  }
}
</style>
