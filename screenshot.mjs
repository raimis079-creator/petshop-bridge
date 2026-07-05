import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function cbin(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'s2',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbs2.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbs2.json "'+url+'"',{encoding:'utf8'}); }
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'s2',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbs22.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbs22.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  try {
    execSync('npm i playwright-core@1.44.0 2>&1 | tail -2', {stdio:'pipe', timeout:120000});
    execSync('PLAYWRIGHT_BROWSERS_PATH=0 npx --yes playwright-core@1.44.0 install chromium 2>&1 | tail -3', {stdio:'pipe', timeout:180000});
  } catch(e){ commit('shot2_meta.json', JSON.stringify({install_err:e.message.slice(0,200)})); }
  let pw;
  try { pw = await import('playwright-core'); } catch(e){ commit('shot2_meta.json', JSON.stringify({import_err:e.message.slice(0,200)})); return; }
  try {
    const browser = await pw.chromium.launch({ headless:true, args:['--no-sandbox','--ignore-certificate-errors','--disable-gpu'] });
    const ctx = await browser.newContext({ ignoreHTTPSErrors:true, viewport:{width:1300,height:1100} });
    const page = await ctx.newPage();
    await page.goto(BASE+'/daugiau-pigiau/', { waitUntil:'domcontentloaded', timeout:45000 });
    await page.waitForTimeout(3500);
    const buf = await page.screenshot({ clip:{x:0,y:120,width:1300,height:880} });
    cbin('dp_grid_shot.png', buf.toString('base64'));
    commit('shot2_meta.json', JSON.stringify({ok:true, len:buf.length}));
    await browser.close();
  } catch(e){ commit('shot2_meta.json', JSON.stringify({run_err:e.message.slice(0,250)})); }
  console.log('done');
})();
