import 'server-only';
import index from './usage-index.json';
import meta from '../nav/meta.json';
import industry from '../nav/industries.json';
import type { ContentDocument } from './types';
const titles: Record<string,string> = {'/':'Главная страница','/auth':'Регистрация ученика','/login':'Вход','/onboarding':'Знакомство с платформой','/dashboard':'Кабинет ученика','/portfolio':'Портфолио ученика','/profile':'Профиль ученика','/chat':'Помощник ученика','/tests':'Каталог тестов','/tests/report':'Общий отчёт','/teacher':'Кабинет педагога','/teacher/guide':'Руководство педагога','/teacher/course':'Курс педагога','/teacher/bonus':'Бонусная система','/teacher/assistant':'Помощник педагога','/teacher/reports':'Отчёты педагога','/universities':'Навигатор образования','/universities/industries':'Отрасли','/professions':'Справочник профессий','/skills':'Справочник навыков','/popularuniversity':'Популярные университеты'};
export type ContentUsage = { locations: {path:string;label:string}[]; note?:string; focus?:string };
export function contentUsage(doc: Pick<ContentDocument,'id'|'preview'|'title'>): ContentUsage {
  if (doc.id==='copy.app.platform.tests.attempts.id.page') return {locations:[],note:'Тексты страницы сохранённых ответов (/tests/attempts/[id]). Для этого экрана нужна конкретная попытка текущего пользователя; общий предпросмотр недоступен.'};
  if (doc.id==='copy.components.custom-test') return {locations:[],note:'Запасной шаблон прохождения теста. Сейчас используются отдельные страницы трёх фиксированных тестов: DeBruce, MBTI и Holland.'};
  let paths = (index as Record<string,string[]>)[doc.id] ?? [];
  let focus: string | undefined;
  const preferred:Record<string,string[]>={
    'copy.components.content-language':['/','/tests','/teacher'],
    'copy.components.navigator.college-view':['/universities/college/01120100'],
    'copy.components.navigator.gop-view':['/universities/gop/B001'],
    'copy.components.navigator.institution-view':['/universities/0'],
    'copy.components.report-blocks':['/tests/report','/','/tests/mbti/report','/tests/debruce/report','/tests/holland/report'],
    'copy.components.download-pdf':['/tests/report'],
    'copy.components.ai-assistant':['/dashboard'],
    'copy.components.teacher-ai-button':['/teacher'],
    'copy.components.teacher-onboarding':['/teacher/guide'],
    'inline.components.teacher-onboarding.steps':['/teacher/guide'],
    'mock-data.checklist':['/dashboard'],
    'report-data.reportDisclaimer':['/tests/report'],
    'mock-data.skills':['/tests/debruce/report','/tests/report','/dashboard','/tests/debruce','/teacher/analytics/student/st1'],
    'mock-data.hollandScales':['/tests/holland/report','/tests/report','/tests/holland','/dashboard'],
    'mock-data.mbtiScales':['/tests/mbti/report','/tests/report','/tests/mbti'],
  };
  if(preferred[doc.id])paths=preferred[doc.id];
  const method=/^report-data\.(debruce|mbti|holland)/.exec(doc.id)?.[1];
  if(method && paths.includes(`/tests/${method}/report`)) paths=[`/tests/${method}/report`,...paths.filter(p=>p!==`/tests/${method}/report`)];
  if (doc.id.startsWith('landing.')) paths=['/'];
  if (doc.id.startsWith('teacher-mock-data.training') || doc.id==='teacher-mock-data.studentGuides') {
    paths=['/teacher/guide'];
    focus=doc.id.endsWith('trainingVideos')?'training-videos':doc.id.endsWith('studentGuides')?'student-guides':doc.id.endsWith('trainingFaq')?'training-faq':'training-guides';
  }
  if (/^(industry|direction|profession)\./.test(doc.id)) {
    const kind=doc.id.slice(0,doc.id.indexOf('.')), name=doc.id.slice(kind.length+1);
    const entries=Object.entries(industry.ind) as [string,{groups:Record<string,{profs:Record<string,unknown>}>}][];
    const names=kind==='industry'?[name]:entries.filter(([,d])=>kind==='direction'?!!d.groups[name]:Object.values(d.groups).some(g=>Object.hasOwn(g.profs,name))).map(([n])=>n);
    paths=names.map(n=>meta.industries.findIndex(i=>i.name===n)).filter(i=>i>=0).map(i=>'/universities/industry/'+i);
    focus=name;
  }
  if (doc.id==='nav.meta') paths=['/universities/industries','/universities'];
  if (doc.id==='nav.college-aggregates') paths=['/universities/college/01120100'];
  if (/^(institution|program|gop|college|nogop)\./.test(doc.id)) paths=[doc.preview];
  if (doc.id==='copy.app.not-found') paths=['/preview-missing-page'];
  const locations=[...new Set(paths)].map(path=>({path,label:titles[path] ?? (path.includes('/tests/')&&path.endsWith('/report')?'Отчёт '+path.split('/')[2].toUpperCase():path.startsWith('/universities/industry/')?'Отрасль · '+meta.industries[Number(path.split('/').pop())]?.name:doc.title+' · '+path)}));
  return {locations,focus,note:locations.length?undefined:'Этот материал пока не используется на странице платформы. Изменения сохраняются в CMS; публичного экрана для него пока нет.'};
}
