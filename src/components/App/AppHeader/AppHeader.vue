<template>
  <div class="container">
    <RouterLink to="/">
      <AppLogo data-testid="header-tui-logo" />
    </RouterLink>
    <a href="http://localhost:9000/react-app" class="ml-4"> React App </a>
  </div>
</template>

<script lang="ts" setup>
import AppLogo from "@/components/App/AppLogo/AppLogo.vue";
</script>

<style scoped lang="scss">
@import "@/assets/scss/utilities/rem";

.container {
  position: fixed;
  z-index: var(--z-index-header);
  padding: 0 rem(15);
  width: 100%;
  height: var(--header-height);
  background: var(--color-white);
  border-bottom: var(--border-default);
  display: flex;
  align-items: center;
}
</style>
