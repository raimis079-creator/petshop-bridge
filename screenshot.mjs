import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putBin(name,buf){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb.json',JSON.stringify(body)); try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function commit(name, str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb2.json',JSON.stringify(body)); try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb2.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1280,height:1000}});
  const page=await ctx.newPage();
  // Atidarau paslėpto produkto (400g·12vnt = 34191) puslapį
  await page.goto('https://dev.avesa.lt/product/susirink-konservu-rinkini-sunims-pats-400g-%c2%b7-12-vnt-pasleptas/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page.waitForTimeout(8000);
  var probe = await page.evaluate(()=>{
    var c = document.querySelector('.petshop-choice-constructor');
    var activeGram = document.querySelector('.psc-gram-btn.psc-active');
    var activeSize = document.querySelector('.psc-size-btn.psc-active');
    return {
      has_constructor: !!c,
      has_sidebar: !!document.querySelector('.psc-summary'),
      active_gram: activeGram ? activeGram.dataset.gram : null,
      active_size: activeSize ? activeSize.dataset.size : null,
      gram_btns: document.querySelectorAll('.psc-gram-btn').length,
      size_btns: document.querySelectorAll('.psc-size-btn').length,
      forms_count: document.querySelectorAll('.psc-form').length,
      box_price: (document.querySelector('.psc-box-price')||{}).textContent
    };
  });
  commit('a_e2_check.json', JSON.stringify(probe,null,1));
  putBin('a_e2_check.png', await page.screenshot({fullPage:false}));
  console.log(JSON.stringify(probe));
  await ctx.close(); await browser.close();
})();
