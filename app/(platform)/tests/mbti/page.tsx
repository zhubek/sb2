import { withPublishedContent } from "@/lib/cms/server";
import { notFound } from "next/navigation";
import { publishedTest } from "@/lib/cms/tests";
import MbtiFlow from "./mbti-flow";

async function MbtiPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  if (!publishedTest("mbti")) notFound();
  const { view } = await searchParams;
  return <MbtiFlow initialStage={view === "result" ? "result" : "intro"} />;
}

export default withPublishedContent(MbtiPage);
