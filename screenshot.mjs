import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
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
async function shot(page,name,opts){ try{ putBin(name, await page.screenshot(opts||{fullPage:true})); }catch(e){ } }
const URL='https://dev.avesa.lt/product/test-konservu-rinkinys-6-vnt-mnm/';
const log={steps:[]};
function S(x){ log.steps.push(x); }
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:1100}, userAgent:'Mozilla/5.0'});
  const page=await ctx.newPage();
  try{
    await page.goto(URL+'?nc='+Date.now(), {waitUntil:'domcontentloaded', timeout:60000});
    await page.waitForTimeout(3000);
    S('loaded product');
  }catch(e){ S('goto err '+String(e).slice(0,80)); }

  // dump all input names in the cart form
  try{
    const inputs = await page.evaluate(()=>{
      const f = document.querySelector('form.cart, form.mnm_form, .mnm_form');
      if(!f) return {noform:true, bodyInputs:[...document.querySelectorAll('input')].slice(0,30).map(i=>({name:i.name,type:i.type,value:i.value,readonly:i.readOnly}))};
      return {inputs:[...f.querySelectorAll('input,button')].map(i=>({tag:i.tagName,name:i.name||'',type:i.type||'',cls:(i.className||'').slice(0,40),value:i.value||'',readonly:i.readOnly||false}))};
    });
    log.form_inputs = inputs;
  }catch(e){ S('dump err '+String(e).slice(0,80)); }
  await shot(page,'e2e_1_product.png',{clip:{x:0,y:170,width:1440,height:760}});

  // strategy: set first child qty=6 (try fill, then +button x6)
  let done=false;
  const fillSels=['input[name="mnm_quantity[1]"]','input[name="mnm_quantity[17397]"]','.mnm_item:not(.out-of-stock) input.qty','.mnm_child_products tr input[type="number"]','form.cart input.qty'];
  for(const sel of fillSels){
    try{
      const loc=page.locator(sel).first();
      if(await loc.count()>0){
        await loc.scrollIntoViewIfNeeded();
        await loc.fill('6',{timeout:4000});
        await loc.dispatchEvent('change'); await loc.dispatchEvent('input');
        S('filled '+sel); done=true; break;
      }
    }catch(e){ S('fill fail '+sel+' '+String(e).slice(0,50)); }
  }
  if(!done){
    // try plus buttons
    try{
      const plus=page.locator('.plus, button.plus, .quantity .plus, [data-step="up"]').first();
      if(await plus.count()>0){ for(let i=0;i<6;i++){ await plus.click({timeout:2000}); await page.waitForTimeout(250);} S('clicked + x6'); done=true; }
    }catch(e){ S('plus fail '+String(e).slice(0,50)); }
  }
  await page.waitForTimeout(1500);
  await shot(page,'e2e_2_selected.png',{clip:{x:0,y:170,width:1440,height:760}});

  // add to cart
  try{
    const sels=['button.single_add_to_cart_button','.single_add_to_cart_button','button[name="add-to-cart"]','form.cart button[type="submit"]'];
    for(const sel of sels){
      const b=page.locator(sel).first();
      if(await b.count()>0){
        const en=await b.isEnabled().catch(()=>true);
        S('addbtn '+sel+' enabled='+en);
        if(en){ await b.click({timeout:5000}); S('clicked add'); break; }
      }
    }
  }catch(e){ S('add err '+String(e).slice(0,80)); }
  await page.waitForTimeout(4000);
  await shot(page,'e2e_3_aftercart.png',{clip:{x:0,y:0,width:1440,height:480}});

  // cart page
  try{
    await page.goto('https://dev.avesa.lt/cart/?nc='+Date.now(), {waitUntil:'domcontentloaded', timeout:60000});
    await page.waitForTimeout(3000);
    await shot(page,'e2e_4_cart.png');
    const t=await page.evaluate(()=>document.querySelector('main,.cart,.woocommerce')?.innerText.slice(0,1500)||document.body.innerText.slice(0,1500));
    commitTxt('e2e_cart.txt', t);
    log.cart_has_test = /TEST Konserv|MnM|rinkinys/i.test(t);
  }catch(e){ S('cart err '+String(e).slice(0,80)); }

  // checkout
  try{
    await page.goto('https://dev.avesa.lt/checkout/?nc='+Date.now(), {waitUntil:'domcontentloaded', timeout:60000});
    await page.waitForTimeout(3500);
    await shot(page,'e2e_5_checkout.png');
    const pm=await page.evaluate(()=>[...document.querySelectorAll('.wc_payment_methods label,.payment_methods label,.wc-block-components-radio-control__label')].map(l=>l.innerText.trim()).filter(Boolean).join(' | '));
    log.payment_methods=pm;
  }catch(e){ S('checkout err '+String(e).slice(0,80)); }

  commitTxt('e2e_log.json', JSON.stringify(log,null,1));
  try{ await ctx.close(); await browser.close(); }catch(e){}
  console.log("DONE");
})();
