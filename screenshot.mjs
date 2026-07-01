import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb2.json',JSON.stringify(body)); try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb2.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1280,height:900}});
  const page=await ctx.newPage();
  // Atidarau paslėpto produkto puslapį (kaip "Keisti pasirinkimus" darytų)
  await page.goto('https://dev.avesa.lt/product/susirink-konservu-rinkini-sunims-pats-400g-%c2%b7-12-vnt-pasleptas/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page.waitForTimeout(7000);
  var probe = await page.evaluate(()=>{
    // Koks šio produkto meta? Ar mūsų vitrina įsijungė?
    return {
      has_our_constructor: !!document.querySelector('.petshop-choice-constructor'),
      has_our_sidebar: !!document.querySelector('.psc-summary'),
      body_classes: document.body.className.slice(0, 200),
      // MnM forma yra?
      has_mnm_form: !!document.querySelector('.mnm_form'),
      title: (document.querySelector('h1')||{}).textContent||'?',
      // Ar yra edit-in-cart žymė?
      is_editing: document.body.textContent.includes('update') || !!document.querySelector('[name="update-container"]')
    };
  });
  commit('hidden_probe.json', JSON.stringify(probe,null,1));
  console.log(JSON.stringify(probe));
  await ctx.close(); await browser.close();
})();
