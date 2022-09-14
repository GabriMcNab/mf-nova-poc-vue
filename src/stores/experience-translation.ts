import { defineStore } from "pinia";
import builder from "@rsql/builder";
import { emit } from "@rsql/emitter";
import { useMasterData } from "@/stores/master-data";
import { useNotifications } from "@/stores/notifications";
import { useContentCommandApi } from "@/composables/useContentCommandApi";
import { ExperienceTranslation } from "@/types/generated/ContentCommandApi";
import { AvailableLanguage } from "@/types/Language";
import { DocumentStatus, DocumentFlow } from "@/types/DocumentStatuses";

type FormField<T> = {
  value: T;
  category: "experience_settings" | "experience_info" | "voucher";
};

export type RequiredField =
  | "title"
  | "seo_title"
  | "description"
  | "seo_description";

type SetRequired<A, K extends string> = {
  [property in keyof A]: {
    value: A[property]["value" & keyof A[property]];
    category: A[property]["category" & keyof A[property]];
    required: property extends K ? true : false;
  };
};

interface ExperienceTranslationFormBase {
  title: FormField<string>;
  seo_title: FormField<string>;
  description: FormField<string>;
  seo_description: FormField<string>;
  info_voucher: FormField<string>;
}

export type ExperienceTranslationForm = SetRequired<
  ExperienceTranslationFormBase,
  RequiredField
>;

export interface ExperienceTranslationStateDocument {
  fields: ExperienceTranslationForm;
  modified: boolean;
  name?: string;
  data: ExperienceTranslation;
}

export interface ExperienceTranslationState {
  translationDocuments: {
    [languageCode in AvailableLanguage]: {
      [experienceId: string]: ExperienceTranslationStateDocument;
    };
  };
}

export const mapPayloadToForm = (
  translation: ExperienceTranslation
): ExperienceTranslationForm => {
  return {
    title: {
      value: translation.title,
      required: true,
      category: "experience_settings",
    },
    seo_title: {
      value: translation.seo_title ?? "",
      required: true,
      category: "experience_settings",
    },
    description: {
      value: translation.text1 ?? "",
      required: true,
      category: "experience_info",
    },
    seo_description: {
      value: translation.seo_description ?? "",
      required: true,
      category: "experience_info",
    },
    info_voucher: {
      value: translation.info_voucher ?? "",
      required: false,
      category: "voucher",
    },
  };
};

export const mapFormToPayload = (
  document: ExperienceTranslationStateDocument
) => {
  return {
    language_code: document.data.language_code,
    experience_id: document.data.experience_id,
    title: document.fields.title.value,
    info_voucher: document.fields.info_voucher.value,
    seo_title: document.fields.seo_title.value,
    seo_description: document.fields.seo_description.value,
    text1: document.fields.description.value,
    curation_quality: false,
  };
};

export const useExperienceTranslation = defineStore("experience-translation", {
  state: (): ExperienceTranslationState => ({
    translationDocuments: {
      en: {},
      es: {},
      it: {},
      de: {},
      fr: {},
      nl: {},
      pl: {},
      pt: {},
      ru: {},
      dk: {},
      no: {},
      fi: {},
      se: {},
    },
  }),
  getters: {
    getTranslation:
      (state) => (experienceId: string, languageCode: AvailableLanguage) => {
        const { addNotification } = useNotifications();
        try {
          const document =
            state.translationDocuments[languageCode][experienceId];

          if (!document) {
            throw new Error(
              `Translation document ${experienceId}/${languageCode} is not loaded into the store. Remember to use "loadTranslationDocument" first.`
            );
          }

          return document;
        } catch (error) {
          addNotification({
            theme: "error",
            message: "notifications.error.fetching.single.translation",
          });
          throw error;
        }
      },
  },
  actions: {
    async loadTranslationDocument(translationId: string) {
      const { getTranslation } = useContentCommandApi();
      const { addNotification } = useNotifications();

      const translation = getTranslation<ExperienceTranslation>(
        `experience-translations/${translationId}`
      );

      await translation
        .then(({ data }) => {
          this.translationDocuments[data.language_code as AvailableLanguage][
            data.experience_id
          ] = {
            modified: false,
            fields: mapPayloadToForm(data),
            data,
          };
        })
        .catch((error) => {
          addNotification({
            theme: "error",
            message: "notifications.error.fetching.single.translation",
          });
          throw error;
        });
    },
    async loadExperienceTranslation(
      experienceId: string,
      languageCode: AvailableLanguage
    ) {
      const { getTranslations } = useContentCommandApi();
      const { addNotification } = useNotifications();

      const params = {
        filters: emit(builder.eq("experience_id", experienceId)),
        language_code: languageCode,
      };

      try {
        const { data } = await getTranslations<ExperienceTranslation[]>(
          "experience-translations",
          { params }
        );

        if (data.length === 0) {
          throw new Error(
            `Could not find any translations for experience ${experienceId} in language ${languageCode}`
          );
        }

        data.forEach((translation) => {
          this.translationDocuments[languageCode][experienceId] = {
            modified: false,
            fields: mapPayloadToForm(translation),
            name: translation.name,
            data: translation,
          };
        });
      } catch (error) {
        addNotification({
          theme: "error",
          message: "notifications.error.fetching.multiple.translations",
        });
        throw error;
      }
    },
    async updateExperienceTranslation(
      experienceId: string,
      languageCode: AvailableLanguage
    ) {
      const document = this.translationDocuments[languageCode][experienceId];

      const { putTranslation } = useContentCommandApi();
      const { addNotification } = useNotifications();
      const { getStatusByCode, getFlowByCode } = useMasterData();

      const status = getStatusByCode(DocumentStatus.IN_REVIEW);
      const flow = getFlowByCode(DocumentFlow.MANUAL_TRANSLATION);

      const payload: ExperienceTranslation = {
        ...mapFormToPayload(document),
        // if updated/saved from the frontend,
        // it's not an automatic translation anymore
        automatic_translation: false,
        to_be_translated: false,
        status_id: status.id,
        flow_id: flow.id,
      };

      await putTranslation(
        `experience-translations/${document.data.id}`,
        payload
      )
        .then(() => {
          this.translationDocuments[languageCode][experienceId].modified =
            false;
          // workaround - used to show the correct status but is not synched with the document
          this.translationDocuments[languageCode][experienceId].data.status_id =
            status.id;
          this.translationDocuments[languageCode][experienceId].data.flow_id =
            flow.id;
          addNotification({
            theme: "success",
            message: "notifications.success.saving.single.translation",
          });
        })
        .catch((error) => {
          addNotification({
            theme: "error",
            message: "notifications.error.saving.single.translation",
          });
          throw error;
        });
    },
  },
});
