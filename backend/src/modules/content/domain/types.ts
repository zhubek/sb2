export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json };
export type Values = Record<string, Json>;
export type Group =
  | "tests"
  | "pages"
  | "catalog"
  | "courses"
  | "reports"
  | "assistant"
  | "achievements"
  | "demo";
export interface ContentDocument {
  id: string;
  title: string;
  description: string;
  group: Group;
  preview: string;
  value: Json;
  kind?: "test" | "copy";
}
export type QuestionKind = "likert" | "single" | "multiple" | "text";
export type TestAnswer = number | string | string[];
export interface TestQuestion {
  id: string;
  text: string;
  type: QuestionKind;
  options?: { id: string; label: string }[];
}
export interface TestContent {
  slug: string;
  name: string;
  method: string;
  tagline: string;
  duration: string;
  enabled: boolean;
  sections: {
    id: string;
    title: string;
    description: string;
    icon: string;
    questions: (string | TestQuestion)[];
  }[];
  scale: { value: number; label: string }[];
}
export interface ContentEntry {
  draft?: Json;
  published?: Json;
  revision: number;
  updatedAt: string;
  publishedAt?: string;
}
export interface Revision {
  id: string;
  documentId: string;
  title: string;
  action: "save" | "publish" | "restore";
  at: string;
  value: Json;
}
export interface Store {
  version: 1;
  entries: Record<string, ContentEntry>;
  history: Revision[];
}
export const groups: Record<Group, { title: string; description: string }> = {
  tests: {
    title: "Тесты и диагностика",
    description: "Методики, разделы, вопросы и варианты ответа",
  },
  pages: {
    title: "Страницы и тексты",
    description: "Страницы платформы и тексты на русском, казахском и английском",
  },
  catalog: {
    title: "Навигатор образования",
    description: "Вузы, колледжи, отрасли и программы",
  },
  courses: {
    title: "Курсы и материалы",
    description: "Уроки, контрольные вопросы и справочники педагога",
  },
  reports: {
    title: "Отчёты и рекомендации",
    description: "Описания результатов, навыков и профессий",
  },
  assistant: {
    title: "AI-помощник",
    description: "Подсказки, готовые вопросы и демонстрационные ответы",
  },
  achievements: {
    title: "Достижения и бонусы",
    description: "Чек-листы, значки, правила и сезон",
  },
  demo: {
    title: "Демонстрационные данные",
    description: "Примеры профилей и аналитики — не реальные аккаунты",
  },
};
