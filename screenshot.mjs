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
  let code=''; for(let i=0;i<6;i++){ const sha=getSha(); code=doPut(sha); if(code==='200'||code==='201') return code; execSync('sleep 3'); } return 'FAIL:'+code;
}
const out={};
let link='';
try{ const cat=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product_cat?slug=higienos-priemones-sunims&_fields=link"`,{encoding:'utf8',env})); link=Array.isArray(cat)&&cat[0]?cat[0].link:''; }catch(e){ out.linkerr=String(e).slice(0,60); }
out.url=link;
if(link){
  const browser=await chromium.launch();
  const page=await browser.newPage({viewport:{width:1280,height:1600}});
  await page.goto(link,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(6000);
  out.dom = await page.evaluate(()=>{
    const r={titles:[],tipas_terms:[],brand_terms_n:null,product_count:null};
    document.querySelectorAll('.yith-wcan-filters .yith-wcan-filter').forEach((f,idx)=>{
      const t=f.querySelector('.filter-title, h4'); if(t)r.titles.push(t.textContent.trim());
      if(idx===0){ f.querySelectorAll('.filter-items li, .filter-content li').forEach(li=>{ const x=li.textContent.replace(/\s+/g,' ').trim(); if(x)r.tipas_terms.push(x); }); }
    });
    r.product_count=document.querySelectorAll('ul.products li.product, .products li.product').length;
    return r;
  });
  await page.screenshot({path:'/tmp/hfilter.png',fullPage:false});
  await browser.close();
}
// TEKSTAS PIRMA (mazas, patikimas)
out.txt_put = putResult('higiena_visual_1782120133.txt', out);
