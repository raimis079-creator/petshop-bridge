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
const TS="1782151519";
const out={};
function gj(u){ return JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${u}"`,{encoding:'utf8',env,maxBuffer:20000000})); }
const c91=gj('https://dev.avesa.lt/wp-json/wp/v2/product_cat?slug=daugiau-pigiau&_fields=id,link,slug');
out.dp_link=Array.isArray(c91)&&c91[0]?c91[0].link:'(nera)';
const { chromium } = await import('playwright');
const browser = await chromium.launch({ args:['--no-sandbox','--disable-setuid-sandbox'] });
const ctx = await browser.newContext({ viewport:{ width:1280, height:850 }, ignoreHTTPSErrors:true });
const page = await ctx.newPage();
// DAUGIAU=PIGIAU
if(out.dp_link && out.dp_link!=='(nera)'){
  await page.goto(out.dp_link,{ waitUntil:'domcontentloaded', timeout:60000 });
  await page.waitForTimeout(3500);
  out.dp_dom = await page.evaluate(()=>{ const rc=document.querySelector('.woocommerce-result-count'); const noprod=!!document.querySelector('.woocommerce-info, .woocommerce-no-products-found'); const prods=document.querySelectorAll('ul.products li.product, .product-small').length; return {count_text:rc?rc.textContent.trim():'', noprod, prod_tiles:prods}; });
  out.dp_png=putResult('dp_empty_'+TS+'.png', await page.screenshot({fullPage:false}));
}
// zuvu maistas 94
await page.goto('https://dev.avesa.lt/kategorija/zuvims/akvariumo-zuvyciu-maistas/',{ waitUntil:'domcontentloaded', timeout:60000 });
await page.waitForTimeout(3500);
out.zuv94 = await page.evaluate(()=>{ const rc=document.querySelector('.woocommerce-result-count'); return {count_text:rc?rc.textContent.trim():'', has_rusis:!!document.body.innerText.match(/\u017duvies r\u016b\u0161is/), has_forma:!!document.body.innerText.match(/Pa\u0161aro forma/)}; });
await browser.close();
out.fin=putResult('dp_verify_'+TS+'.txt', out);
