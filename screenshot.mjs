import { chromium } from 'playwright';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
function putFile(path, buf, msg){
  const u=`https://api.github.com/repos/${REPO}/contents/${path}`; let s='';
  try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pf.json',JSON.stringify({message:msg,content:buf.toString('base64'),...(s?{sha:s}:{})}));
  return execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/pf.json "${u}"`,{maxBuffer:120*1024*1024}).toString().trim();
}
function putJson(name,o){ return putFile('screenshots/'+name, Buffer.from(JSON.stringify(o)), 'shot'); }

const LOGIN='https://dev.avesa.lt/?ps_tlogin=TlogKw8Nx7z';
const o={};
const browser=await chromium.launch({args:['--no-sandbox']});
const ctx=await browser.newContext({ httpCredentials:{username:U,password:P}, viewport:{width:1200,height:1400}, ignoreHTTPSErrors:true });
const page=await ctx.newPage();
try{
  const resp=await page.goto(LOGIN,{waitUntil:'networkidle',timeout:120000});
  o.first_status=resp?resp.status():null;
  await page.waitForTimeout(2500);
  o.final_url=page.url();
  // ar yra feeding blokas
  const el=await page.$('#ps-pet-feeding');
  o.feeding_block_found=!!el;
  if(el){ o.feeding_text=(await el.innerText()).replace(/\s+/g,' ').trim().slice(0,400); }
  // pilnas puslapio tekstas - ar yra "Šėrimo rekomendacija"
  const bodyText=await page.evaluate(()=>document.body?document.body.innerText:'');
  o.has_serimo=bodyText.includes('rimo rekomendacija');
  o.has_porcija=bodyText.includes('Dienos porcija');
  o.body_snippet=bodyText.replace(/\s+/g,' ').slice(0,600);
  // ar prisijunge (my-account rodo pet ekrana, ne login forma)
  o.has_login_form=bodyText.toLowerCase().includes('slaptažod') && bodyText.toLowerCase().includes('prisijung');
  // screenshot: jei blokas yra - jo elementas + pilnas
  if(el){ const eb=await el.screenshot(); o.elem_shot=putFile('screenshots/f1_feeding_block.png',eb,'F1 feeding block'); }
  const full=await page.screenshot({fullPage:true});
  o.full_shot=putFile('screenshots/f1_pet_page.png',full,'F1 pet page full');
  o.full_bytes=full.length;
}catch(e){ o.error=String(e).slice(0,300); 
  try{ const full=await page.screenshot(); o.err_shot=putFile('screenshots/f1_err.png',full,'F1 err'); }catch(e2){}
}
await browser.close();
console.log('PUT:',putJson('pw.json',o));
