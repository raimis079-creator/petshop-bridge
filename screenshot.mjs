import { execSync } from "child_process";
import fs from "fs";
function putBinary(name, buf){
  const tok=process.env.GH_TOKEN, repo=process.env.GH_REPO;
  const b64=buf.toString('base64');
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){let j='{"message":"r","branch":"main","content":"'+b64+'"'+(sha?',"sha":"'+sha+'"':'')+'}';fs.writeFileSync('/tmp/pp.json',j);return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/pp.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const env={...process.env, WP_PASS_CLEAN:(process.env.WP_APP_PASS||'').replace(/\s+/g,'')};
const { chromium } = await import('playwright');
const TS=String(Date.now());
const browser=await chromium.launch({args:['--ignore-certificate-errors']});
for(const id of [12461, 14478]){ // Puppy Medium + Adult SM Lamb
  const p=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products/${id}?_fields=permalink"`,{encoding:'utf8',env,maxBuffer:20000000}));
  const url=p.permalink+(p.permalink.includes('?')?'&':'?')+'ps_desc=1&ps_desc_open=all';
  const ctx=await browser.newContext({viewport:{width:1280,height:1600}, ignoreHTTPSErrors:true});
  const page=await ctx.newPage();
  await page.goto(url, {waitUntil:'domcontentloaded', timeout:60000});
  await page.waitForTimeout(3500);
  try{ await page.locator('.ps-desc-acc').first().scrollIntoViewIfNeeded({timeout:5000}); }catch(e){}
  await page.waitForTimeout(1200);
  let buf;
  try{ buf=await page.locator('.ps-desc-acc').first().screenshot({timeout:8000}); }catch(e){ buf=await page.screenshot({fullPage:false}); }
  putBinary('eukfinal_'+id+'_'+TS+'.png', buf);
  await ctx.close();
}
console.log('done');
await browser.close();
