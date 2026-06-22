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
const TS="1782139784";
function wc(method,p,body){ let cmd; if(body){ fs.writeFileSync('/tmp/b.json',JSON.stringify(body)); cmd=`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/b.json "https://dev.avesa.lt/wp-json/wc/v3/${p}"`; } else { cmd=`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} "https://dev.avesa.lt/wp-json/wc/v3/${p}"`; } return JSON.parse(execSync(cmd,{encoding:'utf8',env,maxBuffer:20000000})); }
const out={};
// 1) nustatyti display=subcategories ant 87
const r=wc('PUT','products/categories/87',{ display:'subcategories' });
out.cat87={id:r.id,display:r.display};
// subkategoriju tvarka: nustatyti menu_order (Pasaras, Skanestai, Narvai, Kraikas)
const order=[[88,1],[97,2],[304,3],[657,4]];
out.order=[];
for(const [id,o] of order){ try{ const u=wc('PUT','products/categories/'+id,{ menu_order:o }); out.order.push(id+':'+u.menu_order); }catch(e){ out.order.push(id+':err'); } }
// 2) screenshot grauzikams puslapio
const { chromium } = await import('playwright');
const browser = await chromium.launch({ args:['--no-sandbox','--disable-setuid-sandbox'] });
const ctx = await browser.newContext({ viewport:{ width:1280, height:1100 }, ignoreHTTPSErrors:true });
const page = await ctx.newPage();
await page.goto('https://dev.avesa.lt/kategorija/grauzikams/',{ waitUntil:'domcontentloaded', timeout:60000 });
await page.waitForTimeout(5000);
out.dom = await page.evaluate(()=>{
  const subcats=[...document.querySelectorAll('.product-category .woocommerce-loop-category__title, li.product-category h2, .category-title')].map(e=>e.textContent.replace(/\(\d+\)/,'').trim()).filter(Boolean);
  const filters=[...document.querySelectorAll('.yith-wcan-filter-title, .widget-title')].map(e=>e.textContent.trim());
  const prods=document.querySelectorAll('li.product:not(.product-category)').length;
  return {subcats, filters, product_count_on_page:prods};
});
const png=await page.screenshot({fullPage:false});
out.png=putResult('grauzparent_'+TS+'.png', png);
await browser.close();
out.fin=putResult('grauzparent_'+TS+'.txt', out);
