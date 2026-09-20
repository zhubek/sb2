import { tests, debruceSections, mbtiSections, hollandSections } from "../mock-data";
import type { TestContent } from "./types";
export const defaultScale=["Совсем не про меня", "Скорее нет", "Нейтрально", "Скорее да", "Точно про меня"].map((label,i)=>({value:i+1,label}));
const sections={debruce:debruceSections,mbti:mbtiSections,holland:hollandSections};
export const defaultTests:TestContent[]=tests.map(t=>({slug:t.id,name:t.name,method:t.method,tagline:t.tagline,duration:t.duration,enabled:true,sections:sections[t.id],scale:defaultScale}));
