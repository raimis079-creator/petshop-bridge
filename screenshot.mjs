import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function cbin(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'s3',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbs3.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbs3.json "'+url+'"',{encoding:'utf8'}); }
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'s3',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbs32.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbs32.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  let log='';
  try { log += execSync('npm i playwright@1.44.0 2>&1 | tail -1', {encoding:'utf8', timeout:150000}); } catch(e){ log+='npm-err '; }
  try { log += execSync('npx playwright@1.44.0 install chromium 2>&1 | tail -2', {encoding:'utf8', timeout:240000}); } catch(e){ log+='inst-err '+e.message.slice(0,80); }
  let pw;
  try { pw = await import('playwright'); } catch(e){ commit('shot3_meta.json', JSON.stringify({import_err:e.message.slice(0,150), log:log.slice(0,300)})); return; }
  try {
    const browser = await pw.chromium.launch({ headless:true, args:['--no-sandbox','--ignore-certificate-errors','--disable-gpu','--disable-dev-shm-usage'] });
    const ctx = await browser.newContext({ ignoreHTTPSErrors:true, viewport:{width:1300,height:1100} });
    const page = await ctx.newPage();
    await page.goto(BASE+'/daugiau-pigiau/', { waitUntil:'domcontentloaded', timeout:50000 });
    await page.waitForTimeout(4000);
    const buf = await page.screenshot({ fullPage:false, clip:{x:0,y:120,width:1300,height:900} });
    cbin('dp_grid_shot.png', buf.toString('base64'));
    commit('shot3_meta.json', JSON.stringify({ok:true, len:buf.length}));
    await browser.close();
  } catch(e){ commit('shot3_meta.json', JSON.stringify({run_err:e.message.slice(0,200), log:log.slice(0,200)})); }
  console.log('done');
})();
