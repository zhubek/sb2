import DebruceFlow from "./debruce-flow";

export default async function DebrucePage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  // view=industry — сразу к выбору отрасли (из отчёта), view=result — 10 навыков
  const stage =
    view === "industry" ? "industry" : view === "result" ? "result" : "intro";
  return <DebruceFlow initialStage={stage} />;
}
