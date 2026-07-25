import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2');}return 'fail';}
const o={};
const shots=[];
try {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 900, height: 1100 }, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  const U = process.env.WP_USER || '', P = (process.env.WP_APP_PASS || '').replace(/\s+/g, '');
  await page.goto('https://dev.avesa.lt/wp-login.php', { timeout: 30000 });
  await page.waitForSelector('#user_login', { timeout: 10000 });
  await page.fill('#user_login', U); await page.fill('#user_pass', P);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), page.click('#wp-submit')]);
  await page.goto('https://dev.avesa.lt/my-account/augintinis/?action=create', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2500);
  // rodent
  await page.evaluate(() => {
    var host = document.getElementById('pspet-synthetic') || (function(){var h=document.createElement('div');h.id='pspet-synthetic';document.body.prepend(h);return h;})();
    window.PetshopPetForm.mount(host, { step:2, data:{ species:'rodent', pet_name:'Ziurke' } });
  });
  await page.waitForTimeout(500);
  o.rodent = await page.evaluate(() => ({
    segs: document.querySelectorAll('.pspet-ring-seg').length,
    steps: document.querySelectorAll('.pspet-step').length,
    single: document.querySelectorAll('.pspet-section-single').length,
    hasRing: !!document.querySelector('.pspet-ring-wrap'),
    hasRingText: !!document.querySelector('.pspet-ringtext'),
    fields: Array.from(document.querySelectorAll('.pspet-section-single .pspet-label')).map(e=>e.textContent),
    hasSens: !!document.querySelector('[data-field="sens"]') || document.body.innerHTML.includes('Jautrumai'),
    btnLabel: (document.querySelector('.pspet-btn-primary')||{}).textContent||''
  }));
  const b1 = await page.screenshot({ fullPage: true }); fs.writeFileSync('/tmp/m01_rodent.png', b1); shots.push('m01_rodent');
  // dog regression - still 3 sections
  await page.evaluate(() => {
    var host = document.getElementById('pspet-synthetic');
    window.PetshopPetForm.mount(host, { step:2, data:{ species:'dog', pet_name:'Reksas' } });
  });
  await page.waitForTimeout(400);
  o.dog = await page.evaluate(() => ({ segs: document.querySelectorAll('.pspet-ring-seg').length, steps: document.querySelectorAll('.pspet-step').length }));
  await browser.close();
} catch (e) { o.fatal = String(e).slice(0,400); }
for (const n of shots) { try { putB64(n+'.png', fs.readFileSync('/tmp/'+n+'.png').toString('base64')); } catch(e){} }
putB64('mincheck.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
