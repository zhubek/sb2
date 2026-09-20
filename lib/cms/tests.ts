import "server-only";
import { defaultTests } from "./test-defaults";
import { getContent } from "./server";
import type { TestContent } from "./types";
export function publishedTests(): TestContent[] {
  const defaults=defaultTests.map(t=>getContent(`test.${t.slug}`,t) as unknown as TestContent);
  return defaults.filter(t=>t.enabled);
}
export function publishedTest(slug:string) {return publishedTests().find(t=>t.slug===slug);}
