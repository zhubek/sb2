export const contentOperations = {
  published: "query PublishedContent($locale: String) { publishedContent(locale: $locale) }",
  library:
    "query ContentLibrary($filter: JSON) { contentLibrary(filter: $filter) }",
  document:
    "query ContentDocument($id: String!, $locale: String) { contentDocument(id: $id, locale: $locale) { locale source translationPublished id title description group kind preview value published revision updatedAt publishedAt history references capabilities { canEdit canPublish canRestore } } }",
  edit: "mutation EditContent($input: JSON!) { editContent(input: $input) }",
  backup: "query ContentBackup { contentBackup }",
  import:
    "mutation ImportContentBackup($backup: JSON!) { importContentBackup(backup: $backup) }",
} as const;
