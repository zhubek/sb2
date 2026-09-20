import gops from "../nav/gops.json";
import nogop from "../nav/nogop.json";
import details from "../nav/details.json";
import institutions from "../nav/institutions.json";
import colleges from "../nav/college-programs.json";
import { institutionPrograms } from "../nav/institution-programs";
import type { Json, Values } from "./types";

export interface EducationProgram {
  institutionId: number; code: string; name: string; groupCode: string;
  price: number | null; threshold: number | null; language: string;
  duration: number | null; exams: string[];
}
export const educationPrograms = Object.entries(details).flatMap(([id, detail]) => {
  const ops = (detail as {ops?: {code:string;name:string;g?:string;p?:number|null;t?:number|null;l?:string;dur?:number;e?:string[]}[]}).ops || [];
  return ops.map((o,index) => ({id:`program.${id}.${index}`,value:{institutionId:Number(id),code:o.code,name:o.name,groupCode:o.g||"",price:o.p??null,threshold:o.t??null,language:o.l||"",duration:o.dur??null,exams:o.e||[]} as EducationProgram}));
});
export const institutionNames = new Map(institutions.map(i=>[i.i,i.name]));

// One program editor updates all navigator views that refer to that offering.
export function projectPrograms(input: Values): Values {
  const values = {...input};
  for(const [key,raw] of Object.entries(input)) {
    if(!key.startsWith("program."))continue;
    const p=raw as unknown as EducationProgram;
    const instKey=`institution.${p.institutionId}`;
    const original=institutions.find(i=>i.i===p.institutionId);
    if(!original)continue;
    const institution=structuredClone(values[instKey]??{...original,detail:(details as Record<string,unknown>)[String(p.institutionId)]}) as unknown as typeof original & {detail:{ops?: Record<string,unknown>[]}};
    const index=Number(key.split(".")[2]);
    const op=institution.detail.ops?.[index];
    if(op)Object.assign(op,{name:p.name,p:p.price,t:p.threshold,l:p.language,g:p.groupCode,dur:p.duration??undefined,e:p.exams});
    values[instKey]=institution as unknown as Json;
    const source=(details as unknown as Record<string,{ops:Record<string,unknown>[]}>) [String(p.institutionId)]?.ops?.[index];
    const codes=new Set([String(source?.g||''),p.groupCode]);
    for(const code of codes){
      const base=gops.find(g=>g.code===code);if(!base)continue;
      const group=structuredClone(values[`gop.${code}`]??base) as unknown as {no:number;nu:number;univ:Record<string,{k:number;ops:{code:string;o:string;p:number|null;g:number|null}[]}>};
      const key=String(p.institutionId),u=group.univ[key];
      if(u){const at=u.ops.findIndex(o=>o.code===p.code&&(o.o===source?.name||o.o===p.name));if(at>=0)u.ops.splice(at,1);u.k=u.ops.length;}
      if(code===p.groupCode){const target=group.univ[key]??{k:0,ops:[]};target.ops.push({code:p.code,o:p.name,p:p.price,g:p.threshold});target.k=target.ops.length;group.univ[key]=target;}
      else if(u&&!u.ops.length)delete group.univ[key];
      group.no=Object.values(group.univ).reduce((n,u)=>n+u.ops.length,0);group.nu=Object.keys(group.univ).length;
      values[`gop.${code}`]=group as unknown as Json;
    }
    const extras=structuredClone(values[`nogop.${p.institutionId}`]??(nogop as Record<string,unknown>)[String(p.institutionId)]) as {code:string;name:string;p:number|null;t:number|null;l?:string;dur?:number}[]|undefined;
    if(extras?.some(o=>o.code===p.code)){values[`nogop.${p.institutionId}`]=extras.map(o=>o.code===p.code?{...o,name:p.name,p:p.price,t:p.threshold,l:p.language,dur:p.duration??undefined}:o) as unknown as Json;}

  }
  // Counts are derived on read, without overwriting the editorial documents.
  const collegeCounts = new Map<number, unknown[]>();
  for (const original of colleges.programs) {
    const program = (values[`college.${original.code}`] ?? original) as unknown as { cols: number[] };
    for (const id of new Set(program.cols)) {
      const offerings = collegeCounts.get(id) ?? [];
      offerings.push(program);
      collegeCounts.set(id, offerings);
    }
  }
  const counts: Record<string, number> = {};
  for (const original of institutions) {
    const key = `institution.${original.i}`;
    const institution = (values[key] ?? {...original, detail:(details as Record<string, unknown>)[String(original.i)] ?? {about:""}}) as unknown as typeof original & {detail?:{ops?:unknown[]}};
    const offerings = institutionPrograms(institution.kind, institution.detail?.ops ?? [], collegeCounts.get(original.i) ?? []);
    const extras = institution.kind === "v" ? (values[`nogop.${original.i}`] ?? (nogop as Record<string,unknown[]>)[String(original.i)] ?? []) as unknown[] : [];
    counts[String(original.i)] = offerings.length + extras.length;
    if (Object.hasOwn(values, key)) values[key] = {...institution, nOps:counts[String(original.i)]} as unknown as Json;
  }
  values["nav.institution-counts"] = counts;
  return values;
}
