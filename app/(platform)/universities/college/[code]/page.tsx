import { withPublishedContent } from "@/lib/cms/server";
import { notFound } from "next/navigation";
import CollegeProgramView from "@/components/navigator/college-view";
import { buildCollegeView } from "@/lib/nav/server";

async function CollegeProgramPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const p = buildCollegeView(code);
  if (!p) notFound();
  return <CollegeProgramView p={p} />;
}

export default withPublishedContent(CollegeProgramPage);
