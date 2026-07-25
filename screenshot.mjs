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
  const ctx = await browser.newContext({ viewport: { width: 1000, height: 1400 }, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  const U = process.env.WP_USER || '', P = (process.env.WP_APP_PASS || '').replace(/\s+/g, '');
  await page.goto('https://dev.avesa.lt/wp-login.php', { timeout: 30000 });
  await page.waitForSelector('#user_login', { timeout: 10000 });
  await page.fill('#user_login', U); await page.fill('#user_pass', P);
  await Promise.all([page.waitForNavigation({ waitUntil:'domcontentloaded', timeout:20000 }).catch(function(){}), page.click('#wp-submit')]);
  await page.goto('https://dev.avesa.lt/my-account/augintinis/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);
  o.url = page.url();
  o.diag = await page.evaluate(() => {
    return {
      loggedIn: !document.body.innerHTML.includes('Prisijungimas prie'),
      hasProfile: !!document.querySelector('.pspet-profile'),
      hasSwitchItem: document.querySelectorAll('.pspet-switch-item').length,
      hasFormHost: !!document.querySelector('#pspet-form-host'),
      // ieskau pspet-* klasiu
      pspetClasses: Array.from(new Set(Array.from(document.querySelectorAll('[class*="pspet"]')).map(function(e){return e.className.split(' ')[0];}))).slice(0,20),
      bodySnippet: (document.querySelector('.woocommerce-MyAccount-content')||document.body).innerText.slice(0,300)
    };
  });
  await browser.close();
} catch (e) { o.fatal = String(e).slice(0,400); }
putB64('domdiag.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
