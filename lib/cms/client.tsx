"use client";
import { createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import { resolveContent } from "./resolve";
import type { Values } from "./types";

import type { ContentLocale } from "@/backend/src/modules/content/domain/localization";
const LocaleContext = createContext<ContentLocale>("ru");
export function useContentLocale() { return useContext(LocaleContext); }
const Context = createContext<Values>({});
const PreviewPathContext=createContext<string|null>(null);
export function useContentPathname() {const preview=useContext(PreviewPathContext),pathname=usePathname();return preview??pathname;}
export function ContentProvider({ values, children, locale = "ru", previewPath=null }: { values: Values; children: React.ReactNode; locale?: ContentLocale; previewPath?:string|null }) {
  return <PreviewPathContext.Provider value={previewPath}><LocaleContext.Provider value={locale}><Context.Provider value={values}>{children}</Context.Provider></LocaleContext.Provider></PreviewPathContext.Provider>;
}
export function useContent<T>(id: string, fallback: T): T {
  return resolveContent(useContext(Context), id, fallback);
}
export function useCopy(group: string) {
  const values=useContext(Context);
  return (key:string,fallback:string)=>resolveContent(values,`${group}.${key}`,fallback);
}
export function ContentText({ id, fallback }: { id: string; fallback: string }) {
  return <>{useContent(id, fallback)}</>;
}
