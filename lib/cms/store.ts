import "server-only";
import { previewRequest } from "./page-preview";
import { landingLanguage } from "@/backend/src/modules/content/domain/localization";
import { contentLocale } from "./locale";
import { graphql } from "../graphql/server";
import { contentOperations } from "../../features/content/graphql/operations";
import { projectPrograms } from "./programs";
import type { Store, Values } from "./types";
// Compatibility facade. PostgreSQL in Nest is the only writable content store.
export async function readStore(): Promise<Store> {
  return (await graphql<{ contentBackup: Store }>(contentOperations.backup))
    .contentBackup;
}
export async function publishedValues(locale?: string): Promise<Values> {
  const { snapshot } = await previewRequest();
  const language=locale ?? snapshot?.locale ?? await contentLocale();
  const values=(await graphql<{publishedContent:Values}>(contentOperations.published,{locale:language},undefined,true)).publishedContent;
  if (snapshot) values[snapshot.id]=snapshot.id.startsWith('landing.')?landingLanguage(snapshot.value,snapshot.locale,snapshot.locale!=='ru'):snapshot.value;
  return projectPrograms(values);
}
