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
const TS="1782156843";
function cs(method,p,body){ fs.writeFileSync('/tmp/c.json',JSON.stringify(body)); return JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/c.json "https://dev.avesa.lt/wp-json/code-snippets/v1/${p}"`,{encoding:'utf8',env,maxBuffer:20000000})); }
function wc(p){ return JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/${p}"`,{encoding:'utf8',env,maxBuffer:20000000})); }
const out={};
let php=fs.readFileSync('modules/descproto.php','utf8').replace(/^\uFEFF?<\?php\s*/,'');
const r=cs('PUT','snippets/512',{name:'Petshop Aprasymu Accordion PROTO v4 (test ps_desc)',scope:'global',active:true,code:php});
out.snippet={id:r.id,active:r.active};
execSync('sleep 2');
const PRODS=[ {id:13869,n:'Monge maistas'},{id:33394,n:'Farmina maistas'},{id:18014,n:'Josera (Legacy)'},{id:27879,n:'Nobleza tualetas (VF)'} ];
const { chromium } = await import('playwright');
const browser = await chromium.launch({ args:['--no-sandbox','--disable-setuid-sandbox'] });
const ctx = await browser.newContext({ viewport:{ width:1180, height:1700 }, ignoreHTTPSErrors:true });
const page = await ctx.newPage();
out.tests=[];
for(const p of PRODS){
  const rec={id:p.id,n:p.n};
  try{
    const wd=wc('products/'+p.id+'?_fields=permalink'); const link=wd.permalink+'?ps_desc=1';
    await page.goto(link,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(2500);
    try{ const tl=await page.$('li.description_tab a, a[href="#tab-description"]'); if(tl){ await tl.click(); await page.waitForTimeout(700);} }catch(e){}
    const d=await page.evaluate(()=>{ const a=document.querySelector('.ps-desc-acc'); const t=document.querySelector('#tab-description'); const txt=t?t.innerText:''; return {titles:a?[...document.querySelectorAll('.ps-desc-acc summary')].map(s=>s.textContent.trim()):'FALLBACK', stray_tags:/<\/?(p|strong|span|em|div)>|&nbsp;|&lt;/i.test(txt)}; });
    rec.titles=d.titles; rec.stray_tags=d.stray_tags;
    const el=await page.$('#tab-description');
    if(el){ await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(400); rec.png=putResult('proto4_'+p.id+'_'+TS+'.png', await el.screenshot()); }
  }catch(e){ rec.err=e.message.slice(0,80); }
  out.tests.push(rec);
}
await browser.close();
putResult('proto4_test_'+TS+'.txt', out);
