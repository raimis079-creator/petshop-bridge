import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putBin(name,buf){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:buf.toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});}

(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0',viewport:{width:1200,height:1100}});
  const page=await ctx.newPage();
  // 3 produktai - po vieną iš Animondos, Real Dog, Monge - su accordion
  for(const id of [19479,14276,12660]){
    await page.goto(`https://dev.avesa.lt/?p=${id}&ps_desc=1`,{waitUntil:'domcontentloaded',timeout:45000});
    await page.waitForTimeout(3500);
    // Scrollas iki pagrindinio aprašymo
    await page.evaluate(()=>{
      // Šukok pirmas accordion atrast'a
      const el=document.querySelector('.ps-desc, .ps_desc, .accordion, [class*="desc"]');
      if(el)el.scrollIntoView({block:'center'});
    });
    await page.waitForTimeout(800);
    const buf=await page.screenshot({fullPage:false});
    putBin(`acc_${id}.png`,buf);
  }
  await ctx.close();
  await browser.close();
  console.log("done");
})();
