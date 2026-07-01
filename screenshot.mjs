import { execSync } from "child_process"; import fs from "fs";
const BASE="https://dev.avesa.lt";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commitB64(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'shot',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1300,height:720}});
    const p=await c.newPage();
    await p.goto(BASE+'/?p=34207',{waitUntil:'domcontentloaded'});
    await p.waitForTimeout(4500);
    const buf=await p.screenshot({fullPage:false});
    commitB64('final_1782928819.png', buf.toString('base64'));
    await b.close(); console.log('shot bytes='+buf.length);
  }catch(e){ console.log('shot EXC:'+e.message); }
})();
