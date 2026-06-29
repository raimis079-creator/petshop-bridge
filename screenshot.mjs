import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
function putBin(name,buf){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }catch(e){}
}
function commitTxt(name,str){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb2.json',JSON.stringify(body));
  try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb2.json "'+url+'"',{encoding:'utf8'}); }catch(e){}
}
function rest(path){ try{ return JSON.parse(execSync('curl -sk -H "Authorization: '+AUTH+'" -H "Accept: application/json" "'+BASE+path+'"',{encoding:'utf8',maxBuffer:300000000})); }catch(e){ return {__e:1}; } }
async function shot(p,n,o){ try{ putBin(n, await p.screenshot(o||{fullPage:true})); }catch(e){} }
const log={steps:[]}; const S=x=>log.steps.push(x);
const URL='https://dev.avesa.lt/product/test-variable-rinkinys-6-12-15-varmnm/';
(async()=>{
  // REST readback
  const vs = rest('/wp-json/wc/v3/products/34143/variations?context=edit&per_page=20');
  log.variations = Array.isArray(vs)? vs.map(v=>({id:v.id,dydis:(v.attributes||[]).map(a=>a.option).join(','),price:v.regular_price,min:v.mnm_min_container_size,max:v.mnm_max_container_size})) : 'readfail';

  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:1200}, userAgent:'Mozilla/5.0'});
  const page=await ctx.newPage();
  try{
    await page.goto(URL+'?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(4000);
    S('loaded');
  }catch(e){ S('goto '+String(e).slice(0,60)); }
  await shot(page,'var_1_initial.png',{clip:{x:0,y:150,width:1440,height:850}});

  // find variation selector controls
  try{
    const info = await page.evaluate(()=>{
      var sels=[...document.querySelectorAll('select')].map(s=>({name:s.name, opts:[...s.options].map(o=>o.value).filter(Boolean)}));
      var btns=[...document.querySelectorAll('.variations button, .wc-mnm-variation, [data-attribute_name]')].slice(0,10).map(b=>(b.textContent||'').trim().slice(0,20));
      return {selects:sels, btnsSample:btns};
    });
    log.controls=info;
  }catch(e){ S('ctrl '+String(e).slice(0,60)); }

  // try select size 12 via select dropdown
  let picked=false;
  try{
    for(const nm of ['attribute_dydis','attribute_pa_dydis']){
      const sel=page.locator('select[name="'+nm+'"]');
      if(await sel.count()>0){ await sel.selectOption('12'); picked=true; S('selected 12 via '+nm); break; }
    }
  }catch(e){ S('select '+String(e).slice(0,60)); }
  if(!picked){
    // maybe buttons
    try{ const b=page.getByText('12',{exact:true}).first(); if(await b.count()>0){ await b.click({timeout:3000}); picked=true; S('clicked 12 btn'); } }catch(e){}
  }
  await page.waitForTimeout(4500);
  await shot(page,'var_2_size12.png',{clip:{x:0,y:150,width:1440,height:950}});
  try{
    const t = await page.evaluate(()=>document.querySelector('form.cart, .mnm_form, .wc-mnm-variable, main')?.innerText.slice(0,1400)||'');
    commitTxt('var_text.txt', t);
    log.shows_pool = /Anatra|Tacchino|Agnello|0 \/ 12|select 12|pasirink/i.test(t);
  }catch(e){}

  commitTxt('var_visual.json', JSON.stringify(log,null,1));
  await ctx.close(); await browser.close();
  console.log("DONE");
})();
