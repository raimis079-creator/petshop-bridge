import { chromium } from 'playwright';
import { putFile } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};

const TRACK_COOKIES = ['_ga','_gid','_gat','_fbp','_fbc','fr','_gcl_au','_gcl_aw','IDE','test_cookie'];
function classify(name){
  if(name==='_ga' || name.startsWith('_ga_') || name==='_gid' || name.startsWith('_gat')) return 'GA4';
  if(name==='_fbp' || name==='_fbc' || name==='fr') return 'Meta';
  if(name.startsWith('_gcl')) return 'Google Ads';
  return null;
}

async function testUrl(browser, url, label){
  L('');
  L('#################################################');
  L('### '+label);
  L('### '+url);
  L('#################################################');
  const ctx = await browser.newContext({ ignoreHTTPSErrors:true, userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36' });
  const page = await ctx.newPage();

  const requests = [];
  page.on('request', r=>{
    const u = r.url();
    if(/google-analytics\.com|analytics\.google\.com|googletagmanager\.com\/gtag|facebook\.com\/tr|connect\.facebook\.net|googleadservices|google\.com\/pagead/.test(u)) requests.push(u);
  });

  let loaded = false;
  try{
    const resp = await page.goto(url, { waitUntil:'domcontentloaded', timeout:60000 });
    loaded = !!resp && resp.status() < 400;
    L('  goto: HTTP '+(resp?resp.status():'?'));
    await page.waitForTimeout(8000);
  }catch(e){ L('  ❌ goto KLAIDA: '+e.message.slice(0,140)); }
  if(!loaded){ L('  ⚠️⚠️ PUSLAPIS NEUZSIKROVE — testas NEGALIOJA'); await ctx.close(); return {tracking:-1, requests:-1, state:{}, loaded:false}; }

  // dataLayer / GTM busena
  const state = await page.evaluate(()=>{
    var dl = window.dataLayer || [];
    var events = dl.filter(function(x){ return x && x.event; }).map(function(x){ return x.event; });
    var consent = null;
    try{
      // gtag consent state paieska dataLayer'yje
      for(var i=0;i<dl.length;i++){
        var a = dl[i];
        if(a && a[0]==='consent' && a[1]==='default'){ consent = a[2]; }
      }
    }catch(e){}
    return {
      gtmLoaded: typeof window.google_tag_manager !== 'undefined',
      containers: window.google_tag_manager ? Object.keys(window.google_tag_manager).filter(function(k){return k.indexOf('GTM-')===0 || k.indexOf('G-')===0;}) : [],
      dlLength: dl.length,
      events: events,
      consentDefault: consent,
      hasGtag: typeof window.gtag === 'function',
      hasFbq: typeof window.fbq === 'function',
      petshopItem: !!window.petshopGtmItem
    };
  }).catch(e=>({error:e.message}));

  L('  GTM uzkrautas: '+state.gtmLoaded+'   containers: '+JSON.stringify(state.containers));
  L('  dataLayer irasu: '+state.dlLength);
  L('  event\'ai: '+JSON.stringify(state.events));
  L('  gtag funkcija: '+state.hasGtag+'   fbq funkcija: '+state.hasFbq);
  L('  consent default: '+JSON.stringify(state.consentDefault));
  L('');

  const cookies = await ctx.cookies();
  L('  Cookies is viso: '+cookies.length);
  const tracking = cookies.filter(c=>classify(c.name));
  if(tracking.length===0){
    L('  ✅ TRACKING COOKIES: nera nei vieno');
  } else {
    L('  ❌ TRACKING COOKIES rasti:');
    tracking.forEach(c=>L('       '+classify(c.name).padEnd(11)+' '+c.name+'  domain='+c.domain));
  }
  L('');
  L('  Visi cookie vardai: '+cookies.map(c=>c.name).join(', ').slice(0,300));
  L('');
  L('  Tracking uzklausos ('+requests.length+'):');
  if(requests.length===0) L('    ✅ nera');
  else [...new Set(requests)].slice(0,10).forEach(u=>L('    ❌ '+u.slice(0,110)));

  await ctx.close();
  return { tracking: tracking.length, requests: requests.length, state, loaded:true };
}

const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
L('##### CONSENT / BLOCKING TESTAS (Complianz DAR NEAKTYVUOTAS) #####');
L('Laukiama: jokiu tracking cookies abiem atvejais.');
L('  1) be gtm_test → blokuoja BLOCKING TRIGGER');
L('  2) su gtm_test → trigger nebeblokuoja, bet CONSENT MODE = denied');

const r1 = await testUrl(browser,'https://dev.avesa.lt/','1) DEV be gtm_test (blocking trigger aktyvus)');
const r2 = await testUrl(browser,'https://dev.avesa.lt/?gtm_test=1','2) DEV su gtm_test=1 (tik consent gina)');
const r3 = await testUrl(browser,'https://dev.avesa.lt/product/trixie-baza-draskykle-2-stulpai-su-guoliu-50-cm-sviesi/?gtm_test=1','3) Prekes puslapis su gtm_test=1 (view_item)');

L('');
L('#################################################');
L('### ISVADOS');
L('#################################################');
L('  1) be gtm_test:  '+(!r1.loaded?'⚠️ NEGALIOJA':'tracking cookies='+r1.tracking+'  uzklausu='+r1.requests+'  '+(r1.tracking===0?'✅':'❌')));
L('  2) su gtm_test:  '+(!r2.loaded?'⚠️ NEGALIOJA':'tracking cookies='+r2.tracking+'  uzklausu='+r2.requests+'  '+(r2.tracking===0?'✅ consent gina':'❌ CONSENT NEVEIKIA')));
L('  3) preke:        '+(!r3.loaded?'⚠️ NEGALIOJA':'view_item dataLayer: '+(r3.state.events&&r3.state.events.includes('view_item')?'✅':'❌')+'   cookies='+r3.tracking));
await browser.close();
putFile('e9_pre_test.txt', out); console.log(out);
