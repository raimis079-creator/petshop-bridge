import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'iw',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbiw.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbiw.json "'+url+'"',{encoding:'utf8'}); }
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
    // Ieškom bet ko su "filter" ar "wcan" klasėje/id
    out.filter_related = await p.evaluate(()=>{
      var els = document.querySelectorAll('[class*="filter"], [class*="wcan"], [id*="filter"], [id*="wcan"]');
      var seen = {};
      var result = [];
      for (var i=0;i<els.length && result.length<40;i++){
        var e = els[i];
        var key = e.tagName+'.'+e.className;
        if(seen[key]) continue;
        seen[key]=1;
        result.push({tag:e.tagName, cls:(e.className||'').toString().slice(0,80), text:e.textContent.trim().slice(0,40)});
      }
      return result;
    });
    // Sidebar turinys - visos h3/h4/h5 antraštės
    out.headings = await p.evaluate(()=> [].slice.call(document.querySelectorAll('.sidebar h3,.sidebar h4,.sidebar h5,aside h3,aside h4,aside h5')).map(function(h){return h.textContent.trim();}));
    await b.close();
  }catch(e){ out.err = e.message.slice(0,200); }
  commit('inspect_widgets.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,800));
})();
