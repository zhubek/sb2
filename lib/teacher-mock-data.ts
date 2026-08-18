// Мок-данные платформы педагога-профориентатора

export const teacher = {
  firstName: "Гульнара",
  lastName: "Ахметова",
  role: "Педагог-профориентатор",
  school: "НИШ ФМН Астана",
  city: "Астана",
  email: "g.akhmetova@nis.edu.kz",
};

export const schoolStats = {
  total: 486, // всего учеников в школе (8–11 классы)
  registered: 412,
  test1: 287, // DeBruce
  test2: 189, // MBTI
  test3: 154, // Голланд
};

// Сигналы «Требуют внимания»: платформа сама находит, где работа встала
export type SignalSeverity = "urgent" | "important" | "info";

export const attentionSignals: {
  id: string;
  severity: SignalSeverity;
  title: string;
  text: string;
  action: string;
  href: string;
}[] = [
  {
    id: "s1",
    severity: "urgent",
    title: "Выпускники без диагностики",
    text: "6 учеников 11-х классов не прошли ни одного теста — до конца учебного года остаётся мало времени",
    action: "Показать",
    href: "/teacher/analytics/students",
  },
  {
    id: "s2",
    severity: "important",
    title: "9 «Б»: низкая вовлечённость",
    text: "Меньше трети класса начали диагностику — проведите классный час о платформе",
    action: "Список учеников",
    href: "/teacher/analytics/class/9b",
  },
  {
    id: "s3",
    severity: "important",
    title: "Не прошли основной тест",
    text: "125 учеников зарегистрированы, но без DeBruce — рекомендации для них не строятся",
    action: "Показать",
    href: "/teacher/analytics/students",
  },
  {
    id: "s4",
    severity: "info",
    title: "Рекомендации не отозвались",
    text: "22 ученика прошли диагностику, но ничего не добавили в избранное",
    action: "Показать",
    href: "/teacher/analytics/students",
  },
  {
    id: "s5",
    severity: "info",
    title: "Готов сводный отчёт за 2-ю четверть",
    text: "Автоматическая сводка по школе сформирована и ждёт в разделе «Отчёты»",
    action: "Открыть",
    href: "/teacher/reports",
  },
];

export type Period = "week" | "month" | "quarter" | "year";

export const activityData: Record<Period, { label: string; value: number }[]> = {
  week: [
    { label: "Пн", value: 34 },
    { label: "Вт", value: 51 },
    { label: "Ср", value: 42 },
    { label: "Чт", value: 67 },
    { label: "Пт", value: 58 },
    { label: "Сб", value: 21 },
    { label: "Вс", value: 12 },
  ],
  month: [
    { label: "Нед. 1", value: 186 },
    { label: "Нед. 2", value: 241 },
    { label: "Нед. 3", value: 205 },
    { label: "Нед. 4", value: 285 },
  ],
  quarter: [
    { label: "Апрель", value: 720 },
    { label: "Май", value: 910 },
    { label: "Июнь", value: 640 },
  ],
  year: [
    { label: "1 четв.", value: 1850 },
    { label: "2 четв.", value: 2340 },
    { label: "3 четв.", value: 2120 },
    { label: "4 четв.", value: 1660 },
  ],
};

export interface SchoolClass {
  id: string;
  name: string;
  students: number;
  tested: number; // прошли хотя бы 1 тест
  fullProfiles: number; // все 3 теста
  t1: number; // DeBruce
  t2: number; // MBTI
  t3: number; // Голланд
  topDirection: string;
}

export const schoolClasses: SchoolClass[] = [
  { id: "9a", name: "9 «А»", students: 26, tested: 21, fullProfiles: 9, t1: 20, t2: 13, t3: 10, topDirection: "IT и телекоммуникации" },
  { id: "9b", name: "9 «Б»", students: 25, tested: 8, fullProfiles: 4, t1: 8, t2: 5, t3: 4, topDirection: "Медицина" },
  { id: "10a", name: "10 «А»", students: 28, tested: 25, fullProfiles: 14, t1: 24, t2: 17, t3: 14, topDirection: "Инженерия" },
  { id: "10b", name: "10 «Б»", students: 27, tested: 24, fullProfiles: 12, t1: 23, t2: 16, t3: 13, topDirection: "Культура и искусство" },
  { id: "11a", name: "11 «А»", students: 29, tested: 22, fullProfiles: 11, t1: 21, t2: 15, t3: 12, topDirection: "Бизнес и финансы" },
  { id: "11b", name: "11 «Б»", students: 28, tested: 18, fullProfiles: 7, t1: 17, t2: 11, t3: 9, topDirection: "IT и телекоммуникации" },
];

export interface TeacherStudent {
  id: string;
  name: string;
  classId: string;
  className: string;
  grade: number; // параллель
  testsPassed: number;
  topSkills: string[];
  mbti: string | null;
  hollandTop: string | null;
  topIndustry: string | null;
  lastActive: string;
  favoriteUniversities: string[]; // id вузов, добавленных учеником в Избранное
  favoritePrograms: string[]; // id образовательных программ из Избранного
}

export const teacherStudents: TeacherStudent[] = [
  { id: "st1", name: "Айгерим Сатпаева", classId: "10b", className: "10 «Б»", grade: 10, testsPassed: 2, topSkills: ["Креативность", "Коммуникация", "Эмпатия"], mbti: "ENFJ", hollandTop: null, topIndustry: "Культура и искусство", lastActive: "сегодня", favoriteUniversities: ["kaznu", "turan"], favoritePrograms: ["ep1", "ep2", "ep6"] },
  { id: "st2", name: "Данияр Оспанов", classId: "10b", className: "10 «Б»", grade: 10, testsPassed: 3, topSkills: ["Критическое мышление", "Работа с данными", "Организованность"], mbti: "INTJ", hollandTop: "Исследовательский", topIndustry: "IT и телекоммуникации", lastActive: "вчера", favoriteUniversities: ["nu", "sdu", "kaznu"], favoritePrograms: ["ep3"] },
  { id: "st3", name: "Томирис Жаксылык", classId: "10b", className: "10 «Б»", grade: 10, testsPassed: 1, topSkills: ["Эмпатия", "Коммуникация", "Адаптивность"], mbti: null, hollandTop: null, topIndustry: "Образование и наука", lastActive: "3 дня назад", favoriteUniversities: ["enu"], favoritePrograms: ["ep4"] },
  { id: "st4", name: "Алишер Нурланулы", classId: "10b", className: "10 «Б»", grade: 10, testsPassed: 3, topSkills: ["Техническая грамотность", "Критическое мышление", "Работа с данными"], mbti: "ISTP", hollandTop: "Реалистичный", topIndustry: "Инженерия", lastActive: "сегодня", favoriteUniversities: ["nu", "enu"], favoritePrograms: ["ep3"] },
  { id: "st5", name: "Камила Ержанова", classId: "10b", className: "10 «Б»", grade: 10, testsPassed: 0, topSkills: [], mbti: null, hollandTop: null, topIndustry: null, lastActive: "2 недели назад", favoriteUniversities: [], favoritePrograms: [] },
  { id: "st6", name: "Арман Токтаров", classId: "10b", className: "10 «Б»", grade: 10, testsPassed: 2, topSkills: ["Лидерство", "Коммуникация", "Стрессоустойчивость"], mbti: "ESTJ", hollandTop: null, topIndustry: "Бизнес и финансы", lastActive: "вчера", favoriteUniversities: ["kimep"], favoritePrograms: ["ep5"] },
  { id: "st7", name: "Инкар Абдрахманова", classId: "10b", className: "10 «Б»", grade: 10, testsPassed: 1, topSkills: ["Креативность", "Адаптивность", "Эмпатия"], mbti: null, hollandTop: null, topIndustry: "Культура и искусство", lastActive: "5 дней назад", favoriteUniversities: ["turan"], favoritePrograms: ["ep6"] },
  { id: "st8", name: "Ерасыл Мухтар", classId: "10b", className: "10 «Б»", grade: 10, testsPassed: 3, topSkills: ["Работа с данными", "Организованность", "Критическое мышление"], mbti: "ISTJ", hollandTop: "Конвенциональный", topIndustry: "Бизнес и финансы", lastActive: "сегодня", favoriteUniversities: ["kimep", "kaznu"], favoritePrograms: ["ep5", "ep3"] },
  { id: "st9", name: "Диас Сериков", classId: "9a", className: "9 «А»", grade: 9, testsPassed: 3, topSkills: ["Техническая грамотность", "Работа с данными", "Критическое мышление"], mbti: "INTP", hollandTop: "Исследовательский", topIndustry: "IT и телекоммуникации", lastActive: "сегодня", favoriteUniversities: ["sdu", "nu"], favoritePrograms: ["ep3"] },
  { id: "st10", name: "Аружан Бекова", classId: "9a", className: "9 «А»", grade: 9, testsPassed: 1, topSkills: ["Коммуникация", "Эмпатия", "Адаптивность"], mbti: null, hollandTop: null, topIndustry: "Медицина и здравоохранение", lastActive: "вчера", favoriteUniversities: ["kaznu"], favoritePrograms: [] },
  { id: "st11", name: "Санжар Абылай", classId: "9b", className: "9 «Б»", grade: 9, testsPassed: 0, topSkills: [], mbti: null, hollandTop: null, topIndustry: null, lastActive: "3 недели назад", favoriteUniversities: [], favoritePrograms: [] },
  { id: "st12", name: "Мадина Кайратова", classId: "9b", className: "9 «Б»", grade: 9, testsPassed: 1, topSkills: ["Эмпатия", "Организованность", "Коммуникация"], mbti: null, hollandTop: null, topIndustry: "Медицина и здравоохранение", lastActive: "неделю назад", favoriteUniversities: ["enu"], favoritePrograms: ["ep4"] },
  { id: "st13", name: "Темирлан Ахметжан", classId: "9b", className: "9 «Б»", grade: 9, testsPassed: 0, topSkills: [], mbti: null, hollandTop: null, topIndustry: null, lastActive: "месяц назад", favoriteUniversities: [], favoritePrograms: [] },
  { id: "st14", name: "Жанель Мукашева", classId: "10a", className: "10 «А»", grade: 10, testsPassed: 3, topSkills: ["Критическое мышление", "Техническая грамотность", "Организованность"], mbti: "ENTJ", hollandTop: "Предприимчивый", topIndustry: "Инженерия", lastActive: "сегодня", favoriteUniversities: ["nu", "msu"], favoritePrograms: ["ep3"] },
  { id: "st15", name: "Али Жумагулов", classId: "10a", className: "10 «А»", grade: 10, testsPassed: 2, topSkills: ["Работа с данными", "Организованность", "Стрессоустойчивость"], mbti: "ISTJ", hollandTop: null, topIndustry: "Инженерия", lastActive: "вчера", favoriteUniversities: ["enu"], favoritePrograms: [] },
  { id: "st16", name: "Диана Ералиева", classId: "11a", className: "11 «А»", grade: 11, testsPassed: 3, topSkills: ["Лидерство", "Коммуникация", "Критическое мышление"], mbti: "ENTP", hollandTop: "Предприимчивый", topIndustry: "Бизнес и финансы", lastActive: "сегодня", favoriteUniversities: ["kimep", "nu", "msu"], favoritePrograms: ["ep5"] },
  { id: "st17", name: "Нурсултан Байжанов", classId: "11a", className: "11 «А»", grade: 11, testsPassed: 2, topSkills: ["Организованность", "Работа с данными", "Критическое мышление"], mbti: "ESTJ", hollandTop: null, topIndustry: "Бизнес и финансы", lastActive: "4 дня назад", favoriteUniversities: ["kimep"], favoritePrograms: ["ep5"] },
  { id: "st18", name: "Асель Турсынова", classId: "11b", className: "11 «Б»", grade: 11, testsPassed: 3, topSkills: ["Креативность", "Техническая грамотность", "Адаптивность"], mbti: "INFP", hollandTop: "Артистичный", topIndustry: "IT и телекоммуникации", lastActive: "вчера", favoriteUniversities: ["sdu", "turan"], favoritePrograms: ["ep3", "ep6"] },
  { id: "st19", name: "Бекзат Оразбаев", classId: "11b", className: "11 «Б»", grade: 11, testsPassed: 1, topSkills: ["Стрессоустойчивость", "Адаптивность", "Лидерство"], mbti: null, hollandTop: null, topIndustry: "IT и телекоммуникации", lastActive: "6 дней назад", favoriteUniversities: [], favoritePrograms: ["ep3"] },
];

export const schoolInterests = [
  { name: "IT и телекоммуникации", value: 96 },
  { name: "Культура и искусство", value: 74 },
  { name: "Медицина и здравоохранение", value: 68 },
  { name: "Инженерия", value: 61 },
  { name: "Бизнес и финансы", value: 55 },
  { name: "Образование и наука", value: 43 },
];

export const popularProfessions = [
  { name: "Программист", value: 58 },
  { name: "Врач", value: 44 },
  { name: "Дизайнер", value: 39 },
  { name: "Инженер", value: 35 },
  { name: "Предприниматель", value: 31 },
];

// ─── Сводка школы за период (аналитика · уровень «Школа») ────────────────────

export const periodSummary: Record<
  Period,
  { active: number; testsDone: number; aiSessions: number; newRegs: number }
> = {
  week: { active: 168, testsDone: 46, aiSessions: 210, newRegs: 12 },
  month: { active: 305, testsDone: 174, aiSessions: 860, newRegs: 47 },
  quarter: { active: 384, testsDone: 402, aiSessions: 2340, newRegs: 128 },
  year: { active: 412, testsDone: 630, aiSessions: 7970, newRegs: 412 },
};

// ─── Избранные ОП учеников: справочник программ ──────────────────────────────

export interface EduProgram {
  id: string;
  code: string;
  name: string;
  direction: string;
  universities: string[];
  description: string;
  professions: string[];
}

export const eduPrograms: EduProgram[] = [
  {
    id: "ep1",
    code: "6B03201",
    name: "Журналистика",
    direction: "Журналистика и информация",
    universities: ["КазНУ", "ЕНУ", "KIMEP", "Туран", "МГУ"],
    description: "Подготовка журналистов для СМИ и новых медиа: репортаж, аналитика, мультимедийные форматы.",
    professions: ["Журналист", "Редактор", "Продюсер подкастов"],
  },
  {
    id: "ep2",
    code: "6B03202",
    name: "Реклама и связи с общественностью",
    direction: "Журналистика и информация",
    universities: ["КазНУ", "ЕНУ", "Туран"],
    description: "Стратегические коммуникации, медиапланирование, работа с брендами и репутацией.",
    professions: ["PR-менеджер", "Бренд-стратег", "SMM-специалист"],
  },
  {
    id: "ep3",
    code: "6B06101",
    name: "Информационные системы",
    direction: "Информационно-коммуникационные технологии",
    universities: ["КазНУ", "ЕНУ", "SDU", "NU"],
    description: "Проектирование и разработка информационных систем, анализ данных, программная инженерия.",
    professions: ["Разработчик ПО", "Аналитик данных", "Системный архитектор"],
  },
  {
    id: "ep4",
    code: "6B01101",
    name: "Педагогика и психология",
    direction: "Педагогические науки",
    universities: ["ЕНУ", "SDU", "Туран"],
    description: "Психолого-педагогическое сопровождение образовательного процесса.",
    professions: ["Педагог-психолог", "Школьный консультант", "Коуч"],
  },
  {
    id: "ep5",
    code: "6B03103",
    name: "Международные отношения",
    direction: "Социальные науки",
    universities: ["КазНУ", "ЕНУ", "KIMEP", "NU", "МГУ"],
    description: "Дипломатия, мировая политика, международное право и региональные исследования.",
    professions: ["Дипломат", "Аналитик-международник", "Советник"],
  },
  {
    id: "ep6",
    code: "6B02101",
    name: "Дизайн",
    direction: "Искусство",
    universities: ["Туран", "SDU"],
    description: "Графический, коммуникационный и цифровой дизайн, визуальные коммуникации.",
    professions: ["UX/UI-дизайнер", "Графический дизайнер", "Арт-директор"],
  },
];

// ─── AI-помощник педагога ────────────────────────────────────────────────────

export const teacherAiTemplates = [
  "Покажи учеников 10 класса с высоким потенциалом в инженерии",
  "Какие профессии чаще выбирают ученики нашей школы?",
  "Подготовь краткую характеристику ученика для встречи с родителями",
  "Какие ученики ещё не прошли тестирование?",
  "Сравни результаты 10 «А» и 10 «Б»",
];

// ─── Обучение ────────────────────────────────────────────────────────────────

export const trainingGuides = [
  { id: "g1", icon: "🚀", title: "Быстрый старт для профориентатора", desc: "Первые шаги: дашборд, аналитика, AI-помощник — за 15 минут.", length: "8 стр." },
  { id: "g2", icon: "🤖", title: "Как использовать AI-помощника", desc: "Готовые сценарии запросов: поиск учеников, характеристики, отчёты.", length: "12 стр." },
  { id: "g3", icon: "📊", title: "Читаем аналитику: школа → класс → ученик", desc: "Как интерпретировать графики и результаты тестов.", length: "10 стр." },
  { id: "g4", icon: "🎓", title: "Платформа глазами ученика", desc: "Что видит ученик: тесты DeBruce, MBTI, Голланда и рекомендации.", length: "9 стр." },
];

export const trainingVideos = [
  { id: "v1", title: "Обзор платформы за 10 минут", duration: "10:24" },
  { id: "v2", title: "Разбор результатов теста DeBruce", duration: "7:12" },
  { id: "v3", title: "Готовим отчёт для администрации", duration: "5:48" },
  { id: "v4", title: "AI-помощник: 10 полезных запросов", duration: "12:03" },
];

// ─── Геймификация (по документу «Описание геймификации») ─────────────────────
// Сезон — учебный год: 1 сентября баллы обнуляются, в мае — итоги и награждение.
// Начисляется только то, что платформа фиксирует технически; самоотчёты не награждаются.

export const season = {
  label: "Сезон 2025/26",
  period: "1 сентября 2025 — май 2026",
  note: "Баллы обнуляются 1 сентября. Итоги сезона и награждение — в мае. Магазина баллов нет: баллы определяют место в рейтинге.",
};

// Значки — награды за рубежи (в отличие от баллов, которые копятся за рутину)
export interface SeasonBadge {
  id: string;
  name: string;
  desc: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
}

export const teacherBadges: SeasonBadge[] = [
  { id: "onboard", name: "Знаком с платформой", desc: "Пройден онбординг по интерфейсу", icon: "🧭", earned: true, earnedAt: "20.09.2025" },
  { id: "wave", name: "На одной волне", desc: "Просмотрены гайды по ученической платформе", icon: "🔁", earned: true, earnedAt: "28.09.2025" },
  { id: "expert", name: "Сертифицированный эксперт", desc: "Завершён курс 72 ч + сертификат научного центра", icon: "🏅", earned: false },
  { id: "half", name: "Школа на борту", desc: "Школа — 50% охвата", icon: "🌗", earned: true, earnedAt: "14.11.2025" },
  { id: "threequarters", name: "Уверенный охват", desc: "Школа — 75% охвата", icon: "🌖", earned: true, earnedAt: "03.03.2026" },
  { id: "full", name: "Полный охват", desc: "Школа — 100% охвата", icon: "⭐", earned: false },
  { id: "classdone", name: "Класс закрыт", desc: "Класс — 100% охвата (за каждый класс)", icon: "🚩", earned: true, earnedAt: "22.01.2026 · 10 «А»" },
];

// Правила начисления баллов, по блокам
export const pointsRules = [
  {
    id: "students",
    block: "Ученики",
    icon: "🎓",
    note: "Основной источник баллов. Начисления за ученика — раз в сезон; полностью вовлечённый ученик приносит ≈50 баллов. Голая регистрация без теста не засчитывается.",
    items: [
      { action: "Ученик зарегистрирован и прошёл хотя бы один тест", points: "+8" },
      { action: "Прошёл DeBruce", points: "+8" },
      { action: "Прошёл MBTI", points: "+5" },
      { action: "Прошёл тест Голланда", points: "+5" },
      { action: "Полный диагностический цикл (все три теста) — бонус", points: "+12" },
      { action: "Открыт комбинированный AI-отчёт", points: "+4" },
      { action: "Ученик определился с направлением", points: "+8" },
    ],
  },
  {
    id: "coverage",
    block: "Охват школы",
    icon: "🏫",
    note: "Считается один раз по школе целиком — от численности 7–11 классов. Максимум за охват — 550 баллов, одинаково для любой школы.",
    items: [
      { action: "Школа — 25% охвата", points: "+30" },
      { action: "Школа — 50% охвата", points: "+60 + значок" },
      { action: "Школа — 75% охвата", points: "+90 + значок" },
      { action: "Школа — 90% охвата", points: "+120" },
      { action: "Школа — 100% охвата", points: "+150 + значок" },
      { action: "Первый класс, закрытый на 100% (раз в сезон)", points: "+100" },
      { action: "Каждый следующий класс на 100%", points: "значок" },
    ],
  },
  {
    id: "reports",
    block: "Отчёты для руководства",
    icon: "📄",
    note: "Начисляется один раз за отчётный период — независимо от числа классов и учеников. Максимум — 340 баллов за сезон.",
    items: [
      { action: "Четвертной отчёт (×4 за сезон)", points: "+30" },
      { action: "Сводный отчёт по школе за полугодие (×2)", points: "+60" },
      { action: "Годовой сводный отчёт по школе", points: "+100" },
    ],
  },
  {
    id: "training",
    block: "Обучение педагога",
    icon: "📚",
    note: "Курс 72 ч проходится один раз за всё время; главная награда — сертификат научного центра, который используется при аттестации.",
    items: [
      { action: "Онбординг по платформе пройден", points: "+20 + значок" },
      { action: "Гайды по ученической платформе просмотрены", points: "+15 + значок" },
      { action: "Курс 72 ч завершён полностью", points: "+50 + сертификат + значок" },
    ],
  },
  {
    id: "regularity",
    block: "Регулярность",
    icon: "📆",
    note: "Постоянная работа ценится выше разовых рывков.",
    items: [
      { action: "Недельная активность (вход + значимое действие)", points: "+5 / неделю" },
      { action: "Четверть без пропущенных недель", points: "+30" },
    ],
  },
];

// Набранные за сезон баллы по блокам
export const seasonPoints = {
  total: 4121,
  byBlock: [
    { block: "Ученики", points: 3456, max: null as number | null },
    { block: "Охват школы", points: 280, max: 550 },
    { block: "Отчёты", points: 150, max: 340 },
    { block: "Обучение", points: 35, max: 85 },
    { block: "Регулярность", points: 200, max: null as number | null },
  ],
};

// Прогресс охвата школы: зарегистрировано из численности 7–11 классов
export const coverageProgress = {
  pct: Math.round((412 / 486) * 100), // 85%
  thresholds: [
    { pct: 25, label: "+30", done: true },
    { pct: 50, label: "+60 🌗", done: true },
    { pct: 75, label: "+90 🌖", done: true },
    { pct: 90, label: "+120", done: false },
    { pct: 100, label: "+150 ⭐", done: false },
  ],
};

// «Определился / не определился» — ученик добавил ОП или вуз в избранное
// (засчитывается только при полном диагностическом цикле)
export const decidedStudents = { count: 186, of: 412 };

export interface BonusTransaction {
  id: string;
  reason: string;
  points: number;
  date: string; // дата и время начисления
}

export const bonusTransactions: BonusTransaction[] = [
  { id: "bt1", reason: "Аружан Бекова прошла DeBruce", points: 8, date: "12.05.2026 · 15:41" },
  { id: "bt2", reason: "Недельная активность", points: 5, date: "12.05.2026 · 08:00" },
  { id: "bt3", reason: "Ерасыл Мухтар: полный диагностический цикл — бонус", points: 12, date: "08.05.2026 · 12:16" },
  { id: "bt4", reason: "Ерасыл Мухтар прошёл тест Голланда", points: 5, date: "08.05.2026 · 12:14" },
  { id: "bt5", reason: "Диана Ералиева определилась с направлением", points: 8, date: "06.05.2026 · 17:03" },
  { id: "bt6", reason: "Открыт комбинированный AI-отчёт: Данияр Оспанов", points: 4, date: "05.05.2026 · 10:27" },
  { id: "bt7", reason: "Недельная активность", points: 5, date: "05.05.2026 · 08:00" },
  { id: "bt8", reason: "Четвертной отчёт сформирован (3-я четверть)", points: 30, date: "27.03.2026 · 14:52" },
  { id: "bt9", reason: "Школа — 75% охвата", points: 90, date: "03.03.2026 · 11:38" },
  { id: "bt10", reason: "Класс 10 «А» закрыт на 100%", points: 100, date: "22.01.2026 · 09:12" },
  { id: "bt11", reason: "Сводный отчёт по школе за полугодие", points: 60, date: "26.12.2025 · 16:44" },
];

// Лидерборды педагогов: городские и сельские школы соревнуются раздельно.
// Баллы считаются за три периода: всё время (сезон), месяц и неделю.
export type LeaderPeriod = "all" | "month" | "week";

export const leaderPeriodLabels: Record<LeaderPeriod, string> = {
  all: "Всё время",
  month: "Месяц",
  week: "Неделя",
};

export interface LeaderRow {
  name: string;
  school: string;
  badges: number;
  points: Record<LeaderPeriod, number>;
  own?: boolean;
}

export const leaderboards: { urban: LeaderRow[]; rural: LeaderRow[] } = {
  urban: [
    { name: "Айгуль Нурланова", school: "Гимназия №130, Алматы", badges: 6, points: { all: 5214, month: 410, week: 52 } },
    { name: "Марат Досжанов", school: "Лицей №134, Алматы", badges: 5, points: { all: 4787, month: 285, week: 24 } },
    { name: "Гульнара Ахметова", school: "НИШ ФМН Астана", badges: 5, points: { all: 4121, month: 342, week: 58 }, own: true },
    { name: "Салтанат Ерликызы", school: "БИЛ Шымкент", badges: 4, points: { all: 3902, month: 368, week: 61 } },
    { name: "Дмитрий Ким", school: "Школа-лицей №72, Астана", badges: 4, points: { all: 3615, month: 120, week: 8 } },
    { name: "Жанна Абишева", school: "Гимназия №8, Караганда", badges: 3, points: { all: 3108, month: 214, week: 30 } },
    { name: "Азамат Тлеубердин", school: "СШ №25, Тараз", badges: 3, points: { all: 2690, month: 96, week: 0 } },
  ],
  rural: [
    { name: "Бакыт Жумабаев", school: "СШ им. Абая, с. Шамалган", badges: 5, points: { all: 2340, month: 205, week: 26 } },
    { name: "Айнур Сапарова", school: "СШ №2, с. Косшы", badges: 4, points: { all: 2105, month: 240, week: 41 } },
    { name: "Ержан Кайыргельды", school: "СШ им. Алтынсарина, с. Аксукент", badges: 4, points: { all: 1870, month: 118, week: 12 } },
    { name: "Гаухар Мусаева", school: "СШ №1, п. Бурабай", badges: 3, points: { all: 1540, month: 74, week: 9 } },
    { name: "Нурбол Азимхан", school: "СШ им. Жамбыла, с. Шелек", badges: 2, points: { all: 1315, month: 152, week: 33 } },
  ],
};

// ─── Обучающий курс: 72 ч · 11 модулей · сертификат научного центра ──────────

export type ModuleStatus = "done" | "progress" | "todo";

export interface CourseModule {
  id: string;
  num: number;
  title: string;
  desc: string;
  lessons: number;
  hours: number;
  status: ModuleStatus;
  progress: number; // 0–100, для статуса «В процессе»
  completedAt?: string;
  href?: string; // модуль с интерактивным ридером
}

export const courseModules: CourseModule[] = [
  { id: "m1", num: 1, title: "Система непрерывной профориентации обучающихся", desc: "Уровни системы, распределение ответственности, методы и этика работы. По методическим рекомендациям НАО им. И. Алтынсарина.", lessons: 6, hours: 8, status: "progress", progress: 33, href: "/teacher/course/module1" },
  { id: "m2", num: 2, title: "Возрастная психология профессионального самоопределения", desc: "Как складывается выбор профессии от начального звена к старшему.", lessons: 5, hours: 6, status: "done", progress: 100, completedAt: "12.10.2025" },
  { id: "m3", num: 3, title: "Диагностика: DeBruce, MBTI и тест Голланда", desc: "Методология трёх тестов платформы: что измеряют и как проводятся.", lessons: 7, hours: 8, status: "done", progress: 100, completedAt: "09.11.2025" },
  { id: "m4", num: 4, title: "Интерпретация результатов диагностики", desc: "Читаем профили навыков и типологию, готовим выводы для консультаций.", lessons: 6, hours: 7, status: "done", progress: 100, completedAt: "21.12.2025" },
  { id: "m5", num: 5, title: "Индивидуальная профконсультация", desc: "Структура беседы с учеником: от результатов теста к плану действий.", lessons: 6, hours: 7, status: "todo", progress: 0 },
  { id: "m6", num: 6, title: "Групповые форматы: класс и параллель", desc: "Классные часы, профориентационные игры и профессиональные пробы.", lessons: 5, hours: 6, status: "todo", progress: 0 },
  { id: "m7", num: 7, title: "Работа с родителями", desc: "Как обсуждать результаты диагностики и выбор ребёнка с семьёй.", lessons: 4, hours: 5, status: "todo", progress: 0 },
  { id: "m8", num: 8, title: "Рынок труда Казахстана и Атлас профессий", desc: "Новые, меняющиеся и исчезающие профессии; региональная специфика.", lessons: 5, hours: 6, status: "todo", progress: 0 },
  { id: "m9", num: 9, title: "Навигация по образованию: ЕНТ, гранты, вузы и колледжи", desc: "Траектории после 9 и 11 класса, правила приёма и стипендии.", lessons: 6, hours: 7, status: "todo", progress: 0 },
  { id: "m10", num: 10, title: "Цифровые инструменты и аналитика платформы", desc: "Дашборд, AI-помощник и отчёты в ежедневной работе педагога.", lessons: 5, hours: 6, status: "todo", progress: 0 },
  { id: "m11", num: 11, title: "Этика, конфиденциальность и отчётность", desc: "Этические стратегии, защита данных учеников, документация для руководства.", lessons: 5, hours: 6, status: "todo", progress: 0 },
];

export const courseInfo = {
  hours: 72,
  modules: 11,
  cert: "Сертификат научного центра — засчитывается при аттестации. По завершении: +50 баллов и значок «Сертифицированный эксперт».",
};

export const moduleStatusLabels: Record<ModuleStatus, string> = {
  done: "Пройден",
  progress: "В процессе",
  todo: "Не пройден",
};

// ─── Отчёты ──────────────────────────────────────────────────────────────────

export interface TeacherReport {
  id: string;
  title: string;
  level: "Школа" | "Класс" | "Ученик";
  source: "manual" | "auto";
  date: string; // дата и время формирования
  size: string;
}

export const teacherReports: TeacherReport[] = [
  { id: "r1", title: "Сводный отчёт школы · 2-я четверть", level: "Школа", source: "auto", date: "15.08.2026 · 06:00", size: "24 стр." },
  { id: "r2", title: "Отчёт по классу 10 «Б»", level: "Класс", source: "manual", date: "14.08.2026 · 09:41", size: "11 стр." },
  { id: "r3", title: "Отчёт по ученику · Данияр Оспанов", level: "Ученик", source: "manual", date: "13.08.2026 · 15:20", size: "6 стр." },
  { id: "r4", title: "Еженедельная сводка активности", level: "Школа", source: "auto", date: "11.08.2026 · 06:00", size: "8 стр." },
  { id: "r5", title: "Отчёт по классу 11 «А»", level: "Класс", source: "manual", date: "07.08.2026 · 12:03", size: "12 стр." },
  { id: "r6", title: "Отчёт по ученику · Диана Ералиева", level: "Ученик", source: "auto", date: "08.08.2026 · 13:30", size: "7 стр." },
  { id: "r7", title: "Сводный отчёт школы · июль", level: "Школа", source: "auto", date: "01.08.2026 · 06:00", size: "22 стр." },
  { id: "r8", title: "Отчёт по классу 9 «Б»", level: "Класс", source: "manual", date: "28.07.2026 · 10:44", size: "9 стр." },
];

// ─── Руководство: гайды платформы ученика ────────────────────────────────────

export const studentGuides = [
  { id: "sg1", icon: "🧭", title: "Как ученику зарегистрироваться", desc: "Регистрация по QR-коду или ссылке школы, первый вход и онбординг.", length: "4 стр." },
  { id: "sg2", icon: "🧪", title: "Как проходить тесты", desc: "DeBruce, MBTI и Голланд: порядок, время, повторные попытки.", length: "6 стр." },
  { id: "sg3", icon: "🏛️", title: "Навигатор по ВУЗам и Избранное", desc: "Поиск университетов и программ, добавление в Избранное.", length: "5 стр." },
  { id: "sg4", icon: "💬", title: "AI-чат для ученика", desc: "Как ученик получает рекомендации и объяснение результатов.", length: "4 стр." },
];

export const trainingFaq = [
  { q: "Как ученику попасть на платформу?", a: "Ученики регистрируются по QR-коду или ссылке школы. Область, город и школа подставляются автоматически — ученик указывает только имя, класс и почту." },
  { q: "Могу ли я видеть результаты конкретного ученика?", a: "Да. Раздел «Аналитика» → класс → карточка ученика: все тесты, история прохождений, рекомендации AI и подходящие вузы." },
  { q: "Как скачать отчёт по классу?", a: "На любом уровне раздела «Аналитика» нажмите «Скачать отчёт» — документ формируется автоматически по текущему уровню (школа, класс или ученик)." },
  { q: "Что делать, если ученики не проходят тесты?", a: "Откройте дашборд — система покажет, кто не начал диагностику. AI-помощник подскажет план вовлечения, а в «Обучающем курсе» есть модуль о работе с классом." },
];
