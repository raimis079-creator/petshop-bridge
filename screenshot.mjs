import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commitB64(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'chapply',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cba.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cba.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var out={};
  var r=exec('curl -sk "'+BASE+'/?psc_chewbuild=1&k=ps2026&confirm=TAIP"');
  var m=r.match(/(\{.*\})/s); try{ out.apply=JSON.parse(m[0]); }catch(e){ out.raw=r.slice(0,300); }
  // deaktyvuojam probe
  exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var pid = out.apply ? out.apply.parent_id : 0;
  if(pid){
    // publish
    fs.writeFileSync('/tmp/pub.json', JSON.stringify({status:'publish'}));
    exec('curl -sk -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/pub.json "'+BASE+'/wp-json/wp/v2/product/'+pid+'"');
    var link=exec('curl -sk -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/wp/v2/product/'+pid+'"');
    var url=BASE+'/?p='+pid; try{ var j=JSON.parse(link); if(j.link) url=j.link; }catch(e){}
    out.url=url;
    try{
      const { chromium } = await import('playwright');
      const b=await chromium.launch({args:['--no-sandbox']});
      const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1300,height:950}});
      const p=await c.newPage();
      await p.goto(url,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(4500);
      out.sections = await p.evaluate(()=> [].slice.call(document.querySelectorAll('.psc-section .psc-label')).map(function(l){return l.textContent.trim();}));
      out.groups = await p.evaluate(()=> [].slice.call(document.querySelectorAll('.psc-group-row .psc-group-btn')).map(function(b){return b.textContent.trim();}));
      out.sizes = await p.evaluate(()=> [].slice.call(document.querySelectorAll('.psc-size-row .psc-size-btn')).map(function(b){return b.textContent.replace(/\s+/g,' ').trim();}));
      out.gram_hidden = await p.evaluate(()=>{ var rows=[].slice.call(document.querySelectorAll('.psc-section')); var gr=rows.find(function(s){return s.querySelector('.psc-gram-row');}); return gr?getComputedStyle(gr).display:'nėra'; });
      const buf=await p.screenshot({fullPage:false});
      commitB64('chewshot_1782985569.png', buf.toString('base64'));
      await b.close();
    }catch(e){ out.shot_err=e.message; }
  }
  commitB64('chapply_1782985569.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out));
})();
