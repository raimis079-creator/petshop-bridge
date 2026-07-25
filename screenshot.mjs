import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2');}return 'fail';}
const o={pets:[]};
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
  // Laukiu kol JS surenderina profili
  await page.waitForSelector('.pspet-profile', { timeout: 20000 }).catch(function(){});
  await page.waitForTimeout(2500);

  async function readProfile(){
    return await page.evaluate(() => {
      var prof = document.querySelector('.pspet-profile');
      var now = document.querySelector('.pspet-now');
      var grid = document.querySelector('.pspet-modgrid');
      var bodyText = (grid||document.body).innerText;
      var name = document.querySelector('.pspet-profile') ? (document.querySelector('.pspet-profile').innerText.split('\n')[0]||'').slice(0,30) : null;
      // moduliu antrastes
      var mods = grid ? Array.from(grid.children).map(function(c){ return (c.innerText||'').split('\n')[0].slice(0,25); }) : [];
      return {
        name: name,
        hasNow: !!now, nowKind: now?now.getAttribute('data-shown'):null,
        nowTitle: document.querySelector('.pspet-now-t')?document.querySelector('.pspet-now-t').innerText.trim():null,
        modules: mods,
        repeatVisible: bodyText.includes('Įprasti pirkiniai'),
        feedingSetup: bodyText.includes('Nustatyti maistą'),
        feedingPlan: bodyText.includes('Peržiūrėti planą'),
        shelf: bodyText.includes('Maisto dar ~'),
        refillFb: bodyText.includes('Dar liko'),
        nenurodyta: prof?prof.innerHTML.includes('Nenurodyta'):false
      };
    });
  }
  var switchers = await page.$$('.pspet-switch-item');
  o.switcherCount = switchers.length;
  o.pets.push(await readProfile());
  for (var i=1;i<Math.min(switchers.length,4);i++){
    try {
      var sw = await page.$$('.pspet-switch-item');
      await sw[i].click();
      await page.waitForTimeout(2500);
      o.pets.push(await readProfile());
    } catch(e){ o.pets.push({err:String(e).slice(0,80)}); }
  }
  await browser.close();
} catch (e) { o.fatal = String(e).slice(0,400); }
putB64('a2check.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
