const {chromium}=require("playwright"),fs=require("node:fs"),assert=require("node:assert/strict");
const accounts=JSON.parse(fs.readFileSync(".data/test-accounts.json","utf8"));
const base="http://136.112.254.16:3025";
(async()=>{const browser=await chromium.launch({args:["--no-sandbox","--disable-dev-shm-usage"]});try{
 for(const account of accounts){const context=await browser.newContext(),page=await context.newPage();page.setDefaultTimeout(60000);
  await page.goto(base+"/login",{waitUntil:"domcontentloaded"});await page.getByLabel("Электронная почта").fill(account.email);await page.getByLabel("Пароль",{exact:true}).fill(account.password);await page.getByRole("button",{name:"Войти",exact:true}).click();await page.waitForURL(url=>url.pathname!=="/login",{waitUntil:"domcontentloaded"});
  const session=await(await context.request.get(base+"/api/auth/session")).json();assert.equal(session.user.id,account.email);
  const response=await context.request.get(base+"/api/backend/users/"+session.user.backendId);assert.equal(response.status(),200);
  console.log("PASS deployed login and authorized profile: "+account.email);await context.close();
 }
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
