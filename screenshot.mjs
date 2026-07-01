import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb2.json',JSON.stringify(body)); try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb2.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1280,height:1100}});
  const page=await ctx.newPage();
  await page.goto('https://dev.avesa.lt/product/susirink-konservu-rinkini-sunims-pats/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page.waitForTimeout(8000);
  const probe = await page.evaluate(()=>{
    var bodyText = document.body.textContent;
    // Suskaičiuoju likusius angliškus visose formose (matomose+paslėptose)
    var engCount = 0, engSamples = [];
    document.querySelectorAll('.psc-form').forEach(function(f){
      var t = f.textContent;
      if(t.includes('Please select')){ engCount++; }
      if(/\bProduct\b/.test(t)) engSamples.push('Product th');
    });
    return {
      has_please_select_en: bodyText.includes('Please select'),
      has_you_have_selected_en: bodyText.includes('You have selected'),
      has_items_en: /\d+ items/.test(bodyText),
      forms_with_english: engCount,
      still_has_product_th: engSamples.length
    };
  });
  commit('v9_check.json', JSON.stringify(probe,null,1));
  console.log(JSON.stringify(probe));
  await ctx.close(); await browser.close();
})();
