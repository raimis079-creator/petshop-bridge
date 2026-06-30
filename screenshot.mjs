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
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:1000}});
  const page=await ctx.newPage();
  await page.goto('https://dev.avesa.lt/shop/?product_cat=skanestu-rinkiniai&nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page.waitForTimeout(5000);
  putBin('badge_v5_skan.png', await page.screenshot({fullPage:false}));

  const page2=await ctx.newPage();
  await page2.goto('https://dev.avesa.lt/shop/?product_cat=konservu-rinkiniai&nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page2.waitForTimeout(5000);
  putBin('badge_v5_konserv.png', await page2.screenshot({fullPage:false}));

  console.log("DONE");
  await ctx.close(); await browser.close();
})();
