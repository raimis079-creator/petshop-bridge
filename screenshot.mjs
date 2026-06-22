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
const TS="1782140054";
const out={};
// deploy kontekstas v13 i snippet 332
let php=fs.readFileSync('modules/kontekstas_v13.txt','utf8').replace(/^\uFEFF?<\?php\s*/,'');
function cs(method,p,body){ let cmd; if(body){ fs.writeFileSync('/tmp/c.json',JSON.stringify(body)); cmd=`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/c.json "https://dev.avesa.lt/wp-json/code-snippets/v1/${p}"`; } else { cmd=`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} "https://dev.avesa.lt/wp-json/code-snippets/v1/${p}"`; } return JSON.parse(execSync(cmd,{encoding:'utf8',env,maxBuffer:20000000})); }
const r=cs('PUT','snippets/332',{ name:'Petshop Filtru Kontekstas v13 [VISADA AKTYVUS]', scope:'global', active:true, code:php });
out.snippet={id:r.id,active:r.active,name:r.name};
// visual grauzikams po fix
const { chromium } = await import('playwright');
const browser = await chromium.launch({ args:['--no-sandbox','--disable-setuid-sandbox'] });
const ctx = await browser.newContext({ viewport:{ width:1280, height:900 }, ignoreHTTPSErrors:true });
const page = await ctx.newPage();
await page.goto('https://dev.avesa.lt/kategorija/grauzikams/',{ waitUntil:'domcontentloaded', timeout:60000 });
await page.waitForTimeout(4500);
out.dom = await page.evaluate(()=>{ const filters=[...document.querySelectorAll('.yith-wcan-filter-title, .widget-title')].map(e=>e.textContent.trim()); const subcats=[...document.querySelectorAll('li.product-category h2, .woocommerce-loop-category__title')].map(e=>e.textContent.replace(/\d+/g,'').trim()).filter(Boolean); return {filters, subcats, has_baltymu: !!document.body.innerText.match(/Baltym\u0173 \u0161altinis/)}; });
const png=await page.screenshot({fullPage:false});
out.png=putResult('grfix2_'+TS+'.png', png);
await browser.close();
out.fin=putResult('grfix2_'+TS+'.txt', out);
