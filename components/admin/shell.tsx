"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, BookOpen, Bot, Building2, ClipboardList, FileText, Gift, History, LayoutGrid, LogOut, Menu, Settings2, Users, X } from "lucide-react";
import { LogoMark } from "@/components/compass-marks";
const links=[
  {href:'/admin',label:'Обзор',icon:LayoutGrid},
  {href:'/admin/tests',label:'Тесты и диагностика',icon:ClipboardList},
  {href:'/admin/content?group=pages',label:'Страницы и тексты',icon:FileText},
  {href:'/admin/universities',label:'Навигатор образования',icon:Building2},
  {href:'/admin/content?group=courses',label:'Курсы и материалы',icon:BookOpen},
  {href:'/admin/content?group=reports',label:'Отчёты и рекомендации',icon:FileText},
  {href:'/admin/content?group=assistant',label:'AI-помощник',icon:Bot},
  {href:'/admin/content?group=achievements',label:'Достижения и бонусы',icon:Gift},
];
export default function AdminShell({children}:{children:React.ReactNode}) {
  const path=usePathname(),search=useSearchParams(),[open,setOpen]=useState(false);
  const active=path+(search.get('group')?'?group='+search.get('group'):'');
  return <div className="admin-app">
    {open && <button aria-label="Закрыть меню" style={{position:'fixed',inset:0,zIndex:29,background:'#20253b55'}} onClick={()=>setOpen(false)}/>}
    <aside className={`admin-sidebar ${open?'open':''}`}>
      <Link className="admin-logo" href="/admin"><LogoMark className="h-8 w-8 text-violet-500"/><div>Smart Bolashaq<small>CONTENT STUDIO</small></div></Link>
      <div className="admin-nav-label">РАБОЧЕЕ ПРОСТРАНСТВО</div>
      <nav>{links.map(({href,label,icon:Icon})=><Link key={href} onClick={()=>setOpen(false)} href={href} className={`admin-nav-link ${active===href?'active':''}`}><Icon size={16} strokeWidth={1.7}/>{label}</Link>)}</nav>
      <div className="admin-nav-label">УПРАВЛЕНИЕ</div>
      <Link className={`admin-nav-link ${path==='/admin/history'?'active':''}`} href="/admin/history"><History size={16}/>История изменений</Link>
      <Link className={`admin-nav-link ${path==='/admin/users'?'active':''}`} href="/admin/users"><Users size={16}/>Демо-данные</Link>
      <Link className={`admin-nav-link ${path==='/admin/settings'?'active':''}`} href="/admin/settings"><Settings2 size={16}/>Настройки и резервная копия</Link>
      <div className="admin-sidebar-foot"><Link href="/" target="_blank" className="flex items-center justify-between">Открыть платформу<ArrowUpRight size={14}/></Link><button className="flex items-center gap-2" onClick={async()=>{await fetch('/api/admin/session',{method:'DELETE'});await signOut({redirectTo:"/login"});}}><LogOut size={14}/>Выйти</button></div>
    </aside>
    <div className="admin-main"><header className="admin-topbar"><div className="flex items-center gap-3"><button className="admin-mobile-toggle" aria-label="Открыть меню" onClick={()=>setOpen(!open)}>{open?<X size={19}/>:<Menu size={19}/>}</button><span style={{fontSize:12,color:'#72798a'}}>Панель администратора <span style={{color:'#ced1db',margin:'0 12px'}}>/</span> Контент</span></div><div className="admin-avatar"><small>Ваше рабочее пространство</small><span>SB</span>Администратор</div></header><main className="admin-body">{children}</main></div>
  </div>;
}
