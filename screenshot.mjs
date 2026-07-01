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
  await page.goto('https://dev.avesa.lt/product/testas-grupiu-vitrina/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page.waitForTimeout(8000);
  // Būsena: Mix aktyvi (default)
  var s1 = await page.evaluate(()=>({
    group_buttons: Array.from(document.querySelectorAll('.psc-group-btn')).map(b=>({label:b.textContent.trim(), active:b.classList.contains('psc-active')})),
    active_group: (document.querySelector('.psc-group-btn.psc-active')||{}).dataset?.group,
    box_price: (document.querySelector('.psc-box-price')||{}).textContent
  }));
  putBin('grpvit_mix.png', await page.screenshot({fullPage:false}));
  // Perjungiu į Hipoalerginis
  await page.evaluate(()=>{ var b=document.querySelector('.psc-group-btn[data-group="hipo"]'); if(b) b.click(); });
  await page.waitForTimeout(2000);
  var s2 = await page.evaluate(()=>({
    active_group: (document.querySelector('.psc-group-btn.psc-active')||{}).dataset?.group,
    box_price: (document.querySelector('.psc-box-price')||{}).textContent,
    visible_form: (function(){var f=Array.from(document.querySelectorAll('.psc-form')).find(x=>x.style.display!=='none'); return f?(f.dataset.group+'_'+f.dataset.gram+'_'+f.dataset.size):'NĖRA';})()
  }));
  putBin('grpvit_hipo.png', await page.screenshot({fullPage:false}));
  commit('grpvit.json', JSON.stringify({mix:s1, hipo:s2},null,1));
  console.log(JSON.stringify({mix:s1, hipo:s2}));
  await ctx.close(); await browser.close();
})();
