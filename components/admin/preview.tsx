"use client";
import PagePreview from "./page-preview";
import type { ContentLocale } from "@/backend/src/modules/content/domain/localization";
import type { ContentUsage } from "@/lib/cms/usage";
import { useEffect, useRef, useState, type ComponentProps } from "react";
import { Eye, RotateCcw } from "lucide-react";
import { ContentProvider } from "@/lib/cms/client";
import type { ContentDocument, Json, TestContent, Values } from "@/lib/cms/types";
import SectionQuiz from "@/components/section-quiz";
import LessonBody from "@/components/course-lesson-body";
import type { Lesson } from "@/lib/course-module1";
import CoursePage from "@/components/course-overview";
import InstitutionView from "@/components/navigator/institution-view";
import GopView from "@/components/navigator/gop-view";
import CollegeProgramView from "@/components/navigator/college-view";
import EducationProgramView from "@/components/navigator/education-program-view";
import type { EducationProgram } from "@/lib/cms/programs";
import FinalCheck from "@/components/course-final-check";
import CourseModuleHeader from "@/components/course-module-header";
import type { module1Meta } from "@/lib/course-module1";
import type { References } from "./fields";

type NavPreview={type:'institution';props:ComponentProps<typeof InstitutionView>}|{type:'gop';props:ComponentProps<typeof GopView>}|{type:'college';props:ComponentProps<typeof CollegeProgramView>};
export default function ContentPreview({document:doc,value,selectedIndex,locale="ru",onProgramCount}:{onProgramCount?:(count:number|null)=>void;locale?:ContentLocale;document:ContentDocument & {references?:References;usage?:ContentUsage};value:Json;selectedIndex?:number}) {
  const [published,setPublished]=useState<Values>({}),[nav,setNav]=useState<NavPreview|null>(null),[error,setError]=useState(''),[loading,setLoading]=useState(false),[run,setRun]=useState(0),[done,setDone]=useState(false),[selected,setSelected]=useState(0);
  const previous=useRef(value);
  useEffect(()=>{const controller=new AbortController();setPublished({});fetch('/api/content?locale='+locale,{signal:controller.signal}).then(async r=>{if(!r.ok)throw new Error('Не удалось загрузить тексты предпросмотра');return r.json();}).then(v=>{if(!controller.signal.aborted)setPublished(v);}).catch(e=>{if(!controller.signal.aborted)setError(e.message);});return()=>controller.abort();},[locale]);
  useEffect(()=>{if(Array.isArray(value)&&Array.isArray(previous.current)){const before=previous.current;const changed=value.findIndex((v,i)=>JSON.stringify(v)!==JSON.stringify(before[i]));if(changed>=0)setSelected(changed);}previous.current=value;},[value]);
  useEffect(()=>{
    if(!/^(institution|gop|college)\./.test(doc.id))return;
    const controller=new AbortController();setLoading(true);
    const timer=setTimeout(()=>fetch('/api/admin/preview',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:doc.id,value,locale}),signal:controller.signal}).then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error);return d;}).then((d:NavPreview)=>{if(controller.signal.aborted)return;setNav(d);if(d.type==='institution')onProgramCount?.(d.props.groups.reduce((count,g)=>count+g.ops.length,0));setError('');}).catch(e=>{if(!controller.signal.aborted&&e.name!=='AbortError'){setError(e.message);onProgramCount?.(null);}}).finally(()=>{if(!controller.signal.aborted)setLoading(false);}),250);
    return()=>{clearTimeout(timer);controller.abort();};
  },[doc.id,value,locale,onProgramCount]);
  const index=Array.isArray(value)?Math.min(selectedIndex??selected,value.length-1):0;
  const values={...published,[doc.id]:value};
  let content:React.ReactNode;
  if(doc.kind==='test') {
    const t=value as unknown as TestContent;
    content=<><div className="mb-6"><h2 className="text-2xl font-semibold">{t.name}</h2><p className="mt-2 text-sm text-stone-500">{t.tagline}</p><p className="mt-2 text-xs text-violet-500">{t.method} · {t.duration}</p></div>{done?<div className="rounded-xl bg-teal-50 p-6">Тест пройден в предпросмотре.</div>:<SectionQuiz key={run+JSON.stringify(t.sections.map(s=>s.questions.map(q=>typeof q==='string'?'likert':q.type)))} activeSection={selectedIndex} title={t.name} sections={t.sections} scale={t.scale} preview onFinish={()=>setDone(true)}/>}</>;
  } else if(doc.id==='course-module1.module1Lessons'&&Array.isArray(value)) {
    const lessons=value as unknown as Lesson[],lesson=lessons[index];
    content=<>{selectedIndex===undefined&&<select className="admin-input mb-6" aria-label="Урок в предпросмотре" value={index} onChange={e=>setSelected(Number(e.target.value))}>{lessons.map((l,i)=><option key={i} value={i}>{l.num} · {l.short||l.title}</option>)}</select>}{lesson&&<><p className="text-xs font-mono text-teal-600">{lesson.num}</p><h1 className="mt-2 mb-3 text-2xl font-semibold">{lesson.title}</h1><p className="mb-6 text-xs text-stone-400">{lesson.source}</p><LessonBody lesson={lesson}/></>}</>;
  } else if(doc.id==='course-module1.module1Quiz'&&Array.isArray(value)) {
    content=<FinalCheck key={JSON.stringify(value)} previewQuestion={selectedIndex} onPassed={()=>{}}/>;
  } else if(doc.id==='course-module1.module1Meta')content=<CourseModuleHeader meta={value as unknown as typeof module1Meta}/>;
  else if(['teacher-mock-data.courseInfo','teacher-mock-data.courseModules'].includes(doc.id)) content=<CoursePage/>;
  else if(doc.id.startsWith('program.')) {const p=value as unknown as EducationProgram;const institution=published['institution.'+p.institutionId];const name=institution&&typeof institution==='object'&&!Array.isArray(institution)&&typeof institution.name==='string'?institution.name:doc.references?.institutions.find(i=>i.value===p.institutionId)?.label||'';content=<EducationProgramView program={p} institution={name}/>;}
  else if(nav?.type==='institution')content=<InstitutionView {...nav.props}/>;
  else if(nav?.type==='gop')content=<GopView {...nav.props}/>;
  else if(nav?.type==='college')content=<CollegeProgramView {...nav.props}/>;
  else content=<PagePreview key={doc.id} document={doc} value={value} locale={locale}/>;
  return <aside lang={locale} className="admin-card admin-live-preview"><div className="admin-preview-top"><div><Eye size={15}/><strong>Предпросмотр</strong><span>{loading?'Обновляем…':'В реальном времени'}</span></div>{doc.kind==='test'&&<button className="admin-btn ghost icon" aria-label="Сбросить ответы в предпросмотре" onClick={()=>{setRun(run+1);setDone(false);}}><RotateCcw size={14}/></button>}</div><p className="admin-preview-caption">Черновик · изменения видны сразу, ответы не сохраняются</p>{error&&<div className="admin-note" role="status">{error}</div>}<div className={`admin-preview-page ${!(doc.kind==='test'||doc.id.startsWith('course-module1.')||['teacher-mock-data.courseInfo','teacher-mock-data.courseModules'].includes(doc.id)||/^(program|institution|gop|college)\./.test(doc.id))?'page-frame':''}`} onClickCapture={e=>{if((e.target as Element).closest('a'))e.preventDefault();}}><ContentProvider values={values} locale={locale}>{content}</ContentProvider></div></aside>;
}
