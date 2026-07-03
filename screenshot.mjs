import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'dut',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbdut.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbdut.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  var out={};
  var tests = [
    ['kampinis-tualetas', 6],
    ['uzdaras-tualetas-namelis', 23],
    ['kraiko-kilimelis', 13],
    ['tualetas-su-remeliu', 9],
    ['atviras-tualetas', 6],
    ['semtuvelis', 6],
  ];
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:900}});
    for (var t of tests){
      var slug = t[0], expected = t[1];
      var url = BASE+'/kategorija/katems/tualetai-kraikai-semtuveliai?yith_wcan=1&product_cat=tualetai-kraikai-semtuveliai&filter_tipas='+slug;
      var p = await c.newPage();
      try{
        await p.goto(url,{waitUntil:'domcontentloaded',timeout:35000});
        await p.waitForTimeout(4000);
        var result = await p.evaluate(()=>{ var rc=document.querySelector('.woocommerce-result-count'); return rc?rc.textContent.trim():'(nera result-count)'; });
        out[slug] = {expected: expected, result: result, url: url};
      }catch(e){ out[slug] = {err: e.message.slice(0,80)}; }
      await p.close();
    }
    await b.close();
  }catch(e){ out.fatal = e.message.slice(0,150); }
  commit('direct_url_test.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,800));
})();
