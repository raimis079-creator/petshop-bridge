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
const TS="1782143664";
function wp(method,p,body){ let cmd; if(body){ fs.writeFileSync('/tmp/w.json',JSON.stringify(body)); cmd=`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/w.json "https://dev.avesa.lt/wp-json/wp/v2/${p}"`; } else { cmd=`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} "https://dev.avesa.lt/wp-json/wp/v2/${p}"`; } return JSON.parse(execSync(cmd,{encoding:'utf8',env,maxBuffer:20000000})); }
const out={};
const all=wp('GET','menu-items?menus=232&per_page=100&_fields=id,title,parent,menu_order,object_id,object');
const lesalas=all.find(m=>m.object_id===90 && m.object==='product_cat');
const skan=all.find(m=>m.object_id===98 && m.object==='product_cat');
out.lesalas=lesalas?{id:lesalas.id,parent:lesalas.parent,o:lesalas.menu_order}:null;
out.skanestai=skan?{id:skan.id,parent:skan.parent,o:skan.menu_order}:null;
let mi=all.find(m=>m.object_id===666);
if(!mi && lesalas){ const ord=(skan?skan.menu_order:lesalas.menu_order)+1; mi=wp('POST','menu-items',{ title:"Aksesuarai pauk\u0161\u010diams", type:'taxonomy', object:'product_cat', object_id:666, parent:lesalas.parent, menus:232, status:'publish', menu_order:ord }); }
out.created=mi?{id:mi.id,t:mi.title&&mi.title.rendered,parent:mi.parent,o:mi.menu_order}:null;
// visual - atidaryti PAUKSCIAMS menu
const { chromium } = await import('playwright');
const browser = await chromium.launch({ args:['--no-sandbox','--disable-setuid-sandbox'] });
const ctx = await browser.newContext({ viewport:{ width:1280, height:760 }, ignoreHTTPSErrors:true });
const page = await ctx.newPage();
await page.goto('https://dev.avesa.lt/',{ waitUntil:'domcontentloaded', timeout:60000 });
await page.waitForTimeout(3000);
out.menu = await page.evaluate(()=>{ const heads=[...document.querySelectorAll('li.menu-item')].filter(li=>{ const a=li.querySelector(':scope > a'); return a && /PAUK\u0160\u010cIAMS/i.test(a.textContent.trim()) && a.textContent.trim().length<14; }); for(const h of heads){ return [...h.querySelectorAll('ul li a')].map(a=>a.textContent.trim()); } return []; });
try{ await page.evaluate(()=>{ const top=[...document.querySelectorAll('li.menu-item')].find(li=>{const a=li.querySelector(':scope>a');return a&&/^\s*PAUK\u0160\u010cIAMS\s*$/i.test(a.textContent);}); if(top){ const dd=top.querySelector('.nav-dropdown,ul.sub-menu,.mega-menu'); if(dd){ dd.style.display='block'; dd.style.opacity='1'; dd.style.visibility='visible'; } } }); await page.waitForTimeout(600); }catch(e){}
const png=await page.screenshot({fullPage:false});
out.png=putResult('pauksmenu_'+TS+'.png', png);
await browser.close();
out.fin=putResult('pauksmenu_'+TS+'.txt', out);
