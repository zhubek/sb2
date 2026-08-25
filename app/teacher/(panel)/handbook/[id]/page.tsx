import { notFound } from "next/navigation";
import InstitutionView from "@/components/navigator/institution-view";
import { buildInstitutionGroups, getDetail, getInstitution } from "@/lib/nav/server";

export default async function TeacherInstitutionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  const i = Number(id);
  const d = Number.isFinite(i) ? getInstitution(i) : null;
  const detail = d ? getDetail(i) : null;
  if (!d || !detail) notFound();

  return (
    <InstitutionView
      d={d}
      detail={detail}
      groups={buildInstitutionGroups(d)}
      initialTab={tab === "programs" ? "programs" : "about"}
      base="/teacher/handbook"
      savable={false}
    />
  );
}
