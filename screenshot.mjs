import { chromium } from 'playwright';
import { putFile } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};
function classify(n){
  if(n==='_ga'||n.startsWith('_ga_')||n==='_gid'||n.startsWith('_gat')) return 'GA4';
  if(n==='_fbp'||n==='_fbc'||n==='fr') return 'Meta';
  if(n.startsWith('_gcl')) return 'Ads';
  return null;
}
async function snapshot(page, ctx, label){
  const st = await page.evaluate(()=>{
    var dl = window.dataLayer||[];
    var events=[], consents=[];
    for(var i=0;i<dl.length;i++){
      var x=dl[i];
      if(x && x.event) events.push(x.event);
      if(x && x[0]==='consent') consents.push({mode:x[1], value:x[2]});
    }
    return {
      dlLen: dl.length, events: events, consents: consents,
      cmplzVars: Object.keys(window).filter(function(k){return k.indexOf('cmplz')===0;}),
      hasBanner: !!document.getElementById('cmplz-cookiebanner-container'),
      bannerVisible: (function(){ var e=document.querySelector('.cmplz-cookiebanner'); return e ? getComputedStyle(e).display!=='none' : false; })(),
      fbq: typeof window.fbq==='function',
      gtmContainers: window.google_tag_manager ? Object.keys(window.google_tag_manager).filter(function(k){return /^(GTM-|G-)/.test(k);}) : []
    };
  }).catch(e=>({error:e.message}));
  const cookies = await ctx.cookies();
  const tr = cookies.filter(c=>classify(c.name));
  L('  --- '+label+' ---');
  L('    dataLayer: '+st.dlLen+' irasu');
  L('    event\'ai: '+JSON.stringify(st.events));
  L('    consent iraso: '+JSON.stringify(st.consents.map(c=>c.mode)));
  st.consents.forEach(c=>L('       '+c.mode+' -> '+JSON.stringify(c.value)));
  L('    GTM containers: '+JSON.stringify(st.gtmContainers)+'   fbq: '+st.fbq);
  L('    baneris DOM: '+st.hasBanner+'  matomas: '+st.bannerVisible);
  L('    tracking cookies: '+(tr.length?tr.map(c=>classify(c.name)+':'+c.name).join(', '):'NERA ✅'));
  L('    cmplz cookies: '+cookies.filter(c=>c.name.startsWith('cmplz')).map(c=>c.name).join(', '));
  return st;
}

const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
const ctx = await browser.newContext({ ignoreHTTPSErrors:true, userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120' });
const page = await ctx.newPage();
const reqs=[];
page.on('request', r=>{ const u=r.url(); if(/g\/collect|facebook\.com\/tr|fbevents|gtag\/js/.test(u)) reqs.push(u.slice(0,60)); });

L('##### COMPLIANZ SIGNALU TESTAS #####'); L('');
L('=== 1. Ikelimas su gtm_test=1 (blocking trigger isjungtas) ===');
const resp = await page.goto('https://dev.avesa.lt/?gtm_test=1',{waitUntil:'domcontentloaded',timeout:60000});
L('  HTTP '+(resp?resp.status():'?'));
await page.waitForTimeout(8000);
await snapshot(page, ctx, 'PRIES SUTIKIMA');
L('    tracking uzklausos: '+reqs.length);
[...new Set(reqs)].forEach(u=>L('       '+u));
L('');

L('=== 2. Banerio mygtukai DOM\'e ===');
const btns = await page.evaluate(()=>{
  var r=[];
  document.querySelectorAll('.cmplz-btn, [class*="cmplz-accept"], [class*="cmplz-deny"], [class*="cmplz-view-preferences"]').forEach(function(b){
    r.push({cls:b.className, txt:(b.innerText||'').trim().slice(0,25)});
  });
  return r;
});
btns.forEach(b=>L('    '+b.cls.slice(0,60)+'   "'+b.txt+'"'));
if(btns.length===0) L('    ❌ mygtuku nerasta');
L('');

L('=== 3. Spaudziam ACCEPT ALL ===');
const before = reqs.length;
try{
  await page.click('.cmplz-accept', { timeout:10000 });
  L('  paspausta .cmplz-accept');
}catch(e){
  L('  .cmplz-accept nepavyko: '+e.message.slice(0,80));
  try{ await page.click('button:has-text("Priimti")',{timeout:8000}); L('  paspausta "Priimti"'); }catch(e2){ L('  ❌ nepavyko: '+e2.message.slice(0,80)); }
}
await page.waitForTimeout(8000);
await snapshot(page, ctx, 'PO ACCEPT ALL');
L('    naujos tracking uzklausos: '+(reqs.length-before));
[...new Set(reqs)].forEach(u=>L('       '+u));
L('');

L('=== 4. dataLayer PILNAS turinys po accept ===');
const dl = await page.evaluate(()=>{
  var dl=window.dataLayer||[];
  return dl.map(function(x,i){
    try{
      if(x && x.length!==undefined && x[0]) return i+': ARGS['+x[0]+' , '+(x[1]||'')+']'+(x[2]?' '+JSON.stringify(x[2]).slice(0,90):'');
      if(x && x.event) return i+': event="'+x.event+'"'+(x.ecommerce?' +ecommerce':'');
      if(x && x['gtm.start']) return i+': gtm.start';
      return i+': '+JSON.stringify(x).slice(0,90);
    }catch(e){ return i+': ?'; }
  });
});
dl.forEach(x=>L('  '+x));
L('');

L('=== 5. Complianz JS API ===');
const api = await page.evaluate(()=>{
  var r={};
  try{
    r.cmplz_exists = typeof window.cmplz_set_category_as_body_class === 'function' || typeof window.complianz !== 'undefined';
    r.consented_services = typeof window.cmplz_consented_services === 'function' ? 'fn' : 'nera';
    r.has_consent = typeof window.cmplz_has_consent === 'function' ? 'fn' : 'nera';
    r.categories = document.body ? document.body.className.split(' ').filter(function(c){return c.indexOf('cmplz')===0;}) : [];
    r.cmplz_keys = Object.keys(window).filter(function(k){return k.toLowerCase().indexOf('cmplz')===0;}).slice(0,20);
  }catch(e){ r.err=e.message; }
  return r;
});
L('  body klases: '+JSON.stringify(api.categories));
L('  window cmplz raktai: '+JSON.stringify(api.cmplz_keys));
L('  cmplz_has_consent: '+api.has_consent);
await browser.close();
putFile('cmplz_signals.txt', out); console.log(out);
