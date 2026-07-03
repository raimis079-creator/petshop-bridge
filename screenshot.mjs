import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'erh',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cberh.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cberh.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  var out={};
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:1400}});
    const p=await c.newPage();
    await p.goto(BASE+'/kategorija/katems/tualetai-kraikai-semtuveliai/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:40000});
    await p.waitForTimeout(5000);
    out.checkbox_hrefs = await p.evaluate(()=>{
      var links = document.querySelectorAll('a[href*="filter_tipas"], a[href*="Tipas"], .yith-wcan-filters a, .widget_layered_nav a');
      var found = [];
      links.forEach(function(l){ if(l.href && (l.href.includes('tipas')||l.textContent.includes('tualetas')||l.textContent.includes('Kilim')||l.textContent.includes('Semtuv'))) found.push({text:l.textContent.trim(), href:l.href}); });
      return found.slice(0,15);
    });
    // taip pat pažiūrim visus href su "filter_" apskritai (gal kitoks param name)
    out.all_filter_hrefs = await p.evaluate(()=>{
      var links = document.querySelectorAll('a[href*="filter_"]');
      var found=[];
      links.forEach(function(l){ found.push(l.href); });
      return [...new Set(found)].slice(0,20);
    });
    await b.close();
  }catch(e){ out.err=e.message.slice(0,150); }
  commit('extract_href.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,800));
})();
