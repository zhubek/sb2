import "server-only";
import { getIndustryData } from "./server";

export interface IndustryStats {
  p: number; // профессий
  g: number; // направлений
  vop: number; // программ в вузах
  cop: number; // программ в колледжах
  u: number; // вузов
  c: number; // колледжей
}

// Статистика отрасли — как statsOf() в прототипе
export function industryStats(name: string): IndustryStats {
  const o = getIndustryData(name);
  if (!o) return { p: 0, g: 0, vop: 0, cop: 0, u: 0, c: 0 };
  const profs = new Set<string>();
  Object.values(o.groups).forEach((g) => Object.keys(g.profs).forEach((x) => profs.add(x)));
  const u = new Set<number>();
  o.v.forEach((x) => x.unis.forEach((z) => u.add(z)));
  const c = new Set<number>();
  o.c.forEach((x) => x.cols.forEach((z) => c.add(z)));
  return { p: profs.size, g: Object.keys(o.groups).length, vop: o.v.length, cop: o.c.length, u: u.size, c: c.size };
}
