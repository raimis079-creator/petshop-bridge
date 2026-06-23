import { execSync } from "child_process";
import fs from "fs";
function putBinary(name, buf){
  const b64=buf.toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  fs.writeFileSync('/tmp/b64.txt', b64);
  function doPut(sha){const body={message:'r',branch:'main'};if(sha)body.sha=sha;
    let j='{"message":"r","branch":"main","content":"'+b64+'"'+(sha?',"sha":"'+sha+'"':'')+'}';
    fs.writeFileSync('/tmp/pp.json',j);
    return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/pp.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const { chromium } = await import('playwright');
const TS=String(Date.now());
const url="https://dev.avesa.lt/product/ambrosia-begrudis-su-eriena-ir-sviezia-lasisa-sausas-maistas-sunims-grain-free-lamb-fresh-salmon-12-kg/?ps_desc=1";

const browser=await chromium.launch({args:['--ignore-certificate-errors']});
// DESKTOP
const ctx=await browser.newContext({viewport:{width:1280,height:1000}, ignoreHTTPSErrors:true});
const page=await ctx.newPage();
await page.goto(url, {waitUntil:'domcontentloaded', timeout:60000});
await page.waitForTimeout(3500);
// scroll iki accordion
try{ await page.locator('.ps-desc-acc').first().scrollIntoViewIfNeeded({timeout:5000}); }catch(e){}
await page.waitForTimeout(1000);
// screenshot tik aprasymo zonos jei randu, kitaip full
let buf;
try{
  const el=await page.locator('.ps-desc-acc').first();
  buf=await el.screenshot({timeout:8000});
}catch(e){
  buf=await page.screenshot({fullPage:false});
}
putBinary('amb19751_desktop_'+TS+'.png', buf);
console.log('desktop done');
await browser.close();
