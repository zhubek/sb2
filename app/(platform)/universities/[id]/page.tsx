import { notFound } from "next/navigation";
import InstitutionView, { type ViewGroup } from "@/components/navigator/institution-view";
import {
  collegeAgg,
  collegeProgramsOf,
  getDetail,
  getGop,
  getInstitution,
  getNoGop,
} from "@/lib/nav/server";

// Страница заведения: данные собираются на сервере из lib/nav/*.json
export default async function InstitutionPage({
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

  const groups: ViewGroup[] = [];
  if (d.kind === "v") {
    // Программы вуза, сгруппированные по ГОП
    const byGop = new Map<string, ViewGroup>();
    (detail.ops ?? []).forEach((o) => {
      const code = o.g ?? "";
      if (!byGop.has(code)) {
        const g = code ? getGop(code) : null;
        byGop.set(code, {
          code,
          name: g?.name ?? "Программы без ГОП",
          ind: g?.ind,
          dur: g?.dur,
          langs: g?.langs,
          ent: g?.ent,
          about: g?.about,
          fit: g?.fit,
          skills: g?.skills,
          format: g?.format,
          roles: g?.roles,
          notfor: g?.notfor,
          accent: g?.accent,
          tint: g?.tint,
          ops: [],
        });
      }
      byGop.get(code)!.ops.push({ code: o.code, name: o.name, p: o.p, t: o.t, e: o.e, l: o.l, dur: o.dur });
    });
    // Собственные программы вне ГОП
    const own = getNoGop(i);
    if (own.length) {
      byGop.set("__own", {
        code: "",
        name: "Собственные программы вуза",
        about: own[0]?.d?.about,
        fit: own[0]?.d?.fit,
        skills: own[0]?.d?.skills,
        format: own[0]?.d?.format,
        roles: own[0]?.d?.roles,
        notfor: own[0]?.d?.notfor,
        ops: own.map((o) => ({ code: o.code, name: o.name, p: o.p, t: o.t, l: o.l, dur: o.dur })),
      });
    }
    groups.push(...[...byGop.values()].sort((a, b) => a.name.localeCompare(b.name, "ru")));
  } else if (d.kind === "c") {
    // Программы колледжа по направлениям (языки и сроки — из агрегата)
    const byDir = new Map<string, ViewGroup>();
    const progs = (detail.ops ?? []).length ? detail.ops! : collegeProgramsOf(i);
    progs.forEach((o) => {
      const dir = (o as { g?: string }).g ?? "Другое";
      if (!byDir.has(dir)) byDir.set(dir, { code: "", name: dir, accent: "#0E8A6B", tint: "#ECF7F3", ops: [] });
      const agg = collegeAgg(o.code);
      const dur = agg ? [...new Set([...agg.d9, ...agg.d11])].join(" / ") : undefined;
      byDir.get(dir)!.ops.push({ code: o.code, name: o.name, l: agg?.l.join(", "), dur });
    });
    groups.push(...[...byDir.values()].sort((a, b) => a.name.localeCompare(b.name, "ru")));
  }

  return (
    <InstitutionView
      d={d}
      detail={detail}
      groups={groups}
      initialTab={tab === "programs" ? "programs" : "about"}
    />
  );
}
