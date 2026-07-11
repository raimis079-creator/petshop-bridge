import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";

function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'ga4 '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
function putBinary(path,buf){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/'+path;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'img '+path,branch:'main',content:buf.toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pb.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pb.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}

let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';
const PROD='/product/exclusion-hepatic-dietinis-sausas-sunu-maistas-su-kiauliena-ryziais-ir-zirneliais-m-l-12kg/';

// Filtruoja dataLayer i tik e-commerce eventus
function ecomEvents(dl) {
  return (dl || []).filter(e => e && typeof e === 'object' && e.event && /view_item|add_to_cart|view_cart|begin_checkout|add_shipping_info|add_payment_info|purchase|remove_from_cart|select_item/.test(String(e.event)));
}
function summarize(events) {
  return events.map(e => ({
    event: e.event,
    ecommerce: e.ecommerce ? {
      currency: e.ecommerce.currency,
      value: e.ecommerce.value,
      transaction_id: e.ecommerce.transaction_id,
      tax: e.ecommerce.tax,
      shipping: e.ecommerce.shipping,
      coupon: e.ecommerce.coupon,
      items_count: (e.ecommerce.items || []).length,
      items_summary: (e.ecommerce.items || []).map(i => ({
        item_id: i.item_id, item_name: (i.item_name||'').slice(0,50), quantity: i.quantity, price: i.price, item_brand: i.item_brand
      })),
      payment_type: e.ecommerce.payment_type,
      shipping_tier: e.ecommerce.shipping_tier
    } : null,
    user_data_present: !!e.user_data,
    user_data_email_hashed: e.user_data && e.user_data.sha256_email_address ? String(e.user_data.sha256_email_address).slice(0,16)+'...' : null
  }));
}

(async () => {
  const R = { steps: {} };
  let browser, ctx, page;
  try {
    browser = await chromium.launch({ args: ['--no-sandbox'] });
    ctx = await browser.newContext({
      ignoreHTTPSErrors: true,
      viewport: { width: 1366, height: 900 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
    });
    page = await ctx.newPage();

    // ═══ 1. VIEW_ITEM ═══
    L('=== 1. view_item — atidarom prekes psl ===');
    await page.goto(BASE + PROD, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(4000);

    // sutikimas: PRIIMTI
    const acceptClicked = await page.evaluate(() => {
      const btns = [...document.querySelectorAll('.cmplz-cookiebanner .cmplz-btn, .cmplz-cookiebanner button')];
      const b = btns.find(x => /priimti/i.test((x.textContent || '').trim()));
      if (b) { b.click(); return true; }
      return false;
    });
    L('  PRIIMTI paspaustas: ' + acceptClicked);
    await page.waitForTimeout(2500);

    let dl1 = await page.evaluate(() => (window.dataLayer || []).map(e => JSON.parse(JSON.stringify(e))));
    let ev1 = ecomEvents(dl1);
    R.steps['1_view_item'] = { dl_len: dl1.length, ecom_events: summarize(ev1) };
    L('  dataLayer len=' + dl1.length + ' | e-commerce events=' + ev1.length);
    ev1.forEach(e => L('    - ' + e.event + ' value=' + (e.ecommerce && e.ecommerce.value) + ' items=' + ((e.ecommerce && e.ecommerce.items || []).length)));

    // ═══ 2. ADD_TO_CART ═══
    L('=== 2. add_to_cart ===');
    // Ieskom "I krepseli" mygtuko
    const atcClicked = await page.evaluate(() => {
      const btns = [...document.querySelectorAll('button, .single_add_to_cart_button, .button')];
      const b = btns.find(x => /krepšel|krepsel|add to cart/i.test((x.textContent||'').trim()) && !x.disabled);
      if (b) { b.click(); return { clicked: true, text: b.textContent.trim().slice(0,40), classes: b.className.slice(0,80) }; }
      return { clicked: false };
    });
    L('  ATC paspaustas: ' + JSON.stringify(atcClicked));

    // Flatsome ATC gali NAVIGUOTI (ne AJAX) - S168 patvirtinta. Lauksim iki 6s bet kokios navigacijos.
    let atcNavigated = false;
    try {
      await page.waitForLoadState('domcontentloaded', { timeout: 6000 });
      // Ar iš tikrųjų nunavigavo į kitą URL?
      if (!/\/product\//.test(page.url())) {
        atcNavigated = true;
        L('  ATC NAVIGAVO (ne AJAX) -> ' + page.url());
      }
    } catch (e) {
      L('  jokios navigacijos (AJAX rezimas)');
    }
    await page.waitForTimeout(2500);

    let dl2 = await page.evaluate(() => (window.dataLayer || []).map(e => JSON.parse(JSON.stringify(e))));
    let ev2 = ecomEvents(dl2);
    let new2 = ev2.slice(atcNavigated ? 0 : ev1.length); // jei navigavo, dataLayer naujas
    R.steps['2_add_to_cart'] = { atc_click: atcClicked, atc_navigated: atcNavigated, dl_len: dl2.length, new_events: summarize(new2), all_ecom: summarize(ev2) };
    L('  ATC navigated: ' + atcNavigated + ' | Nauji e-commerce events: ' + new2.length);
    new2.forEach(e => L('    - ' + e.event + ' value=' + (e.ecommerce && e.ecommerce.value)));

    // ═══ 3. VIEW_CART ═══
    L('=== 3. view_cart — atidarom /cart/ ===');
    await page.goto(BASE + '/cart/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3500);

    let dl3 = await page.evaluate(() => (window.dataLayer || []).map(e => JSON.parse(JSON.stringify(e))));
    let ev3 = ecomEvents(dl3);
    let new3 = ev3.slice(ev2.length);
    R.steps['3_view_cart'] = { url: page.url(), dl_len: dl3.length, new_events: summarize(new3) };
    L('  URL: ' + page.url());
    L('  Nauji events: ' + new3.length);
    new3.forEach(e => L('    - ' + e.event + ' value=' + (e.ecommerce && e.ecommerce.value)));

    // ═══ 4. BEGIN_CHECKOUT ═══
    L('=== 4. begin_checkout — atidarom /checkout/ ===');
    await page.goto(BASE + '/checkout/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000);

    let dl4 = await page.evaluate(() => (window.dataLayer || []).map(e => JSON.parse(JSON.stringify(e))));
    let ev4 = ecomEvents(dl4);
    let new4 = ev4.slice(ev3.length);
    R.steps['4_begin_checkout'] = { url: page.url(), dl_len: dl4.length, new_events: summarize(new4) };
    L('  URL: ' + page.url());
    L('  Nauji events: ' + new4.length);
    new4.forEach(e => L('    - ' + e.event + ' value=' + (e.ecommerce && e.ecommerce.value)));

    // Screenshot pries pildyma
    putBinary('screenshots/order_step4_checkout_empty.png', await page.screenshot({ fullPage: true }));
    L('  screenshot: order_step4_checkout_empty.png');

    // ═══ 5. UZPILDOM FORMA ═══
    L('=== 5. Uzpildom checkout forma ===');
    const fillReport = await page.evaluate(() => {
      const report = {};
      function setVal(sel, val) {
        const el = document.querySelector(sel);
        if (!el) { report[sel] = 'NOT FOUND'; return; }
        el.focus();
        el.value = val;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new Event('blur', { bubbles: true }));
        report[sel] = 'set: ' + val;
      }
      setVal('#billing_first_name', 'Testas');
      setVal('#billing_last_name', 'Testauskas');
      setVal('#billing_email', 'terra@gyvunai.lt');
      setVal('#billing_phone', '+37060000000');
      setVal('#billing_address_1', 'Bandymo g. 1');
      setVal('#billing_city', 'Vilnius');
      setVal('#billing_postcode', 'LT-01001');
      return report;
    });
    R.steps['5_form_fill'] = fillReport;
    L('  ' + JSON.stringify(fillReport).slice(0, 400));
    // Triggerinam WC checkout update
    await page.evaluate(() => { if (window.jQuery) window.jQuery(document.body).trigger('update_checkout'); });
    await page.waitForTimeout(4000);

    // ═══ 6. ADD_SHIPPING_INFO ═══
    L('=== 6. add_shipping_info — LP Express pastomatas ===');
    // Ieskom shipping radio arba select
    const shipPick = await page.evaluate(() => {
      // Radio inputs
      const radios = [...document.querySelectorAll('input[name^="shipping_method"]')];
      const info = radios.map(r => ({ value: r.value, checked: r.checked, id: r.id, label: (document.querySelector('label[for="'+r.id+'"]')||{}).textContent }));
      // Bandom pasirinkti LP Express paštomata (instance 12 arba any lpexpress_terminal)
      const lp = radios.find(r => /lpexpress_terminal/.test(r.value) && !/kurjer/i.test((document.querySelector('label[for="'+r.id+'"]')||{}).textContent||''));
      if (lp) {
        lp.checked = true;
        lp.click();
        lp.dispatchEvent(new Event('change', { bubbles: true }));
        return { radios_info: info, picked: lp.value, picked_label: (document.querySelector('label[for="'+lp.id+'"]')||{}).textContent };
      }
      // Fallback - Venipak paštomatas
      const vp = radios.find(r => /venipak.*pickup/i.test(r.value) || /pickup/i.test(r.value));
      if (vp) { vp.checked = true; vp.click(); vp.dispatchEvent(new Event('change', { bubbles: true })); return { radios_info: info, picked: vp.value, picked_label: 'venipak-pickup' }; }
      // Any first
      if (radios.length) { radios[0].checked = true; radios[0].click(); radios[0].dispatchEvent(new Event('change', { bubbles: true })); return { radios_info: info, picked: radios[0].value, picked_label: 'first-fallback' }; }
      return { radios_info: info, picked: null };
    });
    R.steps['6_ship_pick'] = shipPick;
    L('  radios matomi: ' + (shipPick.radios_info||[]).length);
    (shipPick.radios_info||[]).forEach(r => L('    - ' + r.value + ' | ' + (r.label||'').trim().slice(0,60) + (r.checked?' [checked]':'')));
    L('  pasirinkta: ' + shipPick.picked + ' / ' + shipPick.picked_label);
    await page.evaluate(() => { if (window.jQuery) window.jQuery(document.body).trigger('update_checkout'); });
    await page.waitForTimeout(4500);

    let dl6 = await page.evaluate(() => (window.dataLayer || []).map(e => JSON.parse(JSON.stringify(e))));
    let ev6 = ecomEvents(dl6);
    let new6 = ev6.slice(ev4.length);
    R.steps['6_add_shipping_info_events'] = { new_events: summarize(new6) };
    L('  Nauji events po shipping pasirinkimo: ' + new6.length);
    new6.forEach(e => L('    - ' + e.event + ' shipping_tier=' + (e.ecommerce && e.ecommerce.shipping_tier) + ' value=' + (e.ecommerce && e.ecommerce.value)));

    // Jei paštomato reikia pasirinkti konkretų — bandom
    const terminalPick = await page.evaluate(() => {
      const selects = [...document.querySelectorAll('select[name*="terminal"], select[id*="terminal"], select[name*="pickup"]')];
      if (!selects.length) return { found: false };
      const info = [];
      for (const s of selects) {
        const opts = [...s.options].slice(0, 5).map(o => ({v: o.value, t: (o.text||'').slice(0,50)}));
        info.push({ name: s.name, options_first5: opts });
        // Pasirenkam pirma ne tuscia option
        for (const o of s.options) {
          if (o.value && o.value !== '') { s.value = o.value; s.dispatchEvent(new Event('change', { bubbles: true })); info[info.length-1].picked = o.value + ' | ' + o.text.slice(0,40); break; }
        }
      }
      return { found: true, selects: info };
    });
    R.steps['6_terminal_pick'] = terminalPick;
    L('  terminal select: ' + JSON.stringify(terminalPick).slice(0, 300));
    if (terminalPick.found) { await page.evaluate(() => { if (window.jQuery) window.jQuery(document.body).trigger('update_checkout'); }); await page.waitForTimeout(3500); }

    // ═══ 7. ADD_PAYMENT_INFO ═══
    L('=== 7. add_payment_info — Bankinis pavedimas ===');
    const payPick = await page.evaluate(() => {
      const radios = [...document.querySelectorAll('input[name="payment_method"]')];
      const info = radios.map(r => ({ value: r.value, checked: r.checked, label: (document.querySelector('label[for="'+r.id+'"]')||{}).textContent }));
      const bacs = radios.find(r => r.value === 'bacs');
      if (bacs) { bacs.checked = true; bacs.click(); bacs.dispatchEvent(new Event('change', { bubbles: true })); return { radios_info: info, picked: 'bacs' }; }
      return { radios_info: info, picked: null };
    });
    R.steps['7_pay_pick'] = payPick;
    (payPick.radios_info||[]).forEach(r => L('    payment: ' + r.value + ' | ' + (r.label||'').trim().slice(0,40) + (r.checked?' [checked]':'')));
    L('  pasirinkta: ' + payPick.picked);
    await page.waitForTimeout(2500);

    let dl7 = await page.evaluate(() => (window.dataLayer || []).map(e => JSON.parse(JSON.stringify(e))));
    let ev7 = ecomEvents(dl7);
    let new7 = ev7.slice(ev6.length);
    R.steps['7_add_payment_info_events'] = { new_events: summarize(new7) };
    L('  Nauji events po pay pasirinkimo: ' + new7.length);
    new7.forEach(e => L('    - ' + e.event + ' payment_type=' + (e.ecommerce && e.ecommerce.payment_type) + ' value=' + (e.ecommerce && e.ecommerce.value)));

    // Screenshot pries submit
    putBinary('screenshots/order_step7_before_submit.png', await page.screenshot({ fullPage: true }));

    // ═══ 8. SUBMIT ═══
    L('=== 8. SUBMIT — Atlikti uzsakyma ===');
    // Pazymim I've read the terms & conditions if present
    await page.evaluate(() => {
      const tc = document.querySelector('#terms');
      if (tc && !tc.checked) { tc.checked = true; tc.dispatchEvent(new Event('change', { bubbles: true })); }
    });

    const beforeSubmitUrl = page.url();
    const submitClicked = await page.evaluate(() => {
      const btn = document.querySelector('#place_order') || document.querySelector('button[name="woocommerce_checkout_place_order"]');
      if (btn) { btn.click(); return { clicked: true, text: btn.textContent.trim().slice(0,40), disabled: btn.disabled }; }
      return { clicked: false };
    });
    L('  submit: ' + JSON.stringify(submitClicked));

    // Palaukiam navigacijos i thank-you psl arba klaidos
    let purchaseFireTime = null;
    try {
      await page.waitForURL(/\/checkout\/order-received\/|\/order-received\//, { timeout: 30000 });
      L('  Navigavo i thank-you psl: ' + page.url());
      purchaseFireTime = 'nav_success';
    } catch (e) {
      L('  Navigacija netikslinga (' + e.message.slice(0,80) + '); tikrinam esamos psl busena');
    }
    await page.waitForTimeout(4000);

    // Klaidu tikrinimas
    const errCheck = await page.evaluate(() => {
      const errs = [...document.querySelectorAll('.woocommerce-error li, .woocommerce-NoticeGroup-checkout .woocommerce-error li')];
      return errs.map(e => e.textContent.trim().slice(0,200));
    });
    if (errCheck.length) {
      L('  KLAIDOS checkout: ' + JSON.stringify(errCheck));
      R.errors = errCheck;
    }

    let dl8 = await page.evaluate(() => (window.dataLayer || []).map(e => JSON.parse(JSON.stringify(e))));
    let ev8 = ecomEvents(dl8);
    let new8 = ev8.slice(ev7.length);
    R.steps['8_submit_events'] = { url_after: page.url(), new_events: summarize(new8) };
    L('  Nauji events po submit: ' + new8.length);
    new8.forEach(e => L('    - ' + e.event + ' transaction_id=' + (e.ecommerce && e.ecommerce.transaction_id) + ' value=' + (e.ecommerce && e.ecommerce.value) + ' user_data=' + e.user_data_present));

    // Screenshot thank-you
    if (/order-received/.test(page.url())) {
      putBinary('screenshots/order_step8_thankyou.png', await page.screenshot({ fullPage: true }));
      L('  screenshot: order_step8_thankyou.png');
    } else {
      putBinary('screenshots/order_step8_after_submit.png', await page.screenshot({ fullPage: true }));
      L('  screenshot: order_step8_after_submit.png (ne thank-you)');
    }

    // ═══ 9. THANK-YOU DUPLICATE CHECK ═══
    L('=== 9. Thank-you psl - dublikato patikra (F5 reload) ===');
    if (/order-received/.test(page.url())) {
      const beforeReload = ev8.length;
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(4000);
      let dl9 = await page.evaluate(() => (window.dataLayer || []).map(e => JSON.parse(JSON.stringify(e))));
      let ev9 = ecomEvents(dl9);
      // ar naujas purchase event'as fire'ino?
      const purchaseCount = ev9.filter(e => e.event === 'purchase').length;
      R.steps['9_duplicate_check'] = {
        purchase_events_total: purchaseCount,
        dedup_ok: purchaseCount <= 1,
        message: purchaseCount > 1 ? 'DUBLIKATAS - S168 bug grize' : 'OK - purchase fireino tik karta'
      };
      L('  purchase eventu is viso: ' + purchaseCount);
      L('  ' + R.steps['9_duplicate_check'].message);
    } else {
      R.steps['9_duplicate_check'] = { skipped: 'ne thank-you psl' };
    }

    // Order ID extraction is thank-you URL arba is DL
    const orderMatch = (page.url().match(/order-received\/(\d+)/) || []);
    const orderIdFromUrl = orderMatch[1] || null;
    const orderIdFromDl = ev8.filter(e => e.event === 'purchase')[0]?.ecommerce?.transaction_id;
    R.order_id = orderIdFromUrl || orderIdFromDl;
    L('=== UZSAKYMO ID: ' + R.order_id + ' ===');

    L('DONE');
  } catch (e) {
    L('!!! EXCEPTION: ' + (e && e.stack ? e.stack : String(e)));
    try { if (page) putBinary('screenshots/order_error.png', await page.screenshot({ fullPage: true })); } catch(x){}
  } finally {
    try { if (browser) await browser.close(); } catch (e) {}
    putText('order_test.json', JSON.stringify(R, null, 2));
    putText('_order_log.txt', out);
  }
})();
