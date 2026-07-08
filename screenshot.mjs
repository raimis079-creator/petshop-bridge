import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'oldshot',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){ console.log('putBin err',String(e).slice(0,80)); } }
(async()=>{
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  const ctx = await browser.newContext({ ignoreHTTPSErrors:true, viewport:{width:1280,height:1600} });
  const page = await ctx.newPage();
  await page.goto('https://petshop.lt/apie-mus', { waitUntil:'domcontentloaded', timeout:60000 });
  await page.waitForTimeout(3500);
  const buf = await page.screenshot({ fullPage:true });
  putBin('apie_mus_OLD.png', buf);
  await browser.close();
  console.log('done', buf.length);
})().catch(e=>{ console.log('ERR', String(e).slice(0,150)); });
