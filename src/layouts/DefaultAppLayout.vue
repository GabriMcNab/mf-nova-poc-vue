<template>
  <AppNotifications />
  <AppHeader />
  <div class="wrapper">
    <AppSidebar
      :show="sidebarIsOpen"
      :nav-elements="navElements"
      @click:collapsing="handleCollapse"
    />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RouterView } from "vue-router";
import axios from "axios";
import config from "@/config/config.dev";
import { loadCache } from "@musement/i18n";
import AppHeader from "@/components/App/AppHeader/AppHeader.vue";
import AppSidebar, {
  NavElement,
} from "@/components/App/AppSidebar/AppSidebar.vue";
import AppNotifications from "@/components/App/AppNotifications/AppNotifications.vue";

const lang = "en-GB";
const namespace = "b2b-nova-fe";

const { data } = await axios.get(`${config.API.I18N_BASE_URL}/i18n`, {
  params: { namespace, lang },
});
loadCache(data);

const sidebarIsOpen = ref(false);
function handleCollapse() {
  sidebarIsOpen.value = !sidebarIsOpen.value;
}

const navElements: NavElement[] = [
  {
    icon: "ticket",
    title: "Experiences",
    path: "/",
  },
];
</script>

<style scoped lang="scss">
.wrapper {
  padding-top: var(--header-height);
  display: grid;
  grid-template-columns: auto 1fr auto;

  .page {
    height: 100%;
  }
}
</style>
