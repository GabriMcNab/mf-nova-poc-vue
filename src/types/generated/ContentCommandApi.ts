"use strict";
export type Error = { code?: string; message?: string };
export type StatusAllowed = Array<StatusId>;
export type Transitions = Array<Transition>;
export type Transition = {
  status_id?: StatusId;
  statuses_backward_allowed?: TransitionsArray;
  statuses_forward_allowed?: TransitionsArray;
};
export type TransitionFlow = {
  statuses_backward_allowed?: TransitionsArray;
  statuses_forward_allowed?: TransitionsArray;
};
export type FlowTransition = { flow_id: FlowId; status_id: StatusId };
export type Flow = {
  id: IdReadonly;
  category_id?: CategoryId;
  code: Code;
  status_allowed?: StatusAllowed;
  init_status: InitStatus;
  end_status: EndStatus;
  alternative_status?: AlternativeStatus;
  transitions?: Transitions;
};
export type CategoryMedia = {
  id?: IdReadonly;
  status_id?: StatusMedia;
  image_id?: IdMediaItem;
  category_id?: CategoryId;
};
export type MediaContentElement = {
  id?: IdReadonly;
  flow_id: FlowId;
  status_id: StatusId;
  published?: Published;
  images?: ImageIds;
};
export type ExperienceMedia = MediaContentElement & {
  experience_id?: ExperienceId;
  videos?: VideoIds;
  audios?: AudioIds;
};
export type EndStatus = string;
export type AlternativeStatus = string;
export type InitStatus = string;
export type TransitionsArray = Array<StatusId>;
export type TranslationElement = {
  id?: IdReadonly;
  creation_date?: CreationDate;
  updated_date?: UpdatedDate;
  language_code: LanguageCode;
  text1?: Description;
  name?: Name;
  automatic_translation?: AutomaticTranslation;
  to_be_translated?: ToBeTranslated;
};
export type OptionTranslation = TranslationElement & { option_id: OptionId };
export type ExperienceTranslation = TranslationElement & {
  flow_id: FlowId;
  title: Title;
  text2?: ShortDescription;
  text3?: MediumDescription;
  info_voucher?: InfoVoucher;
  seo_title?: SeoTitle;
  seo_description?: SeoDescription;
  experience_id: ExperienceId;
  status_id: StatusId;
  curation_quality?: CurationQuality;
};
export type CategoryTranslation = TranslationElement & {
  category_id?: CategoryId;
};
export type ImageIds = Array<MediaItem>;
export type MediaItem = {
  id?: IdMediaItem;
  visualization_order?: VisualizationOrder;
  is_cover?: IsCover;
};
export type AudioIds = Array<MediaItem>;
export type VideoIds = Array<MediaItem>;
export type Image = MediaElement & { dynamic_rendition?: DynamicRendition };
export type Audio = MediaElement & { duration?: Duration; player?: Player };
export type Video = MediaElement & {
  duration?: Duration;
  embed_code?: EmbedCode;
};
export type MediaElement = {
  id?: IdReadonly;
  flow_id: FlowId;
  creation_date?: CreationDate;
  updated_date?: UpdatedDate;
  name: Name;
  media_type: MediaType;
  url?: UrlS3;
  width?: Width;
  height?: Height;
  size?: Size;
  status_id: StatusId;
  copyright_id?: CopyrightId;
  supplier_id: SupplierId;
};
export type Copyright = {
  id?: IdReadonly;
  owner: Owner;
  name: Name;
  datetime?: Datetime;
  signature: Signature;
  supplier_id: SupplierId;
};
export type ExperienceCommercialContent = {
  id?: IdReadonly;
  supplier_id?: SupplierId;
  experience_id: ExperienceId;
  experience_translations?: Array<ExperienceTranslationItem>;
  experience_media_id?: ExperienceMediaId;
  category_media_id?: CategoryMediaId;
  published?: Published;
};
export type ExperienceTranslationItem = { id: Id; language_code: LanguageCode };
export type CustomIncluded = {
  id: string;
  experience_id: ExperienceId;
  code?: string;
  language_code: string;
  name: string;
  description?: string;
  automatic_translation?: AutomaticTranslation;
  to_be_translated?: ToBeTranslated;
  visualization_order?: VisualizationOrder;
  flow_id: FlowId;
  status_id: StatusId;
  creation_date?: CreationDate;
  updated_date?: UpdatedDate;
};
export type CustomNonIncluded = {
  id: string;
  experience_id: ExperienceId;
  code?: string;
  language_code: string;
  name: string;
  description?: string;
  automatic_translation?: AutomaticTranslation;
  to_be_translated?: ToBeTranslated;
  visualization_order?: VisualizationOrder;
  flow_id: FlowId;
  status_id: StatusId;
  creation_date?: CreationDate;
  updated_date?: UpdatedDate;
};
export type CustomHighlights = {
  id: string;
  experience_id: ExperienceId;
  code?: string;
  language_code: string;
  name: string;
  description?: string;
  automatic_translation?: AutomaticTranslation;
  to_be_translated?: ToBeTranslated;
  visualization_order?: VisualizationOrder;
  flow_id: FlowId;
  status_id: StatusId;
  creation_date?: CreationDate;
  updated_date?: UpdatedDate;
};
export type CustomImportantInformation = {
  id: string;
  experience_id: ExperienceId;
  code?: string;
  language_code: string;
  name: string;
  description?: string;
  automatic_translation?: AutomaticTranslation;
  to_be_translated?: ToBeTranslated;
  visualization_order?: VisualizationOrder;
  flow_id: FlowId;
  status_id: StatusId;
  creation_date?: CreationDate;
  updated_date?: UpdatedDate;
};
export type OptionId = string;
export type EmbedCode = string;
export type Player = string;
export type Duration = number;
export type DynamicRendition = boolean;
export type Width = number;
export type Height = number;
export type Size =
  | "SMALL"
  | "MEDIUM"
  | "BIG"
  | "EXTRA_LARGE"
  | "LPP"
  | "DYNAMIC";
export type ContentFile = string;
export type UrlS3 = string;
export type VisualizationOrder = number;
export type IsCover = boolean;
export type MediaType = string;
export type Description = string;
export type ShortDescription = string;
export type MediumDescription = string;
export type InfoVoucher = string;
export type SeoTitle = string;
export type SeoDescription = string;
export type Name = string;
export type Owner = string;
export type Datetime = string;
export type CreationDate = string;
export type UpdatedDate = string;
export type Signature = boolean;
export type ExperienceId = string;
export type CategoryId = string;
export type Code = string;
export type StatusMedia = string;
export type Published = boolean;
export type StatusId = string;
export type AutomaticTranslation = boolean;
export type ToBeTranslated = boolean;
export type CurationQuality = boolean;
export type Title = string;
export type IdReadonly = string;
export type IdMediaItem = string;
export type FlowId = string;
export type LanguageCode = string;
export type Id = string;
export type SupplierId = string;
export type CopyrightId = string;
export type CategoryMediaId = string;
export type ExperienceMediaId = string;
