import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'rb',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbrb.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbrb.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  var out={};
  var url = BASE+'/kategorija/sunims/maistas-sunims?yith_wcan=1&product_cat=maistas-sunims&filter_be_grudu=be-grudu';
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:900}});
    const p=await c.newPage();
    var ok=false;
    for (var attempt=0; attempt<2 && !ok; attempt++){
      try{
        await p.goto(url,{waitUntil:'domcontentloaded',timeout:40000});
        await p.waitForTimeout(4000);
        out.begrudu_sun = await p.evaluate(()=>{ var rc=document.querySelector('.woocommerce-result-count'); return rc?rc.textContent.trim():''; });
        ok=true;
      }catch(e){ out.attempt_err=(out.attempt_err||'')+' | '+e.message.slice(0,50); await p.waitForTimeout(5000); }
    }
    await b.close();
  }catch(e){ out.fatal=e.message.slice(0,150); }
  commit('retry_begrudu.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out));
})();
