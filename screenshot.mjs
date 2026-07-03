import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commitB64(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'sc',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbsc.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbsc.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var out={};
  // Skirtingi tipai: dubenėlis 20064 (dvigubas), semtuvėlis 640183 (Benna), guolis 20105 (Duck Pillow)
  var skus = ['20064','640183','20105'];
  var pids = {};
  for (var sku of skus){
    var r = exec('curl -sk -m 20 "'+BASE+'/wp-json/wc/v3/products?sku='+sku+'" -H "Authorization: '+AUTH+'"');
    try{ var arr=JSON.parse(r); if(arr.length){ pids[sku]=arr[0].id; } }catch(e){ out['err_'+sku]=r.slice(0,100); }
  }
  out.pids = pids;
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:1300}});
    for (var sku of skus){
      if (!pids[sku]) continue;
      const p=await c.newPage();
      await p.goto(BASE+'/?p='+pids[sku]+'&nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:30000});
      await p.waitForTimeout(3500);
      out['swatch_'+sku] = await p.evaluate(()=> [].slice.call(document.querySelectorAll('.psc-swatch')).map(function(s){return {name:s.getAttribute('data-name'),bg:s.style.background,oos:s.classList.contains('psc-oos')};}));
      const buf = await p.screenshot({fullPage:false});
      commitB64('spot_'+sku+'.png', buf.toString('base64'));
      await p.close();
    }
    await b.close();
  }catch(e){ out.err=e.message.slice(0,150); }
  commitB64('spot_check.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,500));
})();
