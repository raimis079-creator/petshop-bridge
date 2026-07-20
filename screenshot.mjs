const LOGIN_URL="https://dev.avesa.lt/petshop-login?token=eyJ2ZXJzaW9uIjoxLCJwdXJwb3NlIjoibWFnaWNfbG9naW4iLCJzdWJqZWN0X2lkIjo0MywicmVzb3VyY2VfaWQiOiIiLCJhY3Rpb24iOiJwZXQiLCJleHBpcmVzX2F0IjoxNzg0NTgxNzExLCJub25jZSI6ImVlYjhlZTUxMTI5MWZiZWE1ZDEwYzI1N2ExY2ViNTQ3Iiwia2V5X2lkIjoidjIifQ.53951c2627e64826f499bb10af103a2f1bb444c6947e484107db2c19ed70a125";
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
const ctx = await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:900,height:1300}});
const page = await ctx.newPage();
const errs=[]; page.on('console',m=>{if(m.type()==='error')errs.push(m.text());}); page.on('pageerror',e=>errs.push('PE:'+e.message));
const posts=[]; page.on('request',r=>{ if(r.method()!=='GET' && /petshop\/v1/.test(r.url())) posts.push(r.method()+' '+r.url().split('/petshop/v1')[1]); });
try {
  // 1) ANONIMAS: pilna anketa -> draft su draft_id i localStorage
  await page.goto('https://dev.avesa.lt/anketa-testas/', {waitUntil:'networkidle', timeout:45000});
  await page.evaluate(()=>{ try{localStorage.clear();}catch(e){} });
  await page.reload({waitUntil:'networkidle'}); await page.waitForTimeout(2500);
  await page.evaluate(()=>{ var p=[].slice.call(document.querySelectorAll('#pspet-form .pspet-pill-species')).find(x=>/Šuo/.test(x.textContent)); if(p)p.click(); });
  await page.waitForTimeout(600);
  await page.evaluate(()=>{ var i=document.querySelector('#pspet-form input[type=text],#pspet-form input:not([type])'); if(i){i.value='LiveTestas'; i.dispatchEvent(new Event('input',{bubbles:true}));} });
  await page.evaluate(()=>{ document.querySelectorAll('#pspet-form .pspet-field').forEach(function(f){ var pill=f.querySelector('.pspet-pill:not(.pspet-pill-species)'); if(pill)pill.click(); }); });
  await page.waitForTimeout(500);
  await page.evaluate(()=>{ var b=[].slice.call(document.querySelectorAll('#pspet-form .pspet-btn')).find(x=>/tęsti/i.test(x.textContent)); if(b)b.click(); });
  await page.waitForTimeout(1600);
  await page.evaluate(()=>{ document.querySelectorAll('#pspet-form .pspet-field').forEach(function(f){ var pill=f.querySelector('.pspet-pill'); if(pill)pill.click(); }); });
  await page.waitForTimeout(500);
  o.draft_before = await page.evaluate(()=>{ try{ var d=JSON.parse(localStorage.getItem('pspet_draft')); return {id:d.draft_id, species:d.pet_data.species, name:d.pet_data.pet_name}; }catch(e){ return null; } });
  o.steps.push('anon draft created');
  // 2) MAGIC LOGIN: su tuo paciu localStorage einam i login URL
  await page.goto(LOGIN_URL, {waitUntil:'networkidle', timeout:45000});
  await page.waitForTimeout(1500);
  o.login_page_text = (await page.evaluate(()=> document.body.innerText.slice(0,200)));
  await page.screenshot({path:'/tmp/l1.png'});
  // POST forma su "Prisijungti" mygtuku
  o.submit_login = await page.evaluate(()=>{
     var f=document.querySelector('form'); var b=document.querySelector('form button,form input[type=submit]');
     if(b){b.click(); return true;} if(f){f.submit(); return 'form.submit';} return false;
  });
  await page.waitForTimeout(3500);
  o.after_login_url = page.url();
  o.steps.push('logged in');
  await page.screenshot({path:'/tmp/l2.png'});
  // 3) einam i MyAccount augintinis -> pet-profile.js transferDraftThenLoad turi perkelti draft i DB
  await page.goto('https://dev.avesa.lt/my-account/augintinis/', {waitUntil:'networkidle', timeout:45000});
  await page.waitForTimeout(4000);
  o.pet_page_text = (await page.evaluate(()=> (document.getElementById('pspet-profile')||document.body).innerText.slice(0,400)));
  o.draft_after = await page.evaluate(()=>{ try{ return localStorage.getItem('pspet_draft'); }catch(e){ return 'err'; } });
  o.draft_cleared = (o.draft_after===null);
  await page.screenshot({path:'/tmp/l3.png'});
} catch(e){ o.error=String(e).slice(0,300); }
o.rest_writes=posts; o.console_errors=errs.slice(0,15);
await browser.close();
img('mle2e_1.png','/tmp/l1.png'); img('mle2e_2.png','/tmp/l2.png'); img('mle2e_3.png','/tmp/l3.png');
console.log('PUT:',pr('m8mle2e.json',o));
