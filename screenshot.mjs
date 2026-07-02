import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commitB64(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'tbapply',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cba.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cba.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  // APPLY (probe #557 dar turi TBUILD kodą)
  var r=exec('curl -sk "'+BASE+'/?psc_tbuild=1&k=ps2026&confirm=TAIP"');
  var m=r.match(/(\{.*\})/s); var out=m?JSON.parse(m[0]):{raw:r.slice(0,300)};
  commitB64('tbapply_1782979894.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out));
  var pidNum = out.parent_id;
  if(pidNum){
    try{
      const { chromium } = await import('playwright');
      const b=await chromium.launch({args:['--no-sandbox']});
      const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1300,height:900}});
      const p=await c.newPage();
      // draft — kraunam per preview su p=ID
      await p.goto(BASE+'/?p='+pidNum+'&preview=true',{waitUntil:'domcontentloaded'});
      await p.waitForTimeout(4500);
      out.sections = await p.evaluate(()=> [].slice.call(document.querySelectorAll('.psc-section .psc-label')).map(function(l){return l.textContent.trim();}));
      out.sizes = await p.evaluate(()=> [].slice.call(document.querySelectorAll('.psc-size-row .psc-size-btn')).map(function(b){return b.textContent.replace(/\s+/g,' ').trim();}));
      out.gram_visible = await p.evaluate(()=>{ var g=document.querySelector('.psc-section'); var rows=[].slice.call(document.querySelectorAll('.psc-section')); var gr=rows.find(function(s){return s.querySelector('.psc-gram-row');}); if(!gr) return 'nėra'; return getComputedStyle(gr).display; });
      const buf=await p.screenshot({fullPage:false});
      commitB64('treatshot_1782979894.png', buf.toString('base64'));
      await b.close();
      commitB64('tbapply_1782979894.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
      console.log('shot done; sections='+JSON.stringify(out.sections)+' sizes='+JSON.stringify(out.sizes)+' gram='+out.gram_visible);
    }catch(e){ console.log('shot EXC:'+e.message); }
  }
})();
