process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const out={};
const br = await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx = await br.newContext({httpCredentials:{username:process.env.WP_USER,password:process.env.WP_APP_PASS},ignoreHTTPSErrors:true, viewport:{width:1440,height:1100}});
const page = await ctx.newPage();
const failai=[];
async function shot(vardas){
  const b = await page.screenshot({fullPage:false});
  const kelias = 'screenshots/'+vardas+'.png';
  const b64 = b.toString('base64');
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${kelias}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const body={message:'shot',content:b64}; if(sha) body.sha=sha;
  const r=await fetch(`https://api.github.com/repos/${REPO}/contents/${kelias}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
  failai.push(vardas+':'+r.status);
}
/* 1) konservu deze tuscia */
await page.goto(WP+'/product/test-konservu-deze-suniui-800-g/',{waitUntil:'networkidle',timeout:60000});
await page.waitForTimeout(2500);
await shot('kons_tuscia');
/* 2) prisipildzius su dovana */
await page.evaluate(()=>document.getElementById('pslk-visi').click());
await page.waitForTimeout(600);
for(let i=0;i<8;i++){ await page.evaluate(()=>{var b=document.querySelector('.pslk-kort .pslk-stp button[data-d="1"]');if(b)b.click();}); await page.waitForTimeout(90); }
await page.waitForTimeout(900);
await shot('kons_pilna');
/* 3) sonas is arti */
const el = await page.locator('.pslk-sonas');
try{ const b=await el.screenshot(); 
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/kons_sonas.png`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const body={message:'shot',content:b.toString('base64')}; if(sha) body.sha=sha;
  const r=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/kons_sonas.png`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
  failai.push('sonas:'+r.status);
}catch(e){ failai.push('sonas_err'); }
/* 4) skanestu deze palyginimui */
await page.goto(WP+'/product/skanestu-deze-suniui-be-vistienos/',{waitUntil:'networkidle',timeout:60000});
await page.waitForTimeout(2500);
await shot('skan_palyginimui');
out.failai=failai;
await br.close();
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/shots.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/shots.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('ok');
