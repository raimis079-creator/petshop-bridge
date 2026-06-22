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
const TS="1782155291";
function wc(p){ return JSON.parse(execSync(`curl -sk --max-time 45 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/${p}"`,{encoding:'utf8',env,maxBuffer:80000000})); }
const out={};
// 1) 7 prekiu petshop_desc_* meta
const DESCKEYS=['petshop_desc_main','petshop_desc_composition','petshop_desc_additives','petshop_desc_feeding','petshop_desc_usage','petshop_desc_warnings','petshop_desc_materials','petshop_desc_origin','petshop_desc_components'];
out.meta={};
for(const id of [18014,17333,33452,33990,33900,31874,27879]){
  const p=wc('products/'+id+'?_fields=id,meta_data,short_description');
  const m={}; (p.meta_data||[]).forEach(x=>{ m[x.key]=x.value; });
  const present=DESCKEYS.filter(k=>m[k]!==undefined && (''+m[k]).trim().length>0).map(k=>k.replace('petshop_desc_','')+':'+(''+m[k]).length);
  out.meta[id]={desc_fields:present.length?present:'NONE', short:(p.short_description||'').replace(/<[^>]+>/g,'').slice(0,40)};
}
// 2) padengimas: kiek prekiu turi petshop_desc_composition (sample 200)
let withComp=0, withAny=0, total=0;
for(let page=1; page<=2; page++){
  const ps=wc('products?status=publish&per_page=100&page='+page+'&_fields=id,meta_data');
  if(!Array.isArray(ps)||ps.length===0)break;
  for(const p of ps){ total++; const m={}; (p.meta_data||[]).forEach(x=>{m[x.key]=x.value;});
    if(m['petshop_desc_composition'] && (''+m['petshop_desc_composition']).trim()) withComp++;
    if(DESCKEYS.some(k=>m[k] && (''+m[k]).trim())) withAny++;
  }
}
out.coverage={sample:total, with_composition:withComp, with_any_desc_field:withAny};
// 3) tikras markup: 18014 (maistas) + 27879 (tualetas)
const { chromium } = await import('playwright');
const browser = await chromium.launch({ args:['--no-sandbox','--disable-setuid-sandbox'] });
const ctx = await browser.newContext({ viewport:{ width:1280, height:1600 }, ignoreHTTPSErrors:true });
const page = await ctx.newPage();
out.markup={};
for(const [id,url] of [[18014,'https://dev.avesa.lt/product/josera-nature-energetic-125-kg-begrudis-sausas-maistas-suaugusiems-aktyviems-sunims/'],[27879,'https://dev.avesa.lt/product/nobleza-atviras-tualetas-katems-44-5x34x18-5cm/']]){
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(2800);
  const info=await page.evaluate(()=>{
    const norm=s=>(s||'').replace(/\s+/g,' ').trim();
    // rasti elementa su tekstu "Sudetis" arba "Komponentai" arba "Serimo"
    const words=['Sud\u0117tis','Komponentai','\u0160\u0117rimo','Analitin','Priedai','Pagaminta'];
    let found=null;
    const all=[...document.querySelectorAll('h1,h2,h3,h4,h5,a,button,.accordion-title,div,span,strong')];
    for(const el of all){ const t=norm(el.textContent); if(t.length<30 && words.some(w=>t===w||t.startsWith(w))){ found=el; break; } }
    let chain=''; let mk='';
    if(found){
      let e=found; for(let i=0;i<5 && e;i++){ chain+= (e.tagName.toLowerCase()+'.'+([...e.classList].join('.')||'-'))+' > '; e=e.parentElement; }
      // wrapperio outerHTML
      let w=found; for(let i=0;i<4 && w.parentElement;i++) w=w.parentElement;
      mk=w.outerHTML.replace(/\s+/g,' ').slice(0,900);
    }
    // ar yra .accordion
    const accs=['.accordion','.ux-accordion','.tabbed-content','.woocommerce-tabs'].map(s=>s+':'+document.querySelectorAll(s).length);
    return {found:!!found, chain, mk, accs, hasSudetis:/Sud\u0117tis/.test(document.body.innerText), hasKomp:/Komponentai/.test(document.body.innerText)};
  });
  out.markup[id]=info;
  // screenshot description zona
  try{
    const sel = await page.evaluate(()=>{ const el=[...document.querySelectorAll('*')].find(e=>/Sud\u0117tis|Komponentai/.test(e.textContent||'') && e.children.length>2 && e.textContent.length<4000); if(el){el.setAttribute('data-shot','1');return true;} return false; });
    if(sel){ const el=await page.$('[data-shot="1"]'); await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(500); out['png_'+id]=putResult('descmk_'+id+'_'+TS+'.png', await el.screenshot()); }
    else { await page.evaluate(()=>window.scrollTo(0,1400)); await page.waitForTimeout(500); out['png_'+id]=putResult('descmk_'+id+'_'+TS+'.png', await page.screenshot()); }
  }catch(e){ out['png_'+id]='shot-err'; }
}
await browser.close();
putResult('descdiag_'+TS+'.txt', out);
