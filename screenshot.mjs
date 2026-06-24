import { chromium } from "playwright";
import { execSync } from "child_process";
import fs from "fs";
function commitBin(name, buf){
  const b64=buf.toString('base64');const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}
  fs.writeFileSync('/tmp/img.b64',b64);
  const body={message:'r',branch:'main'};if(sha)body.sha=sha;
  fs.writeFileSync('/tmp/cbm.json',JSON.stringify(body).replace(/}$/,',"content":"'+b64+'"}'));
  return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cbm.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000}).trim();
}
const url="https://dev.avesa.lt/?p=25439&ps_desc=1";
const browser=await chromium.launch({args:['--no-sandbox']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1100,height:2400}});
const page=await ctx.newPage();
await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(3500);
// open all <details> so feeding section is visible
await page.evaluate(()=>{document.querySelectorAll('details').forEach(d=>d.open=true);});
await page.waitForTimeout(800);
// try to scroll the feeding section into view
const found=await page.evaluate(()=>{
  const els=[...document.querySelectorAll('.ps-desc-acc, details, summary, th')];
  const f=els.find(e=>/Am\u017eius|\u0160\u0117rimo instrukcija/.test(e.textContent||''));
  if(f){f.scrollIntoView({block:'center'});return true;}return false;
});
await page.waitForTimeout(800);
let target=await page.$('.ps-desc-acc');
const buf= target? await target.screenshot() : await page.screenshot({fullPage:false});
const code=commitBin("verify_junior.png", buf);
console.log("found_feeding="+found+" img_http="+code+" bytes="+buf.length);
await browser.close();
