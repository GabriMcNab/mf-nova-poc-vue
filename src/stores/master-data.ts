import { defineStore } from "pinia";
import { useNotifications } from "./notifications";
import { useContentCommandApi } from "@/composables/useContentCommandApi";
import { useContentMasterDataApi } from "@/composables/useContentMasterDataApi";
import { useExperienceMasterDataApi } from "@/composables/useExperienceMasterDataApi";
import type { Flow } from "@/types/generated/ContentCommandApi";
import type { ContentStatus } from "@/types/generated/ContentMasterDataApi";
import type {
  AdditionalService,
  Highlights,
  ImportantInformation,
  Included,
} from "@/types/generated/ExperienceMasterDataApi";
import type { DocumentFlow, DocumentStatus } from "@/types/DocumentStatuses";
import type { AvailableLanguage } from "@/types/Language";

export interface ExperienceMasterDataState {
  highlights: Highlights[];
  included: Included[];
  importantInformation: ImportantInformation[];
  additionalServices: AdditionalService[];
  contentStatuses: ContentStatus[];
  contentFlows: Flow[];
  availableLanguages: Set<AvailableLanguage>;
  automaticTranslationLanguages: Set<AvailableLanguage>;
}

export const useMasterData = defineStore("master-data", {
  state: (): ExperienceMasterDataState => ({
    highlights: [],
    included: [],
    importantInformation: [],
    additionalServices: [],
    contentStatuses: [],
    contentFlows: [],
    availableLanguages: new Set([
      "en",
      "es",
      "it",
      "de",
      "fr",
      "nl",
      "pl",
      "pt",
      "ru",
      "dk",
      "no",
      "fi",
      "se",
    ]),
    automaticTranslationLanguages: new Set(["es"]),
  }),
  getters: {
    getStatusCodeById:
      (state) =>
      (id: string): ContentStatus["code"] => {
        const status = state.contentStatuses.find(
          (statuses) => statuses.id === id
        );

        if (!status) {
          throw new Error(`Could not find status master data with id: ${id}`);
        }

        return status.code;
      },
    getStatusByCode:
      (state) =>
      (code: DocumentStatus): ContentStatus => {
        const status = state.contentStatuses.find(
          (statuses) => statuses.code === code
        );
        if (!status) {
          throw new Error(
            `Could not find status master data with code: ${code}`
          );
        }
        return status;
      },
    getFlowCodeById:
      (state) =>
      (id: string): Flow["code"] => {
        const flow = state.contentFlows.find((f) => f.id === id);

        if (!flow) {
          throw new Error(`Could not find flow master data with id: ${id}`);
        }

        return flow.code;
      },
    getFlowByCode:
      (state) =>
      (code: DocumentFlow): Flow => {
        const flow = state.contentFlows.find((f) => f.code === code);

        if (!flow) {
          throw new Error(`Could not find flow master data with code: ${code}`);
        }

        return flow;
      },
  },
  actions: {
    async getMasterData() {
      const { get: getExperienceMasterData } = useExperienceMasterDataApi();
      const { getFlows } = useContentCommandApi();
      const { get: getContentMasterData } = useContentMasterDataApi();
      const notificationStore = useNotifications();

      await Promise.all([
        getFlows("flows"),
        getContentMasterData("content-statuses"),
        getExperienceMasterData<Highlights[]>("highlights"),
        getExperienceMasterData<Included[]>("included"),
        getExperienceMasterData<ImportantInformation[]>(
          "important-information"
        ),
        getExperienceMasterData<AdditionalService[]>("additional-services"),
      ])
        .then(
          ([
            { data: flows },
            { data: contentStatuses },
            { data: highlights },
            { data: included },
            { data: importantInformation },
            { data: additionalServices },
          ]) => {
            this.contentFlows = flows;
            this.contentStatuses = contentStatuses;
            this.highlights = highlights;
            this.included = included;
            this.importantInformation = importantInformation;
            this.additionalServices = additionalServices;
          }
        )
        .catch((error) => {
          notificationStore.addNotification({
            theme: "error",
            message: "notifications.error.fetching.master.data",
          });
          throw error;
        });
    },
  },
});
