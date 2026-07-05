import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commitBin(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'shot',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbshot.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbshot.json "'+url+'"',{encoding:'utf8'}); }
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'shot',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbshot2.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbshot2.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  let pw;
  try { pw = await import('playwright'); } catch(e){
    try { pw = await import('playwright-core'); } catch(e2){ commit('shot_meta.json', JSON.stringify({err:'no playwright: '+e.message})); return; }
  }
  try {
    const browser = await pw.chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
    const ctx = await browser.newContext({ ignoreHTTPSErrors:true, viewport:{width:1300,height:1200} });
    const page = await ctx.newPage();
    await page.goto(BASE+'/daugiau-pigiau/', { waitUntil:'networkidle', timeout:45000 });
    await page.waitForTimeout(2500);
    const buf = await page.screenshot({ clip:{x:0,y:150,width:1300,height:850} });
    commitBin('dp_grid_shot.png', buf.toString('base64'));
    commit('shot_meta.json', JSON.stringify({ok:true, len:buf.length}));
    await browser.close();
  } catch(e){ commit('shot_meta.json', JSON.stringify({err:e.message.slice(0,300)})); }
  console.log('done');
})();
