import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
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
  // Login be networkidle - domcontentloaded + tikrinam ar prisijunge
  await page.goto('https://dev.avesa.lt/wp-login.php', { timeout: 30000, waitUntil:'domcontentloaded' });
  await page.waitForSelector('#user_login', { timeout: 10000 });
  await page.fill('#user_login', U); await page.fill('#user_pass', P);
  await page.check('#rememberme').catch(function(){});
  await page.click('#wp-submit');
  await page.waitForTimeout(4000);
  o.url1 = page.url();
  o.loggedIn1 = !page.url().includes('wp-login');
  // Jei vis dar login - bandom su Enter
  if (page.url().includes('wp-login')) {
    o.retry = true;
    // ar yra klaida?
    o.loginErr = await page.evaluate(() => { var e=document.querySelector('#login_error'); return e?e.innerText.slice(0,150):null; });
    // pabandom is naujo
    await page.fill('#user_login', U); await page.fill('#user_pass', P);
    await Promise.all([page.waitForNavigation({timeout:15000}).catch(function(){}), page.press('#wp-submit','Enter').catch(function(){}) ]);
    await page.waitForTimeout(3000);
    o.url2 = page.url();
    o.loggedIn2 = !page.url().includes('wp-login');
  }
  // Einam i dashboard
  await page.goto('https://dev.avesa.lt/my-account/', { waitUntil:'domcontentloaded', timeout:30000 });
  await page.waitForTimeout(3000);
  o.myAccountIsLogin = await page.evaluate(() => document.body.innerHTML.includes('Vartotojo vardas') || document.body.innerHTML.includes('username') || !!document.querySelector('.woocommerce-form-login'));
  o.myAccountHasNav = await page.evaluate(() => !!document.querySelector('.woocommerce-MyAccount-navigation'));
  await browser.close();
} catch(e){ o.fatal=String(e).slice(0,300); }
putB64('login2.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
