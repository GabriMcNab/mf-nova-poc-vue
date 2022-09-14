"use strict";
export type Error = { code?: string; message?: string };
export type Title = string;
export type Description = string;
export type Highlights = Array<string>;
export type Included = Array<string>;
export type NonIncluded = Array<string>;
export type ImportantInformation = Array<string>;
export type InfoVoucher = string;
export type Option = { code: string; description: string };
export type FunctionalRaw = {
  asterix_id?: AsterixId;
  core_id?: CoreId;
  options?: Array<Option>;
  highlights?: Highlights;
  included?: Included;
  non_included?: NonIncluded;
  important_information?: ImportantInformation;
  additional_services?: Array<string>;
};
export type CommercialRaw = {
  title: Title;
  description?: Description;
  info_voucher?: InfoVoucher;
  custom_highlights?: Array<CustomHighlights>;
  custom_included?: Array<CustomIncluded>;
  custom_non_included?: Array<CustomNonIncluded>;
  custom_important_information?: Array<CustomImportantInformation>;
};
export type RawElement = {
  id?: Id;
  go_commercial?: GoCommercial;
  functional?: FunctionalRaw;
  commercial: CommercialRaw;
  supplier_id?: SupplierId;
  creation_date?: CreationDate;
  updated_date?: UpdatedDate;
};
export type CustomIncluded = {
  code?: string;
  name: string;
  description?: string;
};
export type CustomNonIncluded = {
  code?: string;
  name: string;
  description?: string;
};
export type CustomHighlights = {
  code?: string;
  name: string;
  description?: string;
};
export type CustomImportantInformation = {
  code?: string;
  name: string;
  description?: string;
};
export type SupplierId = string;
export type Id = string;
export type GoCommercial = boolean;
export type AsterixId = string;
export type CoreId = string;
export type CreationDate = string;
export type UpdatedDate = string;
