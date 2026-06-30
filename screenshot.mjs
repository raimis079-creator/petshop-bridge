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
const URL_PROD='https://dev.avesa.lt/product/animonda-grancarno-rinkinys-%c2%b7-6x400g/?nc='+Date.now();
const URL_CAT='https://dev.avesa.lt/kategorija/rinkiniai/konservu-rinkiniai/?nc='+Date.now();
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:1500}});
  const page=await ctx.newPage();
  // product
  await page.goto(URL_PROD,{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page.waitForTimeout(6000);
  putBin('lt_product.png', await page.screenshot({fullPage:true}));
  // category
  await page.goto(URL_CAT,{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page.waitForTimeout(4000);
  putBin('lt_category.png', await page.screenshot({fullPage:true}));
  await ctx.close();
  await browser.close();
})();
