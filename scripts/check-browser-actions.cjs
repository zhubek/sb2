const {chromium}=require("playwright"),fs=require("node:fs"),assert=require("node:assert/strict");
const accounts=JSON.parse(fs.readFileSync(".data/test-accounts.json","utf8"));
const base=process.env.BROWSER_BASE??"http://127.0.0.1:3027";
let passed=0;function check(ok,name){assert.ok(ok,name);console.log("PASS "+name);passed++;}
(async()=>{
 const browser=await chromium.launch({args:["--no-sandbox","--disable-dev-shm-usage"]});
 try {
  const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage();
  page.setDefaultTimeout(30000);
  async function login(account){await page.goto(base+"/login");await page.getByLabel("Электронная почта").fill(account.email);await page.getByLabel("Пароль",{exact:true}).fill(account.password);await page.getByRole("button",{name:"Войти",exact:true}).click();await page.waitForURL(url=>url.pathname!=="/login");}
  await login(accounts[0]);
  const before=await context.request.get(base+"/api/test-attempts");const count=(await before.json()).length;
  for(const slug of ["debruce","mbti","holland"]){
   await page.goto(base+"/tests/"+slug);await page.getByRole("button",{name:"Начать тест",exact:true}).click();
   await page.locator("button[aria-pressed]").first().waitFor();
   let finished=false;
   for(let section=0;section<30;section++){
    const neutral=page.locator("button[aria-pressed]").filter({hasText:/^3$/});
    for(let i=0;i<await neutral.count();i++)await neutral.nth(i).click();
    const text=page.getByLabel("Ваш ответ");for(let i=0;i<await text.count();i++)await text.nth(i).fill("Browser verification response");
    const groups=page.locator('[role="group"]');for(let i=0;i<await groups.count();i++){const choice=groups.nth(i).locator('input');if(await choice.count())await choice.first().check();}
    const finish=page.getByRole("button",{name:"Завершить тест",exact:true});
    if(await finish.count()){
     const responsePromise=page.waitForResponse(r=>r.url().endsWith("/api/test-attempts")&&r.request().method()==="POST");
     await finish.click();const response=await responsePromise;check(response.status()===201,"browser submits "+slug);finished=true;break;
    }
    await page.getByRole("button",{name:"Следующий раздел",exact:true}).click();
   }
   check(finished,"all sections completed "+slug);
  }
  const attempts=await (await context.request.get(base+"/api/test-attempts")).json();check(attempts.length===count+3,"three submissions persist in owner history");
  await page.goto(base+"/tests/attempts/"+attempts[0].id);check(!(await page.locator("body").innerText()).includes("Application error"),"saved answer detail renders");
  await page.goto(base+"/profile");const first=page.getByLabel("Имя",{exact:true});await first.waitFor();await page.waitForFunction(email=>Array.from(document.querySelectorAll('input')).some(i=>i.value===email),accounts[0].email);const previous=await first.inputValue();
  await first.fill("Browser Verified");await page.getByRole("button",{name:"Сохранить изменения",exact:true}).click();await page.getByRole("button",{name:"Сохранено",exact:true}).waitFor();await page.reload();await page.waitForFunction(()=>Array.from(document.querySelectorAll('input')).some(i=>i.value==="Browser Verified"));check(true,"student profile save survives reload");
  await first.fill(previous);await page.getByRole("button",{name:"Сохранить изменения",exact:true}).click();await page.getByRole("button",{name:"Сохранено",exact:true}).waitFor();
  await login(accounts[1]);const other=await (await context.request.get(base+"/api/test-attempts")).json();check(!other.some(a=>attempts.some(b=>a.id===b.id)),"switching accounts does not expose answers");
  await login(accounts[2]);for(let tour=0;tour<4;tour++)await page.getByRole("button",{name:"Далее",exact:true}).click();await page.getByRole("button",{name:"Начать работу",exact:true}).click();check(true,"teacher onboarding completes all five steps");await page.goto(base+"/teacher/profile/edit");const phone=page.getByLabel("Телефон",{exact:true});await phone.waitFor();await page.waitForFunction(email=>Array.from(document.querySelectorAll('input')).some(i=>i.value===email),accounts[2].email);const oldPhone=await phone.inputValue();await phone.fill("+7 700 123 4567");await page.getByRole("button",{name:"Сохранить изменения",exact:true}).click();await page.getByRole("button",{name:"Сохранено",exact:true}).waitFor();await page.reload();await page.waitForFunction(()=>Array.from(document.querySelectorAll('input')).some(i=>i.value==="+7 700 123 4567"));check(true,"teacher phone persists after reload");await phone.fill(oldPhone);await page.getByRole("button",{name:"Сохранить изменения",exact:true}).click();await page.getByRole("button",{name:"Сохранено",exact:true}).waitFor();
  await login(accounts[4]);await page.goto(base+"/admin/editor/test.debruce");await page.locator('.admin-edit-fields').waitFor();
  const editable=page.locator('.admin-edit-fields textarea').first();await editable.waitFor();const original=await editable.inputValue();await editable.fill(original+" [preview check]");
  check((await page.locator('.admin-edit-split').innerText()).includes("[preview check]"),"draft edit appears in live preview");
  await page.getByRole('button',{name:"Сохранить",exact:true}).click();await page.getByRole('status').waitFor();await page.reload();await page.locator('.admin-edit-fields textarea').first().waitFor();check((await page.locator('.admin-edit-fields textarea').first().inputValue()).endsWith("[preview check]"),"CMS draft survives reload");
  await page.locator('.admin-edit-fields textarea').first().fill(original);await page.getByRole('button',{name:"Сохранить",exact:true}).click();await page.getByRole('status').waitFor();
  await page.getByRole('button',{name:"Выйти",exact:true}).click();await page.waitForURL(url=>url.pathname==="/login");const session=await (await context.request.get(base+"/api/auth/session")).json();check(!session?.user,"admin logout removes account session");
  await context.close();
 } finally {await browser.close();}
 console.log("Browser action checks passed: "+passed);
})().catch(e=>{console.error(e);process.exitCode=1;});
