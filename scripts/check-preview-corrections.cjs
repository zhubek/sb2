const {chromium}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const accounts=JSON.parse(fs.readFileSync('.data/test-accounts.json','utf8'));
const base=process.env.BROWSER_BASE??'http://127.0.0.1:3027';
const output='/mnt/sb2dev/backups/cms-corrections-20260913';fs.mkdirSync(output,{recursive:true});
let passed=0;const check=(ok,name)=>{assert.ok(ok,name);console.log('PASS '+name);passed++;};
(async()=>{
 const browser=await chromium.launch({args:['--no-sandbox','--disable-dev-shm-usage'],slowMo:120});
 const context=await browser.newContext({viewport:{width:1600,height:1050},recordVideo:{dir:output,size:{width:1600,height:1050}}}),page=await context.newPage();
 page.setDefaultTimeout(40000);page.on('dialog',d=>d.accept());const errors=[];page.on('pageerror',e=>errors.push(e.message));
 async function login(target,account){await target.goto(base+'/login');await target.getByLabel('Электронная почта').fill(account.email);await target.getByLabel('Пароль',{exact:true}).fill(account.password);await target.getByRole('button',{name:'Войти',exact:true}).click();await target.waitForURL(u=>u.pathname!=='/login');}
 const document=async id=>{const r=await context.request.get(base+'/api/admin/content/'+encodeURIComponent(id));assert.equal(r.status(),200);return r.json();};
 const preview=async(doc,value,route=doc.usage.locations[0].path)=>{const r=await context.request.post(base+'/api/admin/page-preview',{headers:{origin:base},data:{id:doc.id,value,locale:'ru',route}});assert.equal(r.status(),200,await r.text());return(await r.json()).url;};
 try{
  await login(page,accounts.find(a=>a.email==='admin@sb2.test'));
  for(const category of ['industry','direction','profession']){
    await page.goto(base+'/admin/universities?category='+category);
    const row=page.locator('a.admin-row').first();await row.waitFor();const href=await row.getAttribute('href');
    check(/%[A-F\d]{2}/i.test(href),'library encodes '+category+' URL');
    await row.click();await page.getByLabel('Язык материала').waitFor();
    check(!(await page.locator('.admin-body').innerText()).includes('Материал не найден'),'Cyrillic '+category+' opens from library');
    const name=decodeURIComponent(href.split('/').pop()).slice(category.length+1),child=page.frameLocator('iframe');
    if(category==='industry')await child.getByRole('heading',{name,exact:true}).waitFor();
    if(category==='direction')await child.getByRole('button',{name,exact:false,expanded:true}).waitFor();
    if(category==='profession'){
      await child.getByRole('heading',{name,exact:true}).waitFor();
      await page.locator('.admin-edit-fields textarea').first().fill('Проверка описания профессии');
      await child.getByText('Проверка описания профессии',{exact:true}).waitFor();
    }
    check(true,category+' opens its specific public preview');
  }
  await page.goto(base+'/admin/editor/copy.app.platform.portfolio.page');
  await page.locator('.admin-edit-fields textarea').first().fill('Портфолио — проверка живого экрана');
  const frame=page.frameLocator('iframe[title="Предпросмотр страницы платформы"]');
  await frame.getByRole('heading',{name:'Портфолио — проверка живого экрана',exact:true}).waitFor();
  check(true,'unsaved portfolio copy renders in actual page layout');
  await page.locator('.admin-edit-fields textarea').first().fill('Последняя правка — портфолио');
  await frame.getByRole('heading',{name:'Последняя правка — портфолио',exact:true}).waitFor();
  check(true,'latest draft replaces an older preview');
  const before=await document('copy.app.platform.portfolio.page');
  check(!JSON.stringify(before.value).includes('Последняя правка'),'preview does not save the CMS draft');
  await page.getByLabel('Размер предпросмотра').selectOption('390');
  check(await page.locator('iframe').evaluate(e=>e.style.width)==='390px','mobile viewport available');
  await page.getByRole('button',{name:'Развернуть',exact:true}).click();await page.locator('.admin-page-preview.expanded').waitFor();
  await page.keyboard.press('Escape');check(await page.locator('.admin-page-preview.expanded').count()===0,'expanded preview closes with Escape');
  await page.screenshot({path:output+'/portfolio-live-preview.png'});
  const active=page.frames().find(f=>f.url().includes('/_cms-preview/'));
  check(!!active,'preview uses an isolated application frame');
  const mutation=await active.evaluate(async()=>{const r=await fetch('/api/test-attempts',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});return r.status;});
  check(mutation===403,'preview rejects write requests');
  await page.evaluate(()=>localStorage.setItem('cms-preview-storage-check','original'));
  await active.evaluate(()=>localStorage.setItem('cms-preview-storage-check','changed'));
  check(await page.evaluate(()=>localStorage.getItem('cms-preview-storage-check'))==='original','preview cannot change browser storage');
  await page.evaluate(()=>localStorage.removeItem('cms-preview-storage-check'));
  const previewUrl=active.url();
  const anonymous=await browser.newContext();
  const denied=await anonymous.request.get(previewUrl);
  check(!(await denied.text()).includes('Последняя правка'),'anonymous visitor cannot see a preview');
  const deniedCreate=await anonymous.request.post(base+'/api/admin/page-preview',{headers:{origin:base},data:{id:before.id,value:before.value,locale:'ru',route:'/portfolio'}});
  check(deniedCreate.status()===403,'anonymous preview creation denied');await anonymous.close();
  const editorContext=await browser.newContext(),editorPage=await editorContext.newPage();await login(editorPage,accounts.find(a=>a.email==='editor@sb2.test'));
  const foreign=await editorContext.request.get(previewUrl);check(!(await foreign.text()).includes('Последняя правка'),'another content editor cannot read this session preview');await editorContext.close();
  for(const id of ['teacher-mock-data.trainingGuides','teacher-mock-data.studentGuides','teacher-mock-data.trainingFaq','teacher-mock-data.trainingVideos']){
    await page.goto(base+'/admin/editor/'+id);
    await page.getByLabel('Язык материала').waitFor();
    const child=page.frameLocator('iframe');await child.locator('#'+({'teacher-mock-data.trainingGuides':'training-guides','teacher-mock-data.studentGuides':'student-guides','teacher-mock-data.trainingFaq':'training-faq','teacher-mock-data.trainingVideos':'training-videos'}[id])).waitFor();
    check(true,id+' appears in the actual teacher guide');
  }
  const teacherFrame=page.frames().find(f=>f.url().includes('/_cms-preview/'));
  await teacherFrame.waitForFunction(()=>{const r=document.getElementById('training-videos')?.getBoundingClientRect();return r && r.top>=-1 && r.top<innerHeight/2;});
  check(true,'teacher guide automatically scrolls to the edited section');
  await page.locator('.admin-edit-split').scrollIntoViewIfNeeded();
  await page.screenshot({path:output+'/teacher-videos-preview.png'});
  const landing=await document('landing.hero');const landingValue=structuredClone(landing.value);landingValue.h1.ru='Проверка главной страницы';
  const landingUrl=await preview(landing,landingValue);await page.goto(base+landingUrl);await page.getByRole('heading',{name:'Проверка главной страницы',exact:true}).waitFor();check(true,'landing draft uses real landing page');
  const publicResponse=await context.request.get(base+'/');check(!(await publicResponse.text()).includes('Проверка главной страницы'),'ordinary public page cannot see the draft');
  const wrongRoute=await context.request.post(base+'/api/admin/page-preview',{headers:{origin:base},data:{id:landing.id,value:landing.value,locale:'ru',route:'/admin'}});check(wrongRoute.status()===422,'preview cannot target an unrelated or admin page');
  await page.goto(base+'/admin/editor/report-data.mbtiReport');await page.frameLocator('iframe').locator('h1').waitFor();check(true,'report renders in report layout');
  await page.screenshot({path:output+'/report-preview.png'});
  const onboarding=await document('copy.app.onboarding.page'),onboardingUrl=await preview(onboarding,onboarding.value);await page.goto(base+onboardingUrl);await page.getByRole('button',{name:'Пропустить',exact:true}).click();
  check(new URL(page.url()).pathname===onboardingUrl,'preview blocks programmatic navigation from onboarding');
  const profile=await document('copy.app.platform.profile.page'),profileUrl=await preview(profile,profile.value);await page.goto(base+profileUrl);
  const session=await(await context.request.get(base+'/api/auth/session')).json(),profileEndpoint=base+'/api/backend/users/'+session.user.backendId;
  const originalProfile=await(await context.request.get(profileEndpoint)).json();
  await page.getByLabel('Имя',{exact:true}).fill('Preview must not save this');await page.getByRole('button',{name:'Сохранить изменения',exact:true}).click();
  check((await(await context.request.get(profileEndpoint)).json()).name===originalProfile.name,'profile save button inside preview cannot change account data');
  await page.getByRole('button',{name:'Выйти',exact:true}).click();
  check(new URL(page.url()).pathname===profileUrl&&(await context.request.get(base+'/api/admin/content/landing.hero')).status()===200,'preview logout cannot end the editor session');
  check(errors.length===0,'preview flows have no uncaught JavaScript errors: '+errors.join('; '));
  console.log('Preview correction checks passed: '+passed);
  await page.setContent('<html><body style="font:24px system-ui;background:#f7f8fb;padding:70px;color:#28233c"><h1>Content Studio · проверка исправлений</h1><p style="color:#087b58">Пройдено проверок браузера: '+passed+'</p><ul style="line-height:2"><li>Кириллические адреса отраслей, направлений и профессий</li><li>Изменения внутри настоящих страниц платформы</li><li>Размер телефона и развёрнутый предпросмотр</li><li>Приватность черновиков и сохранность аккаунта</li><li>Материалы, памятки, FAQ и список видео</li><li>Главная страница и отчёты</li></ul><p style="font-size:18px;color:#777">Тестовые правки в этом видео не сохранялись в CMS.</p></body></html>');
  await page.screenshot({path:output+'/browser-results.png'});await page.waitForTimeout(3000);
 }catch(e){await page.screenshot({path:output+'/failure.png'}).catch(()=>{});throw e;}
 finally{await context.close();await page.video().saveAs(output+'/cms-preview-corrections.webm');await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
