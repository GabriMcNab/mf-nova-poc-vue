<template>
  <div class="NovaImagePreviewCard">
    <div class="NovaImagePreviewCard__header">
      <span>{{ image.visualization_order }}.</span>
      <NovaButtonIcon
        name="edit"
        theme="dark"
        :size="18"
        @click="$emit('click:edit', image.id)"
      />
      <NovaButtonIcon
        name="trash"
        theme="dark"
        :size="18"
        @click="$emit('click:delete', image.id)"
      />
    </div>
    <div class="NovaImagePreviewCard__img-container">
      <img
        :src="image.url"
        alt="Uploaded image"
        data-testid="nova-image-preview-card-image"
      />
    </div>
    <div class="NovaImagePreviewCard__footer">
      <span data-testid="nova-image-preview-card-name">{{
        clippedFileName
      }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import NovaButtonIcon from "@/ui-kit/NovaButtonIcon/NovaButtonIcon.vue";
import { Image } from "@/types/generated/ContentQueryApi";

export interface Props {
  image: Image;
}

interface Events {
  (e: "click:edit", imageId: Image["id"]): void;
  (e: "click:delete", ImageId: Image["id"]): void;
}

const props = defineProps<Props>();
defineEmits<Events>();

const clippedFileName = computed(() => {
  if (props.image.name.length > 20) {
    const fileExtension = props.image.name.split(".").pop();
    return `${props.image.name.substring(0, 19)}... ${fileExtension}`;
  }
  return props.image.name;
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utilities";

.NovaImagePreviewCard {
  cursor: default;
  border: var(--border-default);
  border-radius: var(--border-radius-sm);
  background-color: var(--color-white);
  display: grid;
  grid-template-rows: auto 150px 42px;

  &:hover {
    outline: 4px solid var(--color-primary-10);
  }

  &__header {
    padding: 0 5px;
    display: grid;
    align-items: center;
    grid-template-columns: 1fr auto auto;
    gap: rem(5);
    border-bottom: var(--border-default);

    @include font-medium(14);

    & > span {
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--color-primary);
      background-color: var(--color-primary-10);
      border-radius: 50%;
      @include font-medium(10);
    }
  }

  .svg-icon {
    margin-right: rem(5);
  }

  &__img-container > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  &__footer {
    padding: 3px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: var(--color-text-80);
    border-top: var(--border-default);
    @include font-medium(12);
  }

  &__grip {
    text-align: center;
    color: var(--color-text-100);
  }
}
</style>
