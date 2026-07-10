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

const PRODUCT_ID = 15484;
const TEST_EMAIL = 'gtm.test.' + Date.now() + '@petshop.lt';

async function dl(page){
  return await page.evaluate(()=>{
    const d=window.dataLayer||[];
    return d.filter(x=>x&&x.event&&x.ecommerce).map(x=>({
      event:x.event, replay:!!x.cmplz_replay,
      ec:{ transaction_id:x.ecommerce.transaction_id, value:x.ecommerce.value,
           currency:x.ecommerce.currency, tax:x.ecommerce.tax, shipping:x.ecommerce.shipping,
           coupon:x.ecommerce.coupon, items:(x.ecommerce.items||[]).length,
           firstItem:(x.ecommerce.items||[])[0] },
      user_data: x.user_data ? Object.keys(x.user_data) : null
    }));
  });
}

const browser=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120'});
const page=await ctx.newPage();
const ga=[],fb=[],ads=[];
page.on('request',r=>{const u=r.url();
  if(/\/g\/collect/.test(u)) ga.push(u);
  if(/facebook\.com\/tr/.test(u)) fb.push(u);
  if(/googleadservices|\/pagead\/|\/ccm\/collect/.test(u)) ads.push(u);});
page.on('pageerror', e=>L('  ⚠️ JS klaida: '+e.message.slice(0,100)));

L('############ S168 — PURCHASE FLOW TESTAS ############');
L('preke: '+PRODUCT_ID+'   el.pastas: '+TEST_EMAIL); L('');

let orderNumber=null, thankyouUrl=null;
try{
  // ---------- 1. Prekes psl + Accept ----------
  L('=== 1. Prekes puslapis + sutikimas ===');
  await page.goto('https://dev.avesa.lt/?p='+PRODUCT_ID+'&gtm_test=1',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(5000);
  L('  URL: '+page.url().slice(0,80));
  try{ await page.click('.cmplz-accept',{timeout:10000}); L('  ✅ sutikimas duotas'); }
  catch(e){ L('  ⚠️ banerio nera: '+e.message.slice(0,50)); }
  await page.waitForTimeout(4000);
  let events=await dl(page);
  L('  dataLayer ecommerce: '+JSON.stringify(events.map(e=>e.event+(e.replay?'(replay)':''))));

  // ---------- 2. Add to cart ----------
  L('');
  L('=== 2. Add to cart ===');
  const before=(await dl(page)).length;
  try{
    await page.click('button.single_add_to_cart_button',{timeout:12000});
    L('  paspausta single_add_to_cart_button');
  }catch(e){ L('  ❌ '+e.message.slice(0,70)); }
  await page.waitForTimeout(6000);
  events=await dl(page);
  const atc=events.find(e=>e.event==='add_to_cart');
  L('  add_to_cart: '+(atc?'✅':'❌'));
  if(atc) L('    value='+atc.ec.value+' '+atc.ec.currency+'  items='+atc.ec.items+'  item='+JSON.stringify(atc.ec.firstItem));

  // ---------- 3. Krepselis ----------
  L('');
  L('=== 3. Krepselis (/cart/) ===');
  await page.goto('https://dev.avesa.lt/cart/?gtm_test=1',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(6000);
  events=await dl(page);
  const vc=events.find(e=>e.event==='view_cart');
  L('  view_cart: '+(vc?'✅':'❌'));
  if(vc) L('    value='+vc.ec.value+' '+vc.ec.currency+'  items='+vc.ec.items);

  // ---------- 4. Checkout ----------
  L('');
  L('=== 4. Checkout (/checkout/) ===');
  await page.goto('https://dev.avesa.lt/checkout/?gtm_test=1',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(7000);
  L('  URL: '+page.url().slice(0,80));
  events=await dl(page);
  const bc=events.find(e=>e.event==='begin_checkout');
  L('  begin_checkout: '+(bc?'✅':'❌'));
  if(bc) L('    value='+bc.ec.value+' '+bc.ec.currency+'  items='+bc.ec.items+'  coupon='+(bc.ec.coupon||'-'));

  // ---------- 5. Forma ----------
  L('');
  L('=== 5. Checkout formos pildymas ===');
  const fill = async (sel, val, name) => {
    try{ await page.fill(sel, val, {timeout:6000}); L('    ✅ '+name); return true; }
    catch(e){ L('    ⚠️ '+name+' — nerastas ('+sel+')'); return false; }
  };
  await fill('#billing_first_name','GTM','vardas');
  await fill('#billing_last_name','Testas','pavarde');
  await fill('#billing_address_1','Testo g. 1','adresas');
  await fill('#billing_city','Vilnius','miestas');
  await fill('#billing_postcode','01001','pastas');
  await fill('#billing_phone','+37060000000','telefonas');
  await fill('#billing_email',TEST_EMAIL,'el.pastas');

  // salis
  try{ await page.selectOption('#billing_country','LT',{timeout:5000}); L('    ✅ salis LT'); }catch(e){ L('    ⚠️ salis — praleista'); }
  await page.waitForTimeout(3000);

  // pristatymo metodas
  L('');
  L('  Pristatymo metodai:');
  const ships = await page.evaluate(()=>{
    const r=[];
    document.querySelectorAll('input[name^="shipping_method"]').forEach(i=>r.push({val:i.value,checked:i.checked,id:i.id}));
    return r;
  });
  ships.forEach(s=>L('    '+(s.checked?'●':'○')+' '+s.val));
  if(ships.length===0) L('    (nerasta — gal vienintelis be radio)');
  if(ships.length>0 && !ships.some(s=>s.checked)){
    try{ await page.check('#'+ships[0].id,{timeout:5000}); L('    pazymeta: '+ships[0].val); }catch(e){}
  }
  await page.waitForTimeout(4000);

  // terminalu select (Venipak/LP)
  const terms = await page.evaluate(()=>{
    const r=[];
    document.querySelectorAll('select').forEach(s=>{
      if(/terminal|pickup|venipak|lp_?express|pastomat/i.test(s.id+s.name+s.className)) r.push({id:s.id,name:s.name,opts:s.options.length});
    });
    return r;
  });
  if(terms.length){
    L('  Terminalu select\'ai: '+JSON.stringify(terms));
    for(const t of terms){
      try{
        const opts=await page.evaluate(id=>{
          const s=document.getElementById(id);
          return [...s.options].filter(o=>o.value&&o.value!=='').slice(0,3).map(o=>({v:o.value,t:o.text.slice(0,30)}));
        }, t.id);
        if(opts.length){ await page.selectOption('#'+t.id, opts[0].v, {timeout:5000}); L('    ✅ pasirinktas: '+opts[0].t); }
      }catch(e){ L('    ⚠️ '+t.id+' nepavyko'); }
    }
    await page.waitForTimeout(3000);
  } else L('  Terminalu select\'u nera');

  // mokejimo budas: bacs
  L('');
  L('  Mokejimo budas:');
  const pays = await page.evaluate(()=>{
    const r=[];
    document.querySelectorAll('input[name="payment_method"]').forEach(i=>r.push({val:i.value,checked:i.checked}));
    return r;
  });
  pays.forEach(p=>L('    '+(p.checked?'●':'○')+' '+p.val));
  try{ await page.check('#payment_method_bacs',{timeout:6000}); L('    ✅ pasirinkta: bacs'); }
  catch(e){ L('    ❌ bacs nepavyko: '+e.message.slice(0,50)); }
  await page.waitForTimeout(3000);

  // terms checkbox jei yra
  try{ await page.check('#terms',{timeout:3000}); L('    ✅ terms pazymeta'); }catch(e){}

  await page.screenshot({path:'/tmp/checkout.png',fullPage:false});

  // ---------- 6. Place order ----------
  L('');
  L('=== 6. Pateikti uzsakyma ===');
  const gaBefore=ga.length, fbBefore=fb.length, adsBefore=ads.length;
  await page.click('#place_order',{timeout:12000});
  L('  paspausta #place_order');
  await page.waitForTimeout(15000);
  thankyouUrl = page.url();
  L('  URL po submit: '+thankyouUrl.slice(0,110));

  const isThankyou = /order-received|uzsakymas-gautas|checkout\/order/.test(thankyouUrl);
  L('  thankyou puslapis: '+(isThankyou?'✅':'❌'));
  if(!isThankyou){
    const errs = await page.evaluate(()=>[...document.querySelectorAll('.woocommerce-error li, .woocommerce-NoticeGroup li')].map(e=>e.innerText.slice(0,90)));
    L('  KLAIDOS: '+JSON.stringify(errs));
    await page.screenshot({path:'/tmp/err.png',fullPage:false});
  }

  // ---------- 7. purchase dataLayer ----------
  L('');
  L('=== 7. purchase dataLayer push ===');
  events=await dl(page);
  const pur=events.find(e=>e.event==='purchase');
  if(!pur){ L('  ❌ purchase push NERASTAS'); L('  ecommerce event\'ai: '+JSON.stringify(events.map(e=>e.event))); }
  else{
    orderNumber = pur.ec.transaction_id;
    L('  ✅ purchase RASTAS');
    L('    transaction_id : '+pur.ec.transaction_id);
    L('    value          : '+pur.ec.value+' '+pur.ec.currency);
    L('    tax            : '+pur.ec.tax);
    L('    shipping       : '+pur.ec.shipping);
    L('    coupon         : '+(pur.ec.coupon||'—'));
    L('    items          : '+pur.ec.items);
    L('    firstItem      : '+JSON.stringify(pur.ec.firstItem));
    L('    user_data      : '+JSON.stringify(pur.user_data));
  }
  const purCount = events.filter(e=>e.event==='purchase').length;
  L('  purchase push\'u kiekis: '+purCount+'  '+(purCount===1?'✅ (tiksliai vienas)':'❌'));

  L('');
  L('=== 8. Tinklo uzklausos thankyou puslapyje ===');
  L('  GA4:  '+(ga.length-gaBefore)+'   Meta: '+(fb.length-fbBefore)+'   Ads: '+(ads.length-adsBefore));
  L('  (be gtm_test param blocking trigger blokuoja — laukiama 0)');

}catch(e){ L(''); L('!!! ERROR: '+e.message.slice(0,200)); }

L('');
L('=== 9. Uzsakymo patikra per API ===');
if(orderNumber){
  try{
    const r=execSync('curl -sk -u "'+AUTH+'" "https://dev.avesa.lt/wp-json/wc/v3/orders?search='+orderNumber+'&per_page=1" 2>/dev/null',{encoding:'utf8'});
    const arr=JSON.parse(r);
    if(arr.length){
      const o=arr[0];
      L('  #'+o.number+'  status='+o.status+'  total='+o.total+' '+o.currency);
      L('  billing_email: '+o.billing.email);
      L('  payment: '+o.payment_method+' ('+o.payment_method_title+')');
      L('  shipping_total: '+o.shipping_total+'  tax: '+o.total_tax);
      const flag=(o.meta_data||[]).find(m=>m.key==='_petshop_dl_purchase_sent');
      L('  _petshop_dl_purchase_sent: '+(flag?'"'+flag.value+'" ✅':'❌ NERA'));
      L('  ORDER_ID='+o.id);
    } else L('  uzsakymas nerastas per search');
  }catch(e){ L('  API klaida: '+e.message.slice(0,100)); }
} else L('  (transaction_id nezinomas)');

L('');
L('thankyouUrl='+(thankyouUrl||'-'));
await browser.close();
putFile('s168_purchase.txt', out);
console.log(out);
