import { execSync } from 'child_process';
import fs from 'fs';
import { chromium } from 'playwright';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nc='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'e',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
const o={};
const browser = await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx = await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:900,height:1100}});
const page = await ctx.newPage();
try {
  await page.goto('https://dev.avesa.lt/anketa-testas/', {waitUntil:'domcontentloaded', timeout:45000});
  await page.evaluate(()=>{ try{localStorage.clear();}catch(e){} });
  await page.reload({waitUntil:'networkidle'}); await page.waitForTimeout(2500);
  // pasirenkam dog + vardas -> saveDraft turi sukurti draft_id
  await page.evaluate(()=>{ var p=[].slice.call(document.querySelectorAll('#pspet-form .pspet-pill-species')).find(x=>/Šuo/.test(x.textContent)); if(p)p.click(); });
  await page.waitForTimeout(600);
  await page.evaluate(()=>{ var i=document.querySelector('#pspet-form input[type=text],#pspet-form input:not([type])'); if(i){i.value='Draftukas'; i.dispatchEvent(new Event('input',{bubbles:true}));} });
  await page.waitForTimeout(800);
  o.draft = await page.evaluate(()=>{ try{ return JSON.parse(localStorage.getItem('pspet_draft')); }catch(e){ return null; } });
  o.has_draft_id = !!(o.draft && o.draft.draft_id);
  o.has_expires = !!(o.draft && o.draft.expires_at);
  o.species_in_draft = o.draft && o.draft.pet_data && o.draft.pet_data.species;
} catch(e){ o.error=String(e).slice(0,300); }
await browser.close();
console.log('PUT:',pr('m8df.json',o));
