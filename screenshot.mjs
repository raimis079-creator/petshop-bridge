import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb2.json',JSON.stringify(body)); try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb2.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1280,height:1400}});
  const page=await ctx.newPage();
  await page.goto('https://dev.avesa.lt/product/susirink-konservu-rinkini-sunims-pats/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page.waitForTimeout(6000);
  const probe = await page.evaluate(()=>{
    // Randu elementus su tekstu "PRODUCT" ir "QUANTITY"
    var found = [];
    document.querySelectorAll('*').forEach(function(el){
      if(el.children.length===0){
        var t = el.textContent.trim();
        if(t==='PRODUCT'||t==='QUANTITY'||t==='Product'||t==='Quantity'){
          found.push({text:t, tag:el.tagName, cls:el.className, parentCls:el.parentElement?.className});
        }
      }
    });
    // Taip pat visi angliški likę
    var eng = [];
    document.querySelectorAll('.petshop-choice-constructor *').forEach(function(el){
      if(el.children.length===0){
        var t = el.textContent.trim();
        if(/^(Please select|You have|Add to cart|In stock|Out of stock|Clear|items|item)/.test(t) && t.length<60){
          eng.push(t.slice(0,40));
        }
      }
    });
    return {product_quantity_els: found, remaining_english: [...new Set(eng)].slice(0,10)};
  });
  commit('header_probe.json', JSON.stringify(probe,null,1));
  console.log(JSON.stringify(probe).slice(0,600));
  await ctx.close(); await browser.close();
})();
