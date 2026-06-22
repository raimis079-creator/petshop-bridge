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
const TS="1782123110";
const out={};
function gj(u){ return JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${u}"`,{encoding:'utf8',env,maxBuffer:20000000})); }
// produktu sarasai per wc/v3 (patikima)
out.vk_products=gj('https://dev.avesa.lt/wp-json/wc/v3/products?category=654&per_page=20&status=any&_fields=id,name,status').map(p=>p.id+' ['+p.status+'] '+p.name.slice(0,40));
out.bs_products=gj('https://dev.avesa.lt/wp-json/wc/v3/products?category=655&per_page=20&status=any&_fields=id,name,status').map(p=>p.id+' ['+p.status+'] '+p.name.slice(0,40));
out.higiena_review=gj('https://dev.avesa.lt/wp-json/wc/v3/products?category=82&per_page=100&status=any&_fields=id,name').filter(p=>/tepal|\u012ftvar|alaptid|\u017eaizd/i.test(p.name)).map(p=>p.id+' '+p.name.slice(0,40));
// URL + screenshot abieju
const links=gj('https://dev.avesa.lt/wp-json/wp/v2/product_cat?include=654,655&_fields=id,link');
const lm={}; links.forEach(l=>lm[l.id]=l.link);
out.urls=lm;
const { chromium } = await import('playwright');
const browser = await chromium.launch({ args:['--no-sandbox','--disable-setuid-sandbox'] });
const ctx = await browser.newContext({ viewport:{ width:1280, height:1300 }, ignoreHTTPSErrors:true });
for(const [cid,nm] of [[654,'vk'],[655,'bs']]){
  try{
    const page = await ctx.newPage();
    await page.goto(lm[cid]||('https://dev.avesa.lt/?p='+cid),{ waitUntil:'domcontentloaded', timeout:60000 });
    await page.waitForTimeout(4000);
    const d = await page.evaluate(()=>{ const h1=document.querySelector('h1,.page-title'); const rc=document.querySelector('.woocommerce-result-count'); const prods=[...document.querySelectorAll('.product-title, li.product h2, .woocommerce-loop-product__title')].map(e=>e.textContent.trim()).slice(0,12); return {title:h1?h1.textContent.trim():'',count:rc?rc.textContent.trim():'',prods}; });
    out[nm+'_dom']=d;
    const png=await page.screenshot({fullPage:false});
    out[nm+'_png']=putResult('newcat_'+nm+'_'+TS+'.png', png);
    await page.close();
  }catch(e){ out[nm+'_err']=String(e).slice(0,120); }
}
await browser.close();
out.fin=putResult('newcat_'+TS+'.txt', out);
