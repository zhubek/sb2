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
  registered: 412,
  test1: 287, // DeBruce
  test2: 189, // MBTI
  test3: 154, // Голланд
};

export const notifications = [
  {
    id: "n1",
    type: "warning" as const,
    text: "23 ученика 11-х классов ещё не начали диагностику",
    action: "Показать список",
    href: "/teacher/analytics",
  },
  {
    id: "n2",
    type: "info" as const,
    text: "Готов сводный отчёт школы за 2-ю четверть",
    action: "Скачать",
    href: "/teacher/analytics",
  },
  {
    id: "n3",
    type: "tip" as const,
    text: "Рекомендация: в 9 «В» низкая вовлечённость — проведите классный час о платформе",
    action: "Материалы",
    href: "/teacher/library",
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
  topDirection: string;
}

export const schoolClasses: SchoolClass[] = [
  { id: "9a", name: "9 «А»", students: 26, tested: 21, fullProfiles: 9, topDirection: "IT и телекоммуникации" },
  { id: "9b", name: "9 «Б»", students: 25, tested: 17, fullProfiles: 6, topDirection: "Медицина" },
  { id: "10a", name: "10 «А»", students: 28, tested: 25, fullProfiles: 14, topDirection: "Инженерия" },
  { id: "10b", name: "10 «Б»", students: 27, tested: 24, fullProfiles: 12, topDirection: "Культура и искусство" },
  { id: "11a", name: "11 «А»", students: 29, tested: 22, fullProfiles: 11, topDirection: "Бизнес и финансы" },
  { id: "11b", name: "11 «Б»", students: 28, tested: 18, fullProfiles: 7, topDirection: "IT и телекоммуникации" },
];

export interface TeacherStudent {
  id: string;
  name: string;
  classId: string;
  className: string;
  testsPassed: number;
  topSkills: string[];
  mbti: string | null;
  hollandTop: string | null;
  topIndustry: string | null;
  lastActive: string;
}

export const teacherStudents: TeacherStudent[] = [
  { id: "st1", name: "Айгерим Сатпаева", classId: "10b", className: "10 «Б»", testsPassed: 2, topSkills: ["Креативность", "Коммуникация", "Эмпатия"], mbti: "ENFJ", hollandTop: null, topIndustry: "Культура и искусство", lastActive: "сегодня" },
  { id: "st2", name: "Данияр Оспанов", classId: "10b", className: "10 «Б»", testsPassed: 3, topSkills: ["Критическое мышление", "Работа с данными", "Организованность"], mbti: "INTJ", hollandTop: "Исследовательский", topIndustry: "IT и телекоммуникации", lastActive: "вчера" },
  { id: "st3", name: "Томирис Жаксылык", classId: "10b", className: "10 «Б»", testsPassed: 1, topSkills: ["Эмпатия", "Коммуникация", "Адаптивность"], mbti: null, hollandTop: null, topIndustry: "Образование и наука", lastActive: "3 дня назад" },
  { id: "st4", name: "Алишер Нурланулы", classId: "10b", className: "10 «Б»", testsPassed: 3, topSkills: ["Техническая грамотность", "Критическое мышление", "Работа с данными"], mbti: "ISTP", hollandTop: "Реалистичный", topIndustry: "Инженерия", lastActive: "сегодня" },
  { id: "st5", name: "Камила Ержанова", classId: "10b", className: "10 «Б»", testsPassed: 0, topSkills: [], mbti: null, hollandTop: null, topIndustry: null, lastActive: "2 недели назад" },
  { id: "st6", name: "Арман Токтаров", classId: "10b", className: "10 «Б»", testsPassed: 2, topSkills: ["Лидерство", "Коммуникация", "Стрессоустойчивость"], mbti: "ESTJ", hollandTop: null, topIndustry: "Бизнес и финансы", lastActive: "вчера" },
  { id: "st7", name: "Инкар Абдрахманова", classId: "10b", className: "10 «Б»", testsPassed: 1, topSkills: ["Креативность", "Адаптивность", "Эмпатия"], mbti: null, hollandTop: null, topIndustry: "Культура и искусство", lastActive: "5 дней назад" },
  { id: "st8", name: "Ерасыл Мухтар", classId: "10b", className: "10 «Б»", testsPassed: 3, topSkills: ["Работа с данными", "Организованность", "Критическое мышление"], mbti: "ISTJ", hollandTop: "Конвенциональный", topIndustry: "Бизнес и финансы", lastActive: "сегодня" },
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

// ─── Справочник: колледжи ────────────────────────────────────────────────────

export interface College {
  id: string;
  name: string;
  city: string;
  specialties: string[];
  admission: string;
  address: string;
  phone: string;
}

export const colleges: College[] = [
  {
    id: "col1",
    name: "Высший колледж APEC PetroTechnic",
    city: "Атырау",
    specialties: ["Нефтегазовое дело", "Автоматизация", "Электроснабжение"],
    admission: "На базе 9 и 11 классов, конкурс аттестатов, гранты",
    address: "г. Атырау, ул. Мурата Монкеулы, 3",
    phone: "+7 (7122) 76-02-22",
  },
  {
    id: "col2",
    name: "Астанинский колледж экономики и IT",
    city: "Астана",
    specialties: ["Программное обеспечение", "Учёт и аудит", "Маркетинг"],
    admission: "На базе 9 и 11 классов, вступительное тестирование",
    address: "г. Астана, ул. Иманова, 26",
    phone: "+7 (7172) 21-45-67",
  },
  {
    id: "col3",
    name: "Алматинский музыкальный колледж им. Чайковского",
    city: "Алматы",
    specialties: ["Инструментальное исполнительство", "Вокал", "Теория музыки"],
    admission: "Творческие экзамены, на базе 9 класса",
    address: "г. Алматы, ул. Толе би, 86",
    phone: "+7 (727) 292-33-44",
  },
  {
    id: "col4",
    name: "Медицинский колледж «Даналык»",
    city: "Шымкент",
    specialties: ["Сестринское дело", "Лечебное дело", "Фармация"],
    admission: "На базе 9 и 11 классов, конкурс аттестатов",
    address: "г. Шымкент, пр. Тауке хана, 128",
    phone: "+7 (7252) 53-21-10",
  },
  {
    id: "col5",
    name: "Колледж дизайна и сервиса «Арт-Сити»",
    city: "Астана",
    specialties: ["Графический дизайн", "Мода и стиль", "Реклама"],
    admission: "Портфолио + собеседование, на базе 9 и 11 классов",
    address: "г. Астана, ул. Сыганак, 54",
    phone: "+7 (7172) 44-88-12",
  },
];

// ─── Справочник: образовательные программы ───────────────────────────────────

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

// ─── Геймификация ────────────────────────────────────────────────────────────

export interface GamificationStep {
  id: string;
  title: string;
  desc: string;
  points: number;
  action: string; // подпись кнопки для невыполненного шага
  initiallyDone: boolean;
}

export const gamificationSteps: GamificationStep[] = [
  {
    id: "g1",
    title: "Курс «Быстрый старт»",
    desc: "Онбординг-курс по платформе: дашборд, аналитика, отчёты.",
    points: 50,
    action: "Пройти курс",
    initiallyDone: true,
  },
  {
    id: "g2",
    title: "Гайд по AI-помощнику",
    desc: "10 готовых сценариев запросов для ежедневной работы.",
    points: 30,
    action: "Изучить гайд",
    initiallyDone: true,
  },
  {
    id: "g3",
    title: "Первая консультация",
    desc: "Проведите консультацию с учеником по результатам DeBruce.",
    points: 80,
    action: "Отметить проведённой",
    initiallyDone: true,
  },
  {
    id: "g4",
    title: "Первый отчёт",
    desc: "Сформируйте и скачайте отчёт по классу из раздела «Аналитика».",
    points: 40,
    action: "Сформировать отчёт",
    initiallyDone: true,
  },
  {
    id: "g5",
    title: "Курс «Интерпретация результатов»",
    desc: "Мини-курс с тестом: как читать профили DeBruce, MBTI и Голланда.",
    points: 100,
    action: "Пройти мини-тест",
    initiallyDone: false,
  },
  {
    id: "g6",
    title: "Вебинар «Профориентация в школе»",
    desc: "Запись вебинара с методистами платформы (45 минут).",
    points: 60,
    action: "Отметить просмотренным",
    initiallyDone: false,
  },
];

// ─── Личный кабинет педагога ─────────────────────────────────────────────────

export const teacherCourses = [
  { id: "tc1", name: "Быстрый старт для профориентатора", date: "12.07.2026", hours: 2 },
  { id: "tc2", name: "AI-помощник: практикум", date: "15.07.2026", hours: 3 },
];

export const teacherBadges = [
  { id: "b1", name: "Первые шаги", desc: "Пройден онбординг-курс", earned: true },
  { id: "b2", name: "AI-энтузиаст", desc: "50 запросов к AI-помощнику", earned: true },
  { id: "b3", name: "Наставник", desc: "10 консультаций с учениками", earned: true },
  { id: "b4", name: "Аналитик", desc: "Скачано 5 отчётов", earned: false },
  { id: "b5", name: "Методист", desc: "20 материалов из библиотеки", earned: false },
];

// ─── Библиотека ──────────────────────────────────────────────────────────────

export interface LibrarySection {
  id: string;
  title: string;
  desc: string;
  items: { name: string; type: string; length: string }[];
}

export const librarySections: LibrarySection[] = [
  {
    id: "method",
    title: "Методические материалы",
    desc: "Рекомендации, нормативные документы, чек-листы и шаблоны",
    items: [
      { name: "План профориентационной работы на год", type: "Шаблон", length: "6 стр." },
      { name: "Чек-лист консультации по результатам DeBruce", type: "Чек-лист", length: "2 стр." },
      { name: "Приказ МОН РК о профориентационной работе", type: "Документ", length: "12 стр." },
      { name: "Рекомендации по работе с 9-ми классами", type: "Методичка", length: "9 стр." },
    ],
  },
  {
    id: "students",
    title: "Работа с учениками",
    desc: "Сценарии классных часов, упражнения, игры и кейсы",
    items: [
      { name: "Классный час «Профессии будущего»", type: "Сценарий", length: "45 мин" },
      { name: "Игра «Город профессий»", type: "Игра", length: "60 мин" },
      { name: "Упражнение «Карта интересов»", type: "Упражнение", length: "20 мин" },
      { name: "Кейс: ученик не знает, чего хочет", type: "Кейс", length: "15 мин" },
    ],
  },
  {
    id: "parents",
    title: "Работа с родителями",
    desc: "Сценарии собраний, памятки и материалы для консультаций",
    items: [
      { name: "Родительское собрание о выборе профессии", type: "Сценарий", length: "60 мин" },
      { name: "Памятка «Как поддержать выбор ребёнка»", type: "Памятка", length: "2 стр." },
      { name: "FAQ для родителей о платформе", type: "FAQ", length: "4 стр." },
    ],
  },
  {
    id: "pro",
    title: "Профессиональное обучение",
    desc: "Онлайн-курсы, видеоуроки и сертификация",
    items: [
      { name: "Курс «Интерпретация результатов тестов»", type: "Курс", length: "4 часа" },
      { name: "Видеоурок «Сложные консультации»", type: "Видео", length: "25 мин" },
      { name: "Мини-курс «Данные в работе педагога»", type: "Курс", length: "2 часа" },
    ],
  },
  {
    id: "cases",
    title: "Практические кейсы",
    desc: "Реальные ситуации и разборы экспертов",
    items: [
      { name: "Ученик выбирает между IT и медициной", type: "Разбор", length: "12 мин" },
      { name: "Родители против выбора ребёнка", type: "Разбор", length: "18 мин" },
      { name: "Класс с низкой вовлечённостью", type: "Алгоритм", length: "8 стр." },
    ],
  },
  {
    id: "knowledge",
    title: "База знаний",
    desc: "Современные профессии, направления и исследования",
    items: [
      { name: "Атлас новых профессий Казахстана", type: "Справочник", length: "40 стр." },
      { name: "Исследование: рынок труда РК 2026", type: "Исследование", length: "25 стр." },
      { name: "Обзор изменений в правилах приёма", type: "Статья", length: "6 стр." },
    ],
  },
];

export const trainingFaq = [
  { q: "Как ученику попасть на платформу?", a: "Ученики регистрируются по QR-коду или ссылке школы. Область, город и школа подставляются автоматически — ученик указывает только имя, класс и почту." },
  { q: "Могу ли я видеть результаты конкретного ученика?", a: "Да. Раздел «Аналитика» → класс → карточка ученика: все тесты, история прохождений, рекомендации AI и подходящие вузы." },
  { q: "Как скачать отчёт по классу?", a: "На любом уровне раздела «Аналитика» нажмите «Скачать отчёт» — документ формируется автоматически по текущему уровню (школа, класс или ученик)." },
  { q: "Что делать, если ученики не проходят тесты?", a: "Откройте дашборд — система покажет, кто не начал диагностику. AI-помощник подскажет план вовлечения, а в разделе «Обучение» есть сценарии классных часов." },
];
