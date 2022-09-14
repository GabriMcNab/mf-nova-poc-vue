<template>
  <div class="NovaImagePreview">
    <div class="NovaImagePreview__header">
      <span data-testid="nova-image-preview-name">{{ image.name }}</span>
      <NovaButton
        variant="text"
        size="xxs"
        @click="$emit('click:edit', image.id)"
        ><NovaIcon name="edit" /> Change</NovaButton
      >
      <NovaButton
        variant="text"
        size="xxs"
        @click="$emit('click:delete', image.id)"
        ><NovaIcon name="trash" /> Remove</NovaButton
      >
    </div>
    <div class="NovaImagePreview__img-container">
      <img
        :src="image.url"
        alt="Uploaded image"
        data-testid="nova-image-preview-image"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import NovaButton from "@/ui-kit/NovaButton/NovaButton.vue";
import NovaIcon from "@/ui-kit/NovaIcon/NovaIcon.vue";
import { Image } from "@/types/generated/ContentQueryApi";

export interface Props {
  image: Image;
}

interface Events {
  (e: "click:edit", imageId: Image["id"]): void;
  (e: "click:delete", ImageId: Image["id"]): void;
}

defineProps<Props>();
defineEmits<Events>();
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utilities";

.NovaImagePreview {
  height: 100%;
  border: var(--border-default);
  border-radius: var(--border-radius-sm);
  background-color: var(--color-white);
  display: grid;
  grid-template-rows: 50px 250px;

  &__header {
    padding: rem(12) rem(15);
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: rem(10);
    border-bottom: var(--border-default);

    @include font-medium(14);
  }

  .svg-icon {
    margin-right: rem(5);
  }

  &__img-container > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
