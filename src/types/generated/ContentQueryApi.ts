"use strict";
export type Error = { code: string; message?: string };
export type Images = Array<Image>;
export type Videos = Array<Video>;
export type Audios = Array<Audio>;
export type ExperienceContent = {
  supplier_id?: SupplierId;
  experience_id: ExperienceId;
  language_code: LanguageCode;
  experience_media?: ExperienceMedia;
  experience_translation?: ExperienceTranslation;
  option_translations?: OptionTranslationArray;
  published?: Published;
};
export type ExperienceMedia = {
  flow_id?: FlowId;
  status_id?: StatusId;
  images?: Images;
  videos?: Videos;
  audios?: Audios;
};
export type ExperienceShortContent = {
  experience_id?: ExperienceId;
  language_code?: LanguageCode;
  title?: Title;
  text2?: ShortDescription;
  cover_image_url?: UrlS3;
  experience_content_complete?: UrlContentComplete;
  published?: Published;
};
export type ExperienceTranslation = {
  id?: Id;
  creation_date?: CreationDate;
  updated_date?: UpdatedDate;
  name: Name;
  text1?: Description;
  text2?: ShortDescription;
  text3?: MediumDescription;
  title: Title;
  info_voucher?: InfoVoucher;
  automatic_translation?: AutomaticTranslation;
  to_be_translated?: ToBeTranslated;
  curation_quality?: CurationQuality;
  status_id: StatusId;
  flow_id: FlowId;
};
export type OptionTranslationArray = Array<OptionTranslation>;
export type OptionTranslation = {
  id?: Id;
  option_id?: OptionId;
  creation_date?: CreationDate;
  updated_date?: UpdatedDate;
  name?: Name;
  text1?: Description;
  automatic_translation?: AutomaticTranslation;
  to_be_translated?: ToBeTranslated;
};
export type Raw = {
  id?: Id;
  supplier_id?: SupplierId;
  go_commercial?: GoCommercial;
  creation_date?: CreationDate;
  updated_date?: UpdatedDate;
  functional?: FunctionalRaw;
  commercial: CommercialRaw;
};
export type FunctionalRaw = {
  asterix_id?: AsterixId;
  core_id?: CoreId;
  highlights?: Highlights;
  included?: Included;
  non_included?: NonIncluded;
  important_information?: ImportantInformation;
};
export type CommercialRaw = {
  title: Title;
  description?: Description;
  info_voucher?: InfoVoucher;
};
export type Highlights = Array<{ id?: Id; name?: NameHighlight }>;
export type Included = Array<{ id?: Id; name?: NameIncluded }>;
export type NonIncluded = Array<{ id?: Id; name?: NameExcluded }>;
export type ImportantInformation = Array<{
  id?: Id;
  name?: NameImportantInformation;
}>;
export type GoCommercial = boolean;
export type Id = string;
export type CopyrightId = string;
export type StatusId = string;
export type FlowId = string;
export type AsterixId = string;
export type CoreId = string;
export type CreationDate = string;
export type UpdatedDate = string;
export type UrlS3 = string;
export type UrlContentComplete = string;
export type Description = string;
export type ShortDescription = string;
export type MediumDescription = string;
export type Title = string;
export type InfoVoucher = string;
export type AutomaticTranslation = boolean;
export type ToBeTranslated = boolean;
export type CurationQuality = boolean;
export type LanguageCode = string;
export type EmbedCode = string;
export type Player = string;
export type Duration = number;
export type Width = number;
export type Height = number;
export type Size =
  | "SMALL"
  | "MEDIUM"
  | "BIG"
  | "EXTRA_LARGE"
  | "LPP"
  | "DYNAMIC";
export type VisualizationOrder = number;
export type MediaType = string;
export type IsCover = boolean;
export type SupplierId = string;
export type ExperienceId = string;
export type OptionId = string;
export type NameHighlight = string;
export type NameIncluded = string;
export type NameExcluded = string;
export type NameImportantInformation = string;
export type Name = string;
export type Published = boolean;
export type Image = Media & {};
export type Audio = Media & ExperienceAudiosExtension & {};
export type Video = Media & ExperienceVideosExtension & {};
export type Media = {
  id: Id;
  creation_date?: CreationDate;
  updated_date?: UpdatedDate;
  flow_id?: FlowId;
  copyright_id?: CopyrightId;
  status_id?: StatusId;
  name: Name;
  media_type: MediaType;
  url?: UrlS3;
  width?: Width;
  height?: Height;
  size?: Size;
  visualization_order?: VisualizationOrder;
  is_cover?: IsCover;
};
export type ExperienceAudiosExtension = {
  duration?: Duration;
  player?: Player;
};
export type ExperienceVideosExtension = {
  duration?: Duration;
  embed_code?: EmbedCode;
};
