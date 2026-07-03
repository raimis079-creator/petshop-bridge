import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'wc',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbwc.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbwc.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  var out={};
  var url = BASE+'/kategorija/katems/tualetai-kraikai-semtuveliai/';
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:1400}});
    const p=await c.newPage();
    await p.goto(url,{waitUntil:'domcontentloaded',timeout:40000});
    await p.waitForTimeout(5000);
    // ieškom filtro blokų antraščių (paprastai h4/h5/.filter-title ar panašiai)
    out.filter_titles = await p.evaluate(()=>{
      var sels = ['.yith-wcan-filter .filter-title','.yith-wcan .widget-title','.filter-block-title','h5.yith-wcan-title','.wcan-filter-title'];
      var found=[];
      sels.forEach(function(s){ document.querySelectorAll(s).forEach(function(e){ found.push(e.textContent.trim()); }); });
      // fallback: visi elementai su klase turinčia "wcan" arba "filter"
      if(found.length===0){
        document.querySelectorAll('[class*="wcan"], [id*="wcan"]').forEach(function(e){
          if(e.children.length<3 && e.textContent.trim().length<50 && e.textContent.trim().length>0) found.push(e.tagName+':'+e.className+' = '+e.textContent.trim());
        });
      }
      return found.slice(0,30);
    });
    out.sidebar_text = await p.evaluate(()=>{
      var sb = document.querySelector('.sidebar, aside, #sidebar, .shop-sidebar');
      return sb ? sb.innerText.slice(0,800) : '(sidebar nerastas)';
    });
    const buf = await p.screenshot({fullPage:true});
    commit('widget_screenshot.png', buf.toString('base64'));
    await b.close();
  }catch(e){ out.err=e.message.slice(0,150); }
  commit('widget_check.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log('done');
})();
