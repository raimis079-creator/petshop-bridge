import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commitB64(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'rc',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbrc.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbrc.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  var out={};
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:1400}});
    const p=await c.newPage();
    await p.goto(BASE+'/kategorija/katems/tualetai-kraikai-semtuveliai/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:40000});
    await p.waitForTimeout(5000);
    // randam ir paspaudžiam "Uždaras tualetas / namelis" nuorodą
    var links = await p.$$('a');
    var clicked=false;
    for (var l of links){
      var txt = await l.textContent();
      if (txt && txt.trim() === 'Uždaras tualetas / namelis'){
        await l.click();
        clicked=true;
        break;
      }
    }
    out.clicked = clicked;
    await p.waitForTimeout(6000); // AJAX laukimas
    out.result = await p.evaluate(()=>{ var rc=document.querySelector('.woocommerce-result-count'); return rc?rc.textContent.trim():'(nerasta)'; });
    out.product_count = await p.evaluate(()=>document.querySelectorAll('ul.products li.product').length);
    out.current_url = p.url();
    out.body_snippet = await p.evaluate(()=>document.body.innerText.slice(0,400));
    const buf = await p.screenshot({fullPage:false});
    commitB64('real_click_screenshot.png', buf.toString('base64'));
    await b.close();
  }catch(e){ out.err=e.message.slice(0,150); }
  commitB64('real_click.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,500));
})();
