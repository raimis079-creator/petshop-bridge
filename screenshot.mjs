import { execSync } from 'child_process';
import fs from 'fs';
const url = process.argv[2] || 'https://dev.avesa.lt';
const TS = String(Date.now());
function commit(name, b64){
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  const apiurl='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+apiurl+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',content:b64,branch:'main'}; if(sha)body.sha=sha;
  fs.writeFileSync('/tmp/cb.json', JSON.stringify(body));
  return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+apiurl+'"',{encoding:'utf8',maxBuffer:80000000}).trim();
}
const meta={ts:TS, url};
(async()=>{
  try{
    const pw=await import('playwright');
    const browser=await pw.chromium.launch({args:['--no-sandbox']});
    const ctx=await browser.newContext({viewport:{width:1100,height:1400}});
    const page=await ctx.newPage();
    await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
    await page.waitForTimeout(3500);
    // isskleidziu visus accordion headerius per teksta (robustiska)
    meta.expanded=await page.evaluate(()=>{
      let n=0;
      const wanted=['Sud\u0117tis','Analitin','\u0160\u0117rimo'];
      document.querySelectorAll('*').forEach(el=>{
        const t=(el.childNodes.length===1 && el.firstChild && el.firstChild.nodeType===3)?el.textContent.trim():'';
        if(t && wanted.some(w=>t.startsWith(w)) && t.length<40){ try{el.click(); n++;}catch(e){} }
      });
      return n;
    });
    await page.waitForTimeout(1200);
    meta.serTable=await page.evaluate(()=>{ for(const t of document.querySelectorAll('table')){ if(/svoris/i.test(t.innerText)) return t.innerText.replace(/\s*\n\s*/g,' | ').slice(0,500);} return 'NERA'; });
    const buf=await page.screenshot({fullPage:true, timeout:30000});
    meta.png_http=commit('festshot_'+TS+'.png', buf.toString('base64'));
    meta.png_name='festshot_'+TS+'.png';
    meta.ok=true;
    await browser.close();
  }catch(e){ meta.ok=false; meta.error=String(e&&e.stack||e).slice(0,500); }
  commit('festmeta_'+TS+'.json', Buffer.from(JSON.stringify(meta,null,2)).toString('base64'));
  console.log('DONE ok='+meta.ok+' '+TS);
})();
