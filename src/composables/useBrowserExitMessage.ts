import type { Ref } from "vue";
export function useBrowserExitMessage(isEnabled: Ref<boolean>) {
  const beforeUnloadListener = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = false;
  };
  const addBrowserExitListener = () => {
    addEventListener("beforeunload", beforeUnloadListener);
  };

  const removeBrowserExitListener = () => {
    removeEventListener("beforeunload", beforeUnloadListener);
  };
  watch(isEnabled, () => {
    if (isEnabled.value) {
      addBrowserExitListener();
    } else {
      removeBrowserExitListener();
    }
  });

  onUnmounted(() => {
    removeBrowserExitListener();
  });
}
