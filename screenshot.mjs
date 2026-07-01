import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb2.json',JSON.stringify(body)); try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb2.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1280,height:800}});
  const page=await ctx.newPage();
  // Pridedu rinkinį pirma
  await page.goto('https://dev.avesa.lt/product/susirink-konservu-rinkini-sunims-pats/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page.waitForTimeout(8000);
  await page.evaluate(()=>{
    var form = Array.from(document.querySelectorAll('.psc-form')).find(f=>f.style.display!=='none');
    if(form){ var inputs=Array.from(form.querySelectorAll('.mnm_child_products input.qty, input[type=number]')).filter(i=>!i.disabled); if(inputs[0]){ inputs[0].value=12; inputs[0].dispatchEvent(new Event('change',{bubbles:true})); } }
  });
  await page.waitForTimeout(2000);
  await page.evaluate(()=>{ var p=document.querySelector('.psc-proxy-cta'); if(p) p.click(); });
  await page.waitForTimeout(5000);
  // Krepšelyje — randu "Keisti pasirinkimus" nuorodą, tikrinu jos href
  var editInfo = await page.evaluate(()=>{
    var link = Array.from(document.querySelectorAll('a')).find(a=>/Keisti pasirinkimus|Edit selections/i.test(a.textContent));
    return { href: link ? link.href : null, text: link ? link.textContent.trim() : null };
  });
  commit('edit_url.json', JSON.stringify(editInfo,null,1));
  console.log(JSON.stringify(editInfo));
  await ctx.close(); await browser.close();
})();
