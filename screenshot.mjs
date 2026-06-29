import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putBin(name,buf){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:buf.toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});}

// Mūsų Rasco SKU → recipe ID
const RECIPES=[
  ['16431_lamb_rice','1704-10434-Rm'],
  ['16425_adult_large','1704-10334-Rm'],
  ['16422_adult_medium','1704-10324-Rm'],
  ['16411_junior_large','1704-10034-Rm'],
  ['16402_senior_large','1704-10634-Rm'],
];

(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0'});
  const page=await ctx.newPage();
  for(const [key,base] of RECIPES){
    try{
      const url=`https://rasco.pet/wp-content/uploads/2021/11/${base}.png`;
      const resp=await page.goto(url,{waitUntil:'networkidle',timeout:30000});
      if(resp&&resp.status()===200){
        const buf=await resp.body();
        putBin(`rasco_recipe_${key}.png`,buf);
        console.log(`${key}: OK size=${buf.length}`);
      }else{
        console.log(`${key}: status=${resp?resp.status():'no'}`);
      }
    }catch(e){console.log(`${key} err:`,e.message.slice(0,80));}
  }
  await ctx.close();
  await browser.close();
})();
