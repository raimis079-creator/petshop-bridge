import { chromium } from 'playwright';
import { putFile } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};
const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });

async function scenario(label, action){
  const ctx = await browser.newContext({ ignoreHTTPSErrors:true, userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120' });
  const page = await ctx.newPage();
  await page.goto('https://dev.avesa.lt/',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(5000);
  if(action) await action(page);
  await page.waitForTimeout(4000);
  const cookies = await ctx.cookies();
  const cm = cookies.filter(c=>c.name.startsWith('cmplz'));
  L('');
  L('=== '+label+' ===');
  if(cm.length===0) L('  (cmplz cookies nera)');
  cm.forEach(c=>L('  '+c.name.padEnd(28)+' = '+String(c.value).slice(0,60)));
  const body = await page.evaluate(()=>document.body.className.split(' ').filter(c=>c.startsWith('cmplz')));
  L('  body klases: '+JSON.stringify(body));
  const api = await page.evaluate(()=>{
    var r={};
    if(typeof window.cmplz_has_consent==='function'){
      ['functional','preferences','statistics','marketing'].forEach(function(c){
        try{ r[c] = window.cmplz_has_consent(c); }catch(e){ r[c]='err'; }
      });
    } else r.err='cmplz_has_consent nera';
    return r;
  });
  L('  cmplz_has_consent(): '+JSON.stringify(api));
  const evts = await page.evaluate(()=>{
    return { listeners: 'n/a', cmplzFns: Object.keys(window).filter(k=>/^cmplz_(has_consent|enable_category|set_cookie|get_cookie|fire)/.test(k)) };
  });
  L('  cmplz funkcijos: '+JSON.stringify(evts.cmplzFns));
  await ctx.close();
}

await scenario('1) PRIES SUTIKIMA (baneris rodomas)', null);
await scenario('2) PO "PRIIMTI" (accept all)', async p=>{ await p.click('.cmplz-accept',{timeout:10000}); });
await scenario('3) PO "NEIGTI" (deny all)', async p=>{ await p.click('.cmplz-deny',{timeout:10000}); });

L('');
L('=== 4. cmplz_status_change event turinys ===');
const ctx=await browser.newContext({ignoreHTTPSErrors:true});
const page=await ctx.newPage();
await page.goto('https://dev.avesa.lt/',{waitUntil:'domcontentloaded',timeout:60000});
await page.evaluate(()=>{
  window.__cmplzEvents = [];
  ['cmplz_status_change','cmplz_fire_categories','cmplz_enable_category','cmplz_run_after_all_scripts','cmplz_cookie_warning_loaded'].forEach(function(n){
    document.addEventListener(n, function(e){
      window.__cmplzEvents.push({ name:n, detail: e.detail ? JSON.parse(JSON.stringify(e.detail)) : null });
    });
  });
});
await page.waitForTimeout(3000);
await page.click('.cmplz-accept',{timeout:10000}).catch(()=>L('  accept click err'));
await page.waitForTimeout(5000);
const evs = await page.evaluate(()=>window.__cmplzEvents||[]);
if(evs.length===0) L('  ❌ jokiu event\'u nepagauta');
evs.forEach(e=>L('  event "'+e.name+'"  detail='+JSON.stringify(e.detail).slice(0,220)));
await browser.close();
putFile('cmplz_cookies.txt', out); console.log(out);
