import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ku',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbku.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbku.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  var out={};
  // kraiko kategorija: kraikai-kaciu-tualetams. Bet reikia rasti pilną kelią (parent KATĖMS).
  // YITH formatas su pa_kraiko_tipas. Bandom kelis kelio variantus.
  var base_paths = [
    BASE+'/kategorija/katems/kraikai-kaciu-tualetams',
    BASE+'/kategorija/kraikai-kaciu-tualetams'
  ];
  var tipai = ['tofu','bentonitinis','medzio','augalinis','silikoninis'];
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:900}});
    // pirma nustatom teisingą kelią (baseline be filtro)
    var goodPath=null;
    for (var bp of base_paths){
      var p=await c.newPage();
      try{ var code=await p.goto(bp+'/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:30000});
        if(code && code.status()<400){ goodPath=bp; out.base_status=code.status(); }
      }catch(e){}
      await p.close();
      if(goodPath) break;
    }
    out.good_path=goodPath;
    if(goodPath){
      // testuojam kiekvieną tipą
      for (var t of tipai){
        var url=goodPath+'?yith_wcan=1&product_cat=kraikai-kaciu-tualetams&filter_kraiko_tipas='+t;
        var p=await c.newPage();
        try{ await p.goto(url,{waitUntil:'domcontentloaded',timeout:35000}); await p.waitForTimeout(4000);
          out[t]=await p.evaluate(()=>{ var rc=document.querySelector('.woocommerce-result-count'); return rc?rc.textContent.trim():''; });
        }catch(e){ out[t]={err:e.message.slice(0,40)}; }
        await p.close();
      }
    }
    await b.close();
  }catch(e){ out.fatal=e.message.slice(0,150); }
  commit('kraikas_url.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,400));
})();
