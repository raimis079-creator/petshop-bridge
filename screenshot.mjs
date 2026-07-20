import { execSync } from 'child_process';
import fs from 'fs';
import { chromium } from 'playwright';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nc='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'e',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
function img(n,f){try{const b=fs.readFileSync(f).toString('base64');const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nc='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}fs.writeFileSync('/tmp/img.json',JSON.stringify({message:'i',content:b,...(s?{sha:s}:{})}));execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/img.json "'+u+'"');}catch(e){}}
const o={steps:[]};
const browser = await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx = await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:900,height:1100}});
const page = await ctx.newPage();
const errs=[]; page.on('console',m=>{if(m.type()==='error')errs.push(m.text());}); page.on('pageerror',e=>errs.push('PE:'+e.message));
try {
  await page.goto('https://dev.avesa.lt/anketa-testas/', {waitUntil:'domcontentloaded', timeout:45000});
  // SVARUS startas: isvalom localStorage ir remount
  await page.evaluate(()=>{ try{localStorage.clear();}catch(e){} });
  await page.reload({waitUntil:'networkidle'});
  await page.waitForTimeout(2500);
  o.steps.push('clean load');
  o.mounted = await page.evaluate(()=> !!(window.PetshopPetForm&&window.PetshopPetForm.mounted));
  // Step 1: turi rodyti rusies pasirinkima. Renkam visus interaktyvius elementus.
  o.step1 = await page.evaluate(()=>{
     var root=document.getElementById('pspet-form'); if(!root)return {none:true};
     var btns=[].slice.call(root.querySelectorAll('button,a,[role=button],.pspet-choice,[data-species],.pspet-species-btn'));
     return { text:(root.innerText||'').slice(0,200), btnCount:btns.length, labels:btns.slice(0,12).map(b=>(b.textContent||'').trim().slice(0,25)) };
  });
  await page.screenshot({path:'/tmp/c1.png'});
  // spustelim "Šuo" ar pirma rusi
  const pick = await page.evaluate(()=>{
     var root=document.getElementById('pspet-form');
     var cand=[].slice.call(root.querySelectorAll('button,a,.pspet-choice,[data-species]'));
     var dog=cand.find(b=>/šuo|šun|dog/i.test(b.textContent));
     var t=(dog||cand[0]); if(t){t.click(); return (t.textContent||'').trim().slice(0,30);} return null;
  });
  o.picked_species = pick;
  await page.waitForTimeout(1800);
  o.step_after_species = await page.evaluate(()=>{
     var root=document.getElementById('pspet-form');
     return { text:(root.innerText||'').slice(0,250), inputs:root.querySelectorAll('input,select').length, btns:root.querySelectorAll('button,a').length };
  });
  await page.screenshot({path:'/tmp/c2.png'});
} catch(e){ o.error=String(e).slice(0,300); }
o.console_errors=errs.slice(0,15);
await browser.close();
img('e2b_1.png','/tmp/c1.png'); img('e2b_2.png','/tmp/c2.png');
console.log('PUT:',pr('m8e2b.json',o));
