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
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:900,height:800}});
  const out={};
  // Skanėstai
  const page1=await ctx.newPage();
  await page1.goto('https://dev.avesa.lt/product/jaucio-ir-kiaules-ausu-rinkinys-sunims-%c2%b7-15-vnt/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page1.waitForTimeout(5000);
  const sav1 = await page1.evaluate(()=>{ const el=document.querySelector('.petshop-savings'); return el?el.textContent.trim():'NĖRA'; });
  out.skanestai_savings = sav1;
  // crop tik summary sritis
  const summary1 = await page1.$('.product-info, .summary, .entry-summary');
  if(summary1) putBin('savings_skan.png', await summary1.screenshot()); else putBin('savings_skan.png', await page1.screenshot());

  // VANDENYNAS
  const page2=await ctx.newPage();
  await page2.goto('https://dev.avesa.lt/product/vandenynas-konservu-rinkinys-katems/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page2.waitForTimeout(5000);
  const sav2 = await page2.evaluate(()=>{ const el=document.querySelector('.petshop-savings'); return el?el.textContent.trim():'NĖRA'; });
  out.vandenynas_savings = sav2;
  const summary2 = await page2.$('.product-info, .summary, .entry-summary');
  if(summary2) putBin('savings_vand.png', await summary2.screenshot()); else putBin('savings_vand.png', await page2.screenshot());

  commit('savings_check.json', JSON.stringify(out,null,1));
  console.log(JSON.stringify(out));
  await ctx.close();
  await browser.close();
})();
