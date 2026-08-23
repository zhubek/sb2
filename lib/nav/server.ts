// Серверные данные навигатора: описания заведений, ГОП и отраслей (тяжёлые
// JSON не попадают в клиентский бандл)
import "server-only";
import details from "./details.json";
import gops from "./gops.json";
import industriesData from "./industries.json";
import institutions from "./institutions.json";
import nogop from "./nogop.json";
import collegePrograms from "./college-programs.json";
import type { NavInst } from "./types";

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
