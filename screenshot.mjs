import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commitB64(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fbt',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbfbt.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbfbt.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  var out={tests:{}};
  var tests = {'uzdaras-namelis':23, 'kilimelis':13, 'atviras':6, 'automatinis':1, 'semtuvelis':6};
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    for (var slug in tests){
      var c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:1000},bypassCSP:true});
      var url = BASE+'/kategorija/katems/tualetai-kraikai-semtuveliai/?yith_wcan=1&filter_tipas='+slug+'&query_type_tipas=or&cb='+Date.now()+Math.random();
      var p=await c.newPage();
      try{
        await p.goto(url,{waitUntil:'domcontentloaded',timeout:40000});
        await p.waitForTimeout(4500);
        var res = await p.evaluate(()=>{ var rc=document.querySelector('.woocommerce-result-count'); return rc?rc.textContent.trim():'(nerasta)'; });
        var cnt = await p.evaluate(()=>document.querySelectorAll('ul.products li.product').length);
        out.tests[slug]={result:res, dom_count:cnt};
      }catch(e){ out.tests[slug]={err:e.message.slice(0,40)}; }
      await c.close();
    }
    // screenshot
    var c2=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:1200}});
    const p2=await c2.newPage();
    await p2.goto(BASE+'/kategorija/katems/tualetai-kraikai-semtuveliai/?yith_wcan=1&filter_tipas=uzdaras-namelis&query_type_tipas=or&cb='+Date.now(),{waitUntil:'domcontentloaded',timeout:40000});
    await p2.waitForTimeout(4500);
    const buf = await p2.screenshot({fullPage:false}); commitB64('final_bridge.png', buf.toString('base64'));
    await b.close();
  }catch(e){ out.fatal=e.message.slice(0,150); }
  commitB64('final_bridge_test.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,500));
})();
