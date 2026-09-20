const fs = require('node:fs');
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const ts = require('typescript');
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,file);
const {projectPrograms} = require('../lib/cms/programs.ts');
const {resolveContent} = require('../lib/cms/resolve.ts');
const {instagramUrl} = require('../lib/nav/instagram.ts');
const {validateDocument} = require('../backend/src/modules/content/domain/validation.ts');
const institutions = require('../lib/nav/institutions.json');
const details = require('../lib/nav/details.json');
const extraPrograms = require('../lib/nav/nogop.json');
const colleges = require('../lib/nav/college-programs.json');
const base = process.env.BROWSER_BASE || 'http://localhost:3027';
const output = '/mnt/sb2dev/backups/institution-editor-20260914';
fs.mkdirSync(output,{recursive:true});
let passed=0;
function check(ok,message){assert.ok(ok,message);console.log('PASS '+message);passed++;}

(async()=>{
  check(instagramUrl('@alt_university')==='https://www.instagram.com/alt_university/','Instagram handles become HTTPS profile links');
  check(instagramUrl('http://instagram.com/alt/')==='https://instagram.com/alt/','existing HTTP profile links upgrade to HTTPS');
  check(instagramUrl('https://www.instagram.com/alt/')==='https://www.instagram.com/alt/','existing HTTPS profile links are preserved');
  check(['','javascript:alert(1)','data:text/html,test','https://instagram.com.attacker.test/profile','https://user:pass@instagram.com/profile'].every(v=>instagramUrl(v)===null),'empty and unsafe destinations cannot become Instagram links');
  const univ=institutions.find(i=>i.i===0), college=institutions.find(i=>i.kind==='c'), foreign=institutions.find(i=>i.kind==='a');
  const input={'institution.0':{...univ,nOps:999999,detail:details['0']}};
  const definition={id:'institution.0',title:univ.name,group:'catalog',value:input['institution.0']};
  check(validateDocument(definition,{...definition.value,inds:[]}).length===0,'clearing industry selection is accepted by backend validation');
  check(validateDocument(definition,{...definition.value,i:999999}).length>0,'institution ID remains protected by backend validation');
  const snapshot=JSON.stringify(input),projected=projectPrograms(input);
  check(JSON.stringify(input)===snapshot,'derived counters do not mutate source documents');
  check(projected['institution.0'].nOps===details['0'].ops.length+(extraPrograms['0']||[]).length,'stale university counter is replaced by actual offerings');
  check(Object.keys(projected).filter(k=>k.startsWith('institution.')).length===1,'counter projection does not inject large default institution documents');
  const defaults=projectPrograms({}),list=resolveContent(defaults,'nav.institutions',institutions);
  const fallbackCollege=institutions.find(i=>i.kind==='c'&&colleges.programs.some(p=>p.cols.includes(i.i)));
  const fallbackValue={...fallbackCollege,detail:{...(details[fallbackCollege.i]??{}),ops:[]}};
  const fallbackProjection=projectPrograms({['institution.'+fallbackCollege.i]:fallbackValue});
  check(fallbackProjection['institution.'+fallbackCollege.i].nOps===colleges.programs.filter(p=>p.cols.includes(fallbackCollege.i)).length,'college with an empty detail list counts fallback specialties');
  check(list.length===institutions.length&&list.every(i=>Number.isInteger(i.nOps)&&i.nOps>=0),'all navigator cards receive derived nonnegative counts');
  check(list.find(i=>i.i===foreign.i).nOps===0,'foreign institutions with external program lists have zero local offerings');
  const fallbackId=institutions.find(i=>i.kind==='c'&&!(details[i.i]?.ops?.length)&&colleges.programs.some(p=>p.cols.includes(i.i)))?.i;
  if(fallbackId!==undefined)check(list.find(i=>i.i===fallbackId).nOps===colleges.programs.filter(p=>p.cols.includes(fallbackId)).length,'college fallback specialties are counted');
  const extraId=institutions.find(i=>i.kind==='v'&&(extraPrograms[i.i]?.length))?.i;
  if(extraId!==undefined)check(list.find(i=>i.i===extraId).nOps===(details[extraId]?.ops?.length||0)+extraPrograms[extraId].length,'additional university offerings are included');

  const browser=await chromium.launch({args:['--no-sandbox','--disable-dev-shm-usage']});
  const context=await browser.newContext({viewport:{width:1440,height:1050}}),page=await context.newPage();
  page.setDefaultTimeout(45000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const publicBefore=await context.request.get(base+'/api/content');assert.equal(publicBefore.status(),200);const publishedBefore=await publicBefore.text();
  try {
    const accounts=JSON.parse(fs.readFileSync('.data/test-accounts.json','utf8'));
    const account=accounts.find(a=>a.email==='admin@sb2.test');
    await page.goto(base+'/login');await page.getByLabel('Электронная почта').fill(account.email);await page.getByLabel('Пароль',{exact:true}).fill(account.password);await page.getByRole('button',{name:'Войти',exact:true}).click();await page.waitForURL(u=>u.pathname!=='/login');
    const docResponse=await context.request.get(base+'/api/admin/content/institution.0');assert.equal(docResponse.status(),200);const doc=await docResponse.json();
    async function preview(id,value){const r=await context.request.post(base+'/api/admin/preview',{headers:{Origin:base},data:{id,value,locale:'ru'}});assert.equal(r.status(),200,await r.text());return r.json();}
    for(const id of [...new Set([0,college.i,foreign.i,extraId,fallbackId].filter(i=>i!==undefined))]){
      const r=await context.request.get(base+'/api/admin/content/institution.'+id);assert.equal(r.status(),200);const d=await r.json();
      const p=await preview(d.id,{...d.value,nOps:999999});
      check(p.props.d.nOps===p.props.groups.reduce((n,g)=>n+g.ops.length,0),'preview and derived card count agree for institution '+id);
    }
    for(const field of ['i','kind']){
      const r=await context.request.put(base+'/api/admin/content/institution.0',{headers:{Origin:base},data:{revision:doc.revision,action:'save',locale:'ru',value:{...doc.value,[field]:field==='i'?999999:'c'}}});
      check([400,422].includes(r.status()),'backend rejects changes to protected institution '+field+' ('+r.status()+': '+await r.text()+')');
    }
    await page.goto(base+'/admin/editor/institution.0');await page.getByTestId('institution-program-count').waitFor();
    await page.waitForFunction(()=>/^\d+$/.test(document.querySelector('[data-testid="institution-program-count"]')?.textContent||''));
    const fields=page.locator('.admin-edit-fields'),view=page.locator('.admin-live-preview');
    check(await fields.getByText('Вуз',{exact:true}).isVisible(),'institution type is displayed as a readable name');
    check(await fields.getByLabel('Идентификатор заведения',{exact:true}).count()===0,'technical ID is absent from the editing form');
    check(await fields.locator('input').filter({has:page.locator('[name="nOps"]')}).count()===0 && await fields.getByLabel('Количество программ',{exact:true}).count()===0,'program count is a read-only summary, not an input');
    check(await fields.getByLabel('Порог гранта, баллы ЕНТ').count()===1,'grant threshold has a readable label');
    const summaryCount=await page.getByTestId('institution-program-count').textContent();
    check(await view.getByRole('button',{name:'Программы · '+summaryCount,exact:true}).count()===1,'editor count matches its public-component preview');
    await fields.getByText(/^Отрасли ·/).click();
    const industry=fields.locator('.admin-industry-options input').first();const initial=await industry.isChecked();await industry.setChecked(!initial);
    await page.waitForResponse(r=>r.url().endsWith('/api/admin/preview')&&r.status()===200);
    check(await industry.isChecked()!==initial,'named industry checkboxes can change a draft selection');await industry.setChecked(initial);
    const instagram=fields.getByLabel('Instagram',{exact:true});await instagram.fill('@sb2_preview_only');
    await view.locator('a[href="https://www.instagram.com/sb2_preview_only/"]').waitFor();
    check(await view.getByText('@sb2_preview_only',{exact:true}).isVisible(),'Instagram changes appear in the unsaved preview');
    await fields.locator('.admin-editor-content').evaluate(el=>{el.scrollTop=0;});
    await page.screenshot({path:output+'/editor-desktop.png'});
    const beforeInvalidLink=await instagram.inputValue();await instagram.fill('javascript:alert(1)');
    await view.getByText('javascript:alert(1)',{exact:true}).waitFor();check(await view.locator('a[href^="javascript:"]').count()===0,'invalid Instagram destinations render as text, never executable links');
    await instagram.fill('');await page.waitForResponse(r=>r.url().endsWith('/api/admin/preview')&&r.status()===200);await page.waitForTimeout(100);
    check(await view.locator('svg[aria-label="Instagram"]').count()===0,'empty Instagram is omitted from preview');
    await instagram.fill(beforeInvalidLink);await view.getByText('@sb2_preview_only',{exact:true}).waitFor();
    await page.setViewportSize({width:390,height:844});await instagram.scrollIntoViewIfNeeded();
    check(await fields.evaluate(el=>el.scrollWidth<=el.clientWidth+1),'institution form fits the mobile field panel');await page.screenshot({path:output+'/editor-mobile.png'});
    check(await page.locator('.admin-savebar .primary').evaluate(el=>el.getBoundingClientRect().right<=innerWidth&&el.getBoundingClientRect().left>=0),'mobile Publish button fits on screen');
    page.on('dialog',d=>d.accept());await page.goto(base+'/universities/0');
    const raw=JSON.parse(publishedBefore)['institution.0']?.detail?.ig ?? details['0']?.ig;
    if(instagramUrl(raw))check(await page.locator('a').filter({hasText:raw.trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i,'@').replace(/\/$/,'')}).count()>0,'existing published Instagram appears on the public institution page');
    await page.setViewportSize({width:1440,height:1050});await page.screenshot({path:output+'/institution-public.png'});
    await page.goto(base+'/universities');await page.getByPlaceholder('Название, город или профессия').fill('ALT');await page.locator('a[href="/universities/0"]').first().waitFor();
    const publishedValues=JSON.parse(publishedBefore);const publicList=resolveContent(publishedValues,'nav.institutions',institutions);
    check((await page.locator('a[href="/universities/0"]').first().evaluate(el=>el.parentElement.textContent)).includes(publicList.find(i=>i.i===0).nOps+' прогр.'),'navigator card displays the derived published count');
    const after=await context.request.get(base+'/api/admin/content/institution.0');const afterDoc=await after.json();
    check(afterDoc.revision===doc.revision&&JSON.stringify(afterDoc.value)===JSON.stringify(doc.value),'preview and rejected edits preserve editorial data and revision');
    const publicAfter=await context.request.get(base+'/api/content');check(await publicAfter.text()===publishedBefore,'verification leaves published content unchanged');
    check(errors.length===0,'institution flows have no uncaught JavaScript errors: '+errors.join('; '));
    console.log('Institution editor checks passed: '+passed);
  }catch(e){await page.screenshot({path:output+'/failure.png'}).catch(()=>{});throw e;}finally{await context.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
