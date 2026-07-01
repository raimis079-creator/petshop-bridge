import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putBin(name,buf){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb.json',JSON.stringify(body)); try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function commit(name, str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb2.json',JSON.stringify(body)); try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb2.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1280,height:1300}});
  const page=await ctx.newPage();
  await page.goto('https://dev.avesa.lt/product/susirink-konservu-rinkini-sunims-pats/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page.waitForTimeout(8000);
  const probe = await page.evaluate(()=>{
    var c = document.querySelector('.petshop-choice-constructor');
    if(!c) return {error:'no constructor'};
    var sidebar = c.querySelector('.psc-summary');
    var ctaBtn = c.querySelector('.psc-cta-slot .single_add_to_cart_button');
    var layout = c.querySelector('.psc-layout');
    var gridCols = layout ? window.getComputedStyle(layout).gridTemplateColumns : '?';
    return {
      has_constructor: true,
      has_sidebar: !!sidebar,
      cta_in_sidebar: !!ctaBtn,
      cta_text: ctaBtn ? ctaBtn.textContent.trim().slice(0,20) : null,
      layout_columns: gridCols,
      box_price: (c.querySelector('.psc-box-price')||{}).textContent,
      sum_selected: (c.querySelector('.psc-sum-selected')||{}).textContent,
      gram_btns: c.querySelectorAll('.psc-gram-btn').length,
      size_btns: c.querySelectorAll('.psc-size-btn').length
    };
  });
  commit('v10_check.json', JSON.stringify(probe,null,1));
  putBin('v10_check.png', await page.screenshot({fullPage:true}));
  console.log(JSON.stringify(probe));
  await ctx.close(); await browser.close();
})();
