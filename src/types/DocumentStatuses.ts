export enum DocumentFlow {
  RAW = "RAW",
  CURATION = "CURATION",
  MANUAL_TRANSLATION = "MANUAL_TRANSLATION",
  AUTOTRANSLATION = "AUTOTRANSLATION",
  MEDIA = "MEDIA",
}

export enum DocumentStatus {
  DRAFT = "DRAFT", // "In creation" in the frontend
  TO_BE_EDIT = "TO_BE_EDIT",
  IN_REVIEW = "IN_REVIEW",
  PUBLISHED = "PUBLISHED",
}
