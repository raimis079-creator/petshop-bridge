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
  await page.goto('https://dev.avesa.lt/anketa-testas/', {waitUntil:'domcontentloaded', timeout:45000});
  await page.evaluate(()=>{ try{localStorage.clear();}catch(e){} });
  await page.reload({waitUntil:'networkidle'}); await page.waitForTimeout(2500);
  // Species: klik ant .pspet-pill-species turincios "Šuo"
  o.dog_click = await page.evaluate(()=>{
    var pills=[].slice.call(document.querySelectorAll('#pspet-form .pspet-pill-species'));
    var dog=pills.find(p=>/Šuo/.test(p.textContent));
    if(dog){ dog.click(); return true; } return false;
  });
  await page.waitForTimeout(1000);
  o.species_state = await page.evaluate(()=> (window.__ps_state && window.__ps_state.data && window.__ps_state.data.species) || 'unknown');
  o.dog_pill_active = await page.evaluate(()=> !!document.querySelector('#pspet-form .pspet-pill-species.active'));
  // dog atsivere papildomi laukai? life_stage / dydis
  o.after_dog = await page.evaluate(()=>{ var r=document.getElementById('pspet-form'); return {text:(r.innerText||'').slice(0,350), pills:r.querySelectorAll('.pspet-pill').length}; });
  await page.screenshot({path:'/tmp/f1.png'});
  // uzpildom likusias step1 privalomas plyteles (imam pirma kiekvienos grupes)
  await page.evaluate(()=>{
    var r=document.getElementById('pspet-form');
    // grupes: life_stage, dog_size, is_sterilised, feeding_type, primary_need
    var seen={};
    r.querySelectorAll('.pspet-field').forEach(function(f){
      var firstPill=f.querySelector('.pspet-pill:not(.pspet-pill-species)');
      if(firstPill) firstPill.click();
    });
  });
  await page.waitForTimeout(800);
  await page.screenshot({path:'/tmp/f2.png'});
  // TESTI -> step2
  o.next = await page.evaluate(()=>{
    var b=[].slice.call(document.querySelectorAll('#pspet-form button,#pspet-form .pspet-btn')).find(x=>/tęsti/i.test(x.textContent));
    if(b){b.click();return true;} return false;
  });
  await page.waitForTimeout(1800);
  o.step2 = await page.evaluate(()=>{ var r=document.getElementById('pspet-form'); return {text:(r.innerText||'').slice(0,400), progress:(r.querySelector('.pspet-progress-step')||{}).innerText||''}; });
  await page.screenshot({path:'/tmp/f3.png'});
} catch(e){ o.error=String(e).slice(0,300); }
o.rest_writes=posts; o.console_errors=errs.slice(0,15);
await browser.close();
img('e2d_1.png','/tmp/f1.png'); img('e2d_2.png','/tmp/f2.png'); img('e2d_3.png','/tmp/f3.png');
console.log('PUT:',pr('m8e2d.json',o));
