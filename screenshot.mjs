import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function cbin(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'vu',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbvu.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbvu.json "'+url+'"',{encoding:'utf8'}); }
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'vu',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbvu2.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbvu2.json "'+url+'"',{encoding:'utf8'}); }
function exec(c){ try{ return execSync(c,{encoding:'utf8',maxBuffer:300000000,timeout:240000}); }catch(e){ return 'EXC'; } }
(async()=>{
  exec('npm i playwright@1.44.0 2>&1 | tail -1'); exec('npx playwright@1.44.0 install chromium 2>&1 | tail -1');
  let pw; try{ pw=await import('playwright'); }catch(e){ commit('vu_meta.json', JSON.stringify({pw:'no'})); return; }
  var meta={};
  try{
    const b=await pw.chromium.launch({headless:true,args:['--no-sandbox','--ignore-certificate-errors','--disable-gpu','--disable-dev-shm-usage']});
    // DESKTOP grid - mygtuku sulygiavimas
    const cd=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1400,height:1100}});
    const pd=await cd.newPage();
    await pd.goto(BASE+'/daugiau-pigiau/',{waitUntil:'domcontentloaded',timeout:50000}); await pd.waitForTimeout(3500);
    var btns = await pd.evaluate(()=>{
      return Array.from(document.querySelectorAll('.products .product-small .add-to-cart-button')).map(el=>{ var r=el.getBoundingClientRect(); return Math.round(r.top); });
    });
    meta.button_tops = btns;
    cbin('d_grid_align.png', (await pd.screenshot({clip:{x:0,y:130,width:1400,height:820}})).toString('base64'));
    await cd.close();
    // MOBILE single - turima preke (kiaules ausys #34510)
    const cm=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:390,height:844},isMobile:true,deviceScaleFactor:2});
    const pm=await cm.newPage();
    await pm.goto(BASE+'/?p=34510',{waitUntil:'domcontentloaded',timeout:50000}); await pm.waitForTimeout(3500);
    meta.single_url = pm.url();
    meta.has_sticky_el = await pm.evaluate(()=>!!document.getElementById('pscStickyAtc'));
    meta.sticky_at_top = await pm.evaluate(()=>{ var el=document.getElementById('pscStickyAtc'); return el?getComputedStyle(el).display:'no-el'; });
    await pm.evaluate(()=>window.scrollTo(0,1500)); await pm.waitForTimeout(900);
    meta.sticky_scrolled = await pm.evaluate(()=>{ var el=document.getElementById('pscStickyAtc'); return el?getComputedStyle(el).display:'no-el'; });
    cbin('m_sticky_scroll.png', (await pm.screenshot({})).toString('base64'));
    // prie footer - turi paslepti
    await pm.evaluate(()=>window.scrollTo(0, document.body.scrollHeight)); await pm.waitForTimeout(900);
    meta.sticky_at_footer = await pm.evaluate(()=>{ var el=document.getElementById('pscStickyAtc'); return el?getComputedStyle(el).display:'no-el'; });
    meta.ok=true;
    await b.close();
  }catch(e){ meta.err=e.message.slice(0,180); }
  commit('vu_meta.json', JSON.stringify(meta));
  console.log('done');
})();
