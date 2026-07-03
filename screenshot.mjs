import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commitB64(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'tvf',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbtvf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbtvf.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  var out={};
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:1400}});
    // 1. patikra ar filtro blokas rodomas
    const p1=await c.newPage();
    await p1.goto(BASE+'/kategorija/katems/tualetai-kraikai-semtuveliai/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:40000});
    await p1.waitForTimeout(5000);
    out.sidebar = await p1.evaluate(()=>{ var sb=document.querySelector('.sidebar, aside, #sidebar'); return sb?sb.innerText.slice(0,300):'(nerasta)'; });
    // paspaudžiam Uždaras
    var links = await p1.$$('a');
    for (var l of links){ var txt=await l.textContent(); if(txt && txt.trim()==='Uždaras tualetas / namelis'){ await l.click(); break; } }
    await p1.waitForTimeout(6000);
    out.result = await p1.evaluate(()=>{ var rc=document.querySelector('.woocommerce-result-count'); return rc?rc.textContent.trim():'(nerasta)'; });
    out.product_count = await p1.evaluate(()=>document.querySelectorAll('ul.products li.product').length);
    const buf = await p1.screenshot({fullPage:false}); commitB64('v19_filter_result.png', buf.toString('base64'));
    await b.close();
  }catch(e){ out.err=e.message.slice(0,150); }
  commitB64('test_v19.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,400));
})();
