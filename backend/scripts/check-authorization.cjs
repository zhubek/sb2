module.exports = async function ({db,gql,check,identity,jwt,u1,u2,webBase}) {
  const {hashPassword} = require("../dist/modules/auth/password");
  const api = "http://127.0.0.1:3031/api";
  const call = (path, user, method="GET", body) => fetch(api+path,{method,headers:{"Content-Type":"application/json",...(user ? {authorization:identity(user.id,user.email,Date.now()+60000,{credentialVersion:1})}: {})},body:body===undefined?undefined:JSON.stringify(body)});
  const schools = await Promise.all(["Policy School A","Policy School B"].map(name=>db.organization.create({data:{name}})));
  const password="Fixture-correct-password-928!";
  const hash=await hashPassword(password);
  const make = (email,role,school,contentAdmin=false) => db.user.create({data:{email,name:"Policy",surname:"Fixture",role,organizationId:school?.id,credential:{create:{passwordHash:hash,contentAdmin}}}});
  const teacher=await make("policy-teacher@example.test","TEACHER",schools[0]);
  const editor=await make("policy-editor@example.test","STUDENT",null,true);
  const admin=await make("policy-admin@example.test","ADMIN");
  const student=await make("policy-student@example.test","STUDENT",schools[0]);
  const legacyTeacher=await db.user.create({data:{email:"legacy-teacher@example.test",name:"Legacy",surname:"Teacher",role:"TEACHER"}});
  check((await call("/users/"+legacyTeacher.id,legacyTeacher)).status===401,"legacy demo teacher session cannot bypass password setup");
  const loginQuery="mutation($input:PasswordLoginInput!){passwordLogin(input:$input){id email role contentAdmin credentialVersion}}";
  for (const user of [teacher,editor,admin,student]) {
    const result=await gql(loginQuery,{input:{email:user.email,password}},{"Content-Type":"application/json"});
    check(result.data?.passwordLogin.id===user.id,"password login for "+user.email);
  }
  const bad=await gql(loginQuery,{input:{email:student.email,password:"incorrect"}},{"Content-Type":"application/json"});
  check(bad.errors?.[0]?.extensions?.status===401,"wrong password rejected");
  const own=await call("/users/"+student.id,student);
  const ownData=await own.json();
  check(own.status===200 && !JSON.stringify(ownData).includes("passwordHash") && !ownData.credential,"profile never exposes credentials");
  const updated=await call("/users/"+student.id,student,"PATCH",{name:"Updated",phone:"+7 700 000 0000",jobTitle:"Test title",role:"ADMIN"});
  check(updated.status===200,"owner can save profile fields");
  const persisted=await (await call("/users/"+student.id,student)).json();
  check(persisted.name==="Updated" && persisted.phone==="+7 700 000 0000" && persisted.jobTitle==="Test title","profile fields persist after reload");
  check(persisted.role==="STUDENT","profile input cannot elevate role");
  for(const user of [student,teacher,editor]) {
    for(const suffix of ["","/diplomas","/courses","/quizzes","/achievements","/org-logs","/attempts"]) {
      const response=await call("/users/"+u1.id+suffix,user);
      check(response.status===403,"cross-user denied: "+user.email+" "+suffix);
    }
    check((await call("/users/"+u1.id,user,"PATCH",{name:"Forbidden"})).status===403,"cross-user profile edit denied: "+user.email);
    check((await call("/chats?userId="+u1.id,user)).status===403,"cross-user chat list denied: "+user.email);
    check((await call("/users",user)).status===403,"user directory restricted: "+user.email);
  }
  check((await call("/users/"+u1.id,admin)).status===200,"platform admin can read profile");
  check((await call("/organizations/"+schools[0].id,teacher)).status===200,"teacher can read own school");
  check((await call("/organizations/"+schools[1].id,teacher)).status===403,"teacher cannot read another school");
  check((await call("/organizations/"+schools[1].id+"/points",teacher)).status===403,"cross-school counters denied");
  check((await call("/users/"+student.id,student,"PATCH",{organizationId:schools[1].id})).status===403,"student cannot change organization");
  const adminContent=await gql('{contentDocument(id:"test.debruce"){capabilities{canPublish}}}',{}, {"Content-Type":"application/json",authorization:identity(editor.id,editor.email,Date.now()+60000,{credentialVersion:1})});
  check(adminContent.data?.contentDocument.capabilities.canPublish,"content editor retains CMS access");
  const diploma=await db.diploma.create({data:{name:"Policy diploma",type:"DIPLOMA",userId:u1.id}});
  for(const user of [student,editor]) check((await call("/diplomas/"+diploma.id,user,"DELETE")).status===404,"foreign diploma delete denied: "+user.email);
  check(!!await db.diploma.findUnique({where:{id:diploma.id}}),"denied diploma delete leaves data intact");
  check((await call("/diplomas/"+diploma.id,u1,"DELETE")).status===200,"owner deletes own diploma");
  const chat=await db.chat.create({data:{userId:u1.id,chatType:"MAIN_STUDENT",name:"Policy chat"}});
  check((await call("/chats/"+chat.id+"/messages",student)).status===404,"foreign chat messages denied");
  check((await call("/chats/"+chat.id+"/messages",editor,"POST",{text:"Forbidden"})).status===404,"editor cannot write foreign chat");
  for (const token of ["broken",jwt({userId:student.id,subject:student.email,aud:"wrong",exp:Math.floor(Date.now()/1000)+60}),jwt({userId:student.id,subject:student.email,aud:"sb2-api",exp:Math.floor(Date.now()/1000)-1})]) {
    check((await fetch(api+"/users/"+student.id,{headers:{authorization:"Bearer "+token}})).status===401,"invalid JWT rejected");
  }
  await db.authCredential.update({where:{userId:student.id},data:{version:2}});
  check((await call("/users/"+student.id,student)).status===401,"session version revokes existing JWT");
  await db.authCredential.update({where:{userId:student.id},data:{version:1,enabled:false}});
  check((await call("/users/"+student.id,student)).status===401,"disabled account cannot use existing JWT");
  const disabled=await gql(loginQuery,{input:{email:student.email,password}},{"Content-Type":"application/json"});
  check(disabled.errors?.[0]?.extensions?.status===401,"disabled account cannot log in");
  await db.authCredential.update({where:{userId:student.id},data:{enabled:true}});
  for(const user of [student,teacher,editor,admin]) {
    const response=await fetch(api+"/users",{method:"POST",headers:{"Content-Type":"application/json",authorization:"Bearer "+jwt({scope:"identity:provision",email:user.email,aud:"sb2-api",exp:Math.floor(Date.now()/1000)+60})},body:JSON.stringify({email:user.email,name:"Bypass"})});
    check(response.status===403,"registration cannot bypass password: "+user.email);
  }
  // Real Auth.js login, session cookie, BFF call and logout against a production Next build.
  for(const user of [student,teacher,editor,admin]) {
    const csrf=await fetch(webBase+"/api/auth/csrf");
    const csrfToken=(await csrf.json()).csrfToken;
    const cookies=csrf.headers.getSetCookie().map(c=>c.split(";")[0]);
    const login=await fetch(webBase+"/api/auth/callback/password",{method:"POST",redirect:"manual",headers:{"Content-Type":"application/x-www-form-urlencoded","X-Auth-Return-Redirect":"1",cookie:cookies.join("; "),origin:webBase},body:new URLSearchParams({csrfToken,email:user.email,password,callbackUrl:webBase})});
    const sessionCookies=login.headers.getSetCookie().map(c=>c.split(";")[0]);
    check(sessionCookies.some(c=>c.startsWith("authjs.session-token=")),"production password session: "+user.email);
    const cookie=[...cookies,...sessionCookies].join("; ");
    const response=await fetch(webBase+"/api/backend/users/"+user.id,{headers:{cookie}});
    check(response.status===200,"JWT BFF forwards password identity: "+user.email);
    const doc=await fetch(webBase+"/api/admin/content/test.debruce",{headers:{cookie}});
    check(doc.status===([editor.id,admin.id].includes(user.id)?200:403),"CMS page gate: "+user.email);
    const logout=await fetch(webBase+"/api/auth/signout",{method:"POST",headers:{cookie,origin:webBase,"Content-Type":"application/x-www-form-urlencoded","X-Auth-Return-Redirect":"1"},body:new URLSearchParams({csrfToken,callbackUrl:webBase})});
    check(logout.headers.getSetCookie().some(c=>c.startsWith("authjs.session-token=;")&&c.includes("Max-Age=0")),"logout clears JWT session: "+user.email);
  }
};
