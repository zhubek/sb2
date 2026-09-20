// Called only by check-framework against its disposable database and servers.
const { chromium } = require('playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');

module.exports = async ({ db, defaults, headers, webBase: base, check, studentSession, teacherSession }) => {
  for (const id of ['institution.0', 'copy.app.platform.tests.page', 'copy.components.content-language']) {
    const d = defaults.find(d => d.id === id);
    await db.contentDocument.upsert({where:{id},update:{},create:{id,title:d.title,description:d.description,group:d.group,kind:d.kind,preview:d.preview,defaultValue:d.value,searchText:id}});
  }
  const read = async (id, locale) => {
    const r = await fetch(base+'/api/admin/content/'+id+'?locale='+locale,{headers:headers()});
    assert.equal(r.status,200); return r.json();
  };
  const publicValues = async locale => (await fetch(base+'/api/content?locale='+locale)).json();
  for (const [locale,title] of [['en','Your assessments'],['kk','Сіздің тесттеріңіз']]) {
    const d=await read('copy.app.platform.tests.page',locale); d.value.x002=title;
    const r=await fetch(base+'/api/admin/content/copy.app.platform.tests.page',{method:'PUT',headers:{...headers(),origin:base},body:JSON.stringify({locale,value:d.value,revision:d.revision,action:'publish'})});
    check(r.status===200,'tests page CMS translation publishes: '+locale);
  }
  for (const returnTo of ['//example.com','/\\example.com','/..//example.com','/api/auth/signout']) {
    const r=await fetch(base+'/api/content/language?'+new URLSearchParams({locale:'en',returnTo}),{redirect:'manual'});
    check(r.status===400,'language redirect rejects unsafe destination: '+returnTo);
  }
  check((await fetch(base+'/api/content/language?locale=de')).status===400,'language redirect rejects unsupported locale');
  const dir='/mnt/sb2dev/backups/language-flow-20260917';fs.mkdirSync(dir,{recursive:true});
  const browser=await chromium.launch({args:['--no-sandbox','--disable-dev-shm-usage']});
  const admin=await browser.newContext({viewport:{width:1440,height:1000}});
  const [cookieName,...cookieValue]=headers().cookie.split('=');
  await admin.addCookies([{name:cookieName,value:cookieValue.join('='),url:base}]);
  const page=await admin.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(30000);
  const visitor=await browser.newContext({viewport:{width:1183,height:872}});
  await visitor.addCookies([{name:'authjs.session-token',value:studentSession,url:base}]);
  const web=await visitor.newPage();web.on('pageerror',e=>errors.push(e.message));web.setDefaultTimeout(30000);
  async function save(publish=false) {
    const response=page.waitForResponse(r=>r.request().method()==='PUT' && r.url().includes('/api/admin/content/'));
    await page.getByRole('button',{name:publish?'Опубликовать':'Сохранить',exact:true}).click();
    if(publish)await page.getByRole('button',{name:'Да, опубликовать',exact:true}).click();
    const result=await response;assert.equal(result.status(),200,await result.text());
    await page.getByRole('status').filter({hasText:publish?'Опубликовано.':'Черновик сохранён.'}).waitFor();
  }
  async function language(code) {
    await web.getByRole('button',{name:'Language: '+code,exact:true}).filter({visible:true}).click();
    await web.waitForFunction(code=>document.documentElement.lang===code,code);
    assert.equal(await web.getByRole('button',{name:'Language: '+code,exact:true}).filter({visible:true}).getAttribute('aria-pressed'),'true');
    assert.equal((await visitor.cookies()).find(c=>c.name==='sb-locale').value,code);
  }
  try {
    await page.goto(base+'/admin/editor/institution.0?locale=kk');
    const name=page.getByRole('textbox',{name:'Название',exact:true});await name.waitFor();
    check(await page.getByLabel('Язык материала').inputValue()==='kk','editor opens selected URL language');
    check(await page.getByText('Перевод ещё не сохранён',{exact:true}).isVisible(),'new translation status does not claim it is saved');
    check(await page.locator('.admin-edit-fields textarea[aria-label*="Образовательные программы"]').count()===0,'institution omits duplicate program translation fields');
    const ru=await read('institution.0','ru');
    await name.fill('ALT қазақша университеті');
    await page.locator('.admin-live-preview').getByRole('heading',{name:'ALT қазақша университеті',exact:true}).waitFor();
    check(await page.locator('.admin-live-preview').getAttribute('lang')==='kk','Kazakh institution draft appears in Kazakh preview');
    page.once('dialog',d=>d.dismiss());await page.getByLabel('Язык материала').selectOption('en');
    check(await page.getByLabel('Язык материала').inputValue()==='kk' && await name.inputValue()==='ALT қазақша университеті','cancel language switch preserves unsaved text');
    await save();await page.reload();await name.waitFor();
    check(await page.getByLabel('Язык материала').inputValue()==='kk' && await name.inputValue()==='ALT қазақша университеті','Kazakh draft and selected language survive reload');
    check((await publicValues('kk'))['institution.0']?.name!=='ALT қазақша университеті','saved translation remains private before publication');
    await save(true);
    check((await publicValues('kk'))['institution.0'].name==='ALT қазақша университеті','Kazakh publication reaches public backend');
    await page.getByLabel('Язык материала').selectOption('en');await name.fill('ALT English university');
    await page.locator('.admin-live-preview').getByRole('heading',{name:'ALT English university',exact:true}).waitFor();
    await save(true);
    check((await read('institution.0','ru')).revision===ru.revision && (await publicValues('kk'))['institution.0'].name==='ALT қазақша университеті','English publication preserves Russian and Kazakh content');
    const href=await page.getByRole('link',{name:'На сайте',exact:true}).getAttribute('href');
    const redirect=await fetch(base+href,{redirect:'manual'});
    check(redirect.status===303 && redirect.headers.get('location')==='/universities/0' && redirect.headers.get('set-cookie').startsWith('sb-locale=en;'),'admin public-page link selects matching language without changing the public host');
    await page.screenshot({path:dir+'/admin-english-preview.png'});
    await page.getByRole('link',{name:'Открыть программы этого заведения →'}).click();
    await page.locator('a.admin-row').first().click();
    await page.getByLabel('Язык материала').waitFor();
    check(await page.getByLabel('Язык материала').inputValue()==='en','institution-to-program navigation preserves editing language');
    await page.locator('.admin-live-preview').getByRole('link',{name:'ALT English university',exact:true}).waitFor();
    check(true,'program preview uses the published institution name in the selected language');
    await page.goto(base+'/admin/editor/landing.hero?locale=en');
    const headline=page.getByRole('textbox',{name:'Главный заголовок',exact:true});
    await headline.fill('Choose your future');
    await page.frameLocator('iframe[title="Предпросмотр страницы платформы"]').getByRole('heading',{name:'Choose your future',exact:true}).waitFor();
    await save();await page.reload();await headline.waitFor();
    check(await headline.inputValue()==='Choose your future','bilingual landing translation survives save and reload');
    await save(true);
    await web.goto(base+'/tests');
    check(await web.locator('[data-language-switcher]').count()===1,'student header has one language control');
    await language('en');await web.getByRole('heading',{name:'Your assessments',exact:true}).waitFor();
    await language('kk');await web.getByRole('heading',{name:'Сіздің тесттеріңіз',exact:true}).waitFor();
    check(true,'header language buttons load actual English and Kazakh CMS content');
    await web.reload();await web.getByRole('heading',{name:'Сіздің тесттеріңіз',exact:true}).waitFor();
    await web.goto(base+'/universities/0');await web.getByRole('heading',{name:'ALT қазақша университеті',exact:true}).waitFor();
    check(true,'visitor language survives reload and page navigation');
    await language('en');await web.getByRole('heading',{name:'ALT English university',exact:true}).waitFor();
    await web.goto(base+'/');await web.getByRole('heading',{name:'Choose your future',exact:true}).waitFor();
    check(true,'published English landing translation appears to visitors');
    await language('ru');check(!(await web.locator('h1').innerText()).includes('Choose your future'),'Russian landing remains unchanged');
    await web.setViewportSize({width:390,height:844});await web.goto(base+'/tests');await language('kk');
    check(await web.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'student language control fits mobile viewport');
    await web.screenshot({path:dir+'/student-kazakh-mobile.png'});
    for(const id of ['course-module1.module1Lessons','test.mbti']){
      await page.goto(base+'/admin/editor/'+id+'?locale=en');await page.locator('.admin-edit-fields textarea').first().waitFor();
      check(await page.locator('.admin-live-preview').getAttribute('lang')==='en','translated live preview receives language: '+id);
      const field=id.startsWith('course-')?page.getByRole('textbox',{name:/\/ 1 \/ Заголовок$/}).first():page.getByRole('textbox',{name:'Название',exact:true});
      const marker=id.startsWith('course-')?'English lesson preview':'English assessment preview';
      await field.fill(marker);await page.locator('.admin-live-preview').getByRole('heading',{name:marker,exact:true}).first().waitFor();
      await save();await page.reload();await field.waitFor();
      check(await field.inputValue()===marker,'translated text updates preview and persists: '+id);
    }
    await visitor.addCookies([{name:'authjs.session-token',value:teacherSession,url:base}]);
    await web.setViewportSize({width:1440,height:1000});await web.goto(base+'/teacher/course');
    await web.getByRole('button',{name:'Пропустить',exact:true}).click();await language('en');
    check(true,'teacher sidebar uses the same persistent language setting');
    await web.screenshot({path:dir+'/teacher-english-desktop.png'});
    await web.setViewportSize({width:390,height:844});await web.getByRole('button',{name:'Открыть меню',exact:true}).click();
    await web.getByRole('button',{name:'Language: kk',exact:true}).filter({visible:true}).click();
    await web.waitForFunction(()=>document.documentElement.lang==='kk');
    await web.getByRole('button',{name:'Открыть меню',exact:true}).click();
    check(await web.getByRole('button',{name:'Language: kk',exact:true}).filter({visible:true}).getAttribute('aria-pressed')==='true','teacher mobile menu changes and retains language');
    check(await web.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'teacher mobile language menu fits viewport');
    await web.screenshot({path:dir+'/teacher-kazakh-mobile.png'});
    check(errors.length===0,'language browser flows have no uncaught JavaScript errors: '+errors.join('; '));
  } finally {await admin.close();await visitor.close();await browser.close();}
};
