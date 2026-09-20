// Explicit setup only. Never run on the live database or during application startup.
const fs = require("node:fs"), path = require("node:path"), { randomBytes } = require("node:crypto");
const { PrismaClient } = require("../generated/prisma");
const { hashPassword } = require("../dist/modules/auth/password");
const url = new URL(process.env.DATABASE_URL);
if (url.hostname !== "127.0.0.1" || url.port !== "5437" || url.pathname !== "/sb2_dev") throw new Error("Only the isolated sb2_dev database is allowed");
const db = new PrismaClient();
const output = path.resolve("../.data/test-accounts.json");
async function run() {
  if (await db.dataImport.findUnique({where:{id:"jwt-test-accounts-v1"}})) {
    if (!fs.existsSync(output)) throw new Error("Accounts already exist; credentials file missing. Do not silently reset passwords.");
    console.log("Test accounts already provisioned; passwords unchanged."); return;
  }
  const specifications = [
    ["student.one@sb2.test", "Student One", "STUDENT", 0, false],
    ["student.two@sb2.test", "Student Two", "STUDENT", 1, false],
    ["teacher.one@sb2.test", "Teacher One", "TEACHER", 0, false],
    ["teacher.two@sb2.test", "Teacher Two", "TEACHER", 1, false],
    ["editor@sb2.test", "Content Editor", "STUDENT", null, true],
    ["admin@sb2.test", "Platform Admin", "ADMIN", null, true],
  ];
  const accounts = await Promise.all(specifications.map(async ([email,name,role,school,contentAdmin]) => {
    const password = randomBytes(18).toString("base64url");
    return { email,name,role,school,contentAdmin,password,passwordHash:await hashPassword(password) };
  }));
  fs.mkdirSync(path.dirname(output),{recursive:true});
  // Private recovery file is written before commit so a process exit cannot lose issued passwords.
  fs.writeFileSync(output,JSON.stringify(accounts.map(({passwordHash,...a})=>a),null,2),{mode:0o600,flag:"wx"});
  await db.$transaction(async tx => {
    if (await tx.user.count({where:{email:{in:accounts.map(a=>a.email)}}})) throw new Error("Reserved test email already exists; refusing overwrite");
    const schools = await Promise.all(["JWT Test School One","JWT Test School Two"].map(name=>tx.organization.create({data:{name}})));
    for (const a of accounts) await tx.user.create({data:{email:a.email,name:a.name,surname:"Test",role:a.role,
      organizationId:a.school === null ? null : schools[a.school].id,
      credential:{create:{passwordHash:a.passwordHash,contentAdmin:a.contentAdmin}}}});
    await tx.dataImport.create({data:{id:"jwt-test-accounts-v1",recordCount:accounts.length}});
  },{timeout:30000});
  console.log("Provisioned six accounts. Credentials: " + output);
}
run().catch(e=>{ console.error(e.message); process.exitCode=1; }).finally(()=>db.$disconnect());
