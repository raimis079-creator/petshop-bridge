import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'gn',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbgn.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbgn.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:30000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var out={};
  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"publish"}\' "'+BASE+'/wp-json/wp/v2/pages/34258"');
  await new Promise(r=>setTimeout(r,1200));
  var url = BASE+'/sprendimai/naujas-suniukas/';
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:1000}});
    const p=await c.newPage();
    await p.goto(url+'?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:30000});
    await p.waitForTimeout(3500);
    out.grid_products = await p.evaluate(()=>{
      var grids=document.querySelectorAll('.psc-sol-grid');
      return [].slice.call(grids).map(function(g){
        var names=[].slice.call(g.querySelectorAll('.psc-sol-product .name, .psc-sol-product h3, .psc-sol-product a')).map(function(e){return e.textContent.trim();}).filter(function(x){return x.length>3;});
        return names.slice(0,4);
      });
    });
    // grid-3 kortelės pozicijos (patikra 3+3)
    out.card_rows = await p.evaluate(()=>{
      var tops=[].slice.call(document.querySelectorAll('.psc-sol-krypt-grid-3 .psc-sol-krypt')).map(function(c){return Math.round(c.getBoundingClientRect().top);});
      return tops;
    });
    await b.close();
  }catch(e){ out.err=e.message.slice(0,150); }
  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"draft"}\' "'+BASE+'/wp-json/wp/v2/pages/34258"');
  commit('grid_names.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,400));
})();
