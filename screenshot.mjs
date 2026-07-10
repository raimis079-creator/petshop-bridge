import { chromium } from 'playwright';
import { putFile } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};
function classify(n){
  if(n==='_ga'||n.startsWith('_ga_')||n==='_gid'||n.startsWith('_gat')) return 'GA4';
  if(n==='_fbp'||n==='_fbc'||n==='fr') return 'Meta';
  if(n.startsWith('_gcl')) return 'Google Ads';
  return null;
}
const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });

async function t(url,label){
  L(''); L('=== '+label+' ==='); L('  '+url);
  const ctx = await browser.newContext({ ignoreHTTPSErrors:true, userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120' });
  const p = await ctx.newPage();
  const req=[];
  p.on('request', r=>{ const u=r.url(); if(/g\/collect|facebook\.com\/tr|fbevents|gtag\/js/.test(u)) req.push(u.slice(0,70)); });
  let ok=false;
  try{ const resp=await p.goto(url,{waitUntil:'domcontentloaded',timeout:60000}); ok=resp&&resp.status()<400; await p.waitForTimeout(8000);}catch(e){ L('  ❌ '+e.message.slice(0,90)); }
  if(!ok){ L('  ⚠️ NEUZSIKROVE — negalioja'); await ctx.close(); return; }
  const cookies = await ctx.cookies();
  const tr = cookies.filter(c=>classify(c.name));
  L('  cookies is viso: '+cookies.length);
  if(tr.length===0) L('  ✅ TRACKING COOKIES: nera');
  else { L('  ❌ tracking cookies:'); tr.forEach(c=>L('       '+classify(c.name)+'  '+c.name)); }
  L('  tracking uzklausos: '+req.length);
  [...new Set(req)].forEach(u=>L('     '+u));
  await ctx.close();
}

L('##### PO CONVERSION LINKER TAISYMO (live v2 / versija #3) #####');
await t('https://dev.avesa.lt/','1) Iprastas DEV lankytojas (be gtm_test)');
await t('https://dev.avesa.lt/?gtm_test=1','2) Su gtm_test=1 (tik consent gina)');
await browser.close();
L('');
L('LAUKIAMA:');
L('  1) jokiu tracking cookies, jokiu uzklausu');
L('  2) _fbp vis dar bus — Meta nepaiso Google consent. Sprendimas: Complianz trigger\'iai (E8).');
putFile('cl_verify.txt', out); console.log(out);
