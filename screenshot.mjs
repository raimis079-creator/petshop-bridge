import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
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
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'ERR'; } }
const URL='https://dev.avesa.lt/product/rinkinys-isrankiems-sunims-%c2%b7-6x400g/';
(async()=>{
  // 1. delete TEMP probe snippets
  for(const sid of [522,523]){
    exec('curl -sk -X POST -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+sid+'/deactivate"');
    exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+sid+'"');
  }
  // 2. analyze DOM structure of MnM page
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:1400}, userAgent:'Mozilla/5.0'});
  const page=await ctx.newPage();
  await page.goto(URL+'?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(5000);
  const analysis = await page.evaluate(()=>{
    const out={};
    // find the MnM form container
    const form = document.querySelector('form.cart');
    out.form_classes = form?.className || 'no form';
    // child items table
    const table = document.querySelector('.mnm_child_products, .mnm_table, table.mnm_table, .mnm_form_content');
    out.child_container_class = table?.className || 'NF';
    out.child_container_tag = table?.tagName || 'NF';
    // each child item structure
    const items = document.querySelectorAll('.mnm_item, .mnm_child_product, tr.mnm_item, .mnm_child_products tr, .mnm_form_content > div');
    out.items_count = items.length;
    out.first_item_html = items[0]?.outerHTML?.slice(0,1500) || 'NF';
    out.first_item_classes = items[0]?.className || 'NF';
    // quantity controls
    const qty = document.querySelectorAll('input.qty, input[type=number]');
    out.qty_inputs = qty.length;
    out.first_qty_html = qty[0]?.outerHTML || 'NF';
    out.first_qty_parent_class = qty[0]?.parentElement?.className || 'NF';
    // plus/minus buttons (if customizer setting on)
    const plusBtns = document.querySelectorAll('.plus, .minus, button.plus, button.minus, .quantity-button');
    out.plus_minus_count = plusBtns.length;
    // image classes
    const img = document.querySelectorAll('.mnm_child_product img, .mnm_item img, .product-thumbnail img');
    out.img_first = img[0]?.outerHTML?.slice(0,200) || 'NF';
    // counter
    const counter = document.querySelector('.mnm_message, .mnm_price_container_message, .mnm_status');
    out.counter_class = counter?.className || 'NF';
    out.counter_text = counter?.textContent?.trim().slice(0,100) || 'NF';
    // add to cart button
    const addBtn = document.querySelector('button.single_add_to_cart_button');
    out.add_btn_disabled = addBtn?.disabled;
    out.add_btn_class = addBtn?.className || 'NF';
    return out;
  });
  commitTxt('mnm_dom_analysis.json', JSON.stringify(analysis,null,2));
  putBin('mnm_current.png', await page.screenshot({fullPage:true}));
  await ctx.close(); await browser.close();
  console.log("DONE");
})();
