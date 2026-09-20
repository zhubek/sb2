const { chromium } = require('playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');

// Invoked by the framework suite against its disposable database and server.
module.exports = async ({ base, cookie, check }) => {
  const dir = '/mnt/sb2dev/backups/app-review-20260909';
  fs.mkdirSync(dir, { recursive: true });
  const browser = await chromium.launch({ slowMo: 220, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, recordVideo: { dir, size: { width: 1440, height: 1000 } } });
  const [name, ...parts] = cookie.split('=');
  await context.addCookies([{ name, value: parts.join('='), url: base, httpOnly: true, sameSite: 'Lax' }]);
  const page = await context.newPage();
  const errors=[];page.on('pageerror', e=>errors.push(e.message));
  page.setDefaultTimeout(30000);
  const milestones=[];
  async function pass(condition, label) { check(condition,label); milestones.push(label); }
  try {
    await page.goto(base+'/admin/editor/landing.hero');
    await page.getByLabel('Язык материала').selectOption('en');
    const title=page.locator('.admin-edit-fields textarea').filter({hasNotText:'__never__'});
    await title.first().waitFor();
    const source=await page.locator('.admin-edit-fields').innerText();
    await pass(source.includes('Русский:'), 'browser shows source text alongside translation fields');
    const headline=page.getByRole('textbox',{name:'Главный заголовок',exact:true});
    await headline.fill('Find your future with Smart Bolashaq');
    await page.frameLocator('iframe[title="Предпросмотр страницы платформы"]').getByRole('heading',{name:'Find your future with Smart Bolashaq',exact:true}).waitFor();
    await pass(true, 'English edit updates right-hand page preview');
    await page.getByRole('button',{name:'Сохранить',exact:true}).click();
    await page.getByRole('status').filter({hasText:'Черновик сохранён'}).waitFor();
    await page.reload();
    await page.getByLabel('Язык материала').selectOption('en');
    assert.equal(await headline.inputValue(),'Find your future with Smart Bolashaq');
    await pass(true, 'English draft survives browser reload');
    await page.getByRole('button',{name:'Опубликовать',exact:true}).click();
    await page.getByRole('button',{name:'Да, опубликовать'}).click();
    await page.getByRole('status').filter({hasText:'Опубликовано'}).waitFor();
    await page.goto(base+'/');
    await page.getByRole('button',{name:'Language: en',exact:true}).click();
    await page.getByRole('heading',{name:'Find your future with Smart Bolashaq',exact:true}).waitFor();
    await pass(await page.locator('html').getAttribute('lang')==='en', 'published English landing content and HTML language match');
    await page.screenshot({path:dir+'/multilingual-published.png'});
    await page.getByRole('button',{name:'Language: ru',exact:true}).click();
    await page.waitForFunction(()=>document.documentElement.lang==='ru');
    await pass(!(await page.locator('h1').innerText()).includes('Find your future'), 'Russian landing remains unchanged');
    await page.getByRole('button',{name:'Language: kk',exact:true}).click();
    await page.waitForFunction(()=>document.documentElement.lang==='kk');
    await pass(!(await page.locator('h1').innerText()).includes('Find your future'), 'existing Kazakh landing text remains available');
    await page.goto(base+'/admin/editor/course-module1.module1Lessons');
    await page.getByLabel('Язык материала').selectOption('en');
    await page.locator('.admin-edit-fields textarea').first().waitFor();
    await pass(await page.locator('.admin-live-preview').isVisible(), 'teacher course translation retains public lesson preview');
    await page.goto(base+'/admin/editor/program.0.0');
    await page.getByLabel('Язык материала').selectOption('kk');
    await page.locator('.admin-edit-fields textarea').first().waitFor();
    await pass(await page.locator('.admin-edit-fields input[type=number]').count()===0 && await page.locator('.admin-live-preview').isVisible(), 'navigator translation protects shared numbers and keeps preview');
    await page.goto(base+'/admin/editor/test.mbti');
    await page.getByLabel('Язык материала').selectOption('en');
    await page.locator('.admin-edit-fields textarea').first().waitFor();
    await pass(await page.locator('.admin-live-preview').isVisible(), 'fixed test translation retains interactive preview');
    await pass(errors.length===0, 'multilingual browser flows have no uncaught JavaScript errors');
    // Explicitly labelled results card, recorded after real app interaction.
    await page.setContent('<html><body style="font:24px system-ui;background:#f6f5fb;padding:60px;color:#25213c"><h1>CMS verification results</h1><p>Isolated test database · Russian / Kazakh / English</p><ul>'+milestones.map(m=>'<li style="margin:14px 0;color:#18765d">PASS — '+m+'</li>').join('')+'</ul><p>Recorded browser verification. Sample edits do not affect the data-entry database.</p></body></html>');
    await page.waitForTimeout(4500);
    await page.screenshot({path:dir+'/multilingual-results.png',fullPage:true});
  } finally {
    await context.close();
    await page.video().saveAs(dir+'/multilingual-cms.webm');
    await browser.close();
  }
};
