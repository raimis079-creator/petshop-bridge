import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, obj){
  const isBuf=Buffer.isBuffer(obj);
  const b64=isBuf?obj.toString('base64'):Buffer.from((typeof obj==='string')?obj:JSON.stringify(obj,null,1),'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/p_'+name+'.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/p_'+name+'.json "'+url+'"',{encoding:'utf8'}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const TS="1782150360";
const out={};
// gauti tikra kategorijos linka
const cat=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product_cat?slug=akvariumo-zuvyciu-maistas&_fields=id,link,slug"`,{encoding:'utf8',env}));
const link=Array.isArray(cat)&&cat[0]?cat[0].link:'';
out.link=link;
const { chromium } = await import('playwright');
const browser = await chromium.launch({ args:['--no-sandbox','--disable-setuid-sandbox'] });
const ctx = await browser.newContext({ viewport:{ width:1280, height:1100 }, ignoreHTTPSErrors:true });
const page = await ctx.newPage();
await page.goto(link,{ waitUntil:'domcontentloaded', timeout:60000 });
await page.waitForTimeout(4500);
out.dom = await page.evaluate(()=>{ const rc=document.querySelector('.woocommerce-result-count'); const titles=[...document.querySelectorAll('.yith-wcan-filter-title,.widget-title')].map(e=>e.textContent.trim()); const opts=[...document.querySelectorAll('.yith-wcan-filters .term-name, .yith-wcan-filters label')].map(e=>e.textContent.trim()).filter(Boolean).slice(0,24); return {count_text:rc?rc.textContent.trim():'', has_rusis:!!document.body.innerText.match(/\u017duvies r\u016b\u0161is/), has_forma:!!document.body.innerText.match(/Pa\u0161aro forma/), has_baltymu:!!document.body.innerText.match(/Baltym\u0173 \u0161altinis/), titles, opts}; });
const png=await page.screenshot({fullPage:false});
out.png=putResult('zuvfilter2_'+TS+'.png', png);
await browser.close();
out.fin=putResult('zuvfilter2_'+TS+'.txt', out);
