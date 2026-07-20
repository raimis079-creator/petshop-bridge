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
async function clickByText(page, txt){
  return await page.evaluate((t)=>{
    var root=document.getElementById('pspet-form')||document;
    var all=[].slice.call(root.querySelectorAll('*'));
    var el=all.find(e=>{ var d=(e.innerText||e.textContent||'').trim(); return d===t && e.offsetHeight>0 && e.children.length<=2; });
    if(el){ el.click(); return true; } return false;
  }, txt);
}
const o={steps:[]};
const browser = await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx = await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:900,height:1300}});
const page = await ctx.newPage();
const errs=[]; page.on('console',m=>{if(m.type()==='error')errs.push(m.text());}); page.on('pageerror',e=>errs.push('PE:'+e.message));
// stebim REST kvietimus
const posts=[]; page.on('request',r=>{ if(r.method()!=='GET' && /petshop\/v1/.test(r.url())) posts.push(r.method()+' '+r.url().split('/petshop/v1')[1]); });
try {
  await page.goto('https://dev.avesa.lt/anketa-testas/', {waitUntil:'domcontentloaded', timeout:45000});
  await page.evaluate(()=>{ try{localStorage.clear();}catch(e){} });
  await page.reload({waitUntil:'networkidle'}); await page.waitForTimeout(2500);
  // 1) Šuo
  o.picked_dog = await clickByText(page,'Šuo'); await page.waitForTimeout(800);
  // vardas
  await page.evaluate(()=>{ var i=document.querySelector('#pspet-form input[type=text],#pspet-form input:not([type])'); if(i){i.value='TestasE2E'; i.dispatchEvent(new Event('input',{bubbles:true}));} });
  await page.screenshot({path:'/tmp/d1.png'});
  // TĘSTI
  o.next1 = await clickByText(page,'TĘSTI') || await clickByText(page,'Tęsti'); await page.waitForTimeout(1500);
  o.step2 = await page.evaluate(()=>{ var r=document.getElementById('pspet-form'); return {text:(r.innerText||'').slice(0,400), inputs:r.querySelectorAll('input,select').length}; });
  await page.screenshot({path:'/tmp/d2.png'});
  // bandom uzpildyti step2 privalomus ir tęsti iki pabaigos (kelis kartus)
  for(var i=0;i<3;i++){
    // pasirenkam pirma matoma pasirinkima kiekvienam klausimui
    await page.evaluate(()=>{
      var r=document.getElementById('pspet-form');
      r.querySelectorAll('.pspet-choice,[data-value],.pspet-opt').forEach(function(g){});
      // pirmas radio/plytele kiekvienoje grupeje
      var groups={};
      r.querySelectorAll('input[type=radio]').forEach(function(x){ if(!groups[x.name]){groups[x.name]=1; x.click();} });
    });
    await page.waitForTimeout(400);
    var adv = await clickByText(page,'TĘSTI') || await clickByText(page,'Tęsti') || await clickByText(page,'Baigti') || await clickByText(page,'Išsaugoti') || await clickByText(page,'IŠSAUGOTI');
    if(!adv) break;
    await page.waitForTimeout(1800);
  }
  o.final = await page.evaluate(()=>{ var r=document.getElementById('pspet-form'); return {text:(r.innerText||'').slice(0,500)}; });
  await page.screenshot({path:'/tmp/d3.png'});
} catch(e){ o.error=String(e).slice(0,300); }
o.rest_writes=posts;
o.console_errors=errs.slice(0,15);
await browser.close();
img('e2c_1.png','/tmp/d1.png'); img('e2c_2.png','/tmp/d2.png'); img('e2c_3.png','/tmp/d3.png');
console.log('PUT:',pr('m8e2c.json',o));
