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
const TS="1782121445";
const out={steps:[]};
putResult('hvsent_'+TS+'.txt','START');
try{
  let url='https://dev.avesa.lt/produkto-kategorija/higienos-priemones-sunims/';
  try{ const r=JSON.parse(execSync(`curl -sk --max-time 20 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product_cat?slug=higienos-priemones-sunims&_fields=link"`,{encoding:'utf8',env})); if(Array.isArray(r)&&r[0]&&r[0].link){ url=r[0].link; } }catch(e){ out.steps.push('url_err'); }
  out.url=url;
  let chromium;
  try{ ({ chromium } = await import('playwright')); out.steps.push('pw_import_ok'); }
  catch(e){ try{ ({ chromium } = await import('playwright-core')); out.steps.push('pwcore_ok'); }catch(e2){ out.steps.push('NO_PLAYWRIGHT:'+String(e).slice(0,40)); throw e2; } }
  const browser = await chromium.launch({ args:['--no-sandbox','--disable-setuid-sandbox'] });
  out.steps.push('launched');
  const ctx = await browser.newContext({ viewport:{ width:1280, height:1700 }, ignoreHTTPSErrors:true }); const page = await ctx.newPage();
  await page.goto(url,{ waitUntil:'domcontentloaded', timeout:60000 });
  out.steps.push('goto_ok');
  await page.waitForTimeout(7000);
  const data = await page.evaluate(()=>{
    const res={titles:[],first_terms:[],all_filter_text:''};
    document.querySelectorAll('.yith-wcan-filter-title, .yith-wcan-filters .filter-title, .widget-title').forEach(e=>{ const t=e.textContent.trim(); if(t) res.titles.push(t); });
    const fc=document.querySelector('.yith-wcan-filter, .yith-wcan-filters, aside.sidebar, .sidebar');
    if(fc){ res.all_filter_text=fc.innerText.slice(0,1100); }
    const first=document.querySelector('.yith-wcan-filter');
    if(first){ first.querySelectorAll('a, label').forEach(e=>{ const t=e.textContent.replace(/\s+/g,' ').trim(); if(t&&t.length<60) res.first_terms.push(t); }); }
    res.first_terms=[...new Set(res.first_terms)].slice(0,30);
    const pc=document.querySelector('.woocommerce-result-count'); res.result_count=pc?pc.textContent.trim():'';
    return res;
  });
  out.dom=data;
  out.steps.push('evaluated');
  const png = await page.screenshot({ fullPage:false });
  out.png_put=putResult('higiena_filter_'+TS+'.png', png);
  out.steps.push('shot:'+out.png_put);
  await browser.close();
}catch(e){ out.ERROR=String(e&&e.stack?e.stack:e).slice(0,400); }
out.fin=putResult('higiena_visual_'+TS+'.txt', out);
