import { ExperienceContent } from "@/types/generated/ContentQueryApi";
import { AvailableLanguage } from "@/types/Language";

export function createMockContentQueryPayload(
  languages: Set<AvailableLanguage>
): ExperienceContent[] {
  const experiences = [];

  for (const language of languages) {
    experiences.push({
      experience_id: `${language}-experience-id`,
      language_code: language,
      experience_translation: {
        id: `id-translation-${language}`,
        name: "translation-name",
        title: "translation-title",
        flow_id: "translation-flow-id",
        status_id: "translation-status-id",
      },
      experience_media: {
        status_id: "media-status-id",
        flow_id: "media-flow-id",
        images: [
          {
            id: "image-id-1",
            name: "test-name-1.jpg",
            media_type: "test-media-type",
            is_cover: true,
            visualization_order: 1,
          },
          {
            id: "image-id-2",
            name: "test-name-2.jpg",
            media_type: "test-media-type",
            is_cover: false,
            visualization_order: 1,
          },
          {
            id: "image-id-3",
            name: "test-name-3.jpg",
            media_type: "test-media-type",
            is_cover: false,
            visualization_order: 2,
          },
          {
            id: "image-id-4",
            name: "test-name-4.jpg",
            media_type: "test-media-type",
            is_cover: false,
          },
        ],
      },
    });
  }

  return experiences;
}
