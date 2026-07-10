import { chromium } from 'playwright';
import { putFile } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};

const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
const ctx = await browser.newContext({ ignoreHTTPSErrors:true, userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' });
const page = await ctx.newPage();

const ga = [], fb = [], order = [];
page.on('request', r=>{
  const u=r.url();
  if(u.includes('google-analytics.com/g/collect') || u.includes('/g/collect')) ga.push(u);
  if(u.includes('facebook.com/tr')) fb.push(u);
  if(/gtm\.js|gtag\/js|fbevents|g\/collect|facebook\.com\/tr/.test(u)) order.push(u.slice(0,80));
});

L('### CONSENT DIAGNOSTIKA ###'); L('');
await page.goto('https://dev.avesa.lt/?gtm_test=1', { waitUntil:'domcontentloaded', timeout:60000 });
await page.waitForTimeout(9000);

L('=== 1. Uzklausu eiliskumas ===');
order.forEach((u,i)=>L('  '+(i+1)+'. '+u));
L('');

L('=== 2. GA4 gcs parametras ===');
if(ga.length===0) L('  (nera g/collect uzklausu)');
for(const u of ga.slice(0,3)){
  const m = u.match(/[?&]gcs=([^&]+)/);
  const gcd = u.match(/[?&]gcd=([^&]+)/);
  L('  gcs = '+(m?m[1]:'NERA')+'   gcd = '+(gcd?gcd[1]:'nera'));
  if(m){
    const v=m[1];
    L('    G100 = ad_storage denied, analytics_storage denied');
    L('    G111 = abu granted');
    L('    -> reiskia: '+(v==='G100'?'✅ consent PERDUOTAS (denied)':(v==='G111'?'❌ consent NEPERDUOTAS arba granted':'? '+v)));
  }
}
L('');

L('=== 3. GTM vidine consent busena ===');
const st = await page.evaluate(()=>{
  var res = { keys:[], consentState:null, dlConsent:[], gtmDL:null };
  try{
    if(window.google_tag_manager){
      res.keys = Object.keys(window.google_tag_manager);
      var c = window.google_tag_manager['GTM-MF3GZGT'];
      if(c && c.dataLayer && typeof c.dataLayer.get === 'function'){
        try{ res.gtmDL = c.dataLayer.get('gtm.consent'); }catch(e){}
      }
    }
  }catch(e){ res.err = e.message; }
  try{
    var dl = window.dataLayer||[];
    for(var i=0;i<dl.length;i++){
      var a = dl[i];
      if(a && a[0]==='consent'){ res.dlConsent.push({ idx:i, mode:a[1], value:a[2] }); }
    }
  }catch(e){}
  return res;
});
L('  google_tag_manager keys: '+JSON.stringify(st.keys));
L('  dataLayer consent iraso pozicija ir turinys:');
if(st.dlConsent.length===0) L('    ❌ NERA nei vieno consent iraso');
st.dlConsent.forEach(c=>L('    [idx '+c.idx+'] '+c.mode+' -> '+JSON.stringify(c.value)));
L('');

L('=== 4. dataLayer pilnas (pirmi 12 irasu) ===');
const dl = await page.evaluate(()=>{
  var dl = window.dataLayer||[];
  return dl.slice(0,12).map(function(x, i){
    try{
      if(x && x.length !== undefined && x[0]) return i+': ARGS['+x[0]+','+(x[1]||'')+']';
      if(x && x.event) return i+': event='+x.event;
      if(x && x['gtm.start']) return i+': gtm.start';
      return i+': '+JSON.stringify(x).slice(0,70);
    }catch(e){ return i+': ?'; }
  });
});
dl.forEach(x=>L('  '+x));
L('');

L('=== 5. Meta pixel busena ===');
const meta = await page.evaluate(()=>{
  var r = { fbqExists: typeof window.fbq === 'function', queue: [] };
  try{ if(window.fbq && window.fbq.queue) r.queue = window.fbq.queue.map(function(q){ return q[0]+':'+(q[1]||''); }); }catch(e){}
  return r;
});
L('  fbq: '+meta.fbqExists+'   queue: '+JSON.stringify(meta.queue));
L('  facebook.com/tr uzklausu: '+fb.length);
L('');

L('=== 6. ISVADA ===');
const gcsFound = ga.length && /[?&]gcs=/.test(ga[0]);
const gcsVal = gcsFound ? ga[0].match(/[?&]gcs=([^&]+)/)[1] : null;
L('  GA4 uzklausu: '+ga.length+'   Meta uzklausu: '+fb.length);
L('  gcs: '+(gcsVal||'nerastas'));
if(gcsVal==='G100'){
  L('  >>> Consent Mode VEIKIA: GA4 gauna denied, siuncia cookieless ping.');
  L('  >>> Bet GTM consentSettings=needed NEBLOKUOJA tag\'o (tikejomes blokuoti).');
} else if(gcsVal==='G111'){
  L('  >>> Consent default NEPASIEKE GTM: tag\'ai laiko consent granted.');
  L('  >>> Priezastis B: Custom HTML ant Consent Initialization per velai.');
} else {
  L('  >>> gcs nerastas — consent signalas visai neperduodamas.');
}
await browser.close();
putFile('consent_diag.txt', out); console.log(out);
