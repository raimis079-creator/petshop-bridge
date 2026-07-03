import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fct',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbfct.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbfct.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  var out={};
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1300,height:1200}});
    const p=await c.newPage();
    var catUrl = BASE+'/kategorija/katems/tualetai-kraikai-semtuveliai/';
    await p.goto(catUrl+'?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:35000});
    await p.waitForTimeout(4000);
    // ieškom "Tipas" filtro widget'o DOM'e
    out.filter_titles = await p.evaluate(()=>{
      var titles = document.querySelectorAll('.yith-wcan-filters h5, .yith-wcan-filters .yith-wcan-filter-title, .widget_yith_wcan_filter h3, .widget-title');
      return [].slice.call(titles).map(function(t){return t.textContent.trim();});
    });
    out.tipas_options = await p.evaluate(()=>{
      var links = document.querySelectorAll('a[href*="filter_tipas"]');
      return [].slice.call(links).slice(0,15).map(function(a){return a.textContent.trim()+' :: '+a.href.split('filter_tipas=')[1];});
    });
    await b.close();
  }catch(e){ out.err = e.message.slice(0,200); }

  // klik-testas su konkrečiu tipu
  if (out.tipas_options && out.tipas_options.length > 0) {
    var slug = out.tipas_options[0].split('::')[1].trim();
    var testUrl = BASE+'/kategorija/katems/tualetai-kraikai-semtuveliai?yith_wcan=1&product_cat=tualetai-kraikai-semtuveliai&filter_tipas='+slug;
    try{
      const { chromium } = await import('playwright');
      const b2=await chromium.launch({args:['--no-sandbox']});
      const c2=await b2.newContext({ignoreHTTPSErrors:true,viewport:{width:1300,height:1200}});
      const p2=await c2.newPage();
      await p2.goto(testUrl,{waitUntil:'domcontentloaded',timeout:35000});
      await p2.waitForTimeout(4000);
      out.click_test_url = testUrl;
      out.click_test_result = await p2.evaluate(()=>{ var rc=document.querySelector('.woocommerce-result-count'); return rc?rc.textContent.trim():'(nerasta)'; });
      const buf = await p2.screenshot({fullPage:true});
      commit('tualetai_filter_test.png', buf.toString('base64'));
      await b2.close();
    }catch(e){ out.click_err = e.message.slice(0,150); }
  }

  commit('final_click_test.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,600));
})();
