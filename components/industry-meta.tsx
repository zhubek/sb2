import {
  Briefcase,
  Clapperboard,
  GraduationCap,
  type LucideIcon,
  MessagesSquare,
  Palette,
  Sparkles,
} from "lucide-react";

// Иконки и цветовая кодировка отраслей — из дополнительных цветов палитры.
// Используются в рекомендациях, отчётах и навигаторе.
export interface IndustryMeta {
  Icon: LucideIcon;
  iconBg: string; // квадрат с иконкой
  card: string; // подложка карточки отрасли
  title: string; // цвет заголовка на карточке
  chip: string; // чипы профессий
}

const meta: Record<string, IndustryMeta> = {
  "Культура, искусство и креативные индустрии": {
    Icon: Palette,
    iconBg: "bg-rose-500 text-white",
    card: "border-rose-200 bg-rose-100/60",
    title: "text-rose-900",
    chip: "bg-rose-100 text-rose-800",
  },
  "Социальная работа и общественное развитие": {
    Icon: MessagesSquare,
    iconBg: "bg-sky-500 text-white",
    card: "border-sky-200 bg-sky-100/60",
    title: "text-sky-900",
    chip: "bg-sky-100 text-sky-800",
  },
  "Образование": {
    Icon: GraduationCap,
    iconBg: "bg-amber-500 text-white",
    card: "border-amber-200 bg-amber-100/60",
    title: "text-amber-900",
    chip: "bg-amber-100 text-amber-800",
  },
  "Медиа и креативные индустрии": {
    Icon: Clapperboard,
    iconBg: "bg-fuchsia-500 text-white",
    card: "border-fuchsia-200 bg-fuchsia-100/60",
    title: "text-fuchsia-900",
    chip: "bg-fuchsia-100 text-fuchsia-800",
  },
  "Бизнес и предпринимательство": {
    Icon: Briefcase,
    iconBg: "bg-emerald-500 text-white",
    card: "border-emerald-200 bg-emerald-100/60",
    title: "text-emerald-900",
    chip: "bg-emerald-100 text-emerald-800",
  },
};

const fallback: IndustryMeta = {
  Icon: Sparkles,
  iconBg: "bg-violet-500 text-white",
  card: "border-violet-200 bg-violet-100/60",
  title: "text-violet-900",
  chip: "bg-violet-100 text-violet-800",
};

export function industryMeta(name: string): IndustryMeta {
  return meta[name] ?? fallback;
}
