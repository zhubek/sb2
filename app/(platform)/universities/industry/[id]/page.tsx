import { notFound } from "next/navigation";
import IndustryPage, { type GroupView } from "@/components/navigator/industry-view";
import { industryStats } from "@/lib/nav/industry-stats";
import { getDirectionDesc, getIndustryData, getProfessionDesc } from "@/lib/nav/server";
import { industries } from "@/lib/nav/types";

export default async function IndustryRoute({ params }: { params: Promise<{ id: string }> }) {
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

  return (
    <IndustryPage
      ind={{ name: meta.name, desc: meta.desc, c: meta.c, cl: meta.cl, stats: industryStats(meta.name), groups }}
    />
  );
}
