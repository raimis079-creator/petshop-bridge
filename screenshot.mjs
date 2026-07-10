import { chromium } from 'playwright';
import { execSync } from "child_process";
import fs from "fs";
function putFile(n,s){
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  for(let a=0;a<4;a++){ try{
    const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;
    let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
    const b={message:'ci',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) b.sha=sha;
    fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));
    const r=execSync('curl -s -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});
    if(/HTTP:20[01]/.test(r)) return true;
  }catch(e){} execSync('sleep 2'); }
  return false;
}
let out=''; const L=(s)=>{out+=s+'\n';};
const U=process.env.WP_USER||''; const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH=U+':'+P;
const API='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
function api(m,u,b){
  let c='curl -sk -o /tmp/r.json -w "%{http_code}" --max-time 45 -u "'+AUTH+'" -X '+m+' ';
  if(b){ fs.writeFileSync('/tmp/b.json',JSON.stringify(b)); c+='-H "Content-Type: application/json" -d @/tmp/b.json '; }
  c+='"'+u+'" 2>/dev/null || echo ERR';
  const code=execSync(c,{encoding:'utf8'}).trim();
  let body=''; try{ body=fs.readFileSync('/tmp/r.json','utf8'); }catch(e){}
  return {code, body};
}
function pg(url){
  const code=execSync('curl -skL -o /tmp/p.html -w "%{http_code}" --max-time 40 "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let h=''; try{ h=fs.readFileSync('/tmp/p.html','utf8'); }catch(e){}
  return {code, html:h};
}

L('############ S168 — FIX DEPLOY + PILNAS FLOW ############'); L('');

// ═══ A. Deploy ═══
L('=== A. Snippet\'u atnaujinimas ===');
const deploys=[
  [619,'petshop_consent_bridge.php','Petshop Consent Bridge v1.2 (Complianz -> GTM)',1],
  [614,'petshop_datalayer_v1.php','Petshop DataLayer v1.1 (GA4 ecommerce)',10],
];
for(const [id,file,name,prio] of deploys){
  const code=fs.readFileSync(file,'utf8');
  const r=api('POST',API+'/'+id,{name,code,active:true,scope:'front-end',priority:prio});
  L('  ['+id+'] '+name);
  L('        HTTP '+r.code+(r.code==='200'?'  code_error='+JSON.stringify(JSON.parse(r.body).code_error||null):'  ❌ '+r.body.slice(0,150)));
  if(r.code!=='200') throw new Error('deploy fail '+id);
}
L('');
await new Promise(r=>setTimeout(r,4000));

L('=== B. Svetaines sveikata ===');
for(const [nm,u] of [['Homepage','https://dev.avesa.lt/'],['Preke','https://dev.avesa.lt/?p=15484'],['Krepselis','https://dev.avesa.lt/cart/']]){
  const r=pg(u); const fatal=/Fatal error|Parse error|critical error/i.test(r.html);
  L('  '+nm.padEnd(12)+' HTTP '+r.code+'  '+(fatal?'❌ FATAL':'✅'));
}
L('');

// ═══ C. Playwright flow ═══
const PRODUCT_ID=15484;
const EMAIL='gtm.test.'+Date.now()+'@petshop.lt';
const browser=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120'});
const page=await ctx.newPage();
page.on('pageerror',e=>L('  ⚠️ JS: '+e.message.slice(0,90)));
async function dl(p){
  return await p.evaluate(()=>{
    const d=window.dataLayer||[];
    return d.filter(x=>x&&x.event&&x.ecommerce).map(x=>({
      event:x.event, replay:!!x.cmplz_replay,
      tid:x.ecommerce.transaction_id, value:x.ecommerce.value, cur:x.ecommerce.currency,
      tax:x.ecommerce.tax, ship:x.ecommerce.shipping, n:(x.ecommerce.items||[]).length,
      first:(x.ecommerce.items||[])[0], ud:x.user_data?Object.keys(x.user_data):null }));
  });
}
let orderNum=null;
try{
  L('=== C. Prekes psl + Accept ===');
  await page.goto('https://dev.avesa.lt/?p='+PRODUCT_ID+'&gtm_test=1',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(5000);
  await page.click('.cmplz-accept',{timeout:10000}); L('  ✅ sutikimas');
  await page.waitForTimeout(4000);
  let e=await dl(page);
  L('  ecommerce: '+JSON.stringify(e.map(x=>x.event+(x.replay?'(replay)':''))));
  const vi=e.filter(x=>x.event==='view_item');
  L('  view_item kiekis: '+vi.length+'  (1 orig + 1 replay = 2 tiketina, nes consent pasikeite)');
  L('');

  L('=== D. Add to cart (forma submit) ===');
  await page.click('button.single_add_to_cart_button',{timeout:12000});
  await page.waitForTimeout(8000);
  L('  URL po submit: '+page.url().slice(0,70));
  e=await dl(page);
  const atc=e.filter(x=>x.event==='add_to_cart');
  L('  add_to_cart: '+(atc.length?'✅ RASTAS ('+atc.length+')':'❌ NERASTAS'));
  if(atc.length) L('    value='+atc[0].value+' '+atc[0].cur+'  item='+JSON.stringify(atc[0].first));
  L('  visi event\'ai: '+JSON.stringify(e.map(x=>x.event+(x.replay?'(r)':''))));
  L('');

  L('=== E. Krepselis ===');
  await page.goto('https://dev.avesa.lt/cart/?gtm_test=1',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(6000);
  e=await dl(page);
  const vc=e.filter(x=>x.event==='view_cart');
  L('  view_cart: '+(vc.length?'✅ ('+vc.length+')':'❌'));
  if(vc.length) L('    value='+vc[0].value+' items='+vc[0].n);
  L('  add_to_cart cia (turi buti 0, jau flush\'inta): '+e.filter(x=>x.event==='add_to_cart').length);
  L('  event\'ai: '+JSON.stringify(e.map(x=>x.event+(x.replay?'(r)':''))));
  L('');

  L('=== F. Checkout ===');
  await page.goto('https://dev.avesa.lt/checkout/?gtm_test=1',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(7000);
  e=await dl(page);
  const bc=e.filter(x=>x.event==='begin_checkout');
  L('  begin_checkout: '+(bc.length?'✅ ('+bc.length+')':'❌'));
  if(bc.length) L('    value='+bc[0].value+' items='+bc[0].n);
  L('  event\'ai: '+JSON.stringify(e.map(x=>x.event+(x.replay?'(r)':''))));
  L('');

  L('=== G. Formos pildymas ===');
  const f=async(s,v)=>{ try{ await page.fill(s,v,{timeout:6000}); return true; }catch(e){ return false; } };
  await f('#billing_first_name','GTM'); await f('#billing_last_name','Testas');
  await f('#billing_address_1','Testo g. 1'); await f('#billing_city','Vilnius');
  await f('#billing_postcode','01001'); await f('#billing_phone','+37060000000');
  await f('#billing_email',EMAIL);
  try{ await page.selectOption('#billing_country','LT',{timeout:5000}); }catch(e){}
  await page.waitForTimeout(3000);
  await page.check('#payment_method_bacs',{timeout:8000}); L('  ✅ bacs');
  await page.waitForTimeout(3000);
  try{ await page.check('#terms',{timeout:3000}); }catch(e){}
  L('');

  L('=== H. Pateikti uzsakyma ===');
  await page.click('#place_order',{timeout:12000});
  await page.waitForTimeout(15000);
  const url=page.url();
  L('  URL: '+url.slice(0,95));
  L('  thankyou: '+(/order-received/.test(url)?'✅':'❌'));
  if(!/order-received/.test(url)){
    const errs=await page.evaluate(()=>[...document.querySelectorAll('.woocommerce-error li')].map(x=>x.innerText.slice(0,80)));
    L('  KLAIDOS: '+JSON.stringify(errs));
  }
  L('');

  L('=== I. purchase patikra ===');
  e=await dl(page);
  const pur=e.filter(x=>x.event==='purchase');
  const verdict = pur.length===1 ? '✅ TIKSLIAI VIENAS' : (pur.length===0 ? '❌ NERA' : '❌ DUBLIS');
  L('  purchase push\'u kiekis: '+pur.length+'  '+verdict);
  if(pur.length){
    const p0=pur[0]; orderNum=p0.tid;
    L('    transaction_id : '+p0.tid);
    L('    value          : '+p0.value+' '+p0.cur);
    L('    tax            : '+p0.tax+'   shipping: '+p0.ship);
    L('    items          : '+p0.n);
    L('    firstItem      : '+JSON.stringify(p0.first));
    L('    user_data      : '+JSON.stringify(p0.ud));
    L('    replay flag    : '+p0.replay);
  }
  L('  visi ecommerce event\'ai: '+JSON.stringify(e.map(x=>x.event+(x.replay?'(r)':''))));
  L('');

  L('=== J. Perkrovimas (idempotencija) ===');
  await page.reload({waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(6000);
  e=await dl(page);
  const pur2=e.filter(x=>x.event==='purchase');
  L('  purchase po perkrovimo: '+pur2.length+'  '+(pur2.length===0?'✅ (order meta veikia)':'❌ pakartotinis push'));
}catch(err){ L(''); L('!!! ERROR: '+err.message.slice(0,180)); }
await browser.close();

L('');
L('=== K. Uzsakymas per API ===');
if(orderNum){
  try{
    const r=execSync('curl -sk -u "'+AUTH+'" "https://dev.avesa.lt/wp-json/wc/v3/orders?search='+orderNum+'&per_page=1"',{encoding:'utf8'});
    const arr=JSON.parse(r);
    if(arr.length){
      const o=arr[0];
      L('  #'+o.number+'  '+o.status+'  total='+o.total+'  tax='+o.total_tax+'  ship='+o.shipping_total);
      L('  email: '+o.billing.email+'   payment: '+o.payment_method);
      const fl=(o.meta_data||[]).find(m=>m.key==='_petshop_dl_purchase_sent');
      L('  _petshop_dl_purchase_sent: '+(fl?'"'+fl.value+'" ✅':'❌'));
    }
  }catch(e){ L('  API err: '+e.message.slice(0,80)); }
}
putFile('s168_final.txt', out); console.log(out);
