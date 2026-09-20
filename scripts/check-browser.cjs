const {chromium}=require("playwright");
const fs=require("node:fs");
const accounts=JSON.parse(fs.readFileSync(".data/test-accounts.json","utf8"));
const base=process.env.BROWSER_BASE ?? "http://127.0.0.1:3025";
const out="/mnt/sb2dev/backups/browser-jwt";
fs.mkdirSync(out,{recursive:true});
const results=[];
const assert=(ok,name)=>{if(!ok)throw new Error(name);results.push(name);console.log("PASS "+name);};
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
 try {
  for(const account of accounts){
   const context=await browser.newContext({viewport:{width:1440,height:1000}});
   const page=await context.newPage();
   const errors=[];page.on("pageerror",e=>errors.push(e.message));
   page.setDefaultTimeout(30000);
   await page.goto(base+"/login");
   await page.getByLabel("Электронная почта").fill(account.email);
   await page.getByLabel("Пароль",{exact:true}).fill(account.password);
   await page.getByRole("button",{name:"Войти",exact:true}).click();
   await page.waitForURL(url=>!url.pathname.startsWith("/login"),{timeout:60000});
   const destination=account.contentAdmin?"/admin":account.role==="TEACHER"?"/teacher":"/dashboard";
   assert(new URL(page.url()).pathname===destination,"login redirect "+account.email);
   const routes=account.contentAdmin?["/admin","/admin/tests","/admin/universities","/admin/content","/admin/history","/admin/settings","/admin/editor/test.debruce","/admin/editor/program.0.0","/admin/editor/course-module1.module1Lessons"]:
    account.role==="TEACHER"?["/teacher","/teacher/course","/teacher/course/module1","/teacher/handbook","/teacher/handbook/0","/teacher/profile","/teacher/profile/edit","/teacher/analytics","/teacher/analytics/classes","/teacher/analytics/students","/teacher/reports","/teacher/bonus","/teacher/guide","/teacher/assistant"]:
    ["/dashboard","/tests","/tests/debruce","/tests/mbti","/tests/holland","/universities","/universities/0","/universities/program/program.0.0","/portfolio","/profile","/chat"];
   for(const route of routes){
    const response=await page.goto(base+route,{waitUntil:"domcontentloaded",timeout:90000});
    await page.locator("body").waitFor();
    assert(response.status()===200 && new URL(page.url()).pathname===route,"page "+account.email+" "+route);
    assert(!(await page.locator("body").innerText()).includes("Application error"),"renders "+route);
   }
   if(!account.contentAdmin && account.role==="STUDENT"){
    await page.goto(base+"/profile");
    await page.waitForFunction(email=>Array.from(document.querySelectorAll("input")).some(i=>i.value===email),account.email);
    assert(true,"profile shows signed-in identity "+account.email);
    await page.goto(base+"/teacher");
    assert(new URL(page.url()).pathname==="/teacher/login","student blocked from teacher panel");
   }
   if(account.contentAdmin){
    await page.goto(base+"/admin/editor/test.debruce");
    await page.locator(".admin-edit-fields").waitFor();
    assert(await page.locator(".admin-edit-split").count()===1,"editor split layout");
    await page.screenshot({path:out+"/"+account.email.split("@")[0]+"-editor.png",fullPage:true});
   }
   assert(errors.length===0,"no browser exceptions "+account.email+": "+errors.join(" | "));
   await context.close();
  }
  const context=await browser.newContext(); const page=await context.newPage();
  for(const route of ["/","/auth","/login","/teacher/login","/professions","/skills","/popularuniversity"]){
    const response=await page.goto(base+route,{timeout:90000});assert(response.status()===200,"public page "+route);
  }
  await page.goto(base+"/login");await page.getByLabel("Электронная почта").fill(accounts[0].email);await page.getByLabel("Пароль",{exact:true}).fill("wrong-password");await page.getByRole("button",{name:"Войти",exact:true}).click();await page.getByRole("alert").waitFor();assert(new URL(page.url()).pathname==="/login","wrong password stays on login with error");
  await context.close();
 } finally {await browser.close();fs.writeFileSync(out+"/results.json",JSON.stringify(results,null,2));}
 console.log("Browser checks passed: "+results.length);
})().catch(e=>{console.error(e);process.exitCode=1;});
