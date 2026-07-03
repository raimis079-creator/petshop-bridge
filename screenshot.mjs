import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'tct2',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbtct2.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbtct2.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  var out={};
  var base_path = BASE+'/kategorija/katems/tualetai-kraikai-semtuveliai';
  var tipai = ['uzdaras-namelis','kilimelis','su-remeliu'];
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:900}});
    for (var slug of tipai){
      var url = base_path+'?yith_wcan=1&product_cat=tualetai-kraikai-semtuveliai&filter_tipas='+slug;
      var p=await c.newPage();
      var ok=false;
      for(var i=0;i<2&&!ok;i++){
        try{
          await p.goto(url,{waitUntil:'domcontentloaded',timeout:40000});
          await p.waitForTimeout(4500);
          out[slug]=await p.evaluate(()=>{ var rc=document.querySelector('.woocommerce-result-count'); return rc?rc.textContent.trim():'(nerasta)'; });
          ok=true;
        }catch(e){ out[slug]={err:e.message.slice(0,50)}; await p.waitForTimeout(4000); }
      }
      await p.close();
    }
    await b.close();
  }catch(e){ out.fatal=e.message.slice(0,150); }
  commit('tipas_click_test2.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out));
})();
