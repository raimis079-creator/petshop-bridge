import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
function putBin(name,buf){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }catch(e){}
}
function commitTxt(name,str){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb2.json',JSON.stringify(body));
  try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb2.json "'+url+'"',{encoding:'utf8'}); }catch(e){}
}
function rest(method,path){
  const cmd='curl -sk -X '+method+' -H "Authorization: '+AUTH+'" -H "Accept: application/json" "'+BASE+path+'"';
  try{ return JSON.parse(execSync(cmd,{encoding:'utf8',maxBuffer:300000000})); }catch(e){ return {__e:String(e).slice(0,80)}; }
}
async function shot(p,n,o){ try{ putBin(n, await p.screenshot(o||{fullPage:true})); }catch(e){} }
async function setIf(page,sel,val){ try{ const l=page.locator(sel).first(); if(await l.count()>0){ await l.fill(val,{timeout:4000}); return true; } }catch(e){} return false; }
const log={steps:[]}; const S=x=>log.steps.push(x);
(async()=>{
  // BEFORE stock
  const b4=rest('GET','/wp-json/wc/v3/products/17397');
  log.anatra_before = b4 && b4.stock_quantity;

  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:1200}, userAgent:'Mozilla/5.0'});
  const page=await ctx.newPage();
  try{
    await page.goto('https://dev.avesa.lt/product/test-konservu-rinkinys-6-vnt-mnm/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(2500);
    await page.locator('input[name="mnm_quantity[17397]"]').first().fill('6');
    await page.locator('input[name="mnm_quantity[17397]"]').first().dispatchEvent('change');
    await page.waitForTimeout(1200);
    await page.locator('button.single_add_to_cart_button').first().click();
    await page.waitForTimeout(4000);
    S('added to cart');
  }catch(e){ S('cart err '+String(e).slice(0,80)); }

  try{
    await page.goto('https://dev.avesa.lt/checkout/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(3000);
    await setIf(page,'#billing_first_name','Test');
    await setIf(page,'#billing_last_name','Testas');
    await setIf(page,'#billing_address_1','Testo g. 1');
    await setIf(page,'#billing_city','Vilnius');
    await setIf(page,'#billing_postcode','01100');
    await setIf(page,'#billing_phone','+37060000000');
    await setIf(page,'#billing_email','test-mnm@example.com');
    await setIf(page,'#billing_state','Vilnius');
    // uncheck create account
    try{ const ca=page.locator('#createaccount'); if(await ca.count()>0 && await ca.isChecked()) await ca.uncheck({timeout:2000}); }catch(e){}
    await page.waitForTimeout(800);
    // select Bankinis pavedimas (bacs)
    let pm=false;
    for(const sel of ['#payment_method_bacs','input[value="bacs"]']){
      try{ const r=page.locator(sel).first(); if(await r.count()>0){ await r.check({timeout:3000,force:true}); pm=true; S('selected bacs '+sel); break; } }catch(e){}
    }
    if(!pm) S('bacs not found');
    await page.waitForTimeout(2500);
    // terms
    try{ const t=page.locator('#terms'); if(await t.count()>0 && !(await t.isChecked())) await t.check({force:true}); }catch(e){}
    await shot(page,'order_1_checkout_filled.png');
    // place order
    await page.locator('#place_order').first().click({timeout:8000});
    S('clicked place_order');
    await page.waitForTimeout(8000);
    await page.waitForLoadState('domcontentloaded').catch(()=>{});
    await page.waitForTimeout(3000);
    log.final_url = page.url();
    await shot(page,'order_2_received.png');
    // parse order id from url
    const m = page.url().match(/order-received\/(\d+)/);
    if(m) log.order_id = parseInt(m[1],10);
    if(!log.order_id){
      const t2 = await page.evaluate(()=>document.body.innerText.slice(0,800));
      log.page_text = t2;
    }
  }catch(e){ S('checkout err '+String(e).slice(0,120)); await shot(page,'order_err.png'); }

  await ctx.close(); await browser.close();

  // AFTER stock
  const af=rest('GET','/wp-json/wc/v3/products/17397');
  log.anatra_after = af && af.stock_quantity;

  // order details
  if(log.order_id){
    const o=rest('GET','/wp-json/wc/v3/orders/'+log.order_id);
    log.order = {id:o.id, status:o.status, total:o.total, payment:o.payment_method_title,
      line_items:(o.line_items||[]).map(li=>({name:(li.name||'').slice(0,45), qty:li.quantity, sku:li.sku, product_id:li.product_id, total:li.total}))};
  }
  commitTxt('order_test.json', JSON.stringify(log,null,1));
  console.log("DONE");
})();
