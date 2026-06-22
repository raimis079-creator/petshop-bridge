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
const TS="1782124728";
const out={};
// produktai cat 656
try{ out.cat656=JSON.parse(execSync(`curl -sk --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products?category=656&per_page=10&status=any&_fields=id,name"`,{encoding:'utf8',env})).map(p=>p.id+' '+p.name.slice(0,42)); }catch(e){ out.cat656='err'; }
const { chromium } = await import('playwright');
const browser = await chromium.launch({ args:['--no-sandbox','--disable-setuid-sandbox'] });
const ctx = await browser.newContext({ viewport:{ width:1280, height:760 }, ignoreHTTPSErrors:true });
const page = await ctx.newPage();
await page.goto('https://dev.avesa.lt/',{ waitUntil:'domcontentloaded', timeout:60000 });
await page.waitForTimeout(3000);
out.prieziura_links = await page.evaluate(()=>{ let res=[]; const heads=[...document.querySelectorAll('li.menu-item')].filter(li=>{ const a=li.querySelector(':scope > a'); return a && /PRIEŽIŪRA IR SVEIKATA/i.test(a.textContent.trim()); }); for(const h of heads){ const sub=h.querySelector('ul'); if(sub){ res=[...sub.querySelectorAll(':scope > li > a')].map(a=>a.textContent.trim()); break; } } return res; });
try{ await page.evaluate(()=>{ const top=[...document.querySelectorAll('li.menu-item')].find(li=>{const a=li.querySelector(':scope>a');return a&&/^\s*ŠUNIMS\s*$/i.test(a.textContent);}); if(top){ top.classList.add('current-dropdown'); const dd=top.querySelector('.nav-dropdown,ul.sub-menu,.mega-menu'); if(dd){ dd.style.display='block'; dd.style.opacity='1'; dd.style.visibility='visible'; } } }); await page.waitForTimeout(700); }catch(e){}
const png=await page.screenshot({fullPage:false});
out.png=putResult('faver_'+TS+'.png', png);
await browser.close();
out.fin=putResult('faver_'+TS+'.txt', out);
