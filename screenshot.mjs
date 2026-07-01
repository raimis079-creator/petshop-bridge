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
function commit(name, str){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb2.json',JSON.stringify(body));
  try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb2.json "'+url+'"',{encoding:'utf8'}); }catch(e){}
}
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1280,height:1400}});
  const page=await ctx.newPage();
  await page.goto('https://dev.avesa.lt/product/susirink-konservu-rinkini-sunims-pats/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page.waitForTimeout(6000);
  const probe = await page.evaluate(()=>{
    // Kiek .price elementų matomų viršuje (turėtų būti 0 dubliuotų)
    var summary = document.querySelector('.summary, .product-info');
    var visiblePrices = [];
    if(summary){
      summary.querySelectorAll('.price').forEach(function(p){
        var st = window.getComputedStyle(p);
        if(st.display !== 'none') visiblePrices.push(p.textContent.trim().slice(0,30));
      });
    }
    // Ar yra angliškų tekstų?
    var bodyText = document.body.textContent;
    var hasEnglish = bodyText.includes('Please select') || bodyText.includes('You have selected') || bodyText.includes(' items');
    var boxPrice = document.querySelector('.psc-box-price')?.textContent;
    // MnM statusas
    var mnmStatus = document.querySelector('.mnm_status, .mnm_message, .mnm_price');
    return {
      visible_prices_in_summary: visiblePrices,
      has_english_text: hasEnglish,
      box_price: boxPrice,
      mnm_status: mnmStatus?mnmStatus.textContent.trim().slice(0,80):'?'
    };
  });
  commit('vitrina_check.json', JSON.stringify(probe,null,1));
  putBin('vitrina_check.png', await page.screenshot({fullPage:false}));
  console.log(JSON.stringify(probe));
  await ctx.close(); await browser.close();
})();
