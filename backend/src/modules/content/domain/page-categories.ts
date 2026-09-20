// First match wins. Broad audience rules follow the more specific page rules.
export const pageCategories = [
  { id: "landing", title: "Лендинг", description: "Главная страница, её разделы и меню", prefixes: ["landing.", "copy.app.page", "copy.components.landing-steps"] },
  { id: "access", title: "Вход и регистрация", description: "Вход ученика и педагога, знакомство с платформой", prefixes: ["copy.app.auth.", "inline.app.auth.", "copy.app.onboarding.", "copy.app.teacher.login."] },
  { id: "navigator", title: "Навигатор и справочники", description: "Поиск образования, профессии, навыки и вузы", prefixes: ["info-data.", "copy.app.platform.universities.", "copy.app.popularuniversity.", "copy.app.professions.", "copy.app.skills.", "copy.app.workingprofessionsgen.", "copy.components.navigator.", "copy.components.info-shell", "inline.components.info-shell.", "copy.components.profession-carousel", "inline.components.profession-carousel."] },
  { id: "student", title: "Кабинет ученика", description: "Тесты, результаты, портфолио, профиль и чат", prefixes: ["copy.app.platform.", "inline.app.platform.", "copy.components.platform-nav", "copy.components.checklist-menu", "copy.components.section-quiz", "copy.components.custom-test", "copy.components.legacy-test-history"] },
  { id: "teacher", title: "Кабинет педагога", description: "Аналитика, обучение, отчёты, бонусы и профиль", prefixes: ["copy.app.teacher.", "inline.app.teacher.", "copy.components.teacher-", "inline.components.teacher-", "copy.components.activity-chart", "inline.components.activity-chart", "inline.components.analytics-tabs"] },
  { id: "shared", title: "Общие элементы", description: "Общие блоки, кнопки и служебные страницы", prefixes: [] },
] as const;

export type PageCategoryId = typeof pageCategories[number]["id"];

export function pageCategoryFor(id: string) {
  return pageCategories.find(category => category.prefixes.some(prefix => id.startsWith(prefix))) ?? pageCategories[5];
}

// Return the same ordered rules for database filtering, before pagination/counts.
export function pageCategoryRules(id: string) {
  const index = pageCategories.findIndex(category => category.id === id);
  if (index < 0) return null;
  return {
    include: pageCategories[index].prefixes,
    exclude: pageCategories.slice(0, index).flatMap(category => [...category.prefixes]),
  };
}
