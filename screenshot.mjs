import { execSync } from "child_process"; import fs from "fs";
const BASE="https://dev.avesa.lt";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commitB64(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'measure',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  var out={};
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1300,height:720}});
    const p=await c.newPage();
    await p.goto(BASE+'/?p=34207',{waitUntil:'domcontentloaded'});
    await p.waitForTimeout(4000);
    out = await p.evaluate(()=>{
      function info(sel){
        var el=document.querySelector(sel); if(!el) return null;
        var cs=getComputedStyle(el);
        var kids=[].slice.call(document.querySelectorAll(sel+' .psc-btn')).map(function(btn){
          var b=btn.getBoundingClientRect(); var s=getComputedStyle(btn);
          return {w:Math.round(b.width), flex:s.flex, display:s.display, minW:s.minWidth, maxW:s.maxWidth, txt:btn.textContent.trim().slice(0,16)};
        });
        return {row_display:cs.display, row_width:Math.round(el.getBoundingClientRect().width), row_flexwrap:cs.flexWrap, buttons:kids};
      }
      return { group: info('.psc-group-row'), gram: info('.psc-gram-row') };
    });
    await b.close();
  }catch(e){ out={err:e.message}; }
  commitB64('measure_1782930862.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out));
})();
