"use strict";
export type Error = { code?: string; message?: string };
export type ExperiencesSustainability = {
  id?: string;
  experience_id: string;
  creation_date?: CreationDate;
  updated_date?: UpdatedDate;
  sustainability: Array<
    | "ANIMAL_WELFARE"
    | "LOCAL_FOOD"
    | "CHARITY"
    | "ACCESSIBILITY"
    | "ENVIRONMENTAL"
    | "LOCAL_PRODUCTS"
    | "HISTORICAL_SITE"
    | "NATURAL_AREA"
    | "SUSTAINABLE_TRANSPORT"
  >;
};
export type ExperienceHighlights = {
  id?: string;
  experience_id: string;
  highlights: Array<string>;
  creation_date?: CreationDate;
  updated_date?: UpdatedDate;
};
export type ExperienceIncluded = {
  id?: string;
  experience_id: string;
  included: Array<string>;
  creation_date?: CreationDate;
  updated_date?: UpdatedDate;
};
export type ExperienceNonIncluded = {
  id?: string;
  experience_id: string;
  non_included: Array<string>;
  creation_date?: CreationDate;
  updated_date?: UpdatedDate;
};
export type ExperienceImportantInformation = {
  id?: string;
  experience_id: string;
  important_information?: Array<string>;
  creation_date?: CreationDate;
  updated_date?: UpdatedDate;
};
export type ExperienceAdditionalService = {
  id?: string;
  experience_id: string;
  additional_services: Array<string>;
  creation_date?: CreationDate;
  updated_date?: UpdatedDate;
};
export type QuestionsItems = {
  id?: string;
  experience_id?: string;
  creation_date?: CreationDate;
  updated_date?: UpdatedDate;
  location: string;
  question_id: string;
  question_type: string;
  order: number;
  required: boolean;
};
export type CreationDate = string;
export type UpdatedDate = string;
