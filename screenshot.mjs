import { execSync } from 'child_process';
import fs from 'fs';
import { chromium } from 'playwright';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function pr(n,o,isText){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  const content = isText ? Buffer.from(o).toString('base64') : Buffer.from(JSON.stringify(o)).toString('base64');
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'e2e',content:content,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
const o={steps:[]};
const browser = await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx = await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:900,height:1100}});
const page = await ctx.newPage();
const errs=[];
page.on('console', m=>{ if(m.type()==='error') errs.push(m.text()); });
page.on('pageerror', e=>errs.push('PAGEERROR: '+e.message));
try {
  // 1) Anoniminis: viesas shortcode puslapis
  await page.goto('https://dev.avesa.lt/anketa-testas/', {waitUntil:'networkidle', timeout:45000});
  await page.waitForTimeout(2500);
  o.steps.push('loaded anketa-testas');
  o.has_config = await page.evaluate(()=> typeof window.PSPetConfig!=='undefined');
  o.has_petform_api = await page.evaluate(()=> !!(window.PetshopPetForm && window.PetshopPetForm.mount));
  o.form_container_present = await page.evaluate(()=> !!document.getElementById('pspet-form'));
  o.form_mounted = await page.evaluate(()=> !!(window.PetshopPetForm && window.PetshopPetForm.mounted));
  // ar matomas anketos turinys (pspet-wrap arba rusies pasirinkimas)
  o.wrap_visible = await page.evaluate(()=>{ var w=document.querySelector('.pspet-wrap'); return !!(w && w.offsetHeight>0); });
  o.body_text_len = (await page.evaluate(()=> (document.querySelector('#pspet-form')||{}).innerText||'')).length;
  await page.screenshot({path:'/tmp/e2e1.png', fullPage:false});
  // pirmojo zingsnio elementai: species mygtukai?
  o.species_buttons = await page.evaluate(()=> document.querySelectorAll('.pspet-species, [data-species], .pspet-choice').length);
  // 2) Bandom spustelet pirma rusies pasirinkima jei yra
  const clicked = await page.evaluate(()=>{
     var b=document.querySelector('.pspet-species, [data-species], .pspet-choice, .pspet-btn');
     if(b){ b.click(); return b.textContent.trim().slice(0,40); } return null;
  });
  o.first_click = clicked;
  await page.waitForTimeout(1500);
  await page.screenshot({path:'/tmp/e2e2.png', fullPage:false});
  o.after_click_text_len = (await page.evaluate(()=> (document.querySelector('#pspet-form')||{}).innerText||'')).length;
} catch(e){ o.error = String(e).slice(0,300); }
o.console_errors = errs.slice(0,15);
await browser.close();
// screenshots -> base64 upload as binary
for(const [n,f] of [['e2e_step1.png','/tmp/e2e1.png'],['e2e_step2.png','/tmp/e2e2.png']]){
  try{ const b=fs.readFileSync(f).toString('base64');
    const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n; let s='';
    try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nc='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
    fs.writeFileSync('/tmp/img.json',JSON.stringify({message:'img',content:b,...(s?{sha:s}:{})}));
    execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/img.json "'+u+'"');
  }catch(e){ o.img_err=(o.img_err||'')+n+':'+e.message; }
}
console.log('PUT:',pr('m8e2e.json',o));
