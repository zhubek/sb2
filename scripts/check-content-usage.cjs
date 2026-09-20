const {chromium}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const base=process.env.BROWSER_BASE??'http://localhost:3027';
const output='/mnt/sb2dev/backups/cms-corrections-20260913/usage-results.json';
(async()=>{
 const browser=await chromium.launch({args:['--no-sandbox','--disable-dev-shm-usage']});
 const context=await browser.newContext(),page=await context.newPage();
 const account=JSON.parse(fs.readFileSync('.data/test-accounts.json')).find(a=>a.email==='admin@sb2.test');
 const results=[];
 try {
  await page.goto(base+'/login');await page.getByLabel('Электронная почта').fill(account.email);await page.getByLabel('Пароль',{exact:true}).fill(account.password);await page.getByRole('button',{name:'Войти',exact:true}).click();await page.waitForURL(u=>u.pathname!=='/login');
  const documents=JSON.parse(fs.readFileSync('.data/bootstrap/content-registry.json')).filter(d=>d.group!=='demo'&&!/^(test|institution|program|gop|college|nogop|industry|direction|profession|course-module1)\./.test(d.id)&&!['teacher-mock-data.courseInfo','teacher-mock-data.courseModules'].includes(d.id));
  assert.equal(documents.length,128,'feedback inventory');
  for(const item of documents){
   try {
    const response=await context.request.get(base+'/api/admin/content/'+encodeURIComponent(item.id));assert.equal(response.status(),200,item.id);
    const doc=await response.json();assert.ok(doc.usage,item.id+' has usage metadata');
    if(!doc.usage.locations.length){assert.ok(doc.usage.note);results.push({id:doc.id,status:'explained',note:doc.usage.note});console.log('EXPLAINED '+doc.id);continue;}
    const route=doc.usage.locations[0].path;
    const created=await context.request.post(base+'/api/admin/page-preview',{headers:{origin:base},data:{id:doc.id,value:doc.value,locale:'ru',route}});assert.equal(created.status(),200,doc.id+': '+await created.text());
    const rendered=await context.request.get(base+(await created.json()).url),html=await rendered.text();
    assert.ok(rendered.status()===200||doc.id==='copy.app.not-found'&&rendered.status()===404,doc.id+' route '+route+' HTTP '+rendered.status());
    assert.ok(html.includes('__CMS_PREVIEW__')&&!html.includes('Application error:')&&!html.includes('Предпросмотр недоступен'),doc.id+' renders an authorized application page');
    results.push({id:doc.id,status:'rendered',route});console.log('PASS '+doc.id+' → '+route);
   } catch(error) {results.push({id:item.id,status:'failed',error:error.message});console.error('FAIL '+item.id+': '+error.message);}
  }
  console.log('Usage inventory checked: '+results.length+'; rendered '+results.filter(x=>x.status==='rendered').length+'; explained '+results.filter(x=>x.status==='explained').length);
  assert.equal(results.filter(x=>x.status==='failed').length,0,'every mapped preview renders');
 } finally {fs.writeFileSync(output,JSON.stringify(results,null,2));await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
