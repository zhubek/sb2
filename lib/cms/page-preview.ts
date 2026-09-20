import 'server-only';
import { cache } from 'react';
import { createHash, randomBytes } from 'node:crypto';
import { mkdir, readdir, writeFile, rename, unlink, stat } from 'node:fs/promises';
import { readFile } from 'node:fs';
import path from 'node:path';
import { cookies, headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { isAdmin } from './auth';
import type { Json } from './types';
import type { ContentLocale } from '@/backend/src/modules/content/domain/localization';

const directory=path.join(process.cwd(),'.data','content-previews');
const lifetime=10*60*1000;
export type PagePreview={id:string;value:Json;locale:ContentLocale;route:string;focus?:string;owner:string;expires:number};
async function owner(create = false) {
  if (!await isAdmin()) return null;
  const user=(await auth())?.user;
  const jar=await cookies();
  const primary=jar.get('sb-admin')?.value ?? '';
  let browser=jar.get('sb-preview-session')?.value;
  if (!browser && create) {
    browser=randomBytes(24).toString('hex');
    jar.set('sb-preview-session',browser,{httpOnly:true,sameSite:'strict',path:'/',maxAge:8*60*60,secure:(await headers()).get('x-forwarded-proto')==='https'});
  }
  if (!browser) return null;
  return createHash('sha256').update(`${user?.id??''}:${user?.credentialVersion??''}:${primary}:${browser}`).digest('hex');
}
export async function createPagePreview(input:Omit<PagePreview,'owner'|'expires'>) {
  const fingerprint=await owner(true);
  if (!fingerprint) throw new Error('Нет доступа к предпросмотру');
  await mkdir(directory,{recursive:true});
  const files=(await readdir(directory)).filter(n=>/^[a-f0-9]{48}\.json$/.test(n));
  const ordered=await Promise.all(files.map(async name=>({name,time:await stat(path.join(directory,name)).then(s=>s.mtimeMs).catch(()=>0)})));
  const obsolete=ordered.sort((a,b)=>b.time-a.time).filter((f,i)=>i>=63 || f.time<Date.now()-lifetime);
  await Promise.all(obsolete.map(f=>unlink(path.join(directory,f.name)).catch(()=>{})));
  const token=randomBytes(24).toString('hex');
  const filename=path.join(directory,token+'.json');
  const snapshot:PagePreview={...input,owner:fingerprint,expires:Date.now()+lifetime};
  await writeFile(filename+'.tmp',JSON.stringify(snapshot),{mode:0o600});
  await rename(filename+'.tmp',filename);
  return token;
}
export const previewRequest=cache(async ():Promise<{requested:boolean;snapshot:PagePreview|null}>=>{
  const h=await headers(),token=h.get('x-cms-preview-token');
  if (!token) return {requested:false,snapshot:null};
  if (!/^[a-f0-9]{48}$/.test(token)) return {requested:true,snapshot:null};
  try {
    const fingerprint=await owner();
    if (!fingerprint) return {requested:true,snapshot:null};
    // Next's development Flight payload includes resolved await values.
    // Resolve only an authorized snapshot, never an unchecked file body.
    const snapshot=await new Promise<PagePreview|null>(resolve=>{
      readFile(path.join(directory,token+'.json'),'utf8',(error,raw)=>{
        if(error){resolve(null);return;}
        try {
          const value=JSON.parse(raw) as PagePreview;
          resolve(value.owner===fingerprint && value.expires>Date.now() && value.route===h.get('x-cms-preview-path')?value:null);
        } catch {resolve(null);}
      });
    });
    return {requested:true,snapshot};
  } catch { return {requested:true,snapshot:null}; }
});
