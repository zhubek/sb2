const {chromium}=require("playwright"),assert=require("node:assert/strict");
const base="http://127.0.0.1:3025";
(async()=>{
 const browser=await chromium.launch({args:["--no-sandbox","--disable-dev-shm-usage"]});
 try{
  const context=await browser.newContext(),page=await context.newPage();page.setDefaultTimeout(60000);
  await page.goto(base+"/auth");
  await page.getByPlaceholder("Электронная почта").fill("registration.browser@sb2.test");
  await page.getByRole("button",{name:"Продолжить",exact:true}).click();
  await page.getByPlaceholder("Имя",{exact:true}).fill("Registration");
  await page.getByPlaceholder("Фамилия",{exact:true}).fill("Browser");
  const selects=page.locator("select");await selects.nth(0).selectOption("9");await selects.nth(1).selectOption({index:1});
  await page.getByRole("button",{name:"Создать аккаунт",exact:true}).click();
  await page.waitForURL(url=>url.pathname!=="/auth");
  const session=await (await context.request.get(base+"/api/auth/session")).json();
  assert.equal(session.user.role,"student");assert.equal(session.user.id,"registration.browser@sb2.test");
  const profile=await(await context.request.get(base+"/api/backend/users/"+session.user.backendId)).json();assert.equal(profile.name,"Registration");
  console.log("PASS development registration and profile creation remain functional");
  await context.close();
  const other=await browser.newContext(),p=await other.newPage();await p.goto(base+"/auth");await p.getByPlaceholder("Электронная почта").fill("admin@sb2.test");await p.getByRole("button",{name:"Продолжить",exact:true}).click();
  await p.getByText("Не удалось создать аккаунт. Проверьте адрес почты.",{exact:true}).waitFor();
  const rejected=await(await other.request.get(base+"/api/auth/session")).json();assert.ok(!rejected?.user);console.log("PASS registration UI cannot enter an existing password account");
  await other.close();
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
