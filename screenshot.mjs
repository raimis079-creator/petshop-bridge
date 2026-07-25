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
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), page.click('#wp-submit')]);
  await page.goto('https://dev.avesa.lt/my-account/augintinis/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3500);

  // Kiek augintiniu switcher'yje
  var petChips = await page.evaluate(() => {
    var chips = Array.from(document.querySelectorAll('[class*="switch"] [class*="pet"], .pspet-switcher > *'));
    return chips.length;
  });
  o.switcherCount = petChips;

  // Funkcija: perskaityti dabartini profili
  async function readProfile(idx){
    return await page.evaluate(() => {
      function txt(sel){ var e=document.querySelector(sel); return e?e.textContent.trim().slice(0,80):null; }
      // hero
      var hero = document.querySelector('.pspet-profile') || document.body;
      var chipEls = Array.from(document.querySelectorAll('.pspet-profile span')).map(s=>s.textContent.trim()).filter(t=>t&&t.length<40&&t.length>2);
      // Kas svarbu dabar
      var now = document.querySelector('.pspet-now');
      var nowKind = now ? now.getAttribute('data-shown') : null;
      var nowTitle = document.querySelector('.pspet-now-t') ? document.querySelector('.pspet-now-t').textContent.trim() : null;
      // Moduliai - ieškau kortelių pagal antraštes
      var cardTitles = Array.from(document.querySelectorAll('.pspet-modgrid > div')).map(c=>{
        var h = c.querySelector('div');
        return h ? h.textContent.trim().slice(0,30) : '?';
      });
      var bodyText = (document.querySelector('.pspet-modgrid')||document.body).innerText;
      return {
        hasNow: !!now, nowKind: nowKind, nowTitle: nowTitle,
        modules: cardTitles,
        hasRepeat: bodyText.includes('Įprasti pirkiniai') || bodyText.includes('Pakartoti'),
        hasFeedingSetup: bodyText.includes('Nustatyti maistą'),
        hasFeedingPlan: bodyText.includes('Peržiūrėti planą'),
        hasShelf: bodyText.includes('Maisto dar ~'),
        hasRefillFb: bodyText.includes('Dar liko') && bodyText.includes('Baigsis anksčiau'),
        hasNenurodyta: document.querySelector('.pspet-profile') ? document.querySelector('.pspet-profile').innerHTML.includes('Nenurodyta') : false
      };
    });
  }

  // Perjungiu per visus augintinius
  var switchers = await page.$$('.pspet-switcher > *, [class*="pspet-switch"] > *');
  o.switcherFound = switchers.length;
  // Skaitau pirma
  o.pets.push(await readProfile(0));
  // Bandau perjungti i kitus
  for (var i=1;i<Math.min(switchers.length,4);i++){
    try {
      await switchers[i].click();
      await page.waitForTimeout(2000);
      o.pets.push(await readProfile(i));
    } catch(e){ o.pets.push({err:String(e).slice(0,80)}); }
  }
  await browser.close();
} catch (e) { o.fatal = String(e).slice(0,400); }
putB64('a2check.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
