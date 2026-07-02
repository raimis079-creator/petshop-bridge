import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commitB64(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'tbverify',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbv.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbv.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+e.message; } }
const PID=34228;
(async()=>{
  var out={};
  // publish
  fs.writeFileSync('/tmp/pub.json', JSON.stringify({status:'publish'}));
  out.pub=exec('curl -sk -o /dev/null -w "%{http_code}" -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/pub.json "'+BASE+'/wp-json/wp/v2/product/'+PID+'"');
  var link=exec('curl -sk -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/wp/v2/product/'+PID+'"');
  var url=BASE+'/?p='+PID; try{ var j=JSON.parse(link); if(j.link) url=j.link; }catch(e){}
  out.url=url;
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1300,height:900}});
    const p=await c.newPage();
    await p.goto(url,{waitUntil:'domcontentloaded'});
    await p.waitForTimeout(4500);
    out.sections = await p.evaluate(()=> [].slice.call(document.querySelectorAll('.psc-section .psc-label')).map(function(l){return l.textContent.trim();}));
    out.sizes = await p.evaluate(()=> [].slice.call(document.querySelectorAll('.psc-size-row .psc-size-btn')).map(function(b){return b.textContent.replace(/\s+/g,' ').trim();}));
    out.gram_visible = await p.evaluate(()=>{ var rows=[].slice.call(document.querySelectorAll('.psc-section')); var gr=rows.find(function(s){return s.querySelector('.psc-gram-row');}); return gr?getComputedStyle(gr).display:'nėra-el'; });
    out.title = await p.evaluate(()=>{ var h=document.querySelector('.product_title,h1'); return h?h.textContent.trim():''; });
    const buf=await p.screenshot({fullPage:false});
    commitB64('treatshot2_1782979894.png', buf.toString('base64'));
    await b.close();
  }catch(e){ out.shot_err=e.message; }
  // revert to draft
  fs.writeFileSync('/tmp/drf.json', JSON.stringify({status:'draft'}));
  out.revert=exec('curl -sk -o /dev/null -w "%{http_code}" -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/drf.json "'+BASE+'/wp-json/wp/v2/product/'+PID+'"');
  commitB64('tbverify_1782979894.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out));
})();
