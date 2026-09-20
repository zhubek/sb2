const fs = require('node:fs');
const { chromium } = require('playwright');
const dir='/mnt/sb2dev/backups/app-review-20260909';
(async()=>{
  const names=fs.readdirSync(dir).filter(n=>/^(actions-|pages-|registration-|multilingual-cms).*\.webm$/.test(n));
  fs.writeFileSync(dir+'/video-check.html','<video controls style="width:100%;height:100%"></video>');
  const browser=await chromium.launch({args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
  try {
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    await page.goto('file://'+dir+'/video-check.html');
    const results=[];
    for(const name of names){
      await page.evaluate(name=>{const v=document.querySelector('video');v.src=name;v.load();},name);
      await page.waitForFunction(()=>{const v=document.querySelector('video');return v.readyState>=2&&v.videoWidth>0;});
      const data=await page.evaluate(()=>{const v=document.querySelector('video');return {width:v.videoWidth,height:v.videoHeight,duration:Number.isFinite(v.duration)?v.duration:null};});
      results.push({file:name,bytes:fs.statSync(dir+'/'+name).size,...data});
      if(name==='multilingual-cms.webm'){
        await page.evaluate(()=>document.querySelector('video').currentTime=12);
        await page.waitForTimeout(500);
        await page.screenshot({path:dir+'/multilingual-video-frame.png'});
      }
    }
    fs.writeFileSync(dir+'/video-metadata.json',JSON.stringify(results,null,2));
    console.log('Decoded recordings: '+results.length);
    console.log(JSON.stringify(results));
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
