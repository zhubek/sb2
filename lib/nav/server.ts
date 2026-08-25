// Серверные данные навигатора: описания заведений, ГОП и отраслей (тяжёлые
// JSON не попадают в клиентский бандл)
import "server-only";
import details from "./details.json";
import gops from "./gops.json";
import industriesData from "./industries.json";
import institutions from "./institutions.json";
import nogop from "./nogop.json";
import collegePrograms from "./college-programs.json";
import { type NavInst, industries } from "./types";
import type { ViewGroup } from "@/components/navigator/institution-view";
import type { GopUni } from "@/components/navigator/gop-view";
import type { CollegeView } from "@/components/navigator/college-view";

export interface InstOp {
  code: string;
  name: string;
  p?: number | null;
  t?: number | null;
  e?: string[];
  l?: string;
  g?: string; // код ГОП
  dur?: number;
}

export interface InstDetail {
  about: string;
  addr?: string | null;
  phone?: string | null;
  email?: string | null;
  site?: string | null;
  ig?: string | null;
  ops?: InstOp[];
  // зарубежные
  spec?: string | null;
  priceTxt?: string | null;
  lang?: string | null;
  docs?: string | null;
}

export interface GopOp {
  code: string;
  o: string;
  p: number | null;
  g: number | null;
}

export interface Gop {
  code: string;
  name: string;
  ind: string;
  no: number;
  nu: number;
  ent?: string;
  about?: string;
  fit?: string;
  skills?: string;
  format?: string;
  roles?: string;
  notfor?: string;
  accent?: string;
  accentB?: string;
  tint?: string;
  langs?: string[];
  dur?: string;
  univ: Record<string, { k: number; ops: GopOp[] }>;
}

export interface NoGopOp {
  code: string;
  name: string;
  p: number | null;
  t: number | null;
  l?: string;
  dur?: number;
  ind?: string;
  d?: { about?: string; fit?: string; skills?: string; format?: string; roles?: string; notfor?: string };
}

export interface ProfOp {
  code: string;
  name: string;
  v: number;
  c: number;
}
export interface IndustryData {
  groups: Record<string, { profs: Record<string, { ops: ProfOp[]; uv?: number; uc?: number }> }>;
  v: { code: string; name: string; g: string; unis: number[]; cities: string[] }[];
  c: { code: string; name: string; g: string; cols: number[]; regs: string[] }[];
}
export interface DirectionDesc {
  ind: string;
  about?: string;
  fit?: string;
  skills?: string;
  format?: string;
  roles?: string;
  notfor?: string;
}

const instList = institutions as unknown as NavInst[];
const gopList = gops as unknown as Gop[];
const nogopMap = nogop as unknown as Record<string, NoGopOp[]>;
const indData = industriesData as unknown as { ind: Record<string, IndustryData>; TD: Record<string, DirectionDesc>; pd: Record<string, string> };
const cprog = collegePrograms as unknown as { programs: { code: string; name: string; g: string; ind: number; cols: number[] }[]; agg: Record<string, { l: string[]; d9: string[]; d11: string[] }> };

export function getInstitution(i: number) {
  return instList.find((x) => x.i === i) ?? null;
}
export function getDetail(i: number): InstDetail | null {
  return (details as unknown as Record<string, InstDetail>)[String(i)] ?? null;
}
export function getGop(code: string) {
  return gopList.find((g) => g.code === code) ?? null;
}
export function allGops() {
  return gopList;
}
export function getNoGop(i: number) {
  return nogopMap[String(i)] ?? [];
}
export function getIndustryData(name: string) {
  return indData.ind[name] ?? null;
}
export function getDirectionDesc(g: string) {
  return indData.TD[g] ?? null;
}
export function getProfessionDesc(p: string) {
  return indData.pd[p] ?? null;
}
export function collegeAgg(code: string) {
  return cprog.agg[code] ?? null;
}
export function collegeProgramsOf(i: number) {
  return cprog.programs.filter((p) => p.cols.includes(i));
}

export function getCollegeProgram(code: string) {
  return cprog.programs.find((p) => p.code === code) ?? null;
}

// Программы заведения, сгруппированные для страницы: вуз — по ГОП (остальные —
// по отраслям), колледж — по направлениям с описанием направления
export function buildInstitutionGroups(d: NavInst): ViewGroup[] {
  const groups: ViewGroup[] = [];
  const detail = getDetail(d.i);
  if (d.kind === "v") {
    const byGop = new Map<string, ViewGroup>();
    (detail?.ops ?? []).forEach((o) => {
      const code = o.g ?? "";
      if (!byGop.has(code)) {
        const g = code ? getGop(code) : null;
        byGop.set(code, {
          code,
          label: code ? `ГОП ${code}` : "Программы",
          name: g?.name ?? "Программы без группы",
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
    // Программы вне ГОП — по отраслям (без отдельной «собственной» категории)
    const byInd = new Map<string, ViewGroup>();
    getNoGop(d.i).forEach((o) => {
      const ind = o.ind ?? "Другие направления";
      if (!byInd.has(ind)) {
        const meta = industries.find((x) => x.name === ind);
        byInd.set(ind, {
          code: "",
          label: "Отрасль",
          name: ind,
          about: o.d?.about,
          fit: o.d?.fit,
          skills: o.d?.skills,
          format: o.d?.format,
          roles: o.d?.roles,
          notfor: o.d?.notfor,
          accent: meta?.c,
          tint: meta?.cl,
          ops: [],
        });
      }
      byInd.get(ind)!.ops.push({ code: o.code, name: o.name, p: o.p, t: o.t, l: o.l, dur: o.dur });
    });
    groups.push(
      ...[...byGop.values()].sort((a, b) => a.name.localeCompare(b.name, "ru")),
      ...[...byInd.values()].sort((a, b) => a.name.localeCompare(b.name, "ru"))
    );
  } else if (d.kind === "c") {
    const byDir = new Map<string, ViewGroup>();
    const progs = (detail?.ops ?? []).length ? detail!.ops! : collegeProgramsOf(d.i);
    progs.forEach((o) => {
      const dir = (o as { g?: string }).g ?? "Другое";
      if (!byDir.has(dir)) {
        const td = getDirectionDesc(dir);
        const meta = td ? industries.find((x) => x.name === td.ind) : undefined;
        byDir.set(dir, {
          code: "",
          label: "Направление",
          name: dir,
          ind: meta?.short,
          about: td?.about,
          fit: td?.fit,
          skills: td?.skills,
          format: td?.format,
          roles: td?.roles,
          notfor: td?.notfor,
          accent: "#0E8A6B",
          tint: "#ECF7F3",
          ops: [],
        });
      }
      const agg = collegeAgg(o.code);
      const dur = agg ? [...new Set([...agg.d9, ...agg.d11])].join(" / ") : undefined;
      byDir.get(dir)!.ops.push({ code: o.code, name: o.name, l: agg?.l.join(", "), dur });
    });
    groups.push(...[...byDir.values()].sort((a, b) => a.name.localeCompare(b.name, "ru")));
  }
  return groups;
}

// Вузы, где есть программы ГОП
export function buildGopUnis(g: Gop): GopUni[] {
  return Object.entries(g.univ)
    .map(([ui, u]) => {
      const d = getInstitution(Number(ui));
      if (!d) return null;
      const ps = u.ops.map((o) => o.p).filter((x): x is number => x != null);
      const gs = u.ops.map((o) => o.g).filter((x): x is number => x != null);
      return { d, k: u.k, p: ps.length ? Math.min(...ps) : null, g: gs.length ? Math.min(...gs) : null };
    })
    .filter((x): x is GopUni => x !== null)
    .sort((a, b) => b.k - a.k);
}

// Специальность колледжа: код, направление с описанием, сроки, языки и колледжи
export function buildCollegeView(code: string): CollegeView | null {
  const p = getCollegeProgram(code);
  if (!p) return null;
  const agg = collegeAgg(code);
  const td = getDirectionDesc(p.g);
  const cols = p.cols
    .map((i) => getInstitution(i))
    .filter((d): d is NavInst => d !== null)
    .sort((a, b) => a.city.localeCompare(b.city, "ru") || a.name.localeCompare(b.name, "ru"));
  return {
    code: p.code,
    name: p.name,
    dir: p.g,
    ind: industries[p.ind]?.name ?? td?.ind ?? "",
    langs: agg?.l ?? [],
    d9: agg?.d9 ?? [],
    d11: agg?.d11 ?? [],
    about: td?.about,
    fit: td?.fit,
    skills: td?.skills,
    format: td?.format,
    roles: td?.roles,
    notfor: td?.notfor,
    cols,
  };
}
