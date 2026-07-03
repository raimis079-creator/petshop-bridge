import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'t107',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbt107.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbt107.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  var out={};
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:1400}});
    // kat 107 - ar ten išvis rodomas Tipas blokas ir ar veikia
    const p=await c.newPage();
    await p.goto(BASE+'/kategorija/katems/kraikai-kaciu-tualetams/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:40000});
    await p.waitForTimeout(5000);
    out.sidebar_107 = await p.evaluate(()=>{ var sb=document.querySelector('.sidebar, aside, #sidebar'); return sb?sb.innerText.slice(0,400):'(nerasta)'; });
    await b.close();
  }catch(e){ out.err=e.message.slice(0,150); }
  commit('test_107.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,400));
})();
