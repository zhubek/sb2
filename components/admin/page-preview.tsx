"use client";
import { useEffect, useRef, useState } from 'react';
import type { ContentDocument, Json } from '@/lib/cms/types';
import type { ContentUsage } from '@/lib/cms/usage';

export default function PagePreview({document:doc,value,locale}:{document:ContentDocument & {usage?:ContentUsage};value:Json;locale:string}) {
  const locations=doc.usage?.locations??[];
  const [route,setRoute]=useState(locations[0]?.path??''),[url,setUrl]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(true),[width,setWidth]=useState(0),[containerWidth,setContainerWidth]=useState(600),[expanded,setExpanded]=useState(false),[refresh,setRefresh]=useState(0);
  const container=useRef<HTMLDivElement>(null);
  useEffect(()=>{if(!expanded)return;const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setExpanded(false);};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close);},[expanded]);
  useEffect(()=>{if(!container.current)return;const observer=new ResizeObserver(([e])=>setContainerWidth(e.contentRect.width));observer.observe(container.current);return()=>observer.disconnect();},[expanded]);
  useEffect(()=>{
    if(!route)return;
    const controller=new AbortController();setBusy(true);setError('');
    const timer=setTimeout(async()=>{
      try {
        const response=await fetch('/api/admin/page-preview',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:doc.id,value,locale,route}),signal:controller.signal});
        const data=await response.json();if(!response.ok)throw new Error(data.error);
        if(!controller.signal.aborted)setUrl(data.url);
      }catch(e){if(!controller.signal.aborted){setError((e as Error).message);setBusy(false);}}
    },450);
    return()=>{clearTimeout(timer);controller.abort();};
  },[doc.id,value,locale,route,refresh]);
  const frameWidth=width||containerWidth,scale=Math.min(1,containerWidth/frameWidth);
  if(!locations.length)return <div className="admin-note">{doc.usage?.note??'Для этого материала пока нет публичного экрана.'}</div>;
  return <div className={expanded?'admin-page-preview expanded':'admin-page-preview'}>
    <div className="admin-page-preview-toolbar">
      <label>Где используется<select aria-label="Страница предпросмотра" value={route} onChange={e=>setRoute(e.target.value)}>{locations.map(l=><option value={l.path} key={l.path}>{l.label}</option>)}</select></label>
      <div><select aria-label="Размер предпросмотра" value={width} onChange={e=>setWidth(Number(e.target.value))}><option value={0}>По ширине панели</option><option value={1280}>Компьютер · 1280 px</option><option value={390}>Телефон · 390 px</option></select><button className="admin-btn" onClick={()=>setExpanded(!expanded)}>{expanded?'Закрыть':'Развернуть'}</button><button className="admin-btn" aria-label="Обновить предпросмотр страницы" onClick={()=>setRefresh(v=>v+1)}>↻</button></div>
      <p role="status">{busy?'Обновляем экран…':'Реальная страница · черновик · без сохранения действий'}</p>
    </div>
    {error&&<div className="admin-error" role="alert">{error}<button className="admin-btn" onClick={()=>setRefresh(v=>v+1)}>Повторить</button></div>}
    <div ref={container} className="admin-page-preview-frame" style={{height:expanded?'calc(100vh - 185px)':560}}>
      {url&&<iframe title="Предпросмотр страницы платформы" src={url} sandbox="allow-scripts allow-same-origin" referrerPolicy="no-referrer" onLoad={()=>setBusy(false)} style={{width:frameWidth,height:`calc(${expanded?'100vh - 185px':'560px'} / ${scale})`,transform:`scale(${scale})`,transformOrigin:'top left',border:0,background:'white'}}/>}
    </div>
  </div>;
}
