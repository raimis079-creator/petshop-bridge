import { execSync } from "child_process"; import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const URL="https://dev.avesa.lt/akcijos/";
function commit(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'v',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbv.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbv.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  const browser = await chromium.launch({ ignoreHTTPSErrors: true });
  const ctx = await browser.newContext({ viewport:{width:1440,height:900}, ignoreHTTPSErrors:true });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil:'domcontentloaded' });
  await page.waitForTimeout(4000);
  // Suskaiciuoti prekiu korteles
  const productCount = await page.evaluate(() => document.querySelectorAll('ul.products li.product').length);
  const h1 = await page.evaluate(() => (document.querySelector('h1')||{}).innerText);
  const shot = await page.screenshot({ fullPage: true, type:'png' });
  commit('akcijos_desktop.png', shot.toString('base64'));
  commit('akcijos_debug.json', Buffer.from(JSON.stringify({productCount, h1}),'utf8').toString('base64'));
  await browser.close();
  console.log('done: products='+productCount);
})();
