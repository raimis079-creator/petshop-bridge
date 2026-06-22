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
const TS="1782136833";
const out={};
out.cat657=JSON.parse(execSync(`curl -sk --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products?category=657&per_page=10&status=any&_fields=id,name"`,{encoding:'utf8',env})).map(p=>p.id+' '+p.name.slice(0,46));
const { chromium } = await import('playwright');
const browser = await chromium.launch({ args:['--no-sandbox','--disable-setuid-sandbox'] });
const ctx = await browser.newContext({ viewport:{ width:1280, height:760 }, ignoreHTTPSErrors:true });
const page = await ctx.newPage();
await page.goto('https://dev.avesa.lt/',{ waitUntil:'domcontentloaded', timeout:60000 });
await page.waitForTimeout(3000);
out.grauz_menu = await page.evaluate(()=>{ let res=[]; const heads=[...document.querySelectorAll('li.menu-item')].filter(li=>{ const a=li.querySelector(':scope > a'); return a && /GRAU\u017dIKAMS/i.test(a.textContent.trim()) && a.textContent.trim().length<14; }); for(const h of heads){ const subs=h.querySelectorAll('ul li a'); res=[...subs].map(a=>a.textContent.trim()); break; } return res; });
try{ await page.evaluate(()=>{ const top=[...document.querySelectorAll('li.menu-item')].find(li=>{const a=li.querySelector(':scope>a');return a&&/^\s*GRAU\u017dIKAMS\s*$/i.test(a.textContent);}); if(top){ top.classList.add('current-dropdown'); const dd=top.querySelector('.nav-dropdown,ul.sub-menu,.mega-menu'); if(dd){ dd.style.display='block'; dd.style.opacity='1'; dd.style.visibility='visible'; } } }); await page.waitForTimeout(700); }catch(e){}
const png=await page.screenshot({fullPage:false});
out.png=putResult('grfin_'+TS+'.png', png);
await browser.close();
out.fin=putResult('grfin_'+TS+'.txt', out);
