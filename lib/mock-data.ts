import type {
  AdminUser,
  ChecklistItem,
  Industry,
  Skill,
  TestAttempt,
  TestMeta,
  University,
} from "./types";

// ─── Ученик (мок текущего пользователя) ──────────────────────────────────────

export const currentUser = {
  firstName: "Айгерим",
  lastName: "Сатпаева",
  grade: "10 «Б»",
  school: "НИШ ФМН Астана",
  city: "Астана",
  region: "г. Астана",
  email: "aigerim.s@example.com",
  mbtiType: "ENFJ",
  mbtiTitle: "Протагонист",
  hollandTop: null as string | null, // Голланд не пройден
};

// ─── Навыки DeBruce (результат теста) ────────────────────────────────────────

export const skills: Skill[] = [
  { id: "s1", name: "Креативность", score: 92, description: "Способность находить нестандартные решения, генерировать идеи и видеть новые возможности там, где другие видят рутину." },
  { id: "s2", name: "Коммуникация", score: 88, description: "Умение ясно доносить мысли, слушать собеседника и выстраивать продуктивный диалог с разными людьми." },
  { id: "s3", name: "Эмпатия", score: 85, description: "Понимание эмоций и мотивов других людей, способность выстраивать доверительные отношения." },
  { id: "s4", name: "Критическое мышление", score: 74, description: "Анализ информации, проверка фактов и умение делать обоснованные выводы." },
  { id: "s5", name: "Организованность", score: 70, description: "Планирование времени и задач, доведение начатого до конца." },
  { id: "s6", name: "Лидерство", score: 66, description: "Способность вести команду за собой, брать ответственность и вдохновлять других." },
  { id: "s7", name: "Адаптивность", score: 61, description: "Гибкость в новых условиях, готовность быстро учиться и менять подход." },
  { id: "s8", name: "Работа с данными", score: 55, description: "Сбор, структурирование и интерпретация числовой и текстовой информации." },
  { id: "s9", name: "Техническая грамотность", score: 48, description: "Уверенное владение цифровыми инструментами и понимание технологий." },
  { id: "s10", name: "Стрессоустойчивость", score: 42, description: "Сохранение продуктивности и ясности мышления в напряжённых ситуациях." },
];

// ─── Иерархия: отрасль → направление → профиль → программа ──────────────────

export const recommendedIndustries: Industry[] = [
  {
    id: "culture",
    name: "Культура и искусство",
    description: "Творческие профессии: медиа, дизайн, коммуникации, создание контента.",
    directions: [
      {
        id: "journalism",
        name: "Журналистика и информация",
        description: "Создание и распространение информации: СМИ, новые медиа, коммуникации.",
        profiles: [
          {
            id: "pr-smm",
            name: "PR, SMM и реклама",
            description: "Управление репутацией, продвижение брендов и работа с аудиторией.",
            programs: [
              {
                id: "adv-pr",
                name: "Реклама и связи с общественностью",
                description: "Стратегические коммуникации, медиапланирование, работа с брендами.",
                professions: ["PR-менеджер", "Бренд-стратег", "SMM-специалист", "Медиапланер"],
              },
              {
                id: "digital-marketing",
                name: "Цифровой маркетинг",
                description: "Продвижение в digital-среде: аналитика, контент, таргетинг.",
                professions: ["Digital-маркетолог", "Контент-стратег", "Таргетолог"],
              },
            ],
          },
          {
            id: "media",
            name: "Журналистика и новые медиа",
            description: "Репортажи, аналитика, мультимедийные форматы.",
            programs: [
              {
                id: "journalism-prog",
                name: "Журналистика",
                description: "Работа с информацией: от репортажа до документального проекта.",
                professions: ["Журналист", "Редактор", "Военкор", "Продюсер подкастов"],
              },
            ],
          },
        ],
      },
      {
        id: "design",
        name: "Дизайн и визуальные искусства",
        description: "Визуальные коммуникации, продуктовый и графический дизайн.",
        profiles: [
          {
            id: "graphic",
            name: "Графический и цифровой дизайн",
            description: "Айдентика, интерфейсы, визуальный контент.",
            programs: [
              {
                id: "design-prog",
                name: "Дизайн",
                description: "Графический, коммуникационный и цифровой дизайн.",
                professions: ["UX/UI-дизайнер", "Графический дизайнер", "Арт-директор"],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "education",
    name: "Образование и наука",
    description: "Обучение, развитие людей, исследования и просвещение.",
    directions: [
      {
        id: "pedagogy",
        name: "Педагогика и психология",
        description: "Работа с людьми: обучение, сопровождение, развитие.",
        profiles: [
          {
            id: "psychology",
            name: "Психология и консультирование",
            description: "Помощь людям в развитии и решении личных задач.",
            programs: [
              {
                id: "psy-prog",
                name: "Психология",
                description: "Общая, возрастная и организационная психология.",
                professions: ["Психолог-консультант", "HR-специалист", "Коуч"],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "social",
    name: "Социальные науки и коммуникации",
    description: "Общество, международные отношения, управление и право.",
    directions: [
      {
        id: "ir",
        name: "Международные отношения",
        description: "Дипломатия, международные организации, глобальные процессы.",
        profiles: [
          {
            id: "diplomacy",
            name: "Дипломатия и регионоведение",
            description: "Международное сотрудничество и анализ регионов.",
            programs: [
              {
                id: "ir-prog",
                name: "Международные отношения",
                description: "Дипломатия, мировая политика, международное право.",
                professions: ["Дипломат", "Аналитик-международник", "Советник"],
              },
            ],
          },
        ],
      },
    ],
  },
];

// ─── ВУЗы ────────────────────────────────────────────────────────────────────

export const universities: University[] = [
  {
    id: "kaznu",
    name: "Казахский национальный университет им. аль-Фараби",
    shortName: "КазНУ",
    city: "Алматы",
    country: "Казахстан",
    foreign: false,
    description: "Ведущий классический университет Казахстана. Более 70 лет готовит специалистов по всем ключевым направлениям — от естественных наук до журналистики и международных отношений.",
    address: "г. Алматы, пр. аль-Фараби, 71",
    phone: "+7 (727) 377-33-33",
    website: "kaznu.kz",
    minScore: 85,
    priceFrom: 1200000,
    grants: true,
    dorm: true,
    military: true,
    mobility: true,
    perks: ["Скидка 25% отличникам", "Стипендиальные программы", "Кампус в центре города"],
    programs: ["Реклама и связи с общественностью", "Журналистика", "Психология", "Международные отношения"],
  },
  {
    id: "enu",
    name: "Евразийский национальный университет им. Л. Н. Гумилёва",
    shortName: "ЕНУ",
    city: "Астана",
    country: "Казахстан",
    foreign: false,
    description: "Крупнейший университет столицы с сильными программами по социальным и гуманитарным наукам, входит в рейтинг QS.",
    address: "г. Астана, ул. Сатпаева, 2",
    phone: "+7 (7172) 70-95-00",
    website: "enu.kz",
    minScore: 80,
    priceFrom: 990000,
    grants: true,
    dorm: true,
    military: true,
    mobility: true,
    perks: ["Гранты акима столицы", "Двудипломные программы"],
    programs: ["Реклама и связи с общественностью", "Журналистика", "Международные отношения"],
  },
  {
    id: "kimep",
    name: "Университет КИМЭП",
    shortName: "KIMEP",
    city: "Алматы",
    country: "Казахстан",
    foreign: false,
    description: "Частный университет с обучением на английском языке по североамериканской модели. Сильнейшие программы по бизнесу, праву и социальным наукам.",
    address: "г. Алматы, пр. Абая, 4",
    phone: "+7 (727) 270-42-00",
    website: "kimep.kz",
    minScore: 75,
    priceFrom: 2900000,
    grants: true,
    dorm: true,
    military: false,
    mobility: true,
    perks: ["Стипендии до 100%", "Обучение на английском"],
    programs: ["Цифровой маркетинг", "Журналистика", "Международные отношения"],
  },
  {
    id: "sdu",
    name: "SDU University",
    shortName: "SDU",
    city: "Каскелен",
    country: "Казахстан",
    foreign: false,
    description: "Современный кампусный университет с сильной IT- и педагогической школой, активной студенческой жизнью.",
    address: "Алматинская обл., г. Каскелен, ул. Абылай хана, 1/1",
    phone: "+7 (727) 307-95-65",
    website: "sdu.edu.kz",
    minScore: 70,
    priceFrom: 1500000,
    grants: true,
    dorm: true,
    military: false,
    mobility: true,
    perks: ["Внутренние гранты", "Кампус-городок"],
    programs: ["Цифровой маркетинг", "Психология", "Дизайн"],
  },
  {
    id: "turan",
    name: "Университет «Туран»",
    shortName: "Туран",
    city: "Алматы",
    country: "Казахстан",
    foreign: false,
    description: "Один из первых частных университетов Казахстана с практико-ориентированными программами по медиа и креативным индустриям.",
    address: "г. Алматы, ул. Сатпаева, 16а",
    phone: "+7 (727) 260-40-00",
    website: "turan-edu.kz",
    minScore: 60,
    priceFrom: 850000,
    grants: true,
    dorm: false,
    military: true,
    mobility: false,
    perks: ["Скидки многодетным семьям", "Собственная медиастудия"],
    programs: ["Реклама и связи с общественностью", "Журналистика", "Дизайн", "Психология"],
  },
  {
    id: "msu",
    name: "МГУ им. М. В. Ломоносова",
    shortName: "МГУ",
    city: "Москва",
    country: "Россия",
    foreign: true,
    description: "Ведущий университет России. Для казахстанцев доступны квоты и межгосударственные программы.",
    address: "г. Москва, Ленинские горы, 1",
    phone: "+7 (495) 939-10-00",
    website: "msu.ru",
    minScore: 95,
    priceFrom: 2500000,
    grants: true,
    dorm: true,
    military: false,
    mobility: true,
    perks: ["Квоты для граждан РК", "Общежитие на кампусе"],
    programs: ["Журналистика", "Психология", "Международные отношения"],
  },
  {
    id: "hku",
    name: "University of Hong Kong",
    shortName: "HKU",
    city: "Гонконг",
    country: "Гонконг",
    foreign: true,
    description: "Топ-30 мирового рейтинга QS. Программы бакалавриата на английском, активно принимает студентов из Центральной Азии.",
    address: "Pokfulam Road, Hong Kong",
    phone: "+852 3917-2882",
    website: "hku.hk",
    minScore: 97,
    priceFrom: 9500000,
    grants: true,
    dorm: true,
    military: false,
    mobility: true,
    perks: ["Стипендии для иностранцев", "Обмены с 400+ вузами"],
    programs: ["Журналистика", "Международные отношения", "Цифровой маркетинг"],
  },
  {
    id: "nu",
    name: "Nazarbayev University",
    shortName: "NU",
    city: "Астана",
    country: "Казахстан",
    foreign: false,
    description: "Исследовательский университет мирового уровня с обучением на английском языке и полным грантовым покрытием для большинства студентов.",
    address: "г. Астана, пр. Кабанбай батыра, 53",
    phone: "+7 (7172) 70-66-88",
    website: "nu.edu.kz",
    minScore: 98,
    priceFrom: 0,
    grants: true,
    dorm: true,
    military: false,
    mobility: true,
    perks: ["Полный грант для большинства", "Кампус мирового уровня"],
    programs: ["Психология", "Международные отношения"],
  },
];

// ─── Тесты и история ─────────────────────────────────────────────────────────

export const tests: TestMeta[] = [
  {
    id: "debruce",
    name: "DeBruce",
    tagline: "Флагманский тест: рейтинг 10 навыков и рекомендации по отраслям и программам.",
    duration: "≈ 15 минут",
    questions: 40,
    passed: true,
    flagship: true,
  },
  {
    id: "mbti",
    name: "MBTI",
    tagline: "Тип личности: как вы принимаете решения и взаимодействуете с миром.",
    duration: "≈ 10 минут",
    questions: 28,
    passed: true,
  },
  {
    id: "holland",
    name: "Тест Голланда",
    tagline: "Профессиональные интересы: 6 типов профессиональной направленности.",
    duration: "≈ 8 минут",
    questions: 24,
    passed: false,
  },
];

export const testHistory: TestAttempt[] = [
  { id: "a3", testId: "mbti", date: "14 июля 2026", time: "16:42", summary: "ENFJ · Протагонист" },
  { id: "a2", testId: "debruce", date: "12 июля 2026", time: "10:15", summary: "Топ-3: Креативность, Коммуникация, Эмпатия" },
  { id: "a1", testId: "debruce", date: "3 марта 2026", time: "14:30", summary: "Топ-3: Коммуникация, Креативность, Лидерство" },
];

export const checklist: ChecklistItem[] = [
  { id: "c1", label: "Зарегистрироваться и заполнить профиль", done: true },
  { id: "c2", label: "Пройти онбординг", done: true },
  { id: "c3", label: "Пройти тест DeBruce", done: true, href: "/tests/debruce" },
  { id: "c4", label: "Изучить свои 10 навыков", done: true, href: "/tests/debruce?view=result" },
  { id: "c5", label: "Пройти тест MBTI", done: true, href: "/tests/mbti" },
  { id: "c6", label: "Пройти тест Голланда", done: false, href: "/tests/holland" },
  { id: "c7", label: "Получить комплексный отчёт ИИ", done: false, href: "/dashboard" },
  { id: "c8", label: "Выбрать образовательную программу", done: false, href: "/tests/debruce?view=result" },
  { id: "c9", label: "Сохранить ВУЗы в избранное", done: false, href: "/universities" },
];

export const savedUniversities = ["kaznu", "kimep"];

export const portfolioItems = [
  { id: "p1", name: "Диплом — олимпиада по литературе (обл. этап)", date: "апрель 2026", type: "Диплом" },
  { id: "p2", name: "Сертификат — курс «Основы SMM»", date: "февраль 2026", type: "Сертификат" },
];

// ─── Вопросы тестов: разделы и страницы (сокращённые мок-версии) ─────────────

export interface QuizSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: string[];
}

export const debruceSections: QuizSection[] = [
  {
    id: "creative",
    title: "Творчество и идеи",
    description: "Как вы придумываете новое и находите нестандартные решения",
    icon: "💡",
    questions: [
      "Мне нравится придумывать новые идеи и способы сделать что-то иначе.",
      "Я часто предлагаю необычные решения там, где другие действуют по шаблону.",
      "Мне интересно создавать что-то своё: тексты, видео, проекты, дизайн.",
    ],
  },
  {
    id: "people",
    title: "Общение и люди",
    description: "Как вы взаимодействуете с окружающими",
    icon: "🗣️",
    questions: [
      "Я легко нахожу общий язык с новыми людьми.",
      "Я замечаю, когда у друзей меняется настроение, и понимаю почему.",
      "Мне нравится объяснять и помогать другим разбираться в сложном.",
    ],
  },
  {
    id: "mind",
    title: "Мышление и данные",
    description: "Как вы работаете с информацией и фактами",
    icon: "🧠",
    questions: [
      "Прежде чем поверить информации, я проверяю её источники.",
      "Мне нравится работать с таблицами, числами и статистикой.",
      "Я быстро осваиваю новые программы и цифровые инструменты.",
    ],
  },
  {
    id: "drive",
    title: "Организация и лидерство",
    description: "Как вы планируете и ведёте дела",
    icon: "🎯",
    questions: [
      "Я планирую свои дела заранее и придерживаюсь плана.",
      "В групповой работе я часто беру на себя роль организатора.",
      "Мне комфортно, когда планы внезапно меняются.",
    ],
  },
];

export const mbtiSections: QuizSection[] = [
  {
    id: "energy",
    title: "Энергия",
    description: "Откуда вы черпаете силы: общение или уединение",
    icon: "⚡",
    questions: [
      "После шумной вечеринки я чувствую прилив энергии, а не усталость.",
      "Мне проще думать вслух, обсуждая идею с кем-то.",
    ],
  },
  {
    id: "info",
    title: "Восприятие",
    description: "Как вы воспринимаете информацию: факты или идеи",
    icon: "👁️",
    questions: [
      "Я больше доверяю конкретным фактам, чем догадкам и интуиции.",
      "Мне интереснее «что есть сейчас», чем «что могло бы быть».",
    ],
  },
  {
    id: "decisions",
    title: "Решения",
    description: "Чем вы руководствуетесь: логикой или чувствами",
    icon: "⚖️",
    questions: [
      "Принимая решения, я в первую очередь опираюсь на логику, а не на чувства.",
      "Для меня справедливость важнее, чем сохранение хороших отношений.",
    ],
  },
  {
    id: "lifestyle",
    title: "Образ жизни",
    description: "Как вы организуете свою жизнь: план или спонтанность",
    icon: "📅",
    questions: [
      "Мне комфортнее, когда всё запланировано, чем когда всё спонтанно.",
      "Я предпочитаю закончить дело заранее, а не в последний момент.",
    ],
  },
];

export const hollandSections: QuizSection[] = [
  {
    id: "practice",
    title: "Практика и исследования",
    description: "Работа руками и познание мира",
    icon: "🔧",
    questions: [
      "Мне нравится собирать и чинить вещи своими руками.",
      "Мне интересно проводить исследования и разбираться, как всё устроено.",
    ],
  },
  {
    id: "art-social",
    title: "Творчество и люди",
    description: "Самовыражение и помощь другим",
    icon: "🎨",
    questions: [
      "Я получаю удовольствие от творчества: рисования, музыки, текстов.",
      "Мне нравится помогать людям и объяснять им что-то новое.",
    ],
  },
  {
    id: "business",
    title: "Дело и порядок",
    description: "Организация, влияние и структура",
    icon: "📈",
    questions: [
      "Мне нравится убеждать людей и вести их за собой.",
      "Мне комфортно работать по чётким правилам и инструкциям.",
    ],
  },
];

export const hollandScales = [
  { code: "R", name: "Реалистичный", score: 35 },
  { code: "I", name: "Исследовательский", score: 55 },
  { code: "A", name: "Артистичный", score: 90 },
  { code: "S", name: "Социальный", score: 82 },
  { code: "E", name: "Предприимчивый", score: 68 },
  { code: "C", name: "Конвенциональный", score: 30 },
];

export const mbtiScales = [
  { left: "Интроверсия (I)", right: "Экстраверсия (E)", value: 72, winner: "E" },
  { left: "Сенсорика (S)", right: "Интуиция (N)", value: 64, winner: "N" },
  { left: "Логика (T)", right: "Чувства (F)", value: 70, winner: "F" },
  { left: "Восприятие (P)", right: "Суждение (J)", value: 58, winner: "J" },
];

// ─── ИИ-ассистент ────────────────────────────────────────────────────────────

export const aiTemplateQuestions = [
  "Что означают мои топ-3 навыка?",
  "Какие профессии мне подходят?",
  "Что мне делать дальше?",
  "Зачем проходить тест Голланда?",
  "Как выбрать университет?",
];

export const aiMockReplies: Record<string, string> = {
  default:
    "Отличный вопрос! Судя по вашему профилю, ваши сильные стороны — креативность, коммуникация и эмпатия. Это хорошая база для профессий в медиа, коммуникациях и работе с людьми. Рекомендую пройти тест Голланда — тогда я смогу составить для вас комплексный отчёт. Хотите, расскажу подробнее о какой-то отрасли?",
};

// ─── Данные для админ-панели ─────────────────────────────────────────────────

export const adminStats = {
  totalUsers: 2847,
  activeThisWeek: 612,
  testsCompleted: 5231,
  fullProfiles: 1408,
  avgTestsPerUser: 1.8,
  savedUniversities: 3960,
};

export const adminTopIndustries = [
  { name: "IT и телекоммуникации", count: 684 },
  { name: "Культура и искусство", count: 517 },
  { name: "Медицина и здравоохранение", count: 493 },
  { name: "Образование и наука", count: 402 },
  { name: "Бизнес и финансы", count: 388 },
];

export const adminUsers: AdminUser[] = [
  { id: "u1", name: "Айгерим Сатпаева", email: "aigerim.s@example.com", school: "НИШ ФМН Астана", grade: "10 «Б»", city: "Астана", testsPassed: 2, registeredAt: "12.07.2026" },
  { id: "u2", name: "Данияр Оспанов", email: "d.ospanov@example.com", school: "Гимназия №5", grade: "11 «А»", city: "Алматы", testsPassed: 3, registeredAt: "10.07.2026" },
  { id: "u3", name: "Томирис Жаксылык", email: "tomiris.zh@example.com", school: "Лицей №1", grade: "9 «В»", city: "Шымкент", testsPassed: 1, registeredAt: "09.07.2026" },
  { id: "u4", name: "Алишер Нурланулы", email: "alisher.n@example.com", school: "БИЛ Караганда", grade: "11 «Б»", city: "Караганда", testsPassed: 3, registeredAt: "08.07.2026" },
  { id: "u5", name: "Камила Ержанова", email: "k.erzhanova@example.com", school: "Школа-гимназия №17", grade: "10 «А»", city: "Астана", testsPassed: 0, registeredAt: "07.07.2026" },
  { id: "u6", name: "Арман Токтаров", email: "a.toktarov@example.com", school: "НИШ ХБН Алматы", grade: "12", city: "Алматы", testsPassed: 2, registeredAt: "05.07.2026" },
  { id: "u7", name: "Инкар Абдрахманова", email: "inkar.a@example.com", school: "Гимназия №38", grade: "9 «А»", city: "Атырау", testsPassed: 1, registeredAt: "03.07.2026" },
];

export const adminTests = [
  { id: "debruce", name: "DeBruce", questions: 40, completions: 2513, avgMinutes: 14, retakes: 312, status: "Активен", flagship: true },
  { id: "mbti", name: "MBTI", questions: 28, completions: 1642, avgMinutes: 9, retakes: 187, status: "Активен", flagship: false },
  { id: "holland", name: "Тест Голланда", questions: 24, completions: 1076, avgMinutes: 8, retakes: 94, status: "Активен", flagship: false },
];

export function formatPrice(price: number): string {
  if (price === 0) return "Грант";
  return `от ${price.toLocaleString("ru-RU")} ₸/год`;
}
