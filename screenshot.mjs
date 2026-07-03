import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'kl',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbkl.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbkl.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:30000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var out={};
  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"publish"}\' "'+BASE+'/wp-json/wp/v2/pages/34262"');
  await new Promise(r=>setTimeout(r,1200));
  var url = BASE+'/sprendimai/kraiko-pasirinkimas/';
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:1000}});
    const p=await c.newPage();
    await p.goto(url+'?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:25000});
    await p.waitForTimeout(3000);
    out.card_pos = await p.evaluate(()=>{
      return [].slice.call(document.querySelectorAll('.psc-sol-krypt-grid-3 .psc-sol-krypt')).map(function(c){
        var r=c.getBoundingClientRect(); var t=c.querySelector('.psc-sol-krypt-title');
        return {title:t?t.textContent.trim().slice(0,18):'', top:Math.round(r.top), left:Math.round(r.left)};
      });
    });
    // footnote stilius - ar pilkas fonas, ne žalias
    out.footnote_bg = await p.evaluate(()=>{ var f=document.querySelector('.psc-sol-footnote'); return f?getComputedStyle(f).backgroundColor:''; });
    out.footnote_text = await p.evaluate(()=>{ var f=document.querySelector('.psc-sol-footnote'); return f?f.textContent.trim().slice(0,80):''; });
    await b.close();
  }catch(e){ out.err=e.message.slice(0,150); }
  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"draft"}\' "'+BASE+'/wp-json/wp/v2/pages/34262"');
  commit('kraiko_layout.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out));
})();
