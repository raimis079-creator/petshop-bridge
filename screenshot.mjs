import { execSync } from 'child_process';
import fs from 'fs';
import { chromium } from 'playwright';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1',{maxBuffer:50e6,shell:'/bin/bash'}).toString();return {out:o};}catch(e){return {out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={}; let sid=null;
const php=Buffer.from('PD9waHAKLyoqCiAqIFVJIExvY2FsaXphdGlvbiBSdW50aW1lIEF1ZGl0IHYzIOKAlCBjaGVja291dCArIGZvcm11IGJ1c2Vub3MKICogU0FVR0lLTElTOiBqb2tzIHdwX21haWwgbmVpc2l1bmNpYW1hcywga29sIHNuaXBwZXQnYXMgYWt0eXZ1cy4KICovCmFkZF9maWx0ZXIoJ3ByZV93cF9tYWlsJywgZnVuY3Rpb24oJG51bGwsICRhdHRzKXsKICAgICRsb2cgPSBnZXRfb3B0aW9uKCdwczMzMl9tYWlsJywgYXJyYXkoKSk7CiAgICBpZiAoIWlzX2FycmF5KCRsb2cpKSAkbG9nID0gYXJyYXkoKTsKICAgICRsb2dbXSA9IGFycmF5KCd0byc9PmlzX2FycmF5KCRhdHRzWyd0byddKT9pbXBsb2RlKCcsJywkYXR0c1sndG8nXSk6JGF0dHNbJ3RvJ10sCiAgICAgICAgICAgICAgICAgICAnc3ViamVjdCc9PiRhdHRzWydzdWJqZWN0J10sICdsYWlrYXMnPT5jdXJyZW50X3RpbWUoJ215c3FsJykpOwogICAgdXBkYXRlX29wdGlvbigncHMzMzJfbWFpbCcsICRsb2csIGZhbHNlKTsKICAgIHJldHVybiB0cnVlOyAgIC8vIEJMT0tVT1RBIOKAlCBsYWlza2FzIG5laXNpdW5jaWFtYXMKfSwgMSwgMik7CgphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19hMyddKSApIHJldHVybjsKICAgICR2ID0gJF9HRVRbJ3BzX2EzJ107CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGdsb2JhbCAkd3BkYjsKCiAgICBpZiAoJHYgPT09ICd1cmxzJykgewogICAgICAgIC8vIFRJS1JJIFVSTCdhaSArIHByZWtlIHRlc3R1aQogICAgICAgICRxID0gbmV3IFdQX1F1ZXJ5KGFycmF5KCdwb3N0X3R5cGUnPT4ncHJvZHVjdCcsJ3Bvc3RzX3Blcl9wYWdlJz0+MSwKICAgICAgICAgICAgJ3Bvc3Rfc3RhdHVzJz0+J3B1Ymxpc2gnLCdvcmRlcmJ5Jz0+J0lEJywnb3JkZXInPT4nQVNDJywKICAgICAgICAgICAgJ21ldGFfcXVlcnknPT5hcnJheShhcnJheSgna2V5Jz0+J19zdG9ja19zdGF0dXMnLCd2YWx1ZSc9PidpbnN0b2NrJykpKSk7CiAgICAgICAgJHBpZCA9ICRxLT5oYXZlX3Bvc3RzKCkgPyAkcS0+cG9zdHNbMF0tPklEIDogMDsKICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KAogICAgICAgICAgICAnY2FydCcgICAgID0+IHdjX2dldF9jYXJ0X3VybCgpLAogICAgICAgICAgICAnY2hlY2tvdXQnID0+IHdjX2dldF9jaGVja291dF91cmwoKSwKICAgICAgICAgICAgJ2tvbnRha3RhaSc9PiBob21lX3VybCgnL2tvbnRha3RhaS8nKSwKICAgICAgICAgICAgJ3ByZWtlX2lkJyA9PiAkcGlkLAogICAgICAgICAgICAncHJla2VfdXJsJz0+ICRwaWQgPyBnZXRfcGVybWFsaW5rKCRwaWQpIDogbnVsbCwKICAgICAgICAgICAgJ3ByZWtlX3Bhdic9PiAkcGlkID8gZ2V0X3RoZV90aXRsZSgkcGlkKSA6IG51bGwsCiAgICAgICAgKSwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKICAgIH0KCiAgICBpZiAoJHYgPT09ICdyZWFkJykgewogICAgICAgICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4nYXVkaXQzLXYxJyk7CiAgICAgICAgJHJbJ2Jsb2t1b3RpX2xhaXNrYWknXSA9IGdldF9vcHRpb24oJ3BzMzMyX21haWwnLCBhcnJheSgpKTsKICAgICAgICAvLyBXUEZvcm1zIGlyYXNhaSBzdSBURVNUIHp5bWVrbGl1CiAgICAgICAgJHQgPSAkd3BkYi0+cHJlZml4Lid3cGZvcm1zX2VudHJpZXMnOwogICAgICAgIGlmICgkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAnJHQnIikgPT09ICR0KSB7CiAgICAgICAgICAgICRyWyd3cGZvcm1zX2lyYXNhaSddID0gJHdwZGItPmdldF9yZXN1bHRzKAogICAgICAgICAgICAgICAgIlNFTEVDVCBlbnRyeV9pZCwgZm9ybV9pZCwgZGF0ZSBGUk9NICR0IE9SREVSIEJZIGVudHJ5X2lkIERFU0MgTElNSVQgNSIsIEFSUkFZX0EpOwogICAgICAgIH0gZWxzZSB7ICRyWyd3cGZvcm1zX2lyYXNhaSddID0gJ2xlbnRlbGUgbmVyYXN0YSAoTGl0ZSB2ZXJzaWphIHNhdWdvIGtpdGFpcCknOyB9CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKICAgIH0KCiAgICBpZiAoJHYgPT09ICdjbGVhbnVwJykgewogICAgICAgICRyID0gYXJyYXkoKTsKICAgICAgICAkclsnbWFpbF9sb2dfaXN0cmludGFzJ10gPSBkZWxldGVfb3B0aW9uKCdwczMzMl9tYWlsJyk7CiAgICAgICAgJHQgPSAkd3BkYi0+cHJlZml4Lid3cGZvcm1zX2VudHJpZXMnOwogICAgICAgIGlmICgkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAnJHQnIikgPT09ICR0KSB7CiAgICAgICAgICAgIC8vIFRJS1NMVVMgenltZWtsaXMsIG5lIGJlbmRyYXMgcG96eW1pcyAoMjAyNi0wNy0zMSBwYW1va2EpCiAgICAgICAgICAgICRpZHMgPSAkd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIGVudHJ5X2lkIEZST00gJHQgV0hFUkUgZmllbGRzIExJS0UgJyVQUzMzMi1URVNUJSciKTsKICAgICAgICAgICAgJHJbJ3Jhc3RhX3Rlc3RfaXJhc3UnXSA9IGNvdW50KCRpZHMpOwogICAgICAgICAgICBpZiAoJGlkcykgewogICAgICAgICAgICAgICAgJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSAkdCBXSEVSRSBlbnRyeV9pZCBJTiAoIi5pbXBsb2RlKCcsJyxhcnJheV9tYXAoJ2ludHZhbCcsJGlkcykpLiIpIik7CiAgICAgICAgICAgICAgICAkdG0gPSAkd3BkYi0+cHJlZml4Lid3cGZvcm1zX2VudHJ5X21ldGEnOwogICAgICAgICAgICAgICAgaWYgKCR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICckdG0nIikgPT09ICR0bSkgewogICAgICAgICAgICAgICAgICAgICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00gJHRtIFdIRVJFIGVudHJ5X2lkIElOICgiLmltcGxvZGUoJywnLGFycmF5X21hcCgnaW50dmFsJywkaWRzKSkuIikiKTsKICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICRyWydpc3RyaW50YSddID0gY291bnQoJGlkcyk7CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7CiAgICB9CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdlcnInPT4xKSk7IGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit v3',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,200); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 5');
  // ★ wp_mail blokavimas jau AKTYVUS (snippet'as global) — tik dabar liesim formas
  const uu=sh('curl -sSk -m 40 "'+SITE+'/?ps_a3=urls"');
  let U=null; try{U=JSON.parse(uu.out);}catch(e){O.urls_raw=uu.out.slice(0,400);}
  O.urls=U;

  if(U && U.preke_url){
   try{
    const br = await chromium.launch();
    const ctx = await br.newContext({viewport:{width:1280,height:1100}, ignoreHTTPSErrors:true, locale:'lt-LT'});
    const page = await ctx.newPage();
    const errs=[];
    page.on('console', m=>{ if(m.type()==='error') errs.push(m.text().slice(0,120)); });
    const ANG = ['Add to cart','Show more','Submit','Checkout','Update cart','Proceed to',
                 'Apply coupon','Coupon code','Remove this item','Continue shopping',
                 'Return to shop','is a required field','Please enter','Invalid','required',
                 'Billing','Shipping','Place order','Your order','Product','Price','Subtotal','Total',
                 'First name','Last name','Phone','Email','Town','Postcode','Country'];
    const skenuok = (html) => { const o={}; for(const a of ANG){ const n=(html.match(new RegExp(a.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))||[]).length; if(n) o[a]=n; } return o; };

    // ---- 1) PREKE I KREPSELI (uzsakymo NEKURIAM) ----
    await page.goto(U.preke_url, {waitUntil:'domcontentloaded', timeout:60000});
    await page.waitForTimeout(2500);
    O.preke = U.preke_pav;
    try {
      await page.locator('button[name="add-to-cart"], .single_add_to_cart_button').first().click({timeout:20000});
      await page.waitForTimeout(4000);
      O.i_krepseli = 'OK';
    } catch(e){ O.i_krepseli = 'NEPAVYKO: '+String(e).slice(0,150); }

    // ---- 2) KREPSELIS ----
    await page.goto(U.cart, {waitUntil:'domcontentloaded', timeout:60000});
    await page.waitForTimeout(3000);
    const hc = await page.content();
    O.cart_url = page.url();
    O.cart_kodas = 200;
    O.cart_tuscias = hc.indexOf('krepšelis tuščias')>=0 || hc.toLowerCase().indexOf('cart is empty')>=0;
    O.cart_anglu = skenuok(hc);
    fs.writeFileSync('/tmp/c1.png', await page.screenshot({fullPage:true}));

    // ---- 3) TIKRAS CHECKOUT ----
    await page.goto(U.checkout, {waitUntil:'domcontentloaded', timeout:60000});
    await page.waitForTimeout(4000);
    O.checkout_url = page.url();
    const hk = await page.content();
    O.checkout_anglu = skenuok(hk);
    O.checkout_labels = await page.locator('form.checkout label').allTextContents().catch(()=>[]);
    fs.writeFileSync('/tmp/c2.png', await page.screenshot({fullPage:true}));

    // ---- 4) CHECKOUT VALIDACIJOS KLAIDOS (NEAPMOKAM) ----
    try {
      await page.locator('#place_order').click({timeout:20000});
      await page.waitForTimeout(6000);
      O.checkout_klaidos = await page.locator('.woocommerce-error li, .wc-block-components-validation-error, .woocommerce-invalid label').allTextContents();
      fs.writeFileSync('/tmp/c3.png', await page.screenshot({fullPage:true}));
    } catch(e){ O.checkout_klaidos_err = String(e).slice(0,180); }

    // ---- 5) KONTAKTU FORMA: tuscia ----
    await page.goto(U.kontaktai, {waitUntil:'domcontentloaded', timeout:60000});
    await page.waitForTimeout(3000);
    O.formos_mygtukas = await page.locator('.wpforms-submit').first().textContent().catch(()=>null);
    try {
      await page.locator('.wpforms-submit').first().click({timeout:15000});
      await page.waitForTimeout(3000);
      O.formos_klaidos_tuscia = await page.locator('.wpforms-error').allTextContents();
    } catch(e){ O.formos_tuscia_err = String(e).slice(0,150); }

    // ---- 6) BLOGAS EL. PASTAS ----
    try {
      const laukai = page.locator('.wpforms-field input[type="text"], .wpforms-field input[type="email"], .wpforms-field textarea');
      const n = await laukai.count();
      for (let i=0;i<n;i++){
        const el = laukai.nth(i);
        const t = await el.getAttribute('type');
        if (t === 'email') { await el.fill('blogas-pastas'); }
        else { await el.fill('PS332-TEST'); }
      }
      await page.locator('.wpforms-submit').first().click({timeout:15000});
      await page.waitForTimeout(3000);
      O.formos_klaidos_pastas = await page.locator('.wpforms-error').allTextContents();
      fs.writeFileSync('/tmp/c4.png', await page.screenshot({fullPage:true}));
    } catch(e){ O.formos_pastas_err = String(e).slice(0,150); }

    // ---- 7) REALUS SIUNTIMAS su TEST zymekliu ----
    try {
      const el2 = page.locator('.wpforms-field input[type="email"]').first();
      if (await el2.count()) { await el2.fill('ps332-test@dev.avesa.lt'); }
      await page.locator('.wpforms-submit').first().click({timeout:15000});
      await page.waitForTimeout(7000);
      O.siuntimo_busena = await page.locator('.wpforms-confirmation-container, .wpforms-confirmation-container-full').allTextContents();
      O.po_siuntimo_klaidos = await page.locator('.wpforms-error').allTextContents();
      fs.writeFileSync('/tmp/c5.png', await page.screenshot({fullPage:true}));
    } catch(e){ O.siuntimo_err = String(e).slice(0,150); }

    // ---- 8) „Submit button is disabled" — ar MATOMAS ----
    const galutinis = await page.content();
    O.submit_disabled_HTML = (galutinis.indexOf('Submit button is disabled')>=0);
    O.submit_disabled_matomas = await page.getByText('Submit button is disabled', {exact:false}).count().catch(()=>0);
    O.paieskos_aria = (galutinis.match(/aria-label="Ieškoti"/g)||[]).length;

    O.js_klaidos = errs.slice(0,8);
    await br.close();
    for (const n of ['c1','c2','c3','c4','c5']) {
      try{ putB64('a3_'+n+'.png', fs.readFileSync('/tmp/'+n+'.png').toString('base64')); }catch(e){}
    }
   }catch(err){ O.BROWSER_ERR = String(err && err.stack ? err.stack : err).slice(0,700); }
  }

  const rr=sh('curl -sSk -m 40 "'+SITE+'/?ps_a3=read"');
  try{O.serveryje=JSON.parse(rr.out);}catch(e){O.read_raw=rr.out.slice(0,400);}
  const cc=sh('curl -sSk -m 40 "'+SITE+'/?ps_a3=cleanup"');
  try{O.valymas=JSON.parse(cc.out);}catch(e){O.cleanup_raw=cc.out.slice(0,300);}

  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
}
putB64('audit3.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
