import { notFound } from "next/navigation";
import GopView from "@/components/navigator/gop-view";
import { buildGopUnis, getGop } from "@/lib/nav/server";

export default async function TeacherGopPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const g = getGop(code);
  if (!g) notFound();
  const { univ: _univ, ...info } = g;
  void _univ;
  return <GopView g={info} unis={buildGopUnis(g)} base="/teacher/handbook" savable={false} />;
}
