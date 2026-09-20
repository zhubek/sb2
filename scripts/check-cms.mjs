// Run only against an isolated localhost dev server with CMS_DATA_DIR=.data/cms-verification-v2.
import assert from 'node:assert/strict';
const base=process.env.CMS_TEST_URL||'http://127.0.0.1:3026';
const admin=new Map(),student=new Map(),other=new Map();
let checks=0;
function check(condition,message){assert.ok(condition,message);checks++;console.log('PASS '+message);}
function rendered(response){return response.text.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');}
async function request(path,{jar=admin,method='GET',body,origin=true}={}){
  const headers={};if(jar.size)headers.cookie=[...jar].map(([k,v])=>`${k}=${v}`).join('; ');
  if(origin)headers.origin=base;
  if(body!==undefined)headers['Content-Type']=body instanceof URLSearchParams?'application/x-www-form-urlencoded':'application/json';
  const r=await fetch(base+path,{method,headers,body:body===undefined?undefined:body instanceof URLSearchParams?body.toString():JSON.stringify(body),redirect:'manual',signal:AbortSignal.timeout(90000)});
  for(const cookie of r.headers.getSetCookie()){const pair=cookie.split(';')[0],at=pair.indexOf('=');jar.set(pair.slice(0,at),pair.slice(at+1));}
  const text=await r.text();let data;try{data=JSON.parse(text);}catch{data=text;}
  return {status:r.status,data,text,headers:r.headers};
}
async function doc(id){const r=await request('/api/admin/content/'+encodeURIComponent(id));assert.equal(r.status,200,r.text);return r.data;}
async function mutate(d,value,action='save',extra={}){return request('/api/admin/content/'+encodeURIComponent(d.id),{method:'PUT',body:{revision:d.revision,value,action,...extra}});}
async function signin(jar,email){
  const csrf=await request('/api/auth/csrf',{jar});
  const r=await request('/api/auth/callback/otp',{jar,method:'POST',body:new URLSearchParams({csrfToken:csrf.data.csrfToken,email,code:'000000',callbackUrl:base+'/tests'})});
  const session=await request('/api/auth/session',{jar});assert.equal(session.data.user?.email,email,JSON.stringify({status:r.status,session:session.data}));
}
check((await request('/api/admin/content',{jar:new Map()})).status===401,'anonymous admin read denied');
check((await request('/api/admin/session',{method:'POST',body:{},origin:false})).status===403,'login requires same-origin request');
check((await request('/api/admin/content',{jar:new Map([['sb-admin','9999999999999.forged']])})).status===401,'forged admin cookie denied');
check((await request('/api/admin/session',{method:'POST',body:{}})).status===200,'localhost development login succeeds');
const listing=await request('/api/admin/content?group=tests');check(listing.data.counts.tests===3,'three built-in diagnostic definitions available');
const t=await doc('test.debruce'),edit=structuredClone(t.value);edit.name='CMS QA · навыки';edit.sections[0].questions[0]='CMS QA · новый вопрос';edit.scale[0].label='CMS QA · не согласен';
const before=(await request('/api/content')).data['test.debruce'];
check((await mutate(t,edit)).status===200,'test draft saved');
check(JSON.stringify((await request('/api/content')).data['test.debruce'])===JSON.stringify(before),'draft is absent from public content');
check((await mutate(t,edit)).status===409,'stale revision cannot overwrite another edit');
let latest=await doc(t.id);check(latest.history.length>=2,'initial version retained for recovery');
const invalid=structuredClone(edit);invalid.sections[0].questions[0]='';
check((await mutate(latest,invalid)).status===422,'empty question rejected');
check((await request('/api/admin/content/test.debruce',{jar:new Map(),method:'PUT',body:{value:edit,revision:latest.revision,action:'publish'}})).status===403,'anonymous publication denied');
const badScale=structuredClone(edit);badScale.scale[0].label='';check((await mutate(latest,badScale)).status===422,'blank answer label rejected');
check((await mutate(latest,edit,'publish')).status===200,'publication succeeds');
check((await request('/api/content')).data['test.debruce'].name===edit.name,'published definition available to frontend');
await signin(student,'cms-verification@example.test');await signin(other,'cms-other@example.test');
const studentPage=await request('/tests',{jar:student});check(studentPage.status===200&&rendered(studentPage).includes(edit.name),'student test library renders published title');
const intro=await request('/tests/debruce',{jar:student});check(intro.status===200&&rendered(intro).includes(edit.name),'test flow renders published title');
check((await request('/api/test-attempts',{method:'POST',jar:student,body:{slug:edit.slug,snapshot:edit,values:[1]}})).status===422,'incomplete test submission rejected');
const answers=edit.sections.flatMap(s=>s.questions.map(()=>3));
const attempt=await request('/api/test-attempts',{method:'POST',jar:student,body:{slug:edit.slug,snapshot:edit,values:answers}});
check(attempt.status===201,'complete attempt saved with question snapshot');
latest=await doc(t.id);const updated=structuredClone(edit);updated.sections[0].questions[0]='CMS QA · ещё более новый вопрос';await mutate(latest,updated,'publish');
const history=await request('/api/test-attempts',{jar:student});check(history.data[0].snapshot.sections[0].questions[0]===edit.sections[0].questions[0],'past attempt retains original wording after publication');
const late=await request('/api/test-attempts',{method:'POST',jar:student,body:{slug:edit.slug,snapshot:edit,values:answers}});check(late.status===201,'student may finish a test begun on previous published version');
check((await request('/tests/attempts/'+attempt.data.id,{jar:other})).status===404,'another user cannot read the attempt');
const own=await request('/tests/attempts/'+attempt.data.id,{jar:student});check(own.status===200&&rendered(own).includes(edit.sections[0].questions[0]),'owner can view saved questions and answers');
latest=await doc(t.id);const original=latest.history.at(-1);const publicBeforeRestore=(await request('/api/content')).data[t.id];
check((await mutate(latest,null,'restore',{historyId:original.id})).status===200,'older version restored into draft');
check(JSON.stringify((await request('/api/content')).data[t.id])===JSON.stringify(publicBeforeRestore),'restore does not publish automatically');
const hero=await doc('landing.hero'),heroEdit=structuredClone(hero.value);heroEdit.h1.ru='CMS QA · опубликованный заголовок';
check((await mutate(hero,heroEdit,'publish')).status===200,'landing content publishes');
check(rendered(await request('/')).includes(heroEdit.h1.ru),'landing SSR renders edited copy');
const inst=(await request('/api/admin/content?group=catalog&q=institution.')).data.items[0];
const institution=await doc(inst.id),instEdit=structuredClone(institution.value);instEdit.name='CMS QA · университет';instEdit.detail.about='CMS QA · новое описание университета';
check((await mutate(institution,instEdit,'publish')).status===200,'institution and detail content publish together');
const uni=await request(institution.preview,{jar:student});check(uni.status===200&&rendered(uni).includes(instEdit.name)&&rendered(uni).includes(instEdit.detail.about),'institution page renders both edited name and description');
const skill=await doc('info-data.mainSkills'),skillEdit=structuredClone(skill.value);skillEdit[0].name='CMS QA · навык';await mutate(skill,skillEdit,'publish');
check(rendered(await request('/skills')).includes(skillEdit[0].name),'derived client data uses published skills');
const quiz=await doc('course-module1.module1Quiz');const badQuiz=structuredClone(quiz.value);badQuiz[0].options.forEach(o=>o.correct=false);check((await mutate(quiz,badQuiz)).status===422,'course quiz requires a correct answer');
const created=await request('/api/admin/content',{method:'POST',body:{name:'Extra test',slug:'extra-test'}});
check(created.status===405,'creating predefined tests is forbidden by API');
check((await request('/tests/extra-test',{jar:student})).status===404,'unknown test has no student route');
const mixed=structuredClone((await doc('test.mbti')).value);
mixed.sections[0].questions[0]={id:'qa-single',type:'single',text:'Выберите один вариант',options:[{id:'a',label:'Первый'},{id:'b',label:'Второй'}]};
mixed.sections[0].questions[1]={id:'qa-multiple',type:'multiple',text:'Выберите несколько',options:[{id:'a',label:'Первый'},{id:'b',label:'Второй'}]};
mixed.sections[0].questions[2]={id:'qa-text',type:'text',text:'Напишите ответ'};
let mbti=await doc('test.mbti');check((await mutate(mbti,mixed,'publish')).status===200,'mixed question types publish');
const mixedAnswers=mixed.sections.flatMap(s=>s.questions.map(q=>typeof q==='string'?3:q.type==='single'?'a':q.type==='multiple'?['a','b']:'Свободный ответ'));
const mixedAttempt=await request('/api/test-attempts',{jar:student,method:'POST',body:{slug:'mbti',snapshot:mixed,values:mixedAnswers}});
check(mixedAttempt.status===201,'single choice, multiple choice, text and Likert answers save together');
check(rendered(await request('/tests/attempts/'+mixedAttempt.data.id,{jar:student})).includes('Свободный ответ'),'mixed answer history renders readable labels');
for(const [index,invalid] of [[0,'unknown-option'],[1,['a','a']],[2,'  ']]){const bad=[...mixedAnswers];bad[index]=invalid;check((await request('/api/test-attempts',{jar:student,method:'POST',body:{slug:'mbti',snapshot:mixed,values:bad}})).status===422,'invalid answer rejected for question '+index);}
const badOptions=structuredClone(mixed);badOptions.sections[0].questions[0].options[1].id='a';mbti=await doc('test.mbti');check((await mutate(mbti,badOptions)).status===422,'duplicate choice identifiers rejected');
const catalog=await request('/api/admin/content?group=catalog&category=program');check(catalog.data.total===9268,'education programs have a dedicated searchable catalog');
const prog=await doc('program.0.0'),progEdit={...prog.value,name:'CMS QA · образовательная программа',price:123456,threshold:87};
check((await mutate(prog,progEdit)).status===200,'program draft saves');
check(!(await request('/api/content')).data[prog.id],'program draft stays private');
const latestProgram=await doc(prog.id);check((await mutate(latestProgram,progEdit,'publish')).status===200,'program publishes');
check(rendered(await request(prog.preview,{jar:student})).includes(progEdit.name),'dedicated program page shows published data');
const projected=(await request('/api/content')).data;
check(projected['institution.0'].detail.ops[0].name===progEdit.name,'institution program list receives the same edit');
check(projected['gop.'+progEdit.groupCode].univ['0'].ops.some(o=>o.o===progEdit.name&&o.p===123456),'program group receives edited offering and price');
const preview=await request('/api/admin/preview',{method:'POST',body:{id:'institution.0',value:{...instEdit,i:0}}});
check(preview.status===200&&preview.data.type==='institution','navigator preview uses the actual page props');
check((await request('/api/admin/preview',{jar:new Map(),method:'POST',body:{id:'institution.0',value:instEdit}})).status===403,'draft preview requires admin authentication');
const backup=await request('/api/admin/backup');check(backup.status===200&&backup.headers.get('content-disposition')?.includes('attachment'),'backup downloads as JSON');
check((await request('/api/admin/backup',{method:'POST',body:backup.data})).status===200,'backup restores materials as drafts');
check((await request('/api/admin/content?group=tests&filter=draft')).status===200,'draft filtering works');
console.log(`\n${checks} CMS integration checks passed.`);
