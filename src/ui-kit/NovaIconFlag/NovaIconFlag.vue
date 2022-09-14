<template>
  <component
    :is="dynamicIcon"
    :style="{
      height: `${size ? size * 0.7 : 14}px`,
      width: `${size ?? 20}px`,
    }"
  />
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from "vue";
import { AvailableLanguage } from "@/types/Language";

export interface Props {
  countryCode: AvailableLanguage;
  size?: number;
}

const props = defineProps<Props>();

const dynamicIcon = defineAsyncComponent(
  () =>
    import(/* @vite-ignore */ `../../assets/svg/flag-${props.countryCode}.svg`)
);
</script>
