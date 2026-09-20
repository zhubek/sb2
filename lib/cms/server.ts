import "server-only";
import { AsyncLocalStorage } from "node:async_hooks";
import { cache, type ReactNode } from "react";
import { publishedValues } from "./store";
import { projectPrograms } from "./programs";
import { resolveContent } from "./resolve";
import { defaultTests } from "./test-defaults";
import type { Values } from "./types";
const loadValues = cache(async () => ({
  ...(Object.fromEntries(
    defaultTests.map((t) => ["test." + t.slug, t]),
  ) as unknown as Values),
  ...(await publishedValues()),
}));
const contentContext = new AsyncLocalStorage<Values>();
export function withPublishedContent<P>(
  render: (props: P) => ReactNode | Promise<ReactNode>,
) {
  return async function ContentPage(props: P) {
    return contentContext.run(await loadValues(), () => render(props));
  };
}
export async function withPreview<T>(values: Values, fn: () => T, locale?: string): Promise<T> {
  return contentContext.run(
    projectPrograms({ ...(locale ? await publishedValues(locale) : await loadValues()), ...values }),
    fn,
  );
}
export function getContent<T>(id: string, fallback: T): T {
  const values = contentContext.getStore();
  if (!values)
    throw new Error("Wrap server content consumers in withPublishedContent");
  return resolveContent(values, id, fallback);
}
export function getCopy(group: string) {
  return (key: string, fallback: string) =>
    getContent(group + "." + key, fallback);
}
