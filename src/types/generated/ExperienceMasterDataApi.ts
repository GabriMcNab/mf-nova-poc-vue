"use strict";
export type Error = { code?: string; message?: string };
export type CategoryGroupType = {
  id: string;
  code: string;
  name: string;
  description?: string;
  language_code: string;
};
export type Included = {
  id: string;
  code: string;
  name: string;
  description?: string;
  language_code: string;
};
export type Highlights = {
  id: string;
  code: string;
  name: string;
  description?: string;
  language_code: string;
};
export type ImportantInformation = {
  id: string;
  code: string;
  name: string;
  description?: string;
  language_code: string;
};
export type CategoryType = {
  id: string;
  category_group_id: string;
  code: string;
  name: string;
  description?: string;
  language_code: string;
};
export type ExperienceStatus = {
  id: string;
  name: string;
  description?: string;
};
export type ExperienceType = { id: string; name: string; description?: string };
export type CapacityType = { id: string; name: string; description?: string };
export type OptionStatus = { id: string; name: string; description?: string };
export type Holder = { id: string; name: string; description?: string };
export type OptionLanguage = { id: string; name: string; description?: string };
export type AdditionalService = {
  id: string;
  code: string;
  name: string;
  description?: string;
  language_code: string;
};
