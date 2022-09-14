<template>
  <NovaSortableList
    v-if="modelValue.length > 0"
    v-slot="{ item }"
    :model-value="modelValue"
    layout="grid"
    @update:model-value="$emit('update:modelValue', $event as Image[])"
  >
    <NovaImagePreviewCard
      :image="item"
      @click:edit="handleGalleryImageEdit"
      @click:delete="handleGalleryImageDelete"
    />
  </NovaSortableList>
  <NovaButton
    size="sm"
    class="mt-4"
    data-testid="nova-image-gallery-button"
    @click="handleGalleryImageAdd"
    >{{ ctaText }}</NovaButton
  >
</template>

<script lang="ts" setup>
import NovaButton from "@/ui-kit/NovaButton/NovaButton.vue";
import NovaImagePreviewCard from "@/ui-kit/NovaImagePreviewCard/NovaImagePreviewCard.vue";
import NovaSortableList from "@/ui-kit/NovaSortableList/NovaSortableList.vue";
import { useFileDialog } from "@/composables/useFileDialog";

export interface Image {
  id: string;
  name: string;
  media_type: string;
  url?: string;
  visualization_order?: number;
  is_cover?: boolean;
  original_file?: File;
}

export interface Props {
  modelValue: Image[];
  ctaText?: string;
}

interface Events {
  (e: "update:modelValue", images: Image[]): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Events>();

const { openDialog, files } = useFileDialog();

function createExperienceImage(file: File, order: number): Image {
  return {
    id: file.name,
    url: URL.createObjectURL(file),
    is_cover: false,
    name: file.name,
    media_type: file.type,
    visualization_order: order,
    original_file: file,
  };
}

async function handleGalleryImageAdd() {
  const images = [...props.modelValue];

  await openDialog({ multiple: true, accept: "image/*" });
  files.value.forEach((file) =>
    images.push(createExperienceImage(file, images.length + 1))
  );

  emit("update:modelValue", images);
}

async function handleGalleryImageEdit(oldImageId: string) {
  const images = [...props.modelValue];

  await openDialog({ accept: "image/*" });
  files.value.forEach((file) => {
    const oldImageIndex = images.findIndex((i) => i.id === oldImageId);
    images[oldImageIndex] = createExperienceImage(file, oldImageIndex + 1);
  });

  emit("update:modelValue", images);
}

function handleGalleryImageDelete(imageId: string) {
  emit(
    "update:modelValue",
    props.modelValue
      .filter((i) => i.id !== imageId)
      .map((i, idx) => ({ ...i, visualization_order: idx + 1 }))
  );
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utilities";
</style>
