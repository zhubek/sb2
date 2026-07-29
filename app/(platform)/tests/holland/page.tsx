import HollandFlow from "./holland-flow";

export default async function HollandPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  return <HollandFlow initialStage={view === "result" ? "result" : "intro"} />;
}
