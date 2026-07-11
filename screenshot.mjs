import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";

function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'ot '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
function putBinary(path,buf){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/'+path;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'img '+path,branch:'main',content:buf.toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pb.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pb.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}

let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';
const PROD='/product/exclusion-hepatic-dietinis-sausas-sunu-maistas-su-kiauliena-ryziais-ir-zirneliais-m-l-12kg/';

// Skenuoja pilna dabartinio puslapio dataLayer, randa event'us
async function findEvents(page, eventName){
  return await page.evaluate((en)=>{
    const dl = window.dataLayer || [];
    return dl.filter(e => e && e.event === en).map(e=>{
      const c = {};
      c.event = e.event;
      if(e.ecommerce){
        const ec = e.ecommerce;
        c.ecommerce = {
          currency: ec.currency, value: ec.value,
          transaction_id: ec.transaction_id, tax: ec.tax, shipping: ec.shipping,
          coupon: ec.coupon, shipping_tier: ec.shipping_tier, payment_type: ec.payment_type,
          items_count: Array.isArray(ec.items)? ec.items.length : 0,
          items: Array.isArray(ec.items)? ec.items.map(it=>({
            item_id: it.item_id||it.id, item_name:(it.item_name||it.name||'').slice(0,50),
            price: it.price, quantity: it.quantity, item_brand: it.item_brand
          })) : []
        };
      }
      // user_data (enhanced conversions)
      if(e.user_data){
        c.user_data = {};
        for(const k of Object.keys(e.user_data)){
          const v = e.user_data[k];
          c.user_data[k] = (typeof v==='string' && v.length>24) ? v.slice(0,16)+'...' : v;
        }
      }
      return c;
    });
  }, eventName);
}

function report(name, evs){
  const flag = evs.length===0 ? '  ❌ NE' : (evs.length>1 ? '  ⚠️ '+evs.length+'x DUBLIKATAS' : '  ✅');
  L('  '+name+': '+evs.length+' event'+flag);
  if(evs.length){
    const e = evs[0]; const ec = e.ecommerce||{};
    let line = '    value='+ec.value+' cur='+ec.currency;
    if(ec.transaction_id) line+=' txn='+ec.transaction_id;
    if(ec.tax!==undefined) line+=' tax='+ec.tax;
    if(ec.shipping!==undefined) line+=' ship='+ec.shipping;
    if(ec.shipping_tier) line+=' tier='+ec.shipping_tier;
    if(ec.payment_type) line+=' pay='+ec.payment_type;
    line+=' items='+ec.items_count;
    L(line);
    if(ec.items && ec.items[0]) L('    item[0]: id='+ec.items[0].item_id+' brand='+ec.items[0].item_brand+' price='+ec.items[0].price+' qty='+ec.items[0].quantity);
    if(e.user_data) L('    user_data: '+Object.keys(e.user_data).join(',')+' | email_hash='+(e.user_data.sha256_email_address||e.user_data.email_address||'NERA'));
  }
  return evs;
}

(async()=>{
  const R = { events:{}, counts:{} };
  let browser;
  try {
    browser = await chromium.launch({args:['--no-sandbox']});
    const ctx = await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:900},
      userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'});
    const page = await ctx.newPage();

    L('=== 1. Home + Priimti sutikima ===');
    await page.goto(BASE+'/', {waitUntil:'domcontentloaded', timeout:60000});
    await page.waitForTimeout(4000);
    const acc = await page.evaluate(()=>{const b=document.querySelector('.cmplz-cookiebanner .cmplz-accept'); if(b){b.click();return true;} return false;});
    L('  Priimti: '+acc);
    await page.waitForTimeout(2500);

    L('=== 2. view_item ===');
    await page.goto(BASE+PROD, {waitUntil:'domcontentloaded', timeout:60000});
    await page.waitForTimeout(4000);
    R.events.view_item = report('view_item', await findEvents(page,'view_item'));
    putBinary('screenshots/ot_1_product.png', await page.screenshot({fullPage:false}));

    L('=== 3. add_to_cart ===');
    const atc = await page.evaluate(()=>{const b=document.querySelector('.single_add_to_cart_button,[name="add-to-cart"]'); if(b){b.click();return true;} return false;});
    L('  ATC spaustas: '+atc);
    await page.waitForTimeout(5000);
    R.events.add_to_cart = report('add_to_cart', await findEvents(page,'add_to_cart'));

    L('=== 4. view_cart ===');
    await page.goto(BASE+'/cart/', {waitUntil:'domcontentloaded', timeout:60000});
    await page.waitForTimeout(4000);
    R.events.view_cart = report('view_cart', await findEvents(page,'view_cart'));

    L('=== 5. begin_checkout ===');
    await page.goto(BASE+'/checkout/', {waitUntil:'domcontentloaded', timeout:60000});
    await page.waitForTimeout(5000);
    R.events.begin_checkout = report('begin_checkout', await findEvents(page,'begin_checkout'));
    putBinary('screenshots/ot_2_checkout.png', await page.screenshot({fullPage:false}));

    L('=== 6. Forma ===');
    async function fill(sel,val){try{await page.fill(sel,val);}catch(e){L('    ⚠ '+sel);}}
    await fill('#billing_first_name','Testas');
    await fill('#billing_last_name','Testauskas');
    await fill('#billing_address_1','Testine g. 1');
    await fill('#billing_city','Vilnius');
    await fill('#billing_postcode','01001');
    await fill('#billing_phone','+37060000000');
    const uemail = 'ga4test'+Date.now()+'@petshop.lt';
    await fill('#billing_email', uemail);
    L('  test email: '+uemail);
    await page.waitForTimeout(4000);

    L('=== 7. add_shipping_info (LP Express pastomatas) ===');
    const sh = await page.evaluate(()=>{
      const inp=[...document.querySelectorAll('input[name^="shipping_method"]')];
      const t = inp.find(i=>/lpexpress/i.test(i.value)&&!/kurjeris/i.test(i.value))||inp.find(i=>/pickup|pastom/i.test(i.value))||inp[0];
      if(t){t.click();t.dispatchEvent(new Event('change',{bubbles:true}));return t.value;}return null;
    });
    L('  shipping: '+sh);
    await page.waitForTimeout(4500);
    // pastomato ID
    const term = await page.evaluate(()=>{
      const s=document.querySelector('select[name*="terminal"],select[name*="lpexpress"]');
      if(!s)return{found:false};
      const o=[...s.options].filter(x=>x.value&&!/pasirinkti|choose/i.test(x.value));
      if(o.length){s.value=o[0].value;s.dispatchEvent(new Event('change',{bubbles:true}));return{found:true,picked:o[0].value,label:o[0].text};}
      return{found:true,picked:null};
    });
    L('  pastomatas: '+JSON.stringify(term));
    await page.waitForTimeout(4000);
    R.events.add_shipping_info = report('add_shipping_info', await findEvents(page,'add_shipping_info'));

    L('=== 8. add_payment_info (bacs) ===');
    const pm = await page.evaluate(()=>{
      const inp=[...document.querySelectorAll('input[name="payment_method"]')];
      const t=inp.find(i=>i.value==='bacs');
      if(t){t.click();t.dispatchEvent(new Event('change',{bubbles:true}));return t.value;}return null;
    });
    L('  payment: '+pm);
    await page.waitForTimeout(3500);
    R.events.add_payment_info = report('add_payment_info', await findEvents(page,'add_payment_info'));
    putBinary('screenshots/ot_3_filled.png', await page.screenshot({fullPage:false}));

    L('=== 9. purchase (place_order) ===');
    const placed = await page.evaluate(()=>{const b=document.querySelector('#place_order'); if(b){b.click();return true;}return false;});
    L('  place_order: '+placed);
    try{ await page.waitForURL(/order-received|thank/i,{timeout:30000}); L('  -> thank-you psl'); }
    catch(e){
      L('  ⚠ nesulaukta thank-you. URL='+page.url());
      const err=await page.evaluate(()=>{const e=document.querySelector('.woocommerce-error,.woocommerce-NoticeGroup-checkout');return e?e.innerText.slice(0,400):'nera err';});
      L('  WC klaida: '+err);
      putBinary('screenshots/ot_err.png', await page.screenshot({fullPage:false}));
    }
    await page.waitForTimeout(5000);
    R.events.purchase = report('purchase', await findEvents(page,'purchase'));
    R.thankyou_url = page.url();
    // order id is URL
    const m = page.url().match(/order-received\/(\d+)/);
    R.order_id = m?m[1]:null;
    L('  order_id is URL: '+R.order_id);
    putBinary('screenshots/ot_4_thankyou.png', await page.screenshot({fullPage:false}));

    L('=== 10. RE-VISIT (dublikato patikra) ===');
    if(/order-received|thank/i.test(page.url())){
      const ty=page.url();
      await page.goto(ty,{waitUntil:'domcontentloaded',timeout:60000});
      await page.waitForTimeout(4000);
      const again = await findEvents(page,'purchase');
      R.counts.purchase_revisit = again.length;
      L('  purchase per re-visit: '+again.length+(again.length>0?'  ⚠️ DUBLIKATAS (Consent Bridge replay?)':'  ✅ idempotent'));
    }

    // counts
    for(const k of Object.keys(R.events)) R.counts[k]=R.events[k].length;
    L('=== SUVESTINE ===');
    for(const k of Object.keys(R.counts)) L('  '+k+': '+R.counts[k]);
    L('DONE');
  } catch(e){ L('!!! EXC: '+(e&&e.stack?e.stack:String(e))); }
  finally {
    try{ if(browser) await browser.close(); }catch(e){}
    putText('order_test_v2.json', JSON.stringify(R,null,2));
    putText('_ot_log.txt', out);
  }
})();
