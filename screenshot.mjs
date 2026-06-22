import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, obj){
  const isBuf=Buffer.isBuffer(obj);
  const b64=isBuf?obj.toString('base64'):Buffer.from((typeof obj==='string')?obj:JSON.stringify(obj,null,1),'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/p.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/p.json "'+url+'"',{encoding:'utf8'}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const TS="1782123372";
const out={};
let url='https://dev.avesa.lt/kategorija/sunims/vesinantys-kilimeliai-sunims/';
try{ const r=JSON.parse(execSync(`curl -sk --max-time 20 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product_cat?slug=vesinantys-kilimeliai-sunims&_fields=link"`,{encoding:'utf8',env})); if(Array.isArray(r)&&r[0]&&r[0].link) url=r[0].link; }catch(e){}
out.url=url;
const { chromium } = await import('playwright');
const browser = await chromium.launch({ args:['--no-sandbox','--disable-setuid-sandbox'] });
const ctx = await browser.newContext({ viewport:{ width:1280, height:1250 }, ignoreHTTPSErrors:true });
const page = await ctx.newPage();
await page.goto(url,{ waitUntil:'domcontentloaded', timeout:60000 });
await page.waitForTimeout(5000);
out.dom = await page.evaluate(()=>{ const h1=document.querySelector('h1,.page-title'); const rc=document.querySelector('.woocommerce-result-count'); const prods=[...document.querySelectorAll('.product-title, .woocommerce-loop-product__title')].map(e=>e.textContent.trim()).slice(0,12); return {title:h1?h1.textContent.trim():'',count:rc?rc.textContent.trim():'',prods}; });
const png=await page.screenshot({fullPage:false});
out.png=putResult('vkcat_'+TS+'.png', png);
await browser.close();
out.fin=putResult('vkcat_'+TS+'.txt', out);
