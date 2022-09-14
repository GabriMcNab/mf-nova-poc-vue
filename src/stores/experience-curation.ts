import { defineStore } from "pinia";
import builder from "@rsql/builder";
import { emit } from "@rsql/emitter";
import { useNotifications } from "@/stores/notifications";
import { useContentCommandApi } from "@/composables/useContentCommandApi";
import { useContentQueryApi } from "@/composables/useContentQueryApi";
import {
  useMetadataExperienceApi,
  ExperienceMetadata,
} from "@/composables/useMetadataExperienceApi";
import { ExperienceTranslation } from "@/types/generated/ContentCommandApi";
import { useMasterData } from "@/stores/master-data";
import {
  ExperienceHighlights,
  ExperienceImportantInformation,
  ExperienceIncluded,
  ExperienceNonIncluded,
  ExperienceAdditionalService,
} from "@/types/generated/MetadataExperiencesApi";
import { DocumentStatus, DocumentFlow } from "@/types/DocumentStatuses";
import { useNuxtApp } from "#imports";
import { AvailableLanguage } from "@/types/Language";

type FormCategory =
  | "experience_settings"
  | "experience_info"
  | "voucher"
  | "property_and_relevance";

type FormField<T> = {
  value: T;
  category: FormCategory;
};

type RequiredField =
  | "title"
  | "seo_title"
  | "description"
  | "seo_description"
  | "highlights"
  | "included"
  | "additional_services";

type SetRequired<A, K extends string> = {
  [property in keyof A]: {
    value: A[property]["value" & keyof A[property]];
    category: A[property]["category" & keyof A[property]];
    required: property extends K ? true : false;
  };
};
interface ExperienceCurationFormBase {
  title: FormField<string>;
  seo_title: FormField<string>;
  description: FormField<string>;
  seo_description: FormField<string>;
  highlights: FormField<string[]>;
  included: FormField<string[]>;
  non_included: FormField<string[]>;
  important_information: FormField<string[]>;
  info_voucher: FormField<string>;
  additional_services: FormField<string[]>;
}

export type ExperienceCurationForm = SetRequired<
  ExperienceCurationFormBase,
  RequiredField
>;

export interface ExperienceCurationState {
  curationDocuments: {
    [id: string]: {
      ids: {
        translation: string;
        highlights?: string;
        included?: string;
        nonIncluded?: string;
        importantInfo?: string;
        additionalServices?: string;
      };
      fields: ExperienceCurationForm;
      modified: boolean;
      data: ExperienceTranslation;
    };
  };
}

export const mapPayloadToForm = ({
  translations,
  highlightsData,
  includedData,
  nonIncludedData,
  importantInfoData,
  additionalServicesData,
}: {
  translations: ExperienceTranslation;
  highlightsData?: ExperienceHighlights;
  includedData?: ExperienceIncluded;
  nonIncludedData?: ExperienceNonIncluded;
  importantInfoData?: ExperienceImportantInformation;
  additionalServicesData?: ExperienceAdditionalService;
}): ExperienceCurationForm => ({
  title: {
    value: translations.title,
    required: true,
    category: "experience_settings",
  },
  seo_title: {
    value: translations.seo_title ?? "",
    required: true,
    category: "experience_settings",
  },
  description: {
    value: translations.text1 ?? "",
    required: true,
    category: "experience_info",
  },
  seo_description: {
    value: translations.seo_description ?? "",
    required: true,
    category: "experience_info",
  },
  info_voucher: {
    value: translations.info_voucher ?? "",
    required: false,
    category: "voucher",
  },
  highlights: {
    value: highlightsData?.highlights ?? [],
    required: true,
    category: "experience_info",
  },
  included: {
    value: includedData?.included ?? [],
    required: true,
    category: "experience_info",
  },
  non_included: {
    value: nonIncludedData?.non_included ?? [],
    required: false,
    category: "experience_info",
  },
  important_information: {
    value: importantInfoData?.important_information ?? [],
    required: false,
    category: "experience_info",
  },
  additional_services: {
    value: additionalServicesData?.additional_services ?? [],
    required: true,
    category: "property_and_relevance",
  },
});

const mapFormToPayload = (id: string, fields: ExperienceCurationForm) => {
  return {
    experience_id: id,
    title: fields.title.value,
    info_voucher: fields.info_voucher.value,
    language_code: "en",
    seo_title: fields.seo_title.value,
    seo_description: fields.seo_description.value,
    text1: fields.description.value,

    // curation_quality should be removed when is possible
    curation_quality: false,
  };
};
function updateMetadataExperience<T extends ExperienceMetadata>(
  endpoint: string,
  payload: T,
  id?: string
) {
  const { put, post } = useMetadataExperienceApi();

  if (id) {
    return put(`${endpoint}/${id}`, payload);
  } else {
    return post(endpoint, payload);
  }
}

export const useExperienceCuration = defineStore("experience-curation", {
  state: (): ExperienceCurationState => ({ curationDocuments: {} }),
  getters: {
    requiredFields:
      (state) =>
      (refCode: string): Partial<ExperienceCurationForm> => {
        return Object.entries(state.curationDocuments[refCode].fields).reduce(
          (output, [fieldName, value]) => {
            if (value.required) {
              output[fieldName] = value;
            }
            return output;
          },
          {} as { [key: string]: FormField<string | string[]> }
        );
      },
    submitEnabled() {
      return (refCode: string) =>
        Object.values(this.requiredFields(refCode)).every(
          (f) => f.value && f.value.length > 0
        );
    },
  },
  actions: {
    async getCurationDocument(experienceId: string) {
      const { getTranslations } = useContentCommandApi();
      const { get: getMetadata } = useMetadataExperienceApi();
      const { addNotification } = useNotifications();

      const params = {
        filters: emit(builder.eq("experience_id", experienceId)),
      };

      // At the moment the only way to fetch a translation iS
      // to query the api for the experience id and the language code,
      // which will return an array of one item.
      const translations = getTranslations<ExperienceTranslation[]>(
        "experience-translations",
        { params: { ...params, language_code: "en" } }
      );

      const highlights = getMetadata<ExperienceHighlights[]>(
        "experience-highlights",
        { params: { ...params, fields: "highlights" } }
      );
      const included = getMetadata<ExperienceIncluded[]>(
        "experience-included",
        {
          params: { ...params, fields: "included" },
        }
      );
      const nonIncluded = getMetadata<ExperienceNonIncluded[]>(
        "experience-non-included",
        { params: { ...params, fields: "non_included" } }
      );
      const importantInfo = getMetadata<ExperienceImportantInformation[]>(
        "experience-important-information",
        {
          params: { ...params, fields: "important_information" },
        }
      );
      const additionalServices = getMetadata<ExperienceAdditionalService[]>(
        "experience-additional-services",
        {
          params: { ...params, fields: "additional_services" },
        }
      );

      await Promise.all([
        translations,
        highlights,
        included,
        nonIncluded,
        importantInfo,
        additionalServices,
      ])

        .then(
          ([
            { data: translationsData },
            { data: highlightsData },
            { data: includedData },
            { data: nonIncludedData },
            { data: importantInfoData },
            { data: additionalServicesData },
          ]) => {
            this.curationDocuments[experienceId] = {
              ids: {
                translation: translationsData[0].id as string,
                highlights: highlightsData[0]?.id,
                included: includedData[0]?.id,
                nonIncluded: nonIncludedData[0]?.id,
                importantInfo: importantInfoData[0]?.id,
                additionalServices: additionalServicesData[0]?.id,
              },
              modified: false,
              fields: mapPayloadToForm({
                translations: translationsData[0],
                highlightsData: highlightsData[0],
                includedData: includedData[0],
                nonIncludedData: nonIncludedData[0],
                importantInfoData: importantInfoData[0],
                additionalServicesData: additionalServicesData[0],
              }),
              data: translationsData[0],
            };
          }
        )
        .catch((error) => {
          addNotification({
            theme: "error",
            message: "notifications.error.fetching.document",
          });
          throw error;
        });
    },
    async updateCurationDocument(
      experienceId: string,
      options?: {
        publish?: boolean;
        showNotification?: boolean;
      }
    ) {
      const document = this.curationDocuments[experienceId];
      const { publish, showNotification = true } = options || {};
      const { putTranslation } = useContentCommandApi();
      const { addNotification } = useNotifications();
      const { getStatusByCode } = useMasterData();

      const status = getStatusByCode(
        publish ? DocumentStatus.PUBLISHED : DocumentStatus.IN_REVIEW
      );

      const translations = putTranslation(
        `experience-translations/${document.ids.translation}`,
        {
          ...mapFormToPayload(experienceId, document.fields),
          status_id: status.id,
          flow_id: "b2fd6818-e10e-4197-bea7-9f2c48a12647",
        }
      );

      const highlights = updateMetadataExperience(
        `experience-highlights`,
        {
          experience_id: experienceId,
          highlights: document.fields.highlights.value,
        },
        document.ids.highlights
      );

      const included = updateMetadataExperience(
        `experience-included`,
        {
          experience_id: experienceId,
          included: document.fields.included.value,
        },
        document.ids.included
      );

      const nonIncluded = updateMetadataExperience(
        `experience-non-included`,
        {
          experience_id: experienceId,
          non_included: document.fields.non_included.value,
        },
        document.ids.nonIncluded
      );

      const importantInfo = updateMetadataExperience(
        `experience-important-information`,
        {
          experience_id: experienceId,
          important_information: document.fields.important_information.value,
        },
        document.ids.importantInfo
      );

      const additionalServices = updateMetadataExperience(
        `experience-additional-services`,
        {
          experience_id: experienceId,
          additional_services: document.fields.additional_services.value,
        },
        document.ids.additionalServices
      );
      await Promise.all([
        translations,
        highlights,
        included,
        nonIncluded,
        importantInfo,
        additionalServices,
      ])
        .then(() => {
          this.curationDocuments[experienceId].modified = false;
          // workaround - used to show the correct status but is not synched with the document
          this.curationDocuments[experienceId].data.status_id = status.id;

          if (showNotification) {
            addNotification({
              theme: "success",
              message: "notifications.success.saving.document",
            });
          }
        })
        .catch(() => {
          if (showNotification) {
            addNotification({
              theme: "error",
              message: "notifications.error.saving.document",
            });
          }
        });
    },

    async sendToTranslationCurationDocument(experienceId: string) {
      const { postTranslation, putTranslation } = useContentCommandApi();
      const { getAllExperienceContents } = useContentQueryApi();
      const {
        availableLanguages,
        getStatusByCode,
        getFlowByCode,
        automaticTranslationLanguages,
      } = useMasterData();
      const { addNotification } = useNotifications();
      const { $t } = useNuxtApp();

      // update the english translation as a curation document
      await this.updateCurationDocument(experienceId, {
        publish: true,
        showNotification: true,
      });

      const englishTranslation = this.curationDocuments[experienceId];
      const autoFlowId = getFlowByCode(DocumentFlow.AUTOTRANSLATION).id;
      const manualFlowId = getFlowByCode(DocumentFlow.MANUAL_TRANSLATION).id;

      const { data: experienceContent } = await getAllExperienceContents(
        `experience-content`,
        {
          params: {
            filters: emit(builder.eq("experience_id", experienceId)),
          },
        }
      );

      // filter out already existing documents and en (curation master file)
      const currentTranslationLanguages = new Set([
        ...experienceContent.map((exp) => exp.language_code),
        "en",
      ]);

      const translationsToCreate = Array.from(availableLanguages).filter(
        (lang) => !currentTranslationLanguages.has(lang)
      );

      // get the current autotranslations
      // if they exist, we will PUT to retrigger them
      const automaticTranslations = experienceContent.filter(
        (exp) => exp.experience_translation?.flow_id === autoFlowId
      );

      try {
        await Promise.all([
          // retrigger automatic translation
          ...automaticTranslations.map((experience) => {
            if (experience.experience_translation == null) {
              throw new Error(
                `Experience ${experience.experience_id} has no experience translation for language ${experience.language_code}.`
              );
            }

            const isAutoTranslatable = automaticTranslationLanguages.has(
              experience.language_code as AvailableLanguage
            );

            // if the translation is automatic we must supply
            // the english content so it can sent to the translation service
            const content = isAutoTranslatable ? englishTranslation.data : null;

            return putTranslation(
              `experience-translations/${experience.experience_translation.id}`,
              {
                title: "",
                ...content,
                id: undefined,
                experience_id: experienceId,
                to_be_translated: isAutoTranslatable,
                flow_id: isAutoTranslatable ? autoFlowId : manualFlowId,
                status_id: getStatusByCode(DocumentStatus.TO_BE_EDIT).id,
                language_code: experience.language_code,
              }
            );
          }),
          // create the required translation
          ...translationsToCreate.map((language) => {
            const isAutoTranslatable = automaticTranslationLanguages.has(
              language as AvailableLanguage
            );

            // if the translation is automatic we must supply
            // the english content so it can sent to the translation service
            const content = isAutoTranslatable ? englishTranslation.data : null;

            return postTranslation("experience-translations", {
              title: "",
              ...content,
              id: undefined,
              experience_id: experienceId,
              language_code: language,
              to_be_translated: isAutoTranslatable,
              curation_quality: false,
              status_id: getStatusByCode(DocumentStatus.TO_BE_EDIT).id,
              flow_id: isAutoTranslatable ? autoFlowId : manualFlowId,
            });
          }),
        ]);
      } catch (error) {
        addNotification({
          theme: "error",
          message: $t("notifications.error.saving.translations"),
        });
        throw error;
      }
    },
  },
});
