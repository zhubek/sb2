const fs=require('node:fs/promises'),path=require('node:path');
// Only called by check-framework against its disposable database.
module.exports=async({db,check,headers,webBase,defaults})=>{
 const {validateDocument}=require('../dist/modules/content/domain/validation');
 check(defaults.filter(d=>d.id.startsWith('industry.')).every(d=>validateDocument(d,d.value).length===0),'all seeded industries accept repeated program codes');
 const duplicateIds={id:'example',title:'Example',value:[{id:'one',code:'shared'},{id:'two',code:'shared'}]};
 check(validateDocument(duplicateIds,[{id:'one',code:'shared'},{id:'one',code:'shared'}]).some(e=>e.includes('повторяется')),'duplicate explicit record IDs remain invalid');
 const industry=defaults.find(d=>d.id.startsWith('industry.'));
 await db.contentDocument.create({data:{id:industry.id,title:industry.title,description:industry.description,group:industry.group,kind:industry.kind,preview:industry.preview,defaultValue:industry.value,searchText:industry.id}});
 const saved=await fetch(webBase+'/api/admin/content/'+encodeURIComponent(industry.id),{method:'PUT',headers:{...headers(),origin:webBase},body:JSON.stringify({action:'save',value:industry.value,revision:0})});
 check(saved.status===200 && (await db.contentDocument.findUnique({where:{id:industry.id}})).revision===1,'Cyrillic industry with repeated codes can be saved through the BFF');
 const id='landing.hero',marker='Private preview security check';
 const value=structuredClone(defaults.find(d=>d.id===id).value);value.h1.ru=marker;
 const credential=headers().cookie;
 const before=await db.contentDocument.findUnique({where:{id}});
 const post=data=>fetch(webBase+'/api/admin/page-preview',{method:'POST',headers:{cookie:credential,origin:webBase,'Content-Type':'application/json'},body:JSON.stringify(data)});
 const created=await post({id,value,route:'/',locale:'ru'});
 check(created.status===200,'authorized page preview is created');
 const {url}=await created.json(),token=url.split('/')[2];
 const cookie=[credential,...created.headers.getSetCookie().map(c=>c.split(';')[0])].join('; ');
 const read=async(target=url,custom={cookie})=>(await fetch(webBase+target,{headers:custom})).text();
 check((await read()).includes(marker),'preview renders a private unsaved snapshot');
 check(!(await read(url,{cookie:credential})).includes(marker),'same administrator in another browser cannot read a snapshot');
 check(!(await read(url,{})).includes(marker),'anonymous preview request cannot read a snapshot');
 check(!(await read('/',{cookie,'x-cms-preview-token':token,'x-cms-preview-path':'/'})).includes(marker),'ordinary page rejects forged preview headers');
 check(!(await read(url+'/portfolio')).includes(marker),'snapshot cannot be reused for another route');
 try {
   await db.contentAdministrator.update({where:{id:'primary'},data:{enabled:false}});
   check(!(await read()).includes(marker),'revoked administrator immediately loses preview access');
 } finally {await db.contentAdministrator.update({where:{id:'primary'},data:{enabled:true}});}
 const filename=path.resolve('../.data/content-previews',token+'.json');
 try {
   const snapshot=JSON.parse(await fs.readFile(filename,'utf8'));snapshot.expires=Date.now()-1;
   await fs.writeFile(filename,JSON.stringify(snapshot),{mode:0o600});
   check(!(await read()).includes(marker),'expired page preview is rejected');
 } finally {await fs.unlink(filename).catch(()=>{});}
 check((await post({id,value,route:'/admin',locale:'ru'})).status===422,'preview only accepts registered public routes');
 check((await post(null)).status===400,'malformed preview payload is rejected');
 const after=await db.contentDocument.findUnique({where:{id}});
 check(after.revision===before.revision && JSON.stringify(after.draft)===JSON.stringify(before.draft) && JSON.stringify(after.published)===JSON.stringify(before.published),'page previews do not change CMS drafts or publications');
};
