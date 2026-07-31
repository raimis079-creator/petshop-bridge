import { execSync } from 'child_process';
import fs from 'fs';
import { chromium } from 'playwright';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function head(u){ try{ return execSync('curl -sSkI -L --max-time 25 "'+u+'" -o /dev/null -w "%{http_code}|%{url_effective}" 2>&1',{maxBuffer:10e6}).toString().trim().slice(0,140);}catch(e){return 'ERR';} }
const O={probe:{}}; const wait=ms=>new Promise(r=>setTimeout(r,ms));
const V='106200460', B='CE123456789LT';
for (const u of [
  'https://venipak.lt/tracking/track/'+V,
  'https://venipak.com/tracking/track/'+V,
  'https://www.post.lt/siuntu-sekimas?parcels='+B,
]) O.probe[u]=head(u);
let br;
try{
 br=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
 const ctx=await br.newContext({viewport:{width:1280,height:1000},ignoreHTTPSErrors:true});
 const p=await ctx.newPage();
 for (const [name,url,needle] of [
   ['venipak','https://venipak.lt/tracking/track/'+V,V],
   ['venipak_com','https://venipak.com/tracking/track/'+V,V],
   ['lp','https://www.post.lt/siuntu-sekimas?parcels='+B,B],
 ]) {
   try{
     await p.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
     await wait(3000);
     // bandom priimti slapukus
     for(const sel of ['button:has-text("Sutinku")','button:has-text("Priimti")','#onetrust-accept-btn-handler','.cmplz-accept','button:has-text("Leisti")']){
       const b=await p.$(sel); if(b){ await b.click().catch(()=>{}); await wait(2000); break; }
     }
     await wait(4000);
     const txt=await p.evaluate(()=>document.body.innerText.slice(0,4000));
     const vals=await p.$$eval('input',is=>is.map(i=>i.value).filter(Boolean));
     O[name]={url:p.url().slice(0,95),
       in_text:txt.includes(needle)?1:0,
       in_input:vals.some(v=>String(v).includes(needle))?1:0,
       inputs:vals.slice(0,8),
       excerpt:txt.replace(/\s+/g,' ').slice(0,350)};
   }catch(e){ O[name]={err:String(e).slice(0,150)}; }
 }
 await ctx.close();
}catch(e){ O.err=String(e).slice(0,200); }
try{ if(br) await br.close(); }catch(e){}
putB64('u3.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
