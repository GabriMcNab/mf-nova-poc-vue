<template>
  <NovaLabel :theme="label.theme" :size="size">
    <NovaIcon
      v-if="label.icon"
      :name="label.icon"
      :size="18"
      style="color: var(--color-text-90)"
    />
    <span v-if="label.textFlow" class="ml-1">{{ $t(label.textFlow) }} - </span>
    <span class="StatusLabel__textCode">{{ $t(label.textCode) }}</span>
  </NovaLabel>
</template>

<script setup lang="ts">
import { ComputedRef, computed } from "vue";
import NovaLabel, {
  LabelTheme,
  NovaLabelProps,
} from "@/ui-kit/NovaLabel/NovaLabel.vue";
import NovaIcon, { Icon } from "@/ui-kit/NovaIcon/NovaIcon.vue";
import { useMasterData } from "@/stores/master-data";
import { DocumentFlow, DocumentStatus } from "@/types/DocumentStatuses";

export interface StatusLabelProps {
  flowId?: string;
  statusId?: string;
  size?: NovaLabelProps["size"];
}

interface LabelProps {
  theme: LabelTheme;
  icon: Icon | null;
  textFlow: string | null;
  textCode: string;
}

const theme: {
  [key: string]: LabelTheme;
} = {
  [DocumentStatus.DRAFT]: "light-grey",
  [DocumentStatus.TO_BE_EDIT]: "secondary",
  [DocumentStatus.IN_REVIEW]: "yellow",
  [DocumentStatus.PUBLISHED]: "green",
};

const icon: {
  [key: string]: Icon | null;
} = {
  [DocumentFlow.RAW]: null,
  [DocumentFlow.CURATION]: "flow-curation",
  [DocumentFlow.MANUAL_TRANSLATION]: "flow-translation",
  [DocumentFlow.AUTOTRANSLATION]: "flow-translation",
  [DocumentFlow.MEDIA]: "flow-media",
};

const props = defineProps<StatusLabelProps>();
const store = useMasterData();

const label: ComputedRef<LabelProps> = computed(() => {
  if (!props.statusId || !props.flowId) {
    return {
      theme: theme.DRAFT,
      icon: null,
      textFlow: null,
      textCode: `status.code.draft`,
    };
  }

  const statusCode = store.getStatusCodeById(props.statusId);
  const flowCode = store.getFlowCodeById(props.flowId);

  return {
    theme: theme[statusCode],
    icon: icon[flowCode],
    textFlow: `status.flow.${flowCode.toLowerCase()}`,
    textCode: `status.code.${statusCode.toLowerCase()}`,
  };
});
</script>

<style scoped lang="scss">
.StatusLabel__textCode {
  font-style: italic;
  font-weight: 300;
}
</style>
