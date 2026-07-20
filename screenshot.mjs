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
const o={};
const browser = await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx = await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:900,height:1300}});
const page = await ctx.newPage();
const errs=[]; page.on('console',m=>{if(m.type()==='error')errs.push(m.text());}); page.on('pageerror',e=>errs.push('PE:'+e.message));
const posts=[]; page.on('request',r=>{ if(r.method()!=='GET' && /petshop\/v1/.test(r.url())) posts.push(r.method()+' '+r.url().split('/petshop/v1')[1]); });
try {
  await page.goto('https://dev.avesa.lt/anketa-testas/', {waitUntil:'domcontentloaded', timeout:45000});
  await page.evaluate(()=>{ try{localStorage.clear();}catch(e){} });
  await page.reload({waitUntil:'networkidle'}); await page.waitForTimeout(2500);
  // step1: dog + fill first pill each field
  await page.evaluate(()=>{ var p=[].slice.call(document.querySelectorAll('#pspet-form .pspet-pill-species')).find(x=>/Šuo/.test(x.textContent)); if(p)p.click(); });
  await page.waitForTimeout(800);
  await page.evaluate(()=>{ document.querySelectorAll('#pspet-form .pspet-field').forEach(function(f){ var pill=f.querySelector('.pspet-pill:not(.pspet-pill-species)'); if(pill)pill.click(); }); });
  await page.waitForTimeout(500);
  await page.evaluate(()=>{ var b=[].slice.call(document.querySelectorAll('#pspet-form .pspet-btn')).find(x=>/tęsti/i.test(x.textContent)); if(b)b.click(); });
  await page.waitForTimeout(1600);
  // step2: fill all pill fields
  o.on_step2 = await page.evaluate(()=> /2 žingsnis/.test((document.getElementById('pspet-form').innerText||'')));
  await page.evaluate(()=>{ document.querySelectorAll('#pspet-form .pspet-field').forEach(function(f){ var pill=f.querySelector('.pspet-pill'); if(pill)pill.click(); }); });
  await page.waitForTimeout(500);
  await page.screenshot({path:'/tmp/g1.png'});
  // ISSAUGOTI
  o.saved_click = await page.evaluate(()=>{ var b=[].slice.call(document.querySelectorAll('#pspet-form .pspet-btn,#pspet-form button')).find(x=>/išsaugoti/i.test(x.textContent)); if(b){b.click();return true;} return false; });
  await page.waitForTimeout(2500);
  o.result = await page.evaluate(()=>{ var r=document.getElementById('pspet-form'); return {text:(r.innerText||'').slice(0,500), hasEmail:!!r.querySelector('input[type=email]')}; });
  await page.screenshot({path:'/tmp/g2.png'});
  // draft issaugotas localStorage?
  o.draft_saved = await page.evaluate(()=>{ try{ var k=Object.keys(localStorage).filter(function(x){return /pet|draft|pspet/i.test(x);}); return k.length>0 ? k : false; }catch(e){return 'err';} });
} catch(e){ o.error=String(e).slice(0,300); }
o.rest_writes=posts; o.console_errors=errs.slice(0,15);
await browser.close();
img('e2e2_1.png','/tmp/g1.png'); img('e2e2_2.png','/tmp/g2.png');
console.log('PUT:',pr('m8e2e2.json',o));
