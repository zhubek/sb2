import { withPublishedContent } from "@/lib/cms/server";
import { notFound } from "next/navigation";
import { publishedTest } from "@/lib/cms/tests";
import DebruceFlow from "./debruce-flow";

async function DebrucePage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  if (!publishedTest("debruce")) notFound();
  const { view } = await searchParams;
  // view=industry — сразу к выбору отрасли (из отчёта), view=result — 10 навыков
  const stage =
    view === "industry" ? "industry" : view === "result" ? "result" : "intro";
  return <DebruceFlow initialStage={stage} />;
}

export default withPublishedContent(DebrucePage);
