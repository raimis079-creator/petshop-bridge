import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2');}return 'fail';}
const o={};
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
  await page.evaluate(() => {
    var host = document.getElementById('pspet-synthetic') || (function(){var h=document.createElement('div');h.id='pspet-synthetic';document.body.prepend(h);return h;})();
    window.PetshopPetForm.mount(host, { step:2, data:{ species:'dog', pet_name:'Reksas' } });
  });
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    var pill = document.querySelector('.pspet-step.pspet-is-active .pspet-pill');
    if (pill) pill.click();
    var next = document.querySelector('.pspet-btn-primary');
    if (next) next.click();
  });
  await page.waitForTimeout(500);
  o.doneCard = await page.evaluate(() => {
    var card = document.querySelector('.pspet-step.pspet-is-done');
    if (!card) return { error:'no done card' };
    var head = card.querySelector('.pspet-step-head');
    var r = head ? head.getBoundingClientRect() : null;
    return { cardDisplay: getComputedStyle(card).display, headW: r?Math.round(r.width):0, headH: r?Math.round(r.height):0 };
  });
  // reopen click
  await page.evaluate(() => { var h=document.querySelector('.pspet-step.pspet-is-done .pspet-step-head'); if(h) h.click(); });
  await page.waitForTimeout(500);
  o.afterReopen = await page.evaluate(() => ({
    activeIdx: (function(){ var idx=-1; document.querySelectorAll('.pspet-step').forEach(function(s,i){ if(s.classList.contains('pspet-is-active')) idx=i; }); return idx; })(),
    activeBodyVisible: !!document.querySelector('.pspet-step.pspet-is-active .pspet-step-body')
  }));
  const buf = await page.screenshot({ fullPage: true });
  fs.writeFileSync('/tmp/v2.png', buf);
  await browser.close();
} catch (e) { o.fatal = String(e).slice(0,400); }
try { putB64('v2.png', fs.readFileSync('/tmp/v2.png').toString('base64')); } catch(e){}
putB64('verify2.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
