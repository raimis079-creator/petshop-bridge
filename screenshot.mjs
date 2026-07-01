import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putBin(name,buf){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb.json',JSON.stringify(body)); try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function commit(name, str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb2.json',JSON.stringify(body)); try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb2.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1280,height:900}});
  const page=await ctx.newPage();
  await page.goto('https://dev.avesa.lt/product/susirink-konservu-rinkini-sunims-pats/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page.waitForTimeout(8000);
  // Surenku 12 konservų (default 400g/12): pirmam turimam konservui 12
  await page.evaluate(()=>{
    var form = Array.from(document.querySelectorAll('.psc-form')).find(f=>f.style.display!=='none');
    if(form){
      var inputs = Array.from(form.querySelectorAll('.mnm_child_products input.qty, .mnm_child_products input[type=number]')).filter(i=>!i.disabled);
      if(inputs[0]){ inputs[0].value=12; inputs[0].dispatchEvent(new Event('change',{bubbles:true})); }
    }
  });
  await page.waitForTimeout(2000);
  var beforeCart = await page.evaluate(()=>{
    var proxy=document.querySelector('.psc-proxy-cta');
    return {proxy_text:proxy?proxy.textContent.trim():'?', proxy_disabled:proxy?proxy.classList.contains('disabled'):null,
      cart_count:(document.querySelector('.cart-counter, .cart-contents-count, .header-cart-count')||{}).textContent||'?'};
  });
  // Paspaudžiu proxy mygtuką
  await page.evaluate(()=>{ var p=document.querySelector('.psc-proxy-cta'); if(p) p.click(); });
  await page.waitForTimeout(4000); // MnM ajax
  var afterCart = await page.evaluate(()=>{
    return {
      cart_count:(document.querySelector('.cart-counter, .cart-contents-count, .header-cart-count')||{}).textContent||'?',
      // Ar yra klaidos pranešimas?
      error:(document.querySelector('.woocommerce-error, .wc-mnm-error, .mnm_message.error')||{}).textContent||'',
      success:(document.querySelector('.woocommerce-message, .added_to_cart')||{}).textContent||'',
      url: window.location.href
    };
  });
  commit('cart_test.json', JSON.stringify({beforeCart, afterCart},null,1));
  putBin('cart_test.png', await page.screenshot({fullPage:false}));
  console.log(JSON.stringify({beforeCart, afterCart}));
  await ctx.close(); await browser.close();
})();
