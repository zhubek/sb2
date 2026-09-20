import { withPublishedContent } from "@/lib/cms/server";
import { notFound } from "next/navigation";
import { publishedTest } from "@/lib/cms/tests";
import HollandFlow from "./holland-flow";

async function HollandPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  if (!publishedTest("holland")) notFound();
  const { view } = await searchParams;
  return <HollandFlow initialStage={view === "result" ? "result" : "intro"} />;
}

export default withPublishedContent(HollandPage);
