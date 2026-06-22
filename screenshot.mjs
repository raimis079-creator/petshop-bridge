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
const TS="1782123702";
const out={};
const { chromium } = await import('playwright');
const browser = await chromium.launch({ args:['--no-sandbox','--disable-setuid-sandbox'] });
const ctx = await browser.newContext({ viewport:{ width:1280, height:900 }, ignoreHTTPSErrors:true });
const page = await ctx.newPage();
await page.goto('https://dev.avesa.lt/',{ waitUntil:'domcontentloaded', timeout:60000 });
await page.waitForTimeout(3500);
// istraukti AKSESUARAI stulpelio nuorodas is DOM
out.aks_links = await page.evaluate(()=>{
  // rasti antraste AKSESUARAI ir jos seserines/vaikines nuorodas
  let res=[];
  const heads=[...document.querySelectorAll('li.menu-item')].filter(li=>{ const a=li.querySelector(':scope > a'); return a && /AKSESUARAI/i.test(a.textContent.trim()) && a.textContent.trim().length<14; });
  for(const h of heads){ const sub=h.querySelector('ul'); if(sub){ res=[...sub.querySelectorAll(':scope > li > a')].map(a=>a.textContent.trim()); break; } }
  if(!res.length){ // fallback: bet kokia nuoroda su vesinant/baseinai
    res=[...document.querySelectorAll('a')].filter(a=>/v\u0117sinantys kilim|baseinai \u0161unims/i.test(a.textContent)).map(a=>a.textContent.trim()+' -> '+a.getAttribute('href'));
  }
  return res;
});
// atidaryti ŠUNIMS dropdown ir screenshot
try{
  const sunims = await page.$('li.menu-item > a:has-text("ŠUNIMS")');
  if(sunims){ await sunims.hover(); await page.waitForTimeout(1500); }
}catch(e){ out.hover_err=String(e).slice(0,60); }
const png=await page.screenshot({fullPage:false});
out.png=putResult('menuvis_'+TS+'.png', png);
await browser.close();
out.fin=putResult('menuvis_'+TS+'.txt', out);
