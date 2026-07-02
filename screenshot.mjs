import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'su',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbsu.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbsu.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  var out={};
  // tikri YITH URL formatai (kaip Jautrus): speciali_mityba reikia query_type=or
  var tests = {
    'steril_kat': BASE+'/kategorija/katems/maistas-katems?yith_wcan=1&product_cat=maistas-katems&query_type_speciali_mityba=or&filter_speciali_mityba=sterilizuotiems',
    'slapimas_kat': BASE+'/kategorija/katems/maistas-katems?yith_wcan=1&product_cat=maistas-katems&query_type_speciali_mityba=or&filter_speciali_mityba=slapimo-takams',
  };
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:900}});
    for (var k in tests){
      var p=await c.newPage();
      try{
        await p.goto(tests[k],{waitUntil:'domcontentloaded',timeout:35000});
        await p.waitForTimeout(4000);
        out[k]=await p.evaluate(()=>{ var rc=document.querySelector('.woocommerce-result-count'); return rc?rc.textContent.trim():'(nėra result-count)'; });
      }catch(e){ out[k]={err:e.message.slice(0,60)}; }
      await p.close();
    }
    await b.close();
  }catch(e){ out.fatal=e.message.slice(0,150); }
  commit('steril_url.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out));
})();
