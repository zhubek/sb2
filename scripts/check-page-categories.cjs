const {chromium}=require('playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const base=process.env.BROWSER_BASE||'http://localhost:3027';
const output='/mnt/sb2dev/backups/page-categories-20260914';fs.mkdirSync(output,{recursive:true});
const accounts=JSON.parse(fs.readFileSync('.data/test-accounts.json','utf8'));
let passed=0;const check=(ok,message)=>{assert.ok(ok,message);console.log('PASS '+message);passed++};
(async()=>{
 const browser=await chromium.launch({args:['--no-sandbox','--disable-dev-shm-usage']});
 const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage();
 page.setDefaultTimeout(30000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 async function ready(){await page.waitForTimeout(250);await page.locator('.admin-card[aria-busy="false"]').waitFor();}
 async function list(params={}){const r=await context.request.get(base+'/api/admin/content?'+new URLSearchParams({group:'pages',...params}));assert.equal(r.status(),200,await r.text());return r.json()}
 try{
  const a=accounts.find(a=>a.email==='admin@sb2.test');await page.goto(base+'/login');await page.getByLabel('Электронная почта').fill(a.email);await page.getByLabel('Пароль',{exact:true}).fill(a.password);await page.getByRole('button',{name:'Войти',exact:true}).click();await page.waitForURL(u=>u.pathname!=='/login');
  const all=await list();check(all.pageCategories.length===6,'backend exposes six named page categories');
  check(all.pageCategories.reduce((sum,c)=>sum+c.count,0)===all.total,'live category counts cover every page');
  const ids=[];
  for(const c of all.pageCategories){const first=await list({pageCategory:c.id});check(first.total===c.count,c.title+' count matches its list');for(let n=1;n<=first.pages;n++){const d=n===1?first:await list({pageCategory:c.id,page:String(n)});check(d.items.every(r=>r.pageCategory===c.id&&r.group==='pages'),c.title+' returns only matching pages');ids.push(...d.items.map(r=>r.id));}}
  check(ids.length===all.total&&new Set(ids).size===all.total,'every live page appears once across categories');
  await page.goto(base+'/admin/content?group=pages');await ready();check(await page.locator('.admin-page-category').count()===6,'six category cards render');await page.screenshot({path:output+'/categories-desktop.png'});
  await page.getByRole('button',{name:/Кабинет педагога/}).click();await page.waitForURL(/pageCategory=teacher/);await ready();check(await page.getByRole('button',{name:/Кабинет педагога/}).getAttribute('aria-pressed')==='true','selected category is announced');
  await page.getByLabel('Поиск материалов').fill('Аналитика');await page.waitForURL(/q=/);await ready();
  // A request matching the final input must finish before inspecting its rows.
  const matching=await list({pageCategory:'teacher',q:'Аналитика'});
  await page.waitForFunction(expected=>JSON.stringify([...document.querySelectorAll('a.admin-row')].map(e=>decodeURIComponent(new URL(e.href).pathname.split('/').pop())))===JSON.stringify(expected),matching.items.map(r=>r.id));
  check(await page.locator('.admin-row').count()>0,'search and category work together');
  const filteredUrl=page.url(),firstHref=await page.locator('.admin-row').first().getAttribute('href');check(firstHref.includes('pageCategory=teacher')&&firstHref.includes('q='),'editor link carries library context');
  await page.locator('.admin-row').first().click();await page.getByLabel('Язык материала').waitFor();await page.getByRole('link',{name:'Назад к материалам',exact:true}).click();await ready();check(page.url()===filteredUrl,'editor return restores category and search');
  await page.reload();await ready();check(await page.getByLabel('Поиск материалов').inputValue()==='Аналитика','reload retains the search');
  await page.getByRole('button',{name:/Навигатор и справочники/}).click();await page.waitForURL(/pageCategory=navigator/);await ready();await page.goBack();await ready();check(new URL(page.url()).searchParams.get('pageCategory')==='teacher','browser Back restores category');
  await page.getByLabel('Поиск материалов').fill('zz-no-such-page');await page.waitForURL(/zz-no-such-page/);await page.getByText('Ничего не найдено',{exact:true}).waitFor();check(await page.locator('.admin-page-category').count()===6,'empty search retains category navigation');
  await page.getByLabel('Поиск материалов').fill('');await page.getByLabel('Статус материала').selectOption('draft');await page.waitForURL(/filter=draft/);await ready();check((await list({pageCategory:'teacher',filter:'draft'})).items.every(r=>r.dirty),'draft filter is applied with category');
  await page.goto(base+'/admin/content?group=pages&page=2');await ready();await page.locator('.admin-row').first().click();await page.getByLabel('Язык материала').waitFor();await page.getByRole('link',{name:'Назад к материалам',exact:true}).click();await ready();check(new URL(page.url()).searchParams.get('page')==='2','editor return retains pagination');
  await page.getByRole('button',{name:/Лендинг/}).click();await page.waitForURL(/pageCategory=landing/);await ready();check(!new URL(page.url()).searchParams.has('page'),'switching category resets pagination');
  await page.setViewportSize({width:390,height:844});await page.goto(base+'/admin/content?group=pages');await ready();check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile categories fit without horizontal scrolling');await page.screenshot({path:output+'/categories-mobile.png'});
  await page.getByRole('button',{name:/Вход и регистрация/}).click();await page.waitForURL(/pageCategory=access/);await ready();await page.locator('.admin-card[aria-busy]').scrollIntoViewIfNeeded();await page.screenshot({path:output+'/category-mobile-results.png'});check(await page.locator('.admin-row').count()>0,'mobile category selection displays its materials');
  const anonymous=await browser.newContext();const denied=await anonymous.request.get(base+'/api/admin/content?group=pages&pageCategory=teacher');check(denied.status()===403||denied.status()===401,'anonymous category request is rejected');await anonymous.close();
  const invalid=await context.request.get(base+'/api/admin/content?group=pages&pageCategory=unknown');check(invalid.status()===400,'unknown category is rejected by the backend');
  await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/admin/universities?category=institution');await ready();check((await page.locator('.admin-row').first().getAttribute('href')).includes('institution.'),'existing navigator category still works');
  check(errors.length===0,'category flows have no uncaught JavaScript errors: '+errors.join('; '));console.log('Page-category browser checks passed: '+passed);
 }catch(e){await page.screenshot({path:output+'/failure.png'}).catch(()=>{});throw e;}finally{await context.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
