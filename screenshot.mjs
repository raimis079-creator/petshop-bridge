import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commitB64(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'vis',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbvis.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbvis.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var out={};
  // gaunam permalink
  var r=exec('curl -sk -m 20 "'+BASE+'/wp-json/wc/v3/products/17920" -H "Authorization: '+AUTH+'"');
  var permalink=BASE+'/product/kampinis-tualetas-katems-shuttle/';
  try{ var pj=JSON.parse(r); permalink=pj.permalink; out.type=pj.type; out.nvar=(pj.variations||[]).length; out.price=pj.price; out.price_html=(pj.price_html||'').replace(/<[^>]+>/g,'').slice(0,40); }catch(e){ out.api_err=r.slice(0,100); }
  out.permalink=permalink;
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    // PRODUKTO PUSLAPIS desktop
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:1400}});
    const p=await c.newPage();
    await p.goto(permalink+'?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:30000});
    await p.waitForTimeout(3500);
    // ar yra spalvų pasirinkimas (swatch ar dropdown)
    out.swatches = await p.evaluate(()=>{
      var swatch = document.querySelectorAll('.swatch, .ux-swatch, [class*="swatch"], .variable-items-wrapper li, ul.variable-items li');
      var select = document.querySelector('select#pa_spalva, select[name*="spalva"], .variations select');
      return {
        swatch_count: swatch.length,
        swatch_classes: [].slice.call(swatch).slice(0,4).map(function(s){return s.className;}),
        has_select: !!select,
        select_options: select ? [].slice.call(select.options).map(function(o){return o.textContent.trim();}) : []
      };
    });
    const buf=await p.screenshot({fullPage:false}); commitB64('variacija_produktas.png', buf.toString('base64'));
    await b.close();
  }catch(e){ out.err=e.message.slice(0,150); }
  commitB64('vis.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,400));
})();
