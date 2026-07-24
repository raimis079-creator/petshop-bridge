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
  const ctx = await browser.newContext({ viewport: { width: 1000, height: 1200 }, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  const U = process.env.WP_USER || '', P = (process.env.WP_APP_PASS || '').replace(/\s+/g, '');
  await page.goto('https://dev.avesa.lt/wp-login.php', { timeout: 30000 });
  await page.waitForSelector('#user_login', { timeout: 10000 });
  await page.fill('#user_login', U); await page.fill('#user_pass', P);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), page.click('#wp-submit')]);
  await page.goto('https://dev.avesa.lt/my-account/augintinis/?action=create', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2500);

  // What does the user ACTUALLY see on this page right now?
  o.pageState = await page.evaluate(() => ({
    hasFormHost: !!document.querySelector('#pspet-form-host'),
    formHostVisible: (function(){ var h=document.querySelector('#pspet-form-host'); return h ? getComputedStyle(h).display : 'no host'; })(),
    hasProfileDiv: !!document.querySelector('#pspet-profile'),
    hasWrap: !!document.querySelector('.pspet-wrap'),
    bodyText: (document.querySelector('.woocommerce-MyAccount-content')||document.body).innerText.slice(0,400)
  }));
  const buf0 = await page.screenshot({ fullPage: true });
  fs.writeFileSync('/tmp/live_asis.png', buf0);

  // Force-mount for real preview (dog)
  await page.evaluate(() => {
    var host = document.querySelector('#pspet-form-host');
    if (host) host.style.display = '';
    if (!host) { host = document.createElement('div'); host.id='pspet-synthetic'; var c=document.querySelector('.woocommerce-MyAccount-content')||document.body; c.prepend(host); }
    window.PetshopPetForm.mount(host, { step:2, data:{ species:'dog', pet_name:'Reksas' } });
  });
  await page.waitForTimeout(600);
  const buf1 = await page.screenshot({ fullPage: true });
  fs.writeFileSync('/tmp/live_dog.png', buf1);

  await browser.close();
} catch (e) { o.fatal = String(e).slice(0,400); }
try { putB64('live_asis.png', fs.readFileSync('/tmp/live_asis.png').toString('base64')); } catch(e){}
try { putB64('live_dog.png', fs.readFileSync('/tmp/live_dog.png').toString('base64')); } catch(e){}
putB64('livecheck.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
