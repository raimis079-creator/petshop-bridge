import { execSync } from "child_process";
import fs from "fs";
function putResult(name, obj){
  const isBuf=Buffer.isBuffer(obj);
  const b64=isBuf?obj.toString('base64'):Buffer.from((typeof obj==='string')?obj:JSON.stringify(obj,null,1),'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/p_'+name+'.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/p_'+name+'.json "'+url+'"',{encoding:'utf8'}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const TS="1782155053";
const PRODS=[
 {id:18014, src:'Legacy', cat:'maistas',  url:'https://dev.avesa.lt/product/josera-nature-energetic-125-kg-begrudis-sausas-maistas-suaugusiems-aktyviems-sunims/'},
 {id:17333, src:'Legacy', cat:'higiena',  url:'https://dev.avesa.lt/product/naturalus-sampunas-jorksyro-terjerams-super-beno-york-300-ml/'},
 {id:33452, src:'ZB',     cat:'maistas',  url:'https://dev.avesa.lt/product/eukanuba-evd-dog-dermatosis-fp-formula-5kg/'},
 {id:33990, src:'ZB',     cat:'draskykle',url:'https://dev.avesa.lt/product/trixie-baza-draskykle-2-stulpai-su-guoliu-50-cm-sviesi/'},
 {id:33900, src:'ZB',     cat:'narvai',   url:'https://dev.avesa.lt/product/trixie-metalinis-narvas-xl-116x86x77-cm/'},
 {id:31874, src:'VF',     cat:'dubenelis',url:'https://dev.avesa.lt/product/dvigubas-chromuotas-dubenelis-sunims/'},
 {id:27879, src:'VF',     cat:'tualetas', url:'https://dev.avesa.lt/product/nobleza-atviras-tualetas-katems-44-5x34x18-5cm/'},
];
const out=[];
const { chromium } = await import('playwright');
const browser = await chromium.launch({ args:['--no-sandbox','--disable-setuid-sandbox'] });
const ctx = await browser.newContext({ viewport:{ width:1280, height:1500 }, ignoreHTTPSErrors:true });
const page = await ctx.newPage();
for(const p of PRODS){
  const rec={id:p.id, src:p.src, cat:p.cat, sections:[], note:''};
  try{
    await page.goto(p.url,{ waitUntil:'domcontentloaded', timeout:60000 });
    await page.waitForTimeout(2500);
    const data = await page.evaluate(()=>{
      const norm=s=>(s||'').replace(/\s+/g,' ').trim();
      // Flatsome accordion items
      let items=[...document.querySelectorAll('.accordion-item, .ux-accordion-item')];
      let res=items.map(it=>{
        const t=it.querySelector('.accordion-title, .ux-accordion-title');
        const c=it.querySelector('.accordion-inner, .accordion-content, .ux-accordion-content, .accordion-body');
        const ct=c?norm(c.innerText):'';
        return {title:norm(t?t.innerText:''), len:ct.length, sample:ct.slice(0,80)};
      });
      // fallback: woo description tab raw
      let fb='';
      if(res.length===0){
        const d=document.querySelector('.woocommerce-Tabs-panel--description, #tab-description, .product-short-description, .woocommerce-product-details__short-description');
        fb=d?norm(d.innerText).slice(0,160):'';
      }
      // badges near price (pa_* feature chips) - heuristic
      const badges=[...document.querySelectorAll('.product-badges, .feature-badges, .pa-badges, .ux-badge')].map(e=>norm(e.innerText)).filter(Boolean).slice(0,8);
      return {res, fb, badges, title:norm(document.title)};
    });
    rec.sections=data.res;
    rec.fallback=data.fb;
    rec.badges=data.badges;
    // expand all + screenshot
    try{ await page.evaluate(()=>{ document.querySelectorAll('.accordion-title, .ux-accordion-title').forEach(t=>{ try{t.click();}catch(e){} }); }); }catch(e){}
    await page.waitForTimeout(900);
    try{
      const acc=await page.$('.accordion, .ux-accordion');
      if(acc){ await acc.scrollIntoViewIfNeeded(); await page.waitForTimeout(400); const png=await acc.screenshot(); rec.png=putResult('desc_'+p.id+'_'+TS+'.png', png); }
      else { const png=await page.screenshot(); rec.png=putResult('desc_'+p.id+'_'+TS+'.png', png); rec.note='no-accordion-el'; }
    }catch(e){ rec.note='shot-err:'+e.message.slice(0,40); }
  }catch(e){ rec.note='ERR:'+e.message.slice(0,60); }
  out.push(rec);
}
await browser.close();
putResult('desc_test_'+TS+'.txt', out);
