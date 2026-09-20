// Real Prisma queries against a disposable database on the isolated dev cluster.
const assert = require('node:assert/strict');
const {spawnSync} = require('node:child_process');
const {PrismaClient} = require('../generated/prisma');
const {ContentQueries} = require('../dist/modules/content/queries/content.queries');
const url = new URL(process.env.DATABASE_URL);
if (!['localhost','127.0.0.1'].includes(url.hostname) || url.port !== '5437') throw new Error('Use the isolated development database');
const name = 'sb2_page_categories_' + Date.now();
const admin = new PrismaClient();
url.pathname = '/' + name;
const db = new PrismaClient({datasourceUrl:url.toString()});
const queries = new ContentQueries(db), actor = {id:'category-review', contentAdmin:true};
let passed = 0;
const check = (condition, message) => {assert.ok(condition,message);passed++;console.log('PASS '+message)};
const fixtures = [
 ['landing.hero','landing'], ['copy.app.page','landing'], ['copy.components.landing-steps','landing'],
 ['copy.app.auth.auth-client','access'], ['copy.app.teacher.login.page','access'], ['copy.app.onboarding.page','access'],
 ['copy.app.platform.universities.university-list','navigator'], ['copy.components.navigator.navigator','navigator'], ['info-data.mainSkills','navigator'],
 ['copy.app.teacher.panel.page','teacher'], ['copy.components.teacher-nav','teacher'], ['inline.components.activity-chart.periods','teacher'],
 ['copy.app.not-found','shared'], ['copy.components.report-button','shared'], ['copy.future.shared-widget','shared'],
 ...Array.from({length:40},(_,i)=>['copy.app.platform.page'+String(i).padStart(2,'0'),'student']),
];
(async()=>{await admin.$executeRawUnsafe('CREATE DATABASE '+name);try{
 const migration=spawnSync(process.execPath,['node_modules/prisma/build/index.js','migrate','deploy'],{env:{...process.env,DATABASE_URL:url.toString()},encoding:'utf8'});
 if(migration.status!==0)throw new Error(migration.stderr);
 await db.contentDocument.createMany({data:[...fixtures.map(([id,category],i)=>({id,title:id,description:'',group:'pages',preview:'/',defaultValue:{},searchText:(i%2?'needle ':'')+id,dirty:i%3===0})),{id:'i18n.kk.landing.hero',title:'translation',description:'',group:'pages',preview:'/',defaultValue:{},searchText:'needle'},{id:'program.0.0',title:'Program',description:'',group:'catalog',preview:'/',defaultValue:{},searchText:'Program'}]});
 const all=await queries.list(actor,{group:'pages'});
 check(all.total===55 && all.items.length===30,'all pages use the existing page size and exclude translations');
 check(all.pageCategories.reduce((sum,c)=>sum+c.count,0)===55,'category counts partition the full library');
 const seen=[];
 for(const category of all.pageCategories){
   const expected=fixtures.filter(([,c])=>c===category.id).map(([id])=>id).sort();
   const first=await queries.list(actor,{group:'pages',pageCategory:category.id});
   const rows=[...first.items];
   for(let page=2;page<=first.pages;page++)rows.push(...(await queries.list(actor,{group:'pages',pageCategory:category.id,page})).items);
   check(first.total===expected.length && JSON.stringify(rows.map(r=>r.id))===JSON.stringify(expected),category.id+' filters before pagination and excludes other categories');
   check(rows.every(r=>r.pageCategory===category.id),category.id+' row labels agree with the query');seen.push(...rows.map(r=>r.id));
 }
 check(new Set(seen).size===55 && seen.length===55,'every page appears exactly once across categories');
 const filtered=await queries.list(actor,{group:'pages',pageCategory:'student',q:'needle',filter:'draft'});
 const expected=fixtures.filter(([id,category],i)=>category==='student'&&i%2&&i%3===0);
 check(filtered.total===expected.length && filtered.items.every(r=>r.dirty),'category combines with search and draft status');
 check(filtered.pageCategories.reduce((sum,c)=>sum+c.count,0)===fixtures.filter((_,i)=>i%2&&i%3===0).length,'facet counts reflect search and status across categories');
 const empty=await queries.list(actor,{group:'pages',q:'no matching content'});
 check(empty.total===0 && empty.pageCategories.every(c=>c.count===0),'empty search keeps all categories with zero counts');
 for(const filter of [{group:'pages',pageCategory:'unknown'},{group:'catalog',pageCategory:'teacher'}]){await assert.rejects(()=>queries.list(actor,filter),/категория/);check(true,'invalid category scope is rejected')}
 await assert.rejects(()=>queries.list(null,{group:'pages'}));check(true,'anonymous caller cannot read page rows or counts');
 await assert.rejects(()=>queries.list({id:'student',contentAdmin:false,role:'STUDENT',userId:1},{group:'pages'}));check(true,'student caller cannot read page rows or counts');
 const catalog=await queries.list(actor,{group:'catalog',category:'program'});check(catalog.total===1&&catalog.items[0].id==='program.0.0','catalog categories retain their existing meaning');
 console.log('Page-category checks passed: '+passed);
}finally{await db.$disconnect();await admin.$executeRawUnsafe('DROP DATABASE '+name);await admin.$disconnect()}})().catch(e=>{console.error(e);process.exitCode=1});
