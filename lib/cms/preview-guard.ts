// Runs before hydration in the isolated iframe. Only fixed application code is
// serialized; the document payload is never inserted into executable JavaScript.
export function previewGuard(id:string,focus?:string) {
  return `(${install.toString()})(${JSON.stringify(id).replace(/</g,'\\u003c')},${JSON.stringify(focus??'').replace(/</g,'\\u003c')})`;
}
function install(id:string,focus:string) {
  (window as any).__CMS_PREVIEW__=true;
  const message='Действие доступно на платформе. Предпросмотр не сохраняет данные.';
  const notice=()=>{let el=document.getElementById('cms-preview-notice');if(!el){el=document.createElement('div');el.id='cms-preview-notice';el.style.cssText='position:fixed;bottom:12px;left:12px;right:12px;padding:12px;background:#27213c;color:white;font:13px sans-serif;border-radius:10px;z-index:999999';document.body.append(el);}el.textContent=message;setTimeout(()=>el?.remove(),2500);};
  const fetchOriginal=window.fetch.bind(window);
  window.fetch=(input,init)=>{
    const method=(init?.method??(input instanceof Request?input.method:'GET')).toUpperCase();
    if (!['GET','HEAD'].includes(method)){notice();return Promise.resolve(new Response(JSON.stringify({error:message}),{status:403,headers:{'Content-Type':'application/json'}}));}
    return fetchOriginal(input,init);
  };
  const open=XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open=function(method:string,...args:any[]){if(!['GET','HEAD'].includes(method.toUpperCase()))throw new Error(message);return (open as any).call(this,method,...args);};
  navigator.sendBeacon=()=>false;
  // Keep local UI interactions (for example demo chat) usable. Network writes
  // remain blocked, and native form navigation is always prevented.
  document.addEventListener('submit',e=>{e.preventDefault();},true);
  HTMLFormElement.prototype.submit=notice;
  const storageGet=Storage.prototype.getItem;
  Storage.prototype.getItem=function(key){if(key==='teacher-onboarding-done')return id.includes('teacher-onboarding')?null:'1';return storageGet.call(this,key);};
  Storage.prototype.setItem=()=>{};Storage.prototype.removeItem=()=>{};Storage.prototype.clear=()=>{};
  const cookie=Object.getOwnPropertyDescriptor(Document.prototype,'cookie');
  if(cookie?.get)Object.defineProperty(document,'cookie',{get:()=>cookie.get!.call(document),set:()=>{}});
  window.open=()=>{notice();return null;};window.print=notice;
  document.addEventListener('click',e=>{const target=(e.target as Element).closest?.('a,[data-cms-navigation="true"]');if(target && !target.getAttribute('href')?.startsWith('#')){e.preventDefault();e.stopImmediatePropagation();notice();}},true);
  // Focus the section named in the usage map once the real page has hydrated.
  let tries=0;
  const timer=setInterval(()=>{
    if(document.readyState!=='complete')return;
    if(++tries>24){clearInterval(timer);return;}
    if(!focus)return;
    let target=document.getElementById(focus);
    if(!target){target=Array.from(document.querySelectorAll('button,h1,h2,h3')).find(e=>e.textContent?.trim()===focus || e.getAttribute('data-cms-label')===focus) as HTMLElement|undefined??null;if(target?.tagName==='BUTTON' && target.getAttribute('aria-expanded')!=='true')target.click();}
    if(target){target.scrollIntoView({block:'start'});clearInterval(timer);}
  },300);
}
