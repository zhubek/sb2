import type { TestContent, Values } from "./types";
import meta from "../nav/meta.json";

export function resolveContent<T>(values: Values, id: string, fallback: T): T {
  if (Object.hasOwn(values, id)) return values[id] as T;
  if(id.startsWith('copy.')) {
    const at=id.lastIndexOf('.'), parent=values[id.slice(0,at)];
    if(parent && typeof parent==='object' && !Array.isArray(parent) && Object.hasOwn(parent,id.slice(at+1)))return parent[id.slice(at+1)] as T;
  }
  if (id === "mock-data.tests") return (fallback as unknown as { id: string }[]).map(t => {
    const edit = values[`test.${t.id}`] as unknown as TestContent | undefined;
    return edit ? { ...t, name: edit.name, method: edit.method, tagline: edit.tagline, duration: edit.duration, questions: edit.sections.reduce((n, s) => n + s.questions.length, 0) } : t;
  }) as T;
  const section = /^mock-data\.(debruce|mbti|holland)Sections$/.exec(id);
  if (section && values[`test.${section[1]}`]) return (values[`test.${section[1]}`] as unknown as TestContent).sections as T;
  if (id === "nav.institutions") return (fallback as unknown as { i: number }[]).map(d => {
    const edit = values[`institution.${d.i}`] as unknown as { detail: unknown } | undefined;
    const { detail: _detail, ...meta } = edit ?? {...d, detail:undefined};
    const count = (values["nav.institution-counts"] as Record<string,number> | undefined)?.[String(d.i)];
    return {...meta, ...(count !== undefined ? {nOps:count} : {})};
  }) as T;
  if (id === "nav.gops") return (fallback as unknown as { code: string }[]).map(d => values[`gop.${d.code}`] ?? d) as T;
  if (id === "nav.gops-compact") return (fallback as unknown as { code: string }[]).map(d => {
    const edit = values[`gop.${d.code}`] as unknown as Record<string, unknown> | undefined;
    if(!edit)return d;
    const industries=((values['nav.meta'] as unknown as typeof meta)?.industries ?? meta.industries);
    const ind=industries.findIndex(i=>i.name===edit.ind);
    const univ=Object.fromEntries(Object.entries(edit.univ as Record<string,{k:number;ops:{p:number|null;g:number|null}[]}>).map(([id,u])=>{
      const prices=u.ops.map(o=>o.p).filter((n):n is number=>n!==null),grants=u.ops.map(o=>o.g).filter((n):n is number=>n!==null);
      return [id,{k:u.k,p:prices.length?Math.min(...prices):null,g:grants.length?Math.min(...grants):null}];
    }));
    return { ...d, name: edit.name, ind:ind>=0?ind:(d as unknown as {ind:number}).ind, dur:edit.dur,univ };
  }) as T;
  if (id.startsWith("nav-meta.")) {
    const key = id.slice(9);
    if (values["nav.meta"]) return (values["nav.meta"] as Record<string, unknown>)[key] as T;
  }
  if (id === "nav.college-programs") {
    const d = fallback as unknown as { programs: { code: string }[]; agg: unknown };
    return { ...d, programs: d.programs.map(p => values[`college.${p.code}`] ?? p), agg: values["nav.college-aggregates"] ?? d.agg } as T;
  }
  if (id === "nav.nogop-compact") {
    const result={...fallback as Record<string,unknown>};
    Object.entries(values).filter(([key])=>key.startsWith('nogop.')).forEach(([key,value])=>{
      result[key.slice(6)]=(value as unknown as {code:string;name:string;p:number|null;t:number|null;ind?:string;l?:string;dur?:number}[]).map((op,i)=>({...op,k:i,ind:meta.industries.findIndex(d=>d.name===op.ind)}));
    });
    return result as T;
  }
  return fallback;
}
