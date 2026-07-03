import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'rgc',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbrgc.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbrgc.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  var out={};
  // seniau veikęs formatas kategorijai 107
  var url = 'https://dev.avesa.lt/kategorija/katems/kraikai-kaciu-tualetams?yith_wcan=1&product_cat=kraikai-kaciu-tualetams&filter_kraiko_tipas=tofu';
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:900}});
    const p=await c.newPage();
    await p.goto(url,{waitUntil:'domcontentloaded',timeout:40000});
    await p.waitForTimeout(5000);
    out.kraiko_tipas_result = await p.evaluate(()=>{ var rc=document.querySelector('.woocommerce-result-count'); return rc?rc.textContent.trim():'(nerasta)'; });
    await b.close();
  }catch(e){ out.err=e.message.slice(0,150); }
  commit('regression_check.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out));
})();
