import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commitB64(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'menushot',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbms.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbms.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  var out={};
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:1000}});
    const p=await c.newPage();
    // atidarom pagrindini puslapi ir hover ant SPRENDIMAI
    await p.goto(BASE+'/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:25000});
    await p.waitForTimeout(2500);
    // surandam SPRENDIMAI meniu punkta ir hover
    var found = await p.evaluate(()=>{
      var links = [].slice.call(document.querySelectorAll('a'));
      var el = links.find(function(a){ return a.textContent.trim().toUpperCase()==='SPRENDIMAI'; });
      if(!el) return null;
      var r = el.getBoundingClientRect();
      return {x: r.x + r.width/2, y: r.y + r.height/2};
    });
    out.sprendimai_found = !!found;
    if (found){
      await p.mouse.move(found.x, found.y);
      await p.waitForTimeout(1200);
      // surenkam dropdown punktus
      out.dropdown_items = await p.evaluate(()=>{
        var subs = [].slice.call(document.querySelectorAll('.nav-dropdown a, ul.sub-menu a, .sub-menu li a'));
        return subs.map(function(a){return a.textContent.trim();}).filter(function(t){return t.length>0;});
      });
      const buf = await p.screenshot({clip:{x:Math.max(0,found.x-350), y:0, width:750, height:520}});
      commitB64('menu_dropdown.png', buf.toString('base64'));
    }
    // patikrinam ar Isrankus puslapis atsidaro (anon, published)
    var resp = await p.goto(BASE+'/sprendimai/isrankus-augintinis/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:25000});
    out.isrankus_http = resp?resp.status():0;
    await p.waitForTimeout(2000);
    out.isrankus_h1 = await p.evaluate(()=>{ var h=document.querySelector('.psc-sol-hero-title'); return h?h.textContent.trim():'(nerasta)'; });
    out.isrankus_products = await p.evaluate(()=> document.querySelectorAll('.psc-sol-product').length);
    await b.close();
  }catch(e){ out.err=e.message.slice(0,200); }
  commitB64('menu_shot.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out));
})();
