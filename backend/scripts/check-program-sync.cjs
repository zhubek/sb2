const assert=require('node:assert/strict');
const {PrismaClient}=require('../generated/prisma');
const {spawn,spawnSync}=require('node:child_process');
const {resolve}=require('node:path');
const {existsSync,readFileSync,writeFileSync,renameSync}=require('node:fs');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const directory=resolve('../.data/cms-verification-v2'),file=resolve(directory,'content.json');
 assert.ok(existsSync(file),'Run frontend CMS integration checks first');
 const url=new URL(process.env.DATABASE_URL);assert.ok(['localhost','127.0.0.1'].includes(url.hostname));
 const db='sb2_cms_verification';
 const admin=new PrismaClient();if(!(await admin.$queryRaw`SELECT 1 FROM pg_database WHERE datname=${db}`).length)await admin.$executeRawUnsafe('CREATE DATABASE sb2_cms_verification');await admin.$disconnect();
 url.pathname='/'+db;
 const env={...process.env,DATABASE_URL:url.toString(),PORT:'3031',CMS_DATA_DIR:directory};
 const run=args=>{const result=spawnSync(process.execPath,args,{env,windowsHide:true,encoding:'utf8'});if(result.status!==0)throw new Error(result.stderr||result.stdout);};
 run(['node_modules/prisma/build/index.js','migrate','deploy']);
 const prisma=new PrismaClient({datasources:{db:{url:url.toString()}}});
 if(!await prisma.institution.count())run(['scripts/seed-empty.cjs']);
 run(['node_modules/@nestjs/cli/bin/nest.js','build']);
 const legacyFixture=await prisma.institutionProgram.findFirst({where:{institution:{type:'COLLEGE'},contentKey:{not:null}}});
 if(legacyFixture)await prisma.institutionProgram.update({where:{id:legacyFixture.id},data:{contentKey:null,opCode:null,opName:null}});
 const child=spawn(process.execPath,['dist/main.js'],{env,windowsHide:true,stdio:'ignore'});
 let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;console.log('PASS '+m);};
 async function waitFor(fn){for(let i=0;i<90;i++){try{const result=await fn();if(result)return result;}catch{}await delay(1000);}throw new Error('Timed out waiting for backend sync');}
 const backup=readFileSync(file,'utf8');
 function write(data){const tmp=file+'.backend-check.tmp';writeFileSync(tmp,JSON.stringify(data));renameSync(tmp,file);}
 try{
  await waitFor(async()=>{const r=await fetch('http://127.0.0.1:3031/api/navigator/education-programs/status');return (await r.json()).state==='ready';});
  if(legacyFixture)check((await prisma.institutionProgram.findUnique({where:{contentKey:legacyFixture.contentKey}})).id===legacyFixture.id,'legacy college relationship is upgraded without duplication');
  const response=await fetch('http://127.0.0.1:3031/api/navigator/education-programs?pageSize=1');const list=await response.json();
  check(list.total===9268&&list.items.length===1,'database exposes all 9268 offerings with pagination');
  const original=await prisma.institutionProgram.findUnique({where:{contentKey:'program.0.0'}});
  check(original.opName==='CMS QA · образовательная программа'&&original.price===123456,'published program reaches PostgreSQL');
  let data=JSON.parse(backup);data.entries['program.0.0'].draft.name='UNPUBLISHED BACKEND CHECK';data.entries['program.0.0'].revision++;write(data);await delay(6500);
  const afterDraft=await prisma.institutionProgram.findUnique({where:{contentKey:'program.0.0'}});check(afterDraft.opName===original.opName,'backend keeps drafts private');
  data.entries['program.0.0'].published={...data.entries['program.0.0'].draft,name:'PUBLISHED BACKEND CHECK',price:777777};data.entries['program.0.0'].revision++;write(data);
  const updated=await waitFor(async()=>{const p=await prisma.institutionProgram.findUnique({where:{contentKey:'program.0.0'}});return p.opName==='PUBLISHED BACKEND CHECK'?p:null;});
  check(updated.price===777777,'later publication automatically updates database');
  const found=await fetch('http://127.0.0.1:3031/api/navigator/education-programs?q=PUBLISHED%20BACKEND%20CHECK&institutionId=0').then(r=>r.json());check(found.total===1&&found.items[0].institution.extId===0,'program search and institution filter agree');
  check((await fetch('http://127.0.0.1:3031/api/navigator/education-programs?page=nope')).status===400,'malformed paging returns a validation error');
  check((await fetch('http://127.0.0.1:3031/api/navigator/education-programs/missing')).status===404,'unknown program returns 404');
  console.log(`${checks} backend integration checks passed.`);
 }finally{write(JSON.parse(backup));child.kill();await prisma.$disconnect();}
})().catch(e=>{console.error(e);process.exitCode=1;});
