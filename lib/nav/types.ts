// Навигатор образования — типы и клиентские хелперы над реальным датасетом
// (ref/…/navigator-mobile-mockup.html → lib/nav/*.json)
import meta from "./meta.json";

export type Kind = "v" | "c" | "a"; // вуз · колледж · зарубежный

export interface NavInst {
  i: number;
  name: string;
  kind: Kind;
  city: string;
  obl: string;
  country?: string;
  price: number | null; // тг/год, 0 — бесплатно
  th: number | null; // порог гранта (ЕНТ)
  dorm: boolean;
  mil: boolean;
  mob: boolean; // академическая мобильность
  nOps: number;
  inds: number[]; // индексы отраслей
}

export interface GopCompact {
  code: string;
  name: string;
  ind: number;
  nu: number; // вузов
  no: number; // программ
  dur?: string | null;
  univ: Record<string, { k: number; p: number | null; g: number | null }>;
}

export interface NoGopCompact {
  k: number;
  code: string;
  name: string;
  p: number | null;
  t: number | null;
  l?: string | null;
  dur?: number | null;
  ind: number;
}

export interface CollegeProgram {
  code: string;
  name: string;
  g: string; // направление
  ind: number;
  cols: number[];
}

export interface IndustryMeta {
  name: string;
  short: string;
  desc: string;
  c: string; // акцент
  cl: string; // светлый тинт
}

export const industries: IndustryMeta[] = meta.industries;
export const industryRank: string[] = meta.rank;
export const obls: string[] = meta.obls;
export const regionCities: Record<string, string[]> = meta.regionCities;

export const PMAX = 3_000_000;

export const KIND: Record<Kind, { label: string; color: string; plural: [string, string, string] }> = {
  v: { label: "Вуз", color: "#1B4D8F", plural: ["вуз", "вуза", "вузов"] },
  c: { label: "Колледж", color: "#0E8A6B", plural: ["колледж", "колледжа", "колледжей"] },
  a: { label: "Зарубеж", color: "#8A4FBF", plural: ["вуз", "вуза", "вузов"] },
};

export function plural(n: number, forms: [string, string, string]) {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b > 1 && b < 5) return forms[1];
  if (b === 1) return forms[0];
  return forms[2];
}

export function fmt(n: number) {
  return n.toLocaleString("ru-RU");
}

// Цена в год: null — не указана, 0 — бесплатно
export function priceLabel(p: number | null | undefined) {
  if (p == null) return "цена не указана";
  if (p === 0) return "бесплатно";
  return `от ${fmt(p)} ₸`;
}

export function priceShort(p: number | null | undefined) {
  if (p == null) return "не указана";
  if (p === 0) return "бесплатно";
  return `от ${Math.round(p / 1000)}к ₸`;
}

// Инициалы для квадрата-логотипа
export function initials(name: string) {
  const w = name.replace(/[«»"]/g, "").split(/\s+/).filter((x) => x.length > 2);
  return ((w[0] || "").slice(0, 1) + (w[1] || "").slice(0, 1)).toUpperCase();
}

export function langAbbr(x: string) {
  const t = x.toLowerCase();
  if (t.includes("казах") || t.includes("қазақ")) return "KZ";
  if (t.includes("рус")) return "RU";
  if (t.includes("англ") || t.includes("english")) return "ENG";
  return x.slice(0, 3).toUpperCase();
}

export function industrySlug(i: number) {
  return String(i);
}
