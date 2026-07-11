import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";

function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'ord '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
function putBinary(path,buf){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/'+path;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'img '+path,branch:'main',content:buf.toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pb.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pb.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}

let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';
const PROD='/product/exclusion-hepatic-dietinis-sausas-sunu-maistas-su-kiauliena-ryziais-ir-zirneliais-m-l-12kg/';

// Trumpina items masyva - tik kritinius laukus
function trimItems(items){
  if(!Array.isArray(items)) return items;
  return items.map(it=>({
    item_id: it.item_id||it.id,
    item_name: (it.item_name||it.name||'').slice(0,60),
    price: it.price,
    quantity: it.quantity,
    item_brand: it.item_brand,
    item_category: it.item_category
  }));
}

// Isskaido ir sutrumpina konkretu event objekta
function trimEvent(e){
  const cp = JSON.parse(JSON.stringify(e));
  if(cp.ecommerce){
    if(cp.ecommerce.items) cp.ecommerce.items = trimItems(cp.ecommerce.items);
  }
  // ilgas hash / user data - tik pirmi 20 simboliu
  if(cp.user_data){
    for(const k of Object.keys(cp.user_data)){
      if(typeof cp.user_data[k]==='string' && cp.user_data[k].length>32){
        cp.user_data[k] = cp.user_data[k].slice(0,20)+'...';
      }
    }
  }
  return cp;
}

// Nuskaito visus dataLayer irasus, filtruoja pagal event pavadinima
async function snapshotDL(page, tag){
  const dl = await page.evaluate(()=> (window.dataLayer||[]).slice());
  L('  DL snapshot ['+tag+']: '+dl.length+' irasu');
  return dl;
}

// Naujus eventus (nuo prieso indekso iki dabar)
function newSince(all, prev){
  return all.slice(prev.length);
}

(async()=>{
  const R = { events: {}, timeline: [], counts: {} };
  let browser;
  try {
    browser = await chromium.launch({args:['--no-sandbox']});
    const ctx = await browser.newContext({
      ignoreHTTPSErrors: true,
      viewport: {width: 1440, height: 900},
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
    });
    const page = await ctx.newPage();
    let allDL = [];

    // === 1. HOME + Complianz Accept ===
    L('=== 1. Home + Priimti sutikima (kad Consent Mode duotu granted) ===');
    await page.goto(BASE+'/', {waitUntil:'domcontentloaded', timeout:60000});
    await page.waitForTimeout(4000);
    // Priimti slapukus
    const accepted = await page.evaluate(()=>{
      const btn = document.querySelector('.cmplz-cookiebanner .cmplz-accept');
      if(btn){ btn.click(); return true; }
      return false;
    });
    L('  Priimti paspaustas: '+accepted);
    await page.waitForTimeout(2500);
    allDL = await snapshotDL(page, 'home_post_accept');

    // === 2. VIEW ITEM ===
    L('=== 2. view_item (prekes puslapis) ===');
    const dlBeforeVI = allDL;
    await page.goto(BASE+PROD, {waitUntil:'domcontentloaded', timeout:60000});
    await page.waitForTimeout(3500);
    allDL = await snapshotDL(page, 'product_page');
    const newAfterVI = newSince(allDL, dlBeforeVI);
    const viEvents = newAfterVI.filter(e=>e && e.event==='view_item');
    R.events.view_item = viEvents.map(trimEvent);
    R.counts.view_item = viEvents.length;
    L('  view_item eventu fireino: '+viEvents.length);
    if(viEvents.length){
      const e = viEvents[0];
      const it = e.ecommerce && e.ecommerce.items && e.ecommerce.items[0];
      L('  value='+e.ecommerce?.value+' currency='+e.ecommerce?.currency+' items[0]={id:'+it?.item_id+', price:'+it?.price+', brand:'+it?.item_brand+'}');
    }
    // Screenshot
    putBinary('screenshots/order_1_product.png', await page.screenshot({fullPage:false}));

    // === 3. ADD TO CART ===
    L('=== 3. add_to_cart (spausti "I krepseli") ===');
    const dlBeforeATC = allDL;
    // Flatsome: single_add_to_cart_button
    const atcClicked = await page.evaluate(()=>{
      const btn = document.querySelector('.single_add_to_cart_button, button.single_add_to_cart_button, [name="add-to-cart"]');
      if(btn){ btn.click(); return true; }
      return false;
    });
    L('  ATC spaustas: '+atcClicked);
    await page.waitForTimeout(4500); // duodam laiko form submit/reload
    allDL = await snapshotDL(page, 'post_atc');
    const newAfterATC = newSince(allDL, dlBeforeATC);
    const atcEvents = newAfterATC.filter(e=>e && e.event==='add_to_cart');
    R.events.add_to_cart = atcEvents.map(trimEvent);
    R.counts.add_to_cart = atcEvents.length;
    L('  add_to_cart fire\'ino: '+atcEvents.length+(atcEvents.length===0?'  ⚠️ S168 bugas? (Flatsome ne-AJAX)':''));

    // === 4. VIEW CART ===
    L('=== 4. view_cart (/cart/) ===');
    const dlBeforeVC = allDL;
    await page.goto(BASE+'/cart/', {waitUntil:'domcontentloaded', timeout:60000});
    await page.waitForTimeout(3500);
    allDL = await snapshotDL(page, 'cart_page');
    const newAfterVC = newSince(allDL, dlBeforeVC);
    const vcEvents = newAfterVC.filter(e=>e && e.event==='view_cart');
    R.events.view_cart = vcEvents.map(trimEvent);
    R.counts.view_cart = vcEvents.length;
    L('  view_cart fire\'ino: '+vcEvents.length);
    if(vcEvents.length){L('  value='+vcEvents[0].ecommerce?.value+' items='+(vcEvents[0].ecommerce?.items?.length||0));}
    putBinary('screenshots/order_2_cart.png', await page.screenshot({fullPage:false}));

    // === 5. BEGIN CHECKOUT ===
    L('=== 5. begin_checkout (/checkout/) ===');
    const dlBeforeBC = allDL;
    await page.goto(BASE+'/checkout/', {waitUntil:'domcontentloaded', timeout:60000});
    await page.waitForTimeout(5000);
    allDL = await snapshotDL(page, 'checkout_page');
    const newAfterBC = newSince(allDL, dlBeforeBC);
    const bcEvents = newAfterBC.filter(e=>e && e.event==='begin_checkout');
    R.events.begin_checkout = bcEvents.map(trimEvent);
    R.counts.begin_checkout = bcEvents.length;
    L('  begin_checkout fire\'ino: '+bcEvents.length);
    if(bcEvents.length){L('  value='+bcEvents[0].ecommerce?.value+' items='+(bcEvents[0].ecommerce?.items?.length||0));}
    putBinary('screenshots/order_3_checkout_empty.png', await page.screenshot({fullPage:false}));

    // === 6. Užpildyti forma ===
    L('=== 6. Uzpildom checkout forma ===');
    async function safeType(sel, val){
      try{ await page.fill(sel, val); L('    '+sel+' -> "'+val+'"'); }
      catch(e){ L('    ⚠ '+sel+' nerastas'); }
    }
    // WC standartiniai laukai
    await safeType('#billing_first_name','Testas');
    await safeType('#billing_last_name','Testauskas');
    await safeType('#billing_address_1','Testinė g. 1');
    await safeType('#billing_city','Vilnius');
    await safeType('#billing_postcode','01001');
    await safeType('#billing_phone','+37060000000');
    await safeType('#billing_email','terra@gyvunai.lt');
    // Country - LT default; nediliojam jei jau LT
    await page.waitForTimeout(3500); // ajax update — shipping perskaiciuojamas

    // === 7. ADD SHIPPING INFO — pasirinkti LP Express pastomata ===
    L('=== 7. add_shipping_info (LP Express pastomatas) ===');
    const dlBeforeSH = allDL;
    // Rinksim pirmą LP Express radio
    const shippingClicked = await page.evaluate(()=>{
      const inputs = [...document.querySelectorAll('input[name^="shipping_method"]')];
      const info = inputs.map(i=>({id:i.id, val:i.value, checked:i.checked}));
      // ieskom LP Express pastomato
      const target = inputs.find(i=>/lpexpress/i.test(i.value) && !/kurjeris/i.test(i.value))
                  || inputs.find(i=>/paštom|pastom|pickup/i.test(i.value))
                  || inputs.find(i=>/lpexpress/i.test(i.value))
                  || inputs[0];
      if(target){ target.click(); target.dispatchEvent(new Event('change',{bubbles:true})); return {ok:true, chosen:target.value, all:info}; }
      return {ok:false, all:info};
    });
    L('  shipping input info: '+JSON.stringify(shippingClicked.all).slice(0,400));
    L('  pasirinkta: '+shippingClicked.chosen);
    await page.waitForTimeout(4500); // WC ajax update

    // 7b. LP Express paštomato ID pasirinkimas (atskiras select po shipping method)
    const terminalPick = await page.evaluate(()=>{
      const sel = document.querySelector('select[name="woo_lithuaniapost_lpexpress_terminal_id"], select[name*="terminal"], select[name*="lpexpress"]');
      if(!sel) return {found:false};
      // pirmas realus paštomatas (ne placeholder)
      const opts = [...sel.options].filter(o=>o.value && !/pasirinkti|choose/i.test(o.value));
      if(opts.length){
        sel.value = opts[0].value;
        sel.dispatchEvent(new Event('change',{bubbles:true}));
        return {found:true, picked:opts[0].value, label:opts[0].text};
      }
      return {found:true, picked:null};
    });
    L('  paštomato select: '+JSON.stringify(terminalPick));
    await page.waitForTimeout(3500);
    allDL = await snapshotDL(page, 'post_shipping');
    const newAfterSH = newSince(allDL, dlBeforeSH);
    const shEvents = newAfterSH.filter(e=>e && e.event==='add_shipping_info');
    R.events.add_shipping_info = shEvents.map(trimEvent);
    R.counts.add_shipping_info = shEvents.length;
    L('  add_shipping_info fire\'ino: '+shEvents.length);
    if(shEvents.length){L('  shipping_tier='+shEvents[0].ecommerce?.shipping_tier);}

    // === 8. ADD PAYMENT INFO - Bankinis pavedimas ===
    L('=== 8. add_payment_info (bacs) ===');
    const dlBeforePM = allDL;
    const paymentClicked = await page.evaluate(()=>{
      const inputs = [...document.querySelectorAll('input[name="payment_method"]')];
      const info = inputs.map(i=>({id:i.id, val:i.value, checked:i.checked}));
      const target = inputs.find(i=>i.value==='bacs');
      if(target){ target.click(); target.dispatchEvent(new Event('change',{bubbles:true})); return {ok:true, chosen:target.value, all:info}; }
      return {ok:false, all:info};
    });
    L('  payment options: '+JSON.stringify(paymentClicked.all));
    L('  pasirinkta: '+paymentClicked.chosen);
    await page.waitForTimeout(3500);
    allDL = await snapshotDL(page, 'post_payment');
    const newAfterPM = newSince(allDL, dlBeforePM);
    const pmEvents = newAfterPM.filter(e=>e && e.event==='add_payment_info');
    R.events.add_payment_info = pmEvents.map(trimEvent);
    R.counts.add_payment_info = pmEvents.length;
    L('  add_payment_info fire\'ino: '+pmEvents.length);
    if(pmEvents.length){L('  payment_type='+pmEvents[0].ecommerce?.payment_type);}
    putBinary('screenshots/order_4_checkout_filled.png', await page.screenshot({fullPage:false}));

    // === 9. PURCHASE - spausti "Atlikti uzsakyma" ===
    L('=== 9. purchase (Atlikti uzsakyma) ===');
    const dlBeforePU = allDL;
    // WC place order btn
    const placed = await page.evaluate(()=>{
      const btn = document.querySelector('#place_order, button#place_order');
      if(btn){ btn.click(); return true; }
      return false;
    });
    L('  place_order spaustas: '+placed);
    // Palaukiam thank-you psl krovimo
    try {
      await page.waitForURL(/order-received|thank/i, {timeout: 30000});
      L('  perkeltas i thank-you psl');
    } catch(e) {
      L('  ⚠ per 30s nesulaukta thank-you psl, tikrinam kur esame');
      L('  dabartinis URL: '+page.url());
      // Screenshot klaidoms
      putBinary('screenshots/order_5_error.png', await page.screenshot({fullPage:false}));
      const errText = await page.evaluate(()=>{
        const err = document.querySelector('.woocommerce-error, .woocommerce-NoticeGroup-checkout');
        return err ? err.innerText.slice(0,600) : 'nera err elemento';
      });
      L('  WC klaida: '+errText);
    }
    await page.waitForTimeout(5000);
    allDL = await snapshotDL(page, 'thankyou_page');
    const newAfterPU = newSince(allDL, dlBeforePU);
    const puEvents = newAfterPU.filter(e=>e && e.event==='purchase');
    R.events.purchase = puEvents.map(trimEvent);
    R.counts.purchase = puEvents.length;
    L('  purchase fire\'ino: '+puEvents.length+(puEvents.length>1?'  ⚠️ DUBLIKATAS':''));
    if(puEvents.length){
      const p = puEvents[0];
      L('  transaction_id='+p.ecommerce?.transaction_id);
      L('  value='+p.ecommerce?.value+' tax='+p.ecommerce?.tax+' shipping='+p.ecommerce?.shipping);
      L('  currency='+p.ecommerce?.currency+' items='+(p.ecommerce?.items?.length||0));
      L('  user_data.sha256_email='+(p.user_data?.sha256_email_address?'yra ('+p.user_data.sha256_email_address.slice(0,16)+'...)':'NERA'));
    }
    R.thankyou_url = page.url();
    putBinary('screenshots/order_6_thankyou.png', await page.screenshot({fullPage:false}));

    // === 10. THANK-YOU RE-VISIT (S168 bugas: replay ant kiekvieno psl) ===
    L('=== 10. RE-VISIT thankyou (patikra ar purchase dubliuojasi) ===');
    if(page.url().match(/order-received|thank/i)) {
      const tyUrl = page.url();
      const dlBeforeRV = allDL;
      await page.goto(tyUrl, {waitUntil:'domcontentloaded', timeout:60000});
      await page.waitForTimeout(4000);
      allDL = await snapshotDL(page, 'thankyou_revisit');
      const newAfterRV = newSince(allDL, dlBeforeRV);
      const puAgain = newAfterRV.filter(e=>e && e.event==='purchase');
      R.counts.purchase_on_revisit = puAgain.length;
      L('  purchase revisit fire\'ino: '+puAgain.length+(puAgain.length>0?'  ⚠️ DUBLIKATAS':'  ✅ idempotent'));
    }

    // === Suvestine ===
    L('=== SUVESTINE (event\'u kiekiai) ===');
    for(const k of Object.keys(R.counts)) L('  '+k+': '+R.counts[k]);

    R.total_dl_items = allDL.length;
    L('DONE');
  } catch(e){
    L('!!! EXC: '+(e&&e.stack?e.stack:String(e)));
  } finally {
    try{ if(browser) await browser.close(); }catch(e){}
    putText('order_test.json', JSON.stringify(R, null, 2));
    putText('_run17_log.txt', out);
  }
})();
