const { PrismaClient } = require('../generated/prisma');
const url=new URL(process.env.DATABASE_URL);
if(url.hostname!=='127.0.0.1'||url.port!=='5437'||url.pathname!=='/sb2_dev') throw new Error('Only isolated development database allowed');
const db=new PrismaClient();
(async()=>{
  const [documents,tests,programs,credentials,translations]=await Promise.all([
    db.contentDocument.count({where:{NOT:{id:{startsWith:'i18n.'}}}}),
    db.contentDocument.findMany({where:{kind:'test'},select:{id:true},orderBy:{id:'asc'}}),
    db.institutionProgram.count({where:{contentKey:{not:null}}}),
    db.authCredential.count({where:{enabled:true}}),
    db.contentDocument.count({where:{id:{startsWith:'i18n.'}}}),
  ]);
  if(tests.map(t=>t.id).join(',')!=='test.debruce,test.holland,test.mbti') throw new Error('Fixed test catalog mismatch');
  console.log(JSON.stringify({documents,fixedTests:tests.map(t=>t.id),educationPrograms:programs,enabledPasswordAccounts:credentials,translations},null,2));
})().catch(e=>{console.error(e.message);process.exitCode=1;}).finally(()=>db.$disconnect());
