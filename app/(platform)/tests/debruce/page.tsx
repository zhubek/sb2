import DebruceFlow from "./debruce-flow";

export default async function DebrucePage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  return <DebruceFlow initialStage={view === "result" ? "result" : "intro"} />;
}
