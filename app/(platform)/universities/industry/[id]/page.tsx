import { withPublishedContent } from "@/lib/cms/server";
import { previewRequest } from "@/lib/cms/page-preview";

import { getContent } from "@/lib/cms/server";
import { notFound } from "next/navigation";
import IndustryPage, { type GroupView } from "@/components/navigator/industry-view";
import { industryStats } from "@/lib/nav/industry-stats";
import { getDirectionDesc, getIndustryData, getProfessionDesc } from "@/lib/nav/server";
import { industries } from "@/lib/nav/types";

const cmsDefaults_industries = industries;

async function IndustryRoute({ params }: { params: Promise<{ id: string }> }) {
  const industries = getContent("nav-meta.industries", cmsDefaults_industries);
  const { id } = await params;
  const meta = industries[Number(id)];
  const data = meta ? getIndustryData(meta.name) : null;
  if (!meta || !data) notFound();

  const groups: GroupView[] = Object.entries(data.groups)
    .sort((a, b) => a[0].localeCompare(b[0], "ru"))
    .map(([name, g]) => ({
      name,
      about: getDirectionDesc(name)?.about ?? null,
      profs: Object.entries(g.profs)
        .sort((a, b) => a[0].localeCompare(b[0], "ru"))
        .map(([p, v]) => ({ name: p, desc: getProfessionDesc(p), ops: v.ops, uv: v.uv, uc: v.uc })),
    }));

  const {snapshot}=await previewRequest();
  const initialProfession=snapshot?.id.startsWith('profession.')?snapshot.id.slice(11):undefined;
  const initialGroup=snapshot?.id.startsWith('direction.')?snapshot.id.slice(10):groups.find(g=>g.profs.some(p=>p.name===initialProfession))?.name;
  return (
    <IndustryPage
      initialGroup={initialGroup} initialProfession={initialProfession}
      ind={{ name: meta.name, desc: meta.desc, c: meta.c, cl: meta.cl, stats: industryStats(meta.name), groups }}
    />
  );
}

export default withPublishedContent(IndustryRoute);
