import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, obj){
  const isBuf = Buffer.isBuffer(obj);
  const b64 = isBuf ? obj.toString('base64') : Buffer.from((typeof obj==='string')?obj:JSON.stringify(obj,null,1),'utf8').toString('base64');
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){ try{ return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){ return ''; } }
  function doPut(sha){ const body={message:'res '+name,content:b64,branch:'main'}; if(sha)body.sha=sha; fs.writeFileSync('/tmp/put_'+name+'.json',JSON.stringify(body)); return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/put_'+name+'.json "'+url+'"',{encoding:'utf8'}).trim(); }
  let code=''; for(let i=0;i<5;i++){ const sha=getSha(); code=doPut(sha); if(code==='200'||code==='201') return code; execSync('sleep 2'); } return 'FAIL:'+code;
}
const out={};
// realus URL
let link='';
try{ const cat=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product_cat?slug=higienos-priemones-sunims&_fields=link"`,{encoding:'utf8',env})); link=Array.isArray(cat)&&cat[0]?cat[0].link:''; }catch(e){ out.linkerr=String(e).slice(0,60); }
out.url=link;
if(link){
  const browser=await chromium.launch();
  const page=await browser.newPage({viewport:{width:1280,height:1600}});
  await page.goto(link,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(6000);
  // DOM: filtru titles + pirmas (Tipas) filtro terminai
  out.dom = await page.evaluate(()=>{
    const r={titles:[],tipas_terms:[],product_count:null};
    document.querySelectorAll('.yith-wcan-filters .yith-wcan-filter .filter-title, .yith-wcan-filters h4').forEach(h=>r.titles.push(h.textContent.trim()));
    // pirmas filtras (Tipas) items
    const first=document.querySelector('.yith-wcan-filters .yith-wcan-filter');
    if(first){ first.querySelectorAll('.filter-items li, .filter-content li').forEach(li=>{ const t=li.textContent.replace(/\s+/g,' ').trim(); if(t)r.tipas_terms.push(t); }); }
    const pc=document.querySelectorAll('ul.products li.product, .products .product').length;
    r.product_count=pc;
    return r;
  });
  await page.screenshot({path:'/tmp/hfilter.png',fullPage:false});
  await browser.close();
  out.png_put = putResult('higiena_filter_1782119839.png', fs.readFileSync('/tmp/hfilter.png'));
}
putResult('higiena_visual_1782119839.txt', out);
