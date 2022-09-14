<template>
  <NovaModal :show="showModal">
    <div class="ExitModal">
      <p class="ExitModal__title">{{ $t("modal.experience.exit.tile") }}</p>
      <p class="ExitModal__description">
        {{ $t("modal.experience.exit.description") }}
      </p>
      <div class="ExitModal__buttons">
        <NovaButton
          data-testid="modal-leave-btn"
          variant="underlined"
          size="sm"
          @click="
            goToNextRoute = true;
            $router.push(toRoute);
            !isTheSameExp && tabsStore.closeTab($route.path);
          "
        >
          {{ $t("modal.experience.exit.btn.leave") }}</NovaButton
        >
        <NovaButton
          size="sm"
          data-testid="modal-save-btn"
          @click="showModal = false"
        >
          {{ $t("modal.experience.exit.btn.stay") }}</NovaButton
        >
      </div>
    </div>
  </NovaModal>
</template>

<script setup lang="ts">
import { RouteLocationRaw } from "vue-router";
import { Ref, ref } from "vue";
import NovaModal from "@/ui-kit/NovaModal/NovaModal.vue";
import NovaButton from "@/ui-kit/NovaButton/NovaButton.vue";
import { useDocumentTabs } from "@/stores/document-tabs";

export interface Props {
  documentIsModified?: boolean;
}

const router = useRouter();
const props = defineProps<Props>();
const toRoute: Ref<RouteLocationRaw> = ref("");
const showModal: Ref<boolean> = ref(false);
const goToNextRoute: Ref<boolean> = ref(false);
const tabsStore = useDocumentTabs();

const isTheSameExp = ref(false);

router.beforeEach((to, from) => {
  const toSplitted = to.path.split("/");
  const fromSplitted = from.path.split("/");

  isTheSameExp.value =
    toSplitted[1] === fromSplitted[1] && toSplitted[2] === fromSplitted[2];

  if (
    props.documentIsModified &&
    !goToNextRoute.value &&
    to.path !== from.path
  ) {
    showModal.value = true;
    toRoute.value = to;
    goToNextRoute.value = false;
    return false;
  }
  if (showModal.value) showModal.value = false;
});
</script>

<style lang="scss">
@import "@/assets/scss/utilities";

.ExitModal {
  padding: rem(24px);
  width: rem(354px);

  &__title {
    @include font-bold(16);

    color: var(--color-text-100);
  }

  &__description {
    @include font-medium(12);

    margin-top: 4px;
  }

  &__buttons {
    margin-top: rem(16px);
    display: flex;
    justify-content: space-around;

    button {
      white-space: nowrap;
    }
  }
}
</style>
