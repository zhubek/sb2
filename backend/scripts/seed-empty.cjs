const {PrismaClient,Prisma}=require('../generated/prisma');
const {spawnSync}=require('node:child_process');
(async()=>{const p=new PrismaClient();const counts=await Promise.all(Object.keys(Prisma.ModelName).map(name=>p[name[0].toLowerCase()+name.slice(1)].count()));await p.$disconnect();if(counts.some(Boolean))throw new Error('Database is not empty; refusing destructive seed');const r=spawnSync(process.execPath,['node_modules/ts-node/dist/bin.js','-T','prisma/seed.ts'],{stdio:'inherit'});process.exit(r.status??1);})().catch(e=>{console.error(e.message);process.exit(1)});
