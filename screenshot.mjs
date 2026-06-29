import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putBin(name,buf){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});
}
function commitTxt(name,str){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb2.json',JSON.stringify(body));
  execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb2.json "'+url+'"',{encoding:'utf8'});
}
const URL='https://dev.avesa.lt/product/test-konservu-rinkinys-6-vnt-mnm/';
const log={steps:[]};
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:1100}, userAgent:'Mozilla/5.0'});
  const page=await ctx.newPage();
  await page.goto(URL+'?nc='+Date.now(), {waitUntil:'networkidle', timeout:60000});
  await page.waitForTimeout(2000);

  // set Anatra (item_id 1) qty = 6
  let set=false;
  for(const sel of ['input[name="mnm_quantity[1]"]','input[name="mnm_quantity[17397]"]','.mnm_item input.qty','.mnm_child_products input[type="number"]']){
    const loc = page.locator(sel).first();
    if(await loc.count()>0){
      await loc.fill('6');
      await loc.dispatchEvent('change'); await loc.dispatchEvent('input');
      set=true; log.steps.push('qty set via '+sel); break;
    }
  }
  if(!set) log.steps.push('QTY INPUT NOT FOUND');
  await page.waitForTimeout(1500);
  putBin('e2e_1_selected.png', await page.screenshot({clip:{x:0,y:170,width:1440,height:700}}));

  // click add to cart
  let added=false;
  for(const sel of ['button.single_add_to_cart_button','.single_add_to_cart_button','button[name="add-to-cart"]','form.cart button[type="submit"]']){
    const b=page.locator(sel).first();
    if(await b.count()>0 && await b.isEnabled().catch(()=>false)){ await b.click(); added=true; log.steps.push('clicked '+sel); break; }
  }
  if(!added) log.steps.push('ADD BUTTON not clickable');
  await page.waitForTimeout(4000);
  putBin('e2e_2_aftercart.png', await page.screenshot({clip:{x:0,y:0,width:1440,height:500}}));

  // go to cart
  await page.goto('https://dev.avesa.lt/cart/?nc='+Date.now(), {waitUntil:'networkidle', timeout:60000});
  await page.waitForTimeout(2500);
  putBin('e2e_3_cart.png', await page.screenshot({fullPage:true}));
  try{
    const cartTxt = await page.evaluate(()=>document.querySelector('.woocommerce-cart-form, .cart, .wc-block-cart, main')?.innerText.slice(0,1200)||document.body.innerText.slice(0,1200));
    commitTxt('e2e_cart.txt', cartTxt);
  }catch(e){}

  // go to checkout to see fields + payment methods
  await page.goto('https://dev.avesa.lt/checkout/?nc='+Date.now(), {waitUntil:'networkidle', timeout:60000});
  await page.waitForTimeout(3000);
  putBin('e2e_4_checkout.png', await page.screenshot({fullPage:true}));
  try{
    const pm = await page.evaluate(()=>{
      const labels=[...document.querySelectorAll('.wc_payment_methods label, .payment_methods label, .wc-block-components-radio-control__label')].map(l=>l.innerText.trim()).filter(Boolean);
      return labels.join(' | ');
    });
    log.payment_methods = pm;
  }catch(e){ log.pm_err=String(e).slice(0,100); }

  commitTxt('e2e_log.json', JSON.stringify(log,null,1));
  await ctx.close(); await browser.close();
  console.log("DONE");
})();
