import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2');}return 'fail';}
const o={}; const shots=[];
try {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1000, height: 1300 }, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  const U = process.env.WP_USER || '', P = (process.env.WP_APP_PASS || '').replace(/\s+/g, '');
  await page.goto('https://dev.avesa.lt/wp-login.php', { timeout: 30000 });
  await page.waitForSelector('#user_login', { timeout: 10000 });
  await page.fill('#user_login', U); await page.fill('#user_pass', P);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), page.click('#wp-submit')]);
  await page.goto('https://dev.avesa.lt/my-account/augintinis/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  // ar yra hero chip'ai + Kas svarbu dabar
  o.state = await page.evaluate(() => ({
    hasHero: !!document.querySelector('.pspet-profile'),
    heroChips: Array.from(document.querySelectorAll('.pspet-profile > div:first-child span')).map(s=>s.textContent).filter(t=>t && t.length<40).slice(0,8),
    hasNow: !!document.querySelector('.pspet-now'),
    nowTitle: (document.querySelector('.pspet-now-t')||{}).textContent||'',
    nowShown: document.querySelector('.pspet-now') ? document.querySelector('.pspet-now').getAttribute('data-shown') : null,
    greyNenurodyta: document.body.innerHTML.includes('Nenurodyta'),
    petName: (document.querySelector('.pspet-profile div')||{}).textContent||''
  }));
  const buf = await page.screenshot({ fullPage: true });
  fs.writeFileSync('/tmp/a1_dash.png', buf); shots.push('a1_dash');
  await browser.close();
} catch (e) { o.fatal = String(e).slice(0,400); }
for (const n of shots) { try { putB64(n+'.png', fs.readFileSync('/tmp/'+n+'.png').toString('base64')); } catch(e){} }
putB64('a1shot.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
