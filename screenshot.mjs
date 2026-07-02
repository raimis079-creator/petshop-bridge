import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'slr',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbslr.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbslr.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  var out={};
  var url = BASE+'/kategorija/katems/maistas-katems?yith_wcan=1&product_cat=maistas-katems&query_type_speciali_mityba=or&filter_speciali_mityba=slapimo-takams';
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:900}});
    const p=await c.newPage();
    var ok=false;
    for (var i=0;i<3 && !ok;i++){
      try{ await p.goto(url,{waitUntil:'domcontentloaded',timeout:40000}); await p.waitForTimeout(4000);
        out.slapimas_kat=await p.evaluate(()=>{ var rc=document.querySelector('.woocommerce-result-count'); return rc?rc.textContent.trim():''; }); ok=true;
      }catch(e){ out.err=(out.err||'')+' | '+e.message.slice(0,40); await p.waitForTimeout(6000); }
    }
    await b.close();
  }catch(e){ out.fatal=e.message.slice(0,150); }
  commit('slapimas_retry.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out));
})();
