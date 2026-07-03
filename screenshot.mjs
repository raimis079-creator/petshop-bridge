import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'tbf',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbtbf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbtbf.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  var out={};
  var url = BASE+'/kategorija/katems/tualetai-kraikai-semtuveliai?yith_wcan=1&product_cat=tualetai-kraikai-semtuveliai&filter_tipas=uzdaras-namelis';
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:900}});
    const p=await c.newPage();
    await p.goto(url,{waitUntil:'domcontentloaded',timeout:40000});
    await p.waitForTimeout(5000);
    out.full_text = await p.evaluate(()=>document.body.innerText.slice(0,1500));
    out.product_count_dom = await p.evaluate(()=>document.querySelectorAll('ul.products li.product').length);
    const buf = await p.screenshot({fullPage:false});
    commit('tipas_screenshot.png', buf.toString('base64'));
    await b.close();
  }catch(e){ out.err=e.message.slice(0,150); }
  commit('tipas_body_full.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log('done, product_count_dom:', out.product_count_dom);
})();
