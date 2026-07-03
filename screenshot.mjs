import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commitB64(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'vv',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbvv.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbvv.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  var out={};
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    var c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:1400}});
    var url = BASE+'/kategorija/katems/tualetai-kraikai-semtuveliai/?yith_wcan=1&filter_tipas=uzdaras-namelis&query_type_tipas=or&cb='+Date.now();
    var p=await c.newPage();
    await p.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
    await p.waitForTimeout(9000); // daug laiko
    out.result = await p.evaluate(()=>{ var rc=document.querySelector('.woocommerce-result-count'); return rc?rc.textContent.trim():'(nerasta)'; });
    out.dom_count = await p.evaluate(()=>document.querySelectorAll('ul.products li.product').length);
    // produktų pavadinimai
    out.product_titles = await p.evaluate(()=>{
      var titles=[]; document.querySelectorAll('ul.products li.product h2, ul.products li.product .woocommerce-loop-product__title').forEach(function(e){ titles.push(e.textContent.trim()); });
      return titles.slice(0,8);
    });
    const buf = await p.screenshot({fullPage:false}); commitB64('verify_visual.png', buf.toString('base64'));
    await b.close();
  }catch(e){ out.err=e.message.slice(0,150); }
  commitB64('verify_visual.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,500));
})();
