import { execSync } from 'child_process';
import fs from 'fs';
const url = process.argv[2];
function commit(name,b64){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const u='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+u+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'r',content:b64,branch:'main'};if(sha)b.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(b));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -d @/tmp/cb.json "'+u+'"',{encoding:'utf8',maxBuffer:80000000}).trim();}
const meta={url};
(async()=>{
  try{
    const pw=await import('playwright');
    const browser=await pw.chromium.launch({args:['--no-sandbox']});
    const ctx=await browser.newContext({viewport:{width:1100,height:1500},ignoreHTTPSErrors:true});
    const page=await ctx.newPage();
    await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
    await page.waitForTimeout(3500);
    // Aprasymo sekcija atidaryta by default (first). Nuskaitau jos auksti
    meta.aprasymas_h = await page.evaluate(()=>{ const d=document.querySelector('.ps-desc-acc details'); return d? d.getBoundingClientRect().height : -1; });
    const buf=await page.screenshot({fullPage:true,timeout:30000});
    meta.png=commit('verify_apr.png',buf.toString('base64'));
    meta.ok=true; await browser.close();
  }catch(e){meta.ok=false;meta.error=String(e&&e.stack||e).slice(0,300);}
  commit('verify_apr_meta.json',Buffer.from(JSON.stringify(meta,null,2)).toString('base64'));
  console.log('DONE ok='+meta.ok);
})();
