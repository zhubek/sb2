import { educationPrograms, institutionNames } from "./programs";
import * as mock from "../mock-data";
import * as teacher from "../teacher-mock-data";
import * as reports from "../report-data";
import * as info from "../info-data";
import * as course from "../course-module1";
import landing from "./landing-defaults.json";
import copy from "./copy-defaults.json";
import inline from "./inline-defaults.json";
import teacherReplies from "./teacher-replies.json";
import institutions from "../nav/institutions.json";
import details from "../nav/details.json";
import gops from "../nav/gops.json";
import college from "../nav/college-programs.json";
import industry from "../nav/industries.json";
import meta from "../nav/meta.json";
import nogop from "../nav/nogop.json";
import type { ContentDocument, Group, Json } from "./types";
import { defaultTests } from "./test-defaults";
export { defaultTests } from "./test-defaults";

const titles: Record<string, string> = {
  currentUser: "Пример профиля ученика", skills: "Навыки DeBruce", recommendedIndustries: "Рекомендуемые отрасли", universities: "Примеры вузов в отчётах", colleges: "Примеры колледжей", gops: "Примеры программ в рекомендациях", testHistory: "Пример истории тестов", checklist: "Чек-лист ученика", portfolioItems: "Примеры портфолио", savedUniversities: "Пример избранных вузов", hollandScales: "Шкалы Голланда", mbtiScales: "Шкалы MBTI", aiTemplateQuestions: "Вопросы ученика помощнику", aiMockReplies: "Демонстрационные ответы помощника", teacherAiTemplates: "Вопросы педагога помощнику", teacher: "Пример профиля педагога", schoolStats: "Пример статистики школы", attentionSignals: "Примеры сигналов внимания", activityData: "Пример активности", schoolClasses: "Примеры классов", teacherStudents: "Примеры учеников", schoolInterests: "Интересы школы", popularProfessions: "Популярные профессии", periodSummary: "Сводка за период", eduPrograms: "Программы педагога", trainingGuides: "Методические материалы", trainingVideos: "Обучающие видео", season: "Текущий сезон", teacherBadges: "Значки школы", pointsRules: "Правила начисления баллов", seasonPoints: "Пример баллов за сезон", coverageProgress: "Пример охвата", decidedStudents: "Пример определившихся учеников", bonusTransactions: "Пример начислений", leaderPeriodLabels: "Названия периодов", leaderboards: "Пример рейтинга школ", courseModules: "Модули курса", courseInfo: "Описание курса", moduleStatusLabels: "Статусы обучения", teacherReports: "Материалы отчётов педагога", studentGuides: "Памятки ученикам", trainingFaq: "Частые вопросы педагогов", module1Meta: "Модуль 1 · описание", module1Lessons: "Модуль 1 · уроки", module1Quiz: "Модуль 1 · итоговый квиз", kzUniversities: "Популярные вузы Казахстана", worldUniversities: "Популярные зарубежные вузы", mainSkills: "Основные навыки", softSkills: "Гибкие навыки", hardSkills: "Профессиональные навыки", professionSectors: "Справочник профессий", workingCategories: "Рабочие профессии", reportDisclaimer: "Пояснение к отчётам", debruceWhatIs: "О методике DeBruce", debruceTop: "DeBruce · ведущие навыки", debruceAdditional: "DeBruce · остальные навыки", debruceIndustries: "DeBruce · подходящие отрасли", debruceAdditionalIndustries: "DeBruce · другие отрасли", mbtiWhatIs: "О методике MBTI", mbtiReport: "MBTI · содержание отчёта", hollandWhatIs: "О методике Голланда", hollandSixTypes: "Голланд · шесть типов", hollandCodeMeaning: "Голланд · расшифровка кода", hollandTopTypes: "Голланд · ведущие типы", hollandProfessions: "Голланд · профессии", generalReport: "Комплексный отчёт",
};
const landingTitles: Record<string,string> = { nav: "Лендинг · меню", hero: "Лендинг · первый экран", skills: "Лендинг · примеры навыков", how: "Лендинг · с чего начать", what: "Лендинг · возможности", panes: "Лендинг · карточки платформы", paneScreens: "Лендинг · примеры экранов", privacy: "Лендинг · приватность", faq: "Лендинг · вопросы и ответы", codes: "Лендинг · справочники", finalCta: "Лендинг · финальный призыв" };
function pageTitle(file:string) {
  if(file==='components/content-language.tsx')return 'Выбор языка';
  const normalized=file.replace(/\/\(platform\)|\/\(panel\)/g,'');
  const names:Record<string,string>={
    'app/page.tsx':'Главная страница','app/auth/auth-client.tsx':'Вход ученика','app/dashboard/page.tsx':'Кабинет ученика','app/tests/page.tsx':'Список тестов','app/tests/debruce/debruce-flow.tsx':'Прохождение DeBruce','app/tests/mbti/mbti-flow.tsx':'Прохождение MBTI','app/tests/holland/holland-flow.tsx':'Прохождение Голланда','app/tests/report/page.tsx':'Комплексный отчёт','app/tests/debruce/report/page.tsx':'Отчёт DeBruce','app/tests/mbti/report/page.tsx':'Отчёт MBTI','app/tests/holland/report/page.tsx':'Отчёт Голланда','app/portfolio/page.tsx':'Портфолио ученика','app/profile/page.tsx':'Профиль ученика','app/chat/page.tsx':'Чат ученика','app/professions/page.tsx':'Справочник профессий','app/skills/page.tsx':'Справочник навыков','app/popularuniversity/page.tsx':'Популярные университеты','app/workingprofessionsgen/page.tsx':'Рабочие профессии','app/teacher/page.tsx':'Кабинет педагога','app/teacher/course/page.tsx':'Курс педагога','app/teacher/course/module1/page.tsx':'Модуль 1: обучение и квиз','app/teacher/analytics/page.tsx':'Аналитика школы','app/teacher/analytics/classes/page.tsx':'Аналитика классов','app/teacher/analytics/students/page.tsx':'Список учеников','app/teacher/analytics/student/[id]/page.tsx':'Карточка ученика','app/teacher/analytics/class/[id]/page.tsx':'Карточка класса','app/teacher/bonus/page.tsx':'Бонусная система','app/teacher/assistant/page.tsx':'Помощник педагога','app/teacher/guide/page.tsx':'Руководство педагога','app/teacher/profile/page.tsx':'Профиль педагога','app/teacher/profile/edit/page.tsx':'Редактирование профиля педагога','app/teacher/reports/page.tsx':'Отчёты педагога','app/teacher/login/page.tsx':'Вход педагога','app/teacher/handbook/page.tsx':'Справочник педагога','app/not-found.tsx':'Страница не найдена','app/onboarding/page.tsx':'Знакомство с платформой','app/verify/[id]/page.tsx':'Проверка сертификата','components/section-quiz.tsx':'Общий экран вопросов','components/custom-test.tsx':'Прохождение дополнительных тестов','components/platform-nav.tsx':'Меню ученика','components/teacher-nav.tsx':'Меню педагога','components/checklist-menu.tsx':'Прогресс ученика','components/info-shell.tsx':'Меню справочников','components/ai-assistant.tsx':'Всплывающий AI-помощник','components/teacher-onboarding.tsx':'Знакомство педагога с платформой','components/report-blocks.tsx':'Общие блоки отчётов','components/test-result-rows.tsx':'Краткие результаты тестов','components/profession-carousel.tsx':'Карусель профессий','components/landing-steps.tsx':'Шаги на главной','components/navigator/navigator.tsx':'Фильтры и поиск навигатора','components/navigator/institution-view.tsx':'Карточка учебного заведения','components/navigator/gop-view.tsx':'Карточка группы программ','components/navigator/college-view.tsx':'Карточка специальности колледжа','components/navigator/industry-view.tsx':'Карточка отрасли','components/download-report.tsx':'Скачивание отчёта','components/download-pdf.tsx':'Скачивание PDF','components/report-button.tsx':'Кнопки отчётов','components/report-preview.tsx':'Предпросмотр отчётов','components/analytics-tabs.tsx':'Вкладки аналитики','components/activity-chart.tsx':'График активности','components/teacher-ai-button.tsx':'Кнопка помощника педагога','app/universities/industries/page.tsx':'Список отраслей','app/tests/attempts/[id]/page.tsx':'История ответов на тест',
  };
  return names[normalized] || normalized.replace(/^app\//,'').replace(/^components\//,'').replace(/\/page\.tsx$/,'').replace('.tsx','');
}
const docs: ContentDocument[] = [];
function add(id: string, title: string, group: Group, value: unknown, preview: string, description = "", kind?: ContentDocument["kind"]) {
  docs.push({ id, title, group, value: JSON.parse(JSON.stringify(value)) as Json, preview, description, kind });
}
defaultTests.forEach(t => add(`test.${t.slug}`,t.name,"tests",t,`/tests/${t.slug}`,t.method,"test"));
add('assistant.teacher-replies','Ответы помощника педагога','assistant',teacherReplies,'/teacher/assistant','Демонстрационные сценарии и ссылки на учеников');
for (const [module, values, baseGroup, preview] of [
  ["mock-data",mock,"reports","/dashboard"], ["teacher-mock-data",teacher,"demo","/teacher"], ["report-data",reports,"reports","/tests/report"], ["info-data",info,"pages","/professions"], ["course-module1",course,"courses","/teacher/course/module1"],
] as const) {
  for(const [key,value] of Object.entries(values)) {
    if(typeof value === "function" || ["tests","debruceSections","mbtiSections","hollandSections","adminStats","adminTopIndustries","adminUsers","adminTests"].includes(key)) continue;
    let group: Group = baseGroup;
    if(/^(currentUser|testHistory|portfolioItems|savedUniversities)$/.test(key)) group="demo";
    if(/^(training|studentGuides|course|module)/.test(key)) group="courses";
    if(/^(checklist|teacherBadges|pointsRules|season$)/.test(key)) group="achievements";
    if(/^(ai|teacherAi)/.test(key)) group="assistant";
    const editable=key==='module1Quiz' ? course.module1Quiz.map(q=>({...q,...(q.options?{options:q.options.map(o=>({...o,correct:!!o.correct}))}:{})})) : value;
    add(`${module}.${key}`,titles[key] || key,group,editable,preview);
  }
}
Object.entries(landing).forEach(([key,value])=>add(`landing.${key}`,landingTitles[key],"pages",value,"/","Русский и казахский языки"));
Object.entries(inline).forEach(([id,d])=>add(id,`${pageTitle(d.file)} · ${d.name==='LONG_ANSWER'?'ответ помощника':d.name==='steps'?'шаги':d.name==='periods'?'периоды':d.name==='tabs'?'вкладки':d.name==='letters'?'расшифровки':d.name==='testFilters'?'фильтры':d.name==='severityStyles'?'статусы':d.name==='pages'?'навигация':'карточки'}`,d.name==='LONG_ANSWER'?'assistant':'pages',d.value,'/',"Карточки, подписи и содержание страницы"));
Object.entries(copy).forEach(([id,d]) => {
  const route=d.file.replace(/^app/,"").replace(/\/\(platform\)|\/\(panel\)/g,"").replace(/\/page\.tsx$/,"");
  add(id,`${pageTitle(d.file)} · тексты`,"pages",d.values,route.startsWith('/') && !route.includes('[') ? route || '/' : '/',"Заголовки, пояснения и кнопки","copy");
});
institutions.forEach(d => add(`institution.${d.i}`,d.name,"catalog",{...d,detail:(details as Record<string, unknown>)[String(d.i)] || {about:"",addr:"",phone:"",email:"",site:""}},`/universities/${d.i}`,`${d.kind === 'c' ? 'Колледж' : d.kind === 'a' ? 'Зарубежный вуз' : 'Вуз'} · ${d.city}`));
gops.forEach(d => add(`gop.${d.code}`,`${d.code} · ${d.name}`,"catalog",d,`/universities/gop/${d.code}`,"Группа образовательных программ"));
college.programs.forEach(d => add(`college.${d.code}`,`${d.code} · ${d.name}`,"catalog",d,`/universities/college/${d.code}`,"Специальность колледжа"));
add("nav.meta","Навигатор · отрасли и география","catalog",meta,"/universities/industries");
Object.entries(industry.ind).forEach(([key,value])=>add(`industry.${key}`,key,"catalog",value,"/universities/industries","Направления и профессии отрасли"));
Object.entries(industry.TD).forEach(([key,value])=>add(`direction.${key}`,key,"catalog",value,"/universities/industries","Описание направления"));
Object.entries(industry.pd).forEach(([key,value])=>add(`profession.${key}`,key,"catalog",value,"/universities/industries","Описание профессии"));
Object.entries(nogop).forEach(([key,value])=>add(`nogop.${key}`,`Дополнительные программы · ${institutions.find(d=>String(d.i)===key)?.name || key}`,"catalog",value,`/universities/${key}`));
add("nav.college-aggregates","Колледжи · сроки и языки обучения","catalog",college.agg,"/universities");
educationPrograms.forEach(d=>add(d.id,d.value.name,"catalog",d.value,`/universities/program/${d.id}`,`${d.value.code} · ${institutionNames.get(d.value.institutionId)||''}`));
const index = new Map(docs.map(d=>[d.id,d]));
export function hasDefaultDocument(id:string){return index.has(id);}
export function editorReferences(entries: import("./types").Store["entries"] = {}){
  return {institutions:institutions.map(i=>({value:i.i,label:String((entries[`institution.${i.i}`]?.draft as Record<string,Json>|undefined)?.name || i.name)})),industries:meta.industries.map((i,index)=>({value:index,label:i.name}))};
}
export function allDocuments(): ContentDocument[] { return [...index.values()]; }
export function getDocument(id: string) { return index.get(id); }
