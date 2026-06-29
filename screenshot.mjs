import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putBin(name,buf){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:buf.toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});}

(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0',viewport:{width:1200,height:800}});
  const page=await ctx.newPage();
  for(const id of [19479,19574,19508]){
    await page.goto(`https://dev.avesa.lt/?p=${id}`,{waitUntil:'domcontentloaded',timeout:45000});
    await page.waitForTimeout(3000);
    await page.evaluate(()=>{const el=document.querySelector('.b2b-black');if(el)el.scrollIntoView({block:'center'});});
    await page.waitForTimeout(800);
    const buf=await page.screenshot({fullPage:false});
    putBin(`animonda_v2_${id}.png`,buf);
  }
  await ctx.close();
  await browser.close();
  console.log("done");
})();
