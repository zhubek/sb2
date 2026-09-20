"use client";
import { randomId } from "@/lib/random-id";
import type { Json } from "@/lib/cms/types";
import ValueEditor, { OrderButtons, moveItem } from "./fields";
export default function CollectionEditor({value,onChange,selected,onSelect,label,filter}:{value:Json[];onChange:(v:Json[])=>void;selected:number;onSelect:(i:number)=>void;label:string;filter?:string}){
 const current=Math.min(selected,value.length-1),item=value[current];
 const title=(v:Json,i:number)=>{const o=v as Record<string,Json>;return String(o.title||o.q||o.name||`${label} ${i+1}`);};
 function add(){const copy=structuredClone(item) as Record<string,Json>;copy.id=randomId();if('q'in copy)copy.q='Новый вопрос';if('title'in copy)copy.title='Новый урок';if('short'in copy)copy.short='Новый урок';if('num'in copy)copy.num=String(value.length+1);onChange([...value,copy]);onSelect(value.length);}
 function duplicate(){const copy=structuredClone(item) as Record<string,Json>;copy.id=randomId();onChange([...value.slice(0,current+1),copy,...value.slice(current+1)]);onSelect(current+1);}
 return <><label className="admin-field"><span>{label} · {value.length}</span><select className="admin-input" value={current} onChange={e=>onSelect(Number(e.target.value))}>{value.map((v,i)=><option key={i} value={i}>{i+1}. {title(v,i)}</option>)}</select></label><div className="flex items-center justify-between my-4"><button className="admin-btn" onClick={add}>Добавить {label.toLocaleLowerCase('ru')}</button><OrderButtons index={current} length={value.length} move={to=>{onChange(moveItem(value,current,to));onSelect(to);}} duplicate={duplicate} remove={()=>{onChange(value.filter((_,i)=>i!==current));onSelect(Math.max(0,current-1));}}/></div><ValueEditor filter={filter} key={String((item as Record<string,Json>).id)||current} value={item} onChange={next=>onChange(value.map((v,i)=>i===current?next:v))}/></>;
}
