import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ft',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbft.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbft.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  var out={};
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:1400}});
    // 1. patikra: koks filtro widget rodomas kategorijos puslapyje dabar
    const p1=await c.newPage();
    await p1.goto(BASE+'/kategorija/katems/tualetai-kraikai-semtuveliai/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:40000});
    await p1.waitForTimeout(5000);
    out.sidebar_text = await p1.evaluate(()=>{ var sb=document.querySelector('.sidebar, aside, #sidebar, .shop-sidebar'); return sb?sb.innerText.slice(0,400):'(nerasta)'; });
    await p1.close();

    // 2. klik testas su filter_tipas
    const p2=await c.newPage();
    var url = BASE+'/kategorija/katems/tualetai-kraikai-semtuveliai?yith_wcan=1&product_cat=tualetai-kraikai-semtuveliai&filter_tipas=uzdaras-namelis';
    await p2.goto(url,{waitUntil:'domcontentloaded',timeout:40000});
    await p2.waitForTimeout(5000);
    out.filter_result = await p2.evaluate(()=>{ var rc=document.querySelector('.woocommerce-result-count'); return rc?rc.textContent.trim():'(nerasta)'; });
    out.product_count_dom = await p2.evaluate(()=>document.querySelectorAll('ul.products li.product').length);
    out.first_product = await p2.evaluate(()=>{ var el=document.querySelector('ul.products li.product .woocommerce-loop-product__title, ul.products li.product h2'); return el?el.textContent.trim():''; });
    await p2.close();
    await b.close();
  }catch(e){ out.err=e.message.slice(0,150); }
  commit('final_test.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,600));
})();
