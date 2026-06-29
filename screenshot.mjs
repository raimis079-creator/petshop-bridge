import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putBin(name,buf){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:buf.toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});}

(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0',viewport:{width:1400,height:900}});
  const page=await ctx.newPage();
  // Surask visus produktus su jų pakuotės nuotraukomis (back side gali rodyti šerimo lenteles)
  // Vienas pavyzdys: Adult Sensitive Lamb&Rice
  const urls=[
    {sku:'89004',u:'https://www.realdog.lt/89004-real-dog-adult-sensitive-lambrice-15-kg'},
    {sku:'01110',u:'https://www.realdog.lt/01110-real-dog-adult-sensitive-with-duck-vegetables-15-kg'},
    {sku:'702700',u:'https://www.realdog.lt/702700-real-dog-food-for-adult-dogs-with-poultry-20-kg'},
    {sku:'695097',u:'https://www.realdog.lt/695097-real-dog-small-breeds-10-kg'}
  ];
  const results={};
  for(const {sku,u} of urls){
    try{
      await page.goto(u,{waitUntil:'domcontentloaded',timeout:45000});
      await page.waitForTimeout(2000);
      // Surask visas nuotraukas
      const imgs=await page.evaluate(()=>{
        const arr=Array.from(document.querySelectorAll('img'));
        return arr.map(img=>img.src).filter(src=>src.includes('uploads')||src.includes('thumbs'));
      });
      results[sku]={imgs};
    }catch(e){results[sku]={err:String(e).slice(0,100)};}
  }
  // Commit results
  const body=Buffer.from(JSON.stringify(results,null,1),'utf8');
  putBin('real_imgs.json',body);
  await ctx.close();
  await browser.close();
  console.log("done");
})();
