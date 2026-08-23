import {
  Banknote,
  Briefcase,
  Cpu,
  FlaskConical,
  GraduationCap,
  HandHeart,
  HardHat,
  HeartPulse,
  Landmark,
  Leaf,
  type LucideIcon,
  Palette,
  Plane,
  Shield,
  Sparkles,
  Truck,
  Wheat,
  Zap,
} from "lucide-react";

// Иконки 16 отраслей навигатора (по названию из датасета)
const icons: Record<string, LucideIcon> = {
  "Информационные технологии и искусственный интеллект": Cpu,
  Наука: FlaskConical,
  "Финансы, экономика и управление": Banknote,
  "Культура, искусство и креативные индустрии": Palette,
  "Инженерия, промышленность и производство": HardHat,
  "Здравоохранение и медицина": HeartPulse,
  Образование: GraduationCap,
  "Агропромышленный комплекс": Wheat,
  "Строительство и инфраструктура": Landmark,
  "Транспорт и логистика": Truck,
  "Энергетика и экология": Zap,
  "Государственное управление и право": Briefcase,
  "Социальная работа и общественное развитие": HandHeart,
  "Туризм, сервис и сфера услуг": Plane,
  "Безопасность и защита": Shield,
  Экология: Leaf,
};

export function industryIcon(name: string): LucideIcon {
  return icons[name] ?? Sparkles;
}

// Отрасли, подобранные под результаты текущего ученика (топ-3 навыка:
// креативность, коммуникация, эмпатия)
export const personaIndustries = [
  "Культура, искусство и креативные индустрии",
  "Социальная работа и общественное развитие",
  "Образование",
];
