import MbtiFlow from "./mbti-flow";

export default async function MbtiPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  return <MbtiFlow initialStage={view === "result" ? "result" : "intro"} />;
}
