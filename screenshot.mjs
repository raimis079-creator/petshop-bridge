import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commitB64(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ctashot',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbcs.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbcs.json "'+url+'"',{encoding:'utf8'}); }
const STAMP=process.env.STAMP||'x';
(async()=>{
  var out={};
  var url=BASE+'/kategorija/sunims/maistas-sunims/konservai-sunims/?nc='+Date.now();
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1300,height:1000}});
    const p=await c.newPage();
    var resp=await p.goto(url,{waitUntil:'domcontentloaded',timeout:25000});
    out.http=resp?resp.status():0;
    await p.waitForTimeout(3000);
    out.banner = await p.evaluate(()=>{ var b=document.querySelector('.psc-cta-banner'); return b?b.textContent.replace(/\s+/g,' ').trim().slice(0,140):'NĖRA'; });
    out.btns = await p.evaluate(()=> [].slice.call(document.querySelectorAll('.psc-cta-btn')).map(function(a){return a.textContent.trim()+' → '+a.getAttribute('href').slice(-40);}));
    // scroll banner into view for screenshot
    await p.evaluate(()=>{ var b=document.querySelector('.psc-cta-banner'); if(b) b.scrollIntoView({block:'center'}); });
    await p.waitForTimeout(600);
    const buf=await p.screenshot({fullPage:false});
    commitB64('ctabanner_'+STAMP+'.png', buf.toString('base64'));
    await b.close();
  }catch(e){ out.err=e.message.slice(0,150); }
  commitB64('ctabanner_'+STAMP+'.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out));
})();
