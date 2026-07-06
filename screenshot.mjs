import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function cbin(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'sb',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbsb.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbsb.json "'+url+'"',{encoding:'utf8'}); }
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'sb',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbsb2.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbsb2.json "'+url+'"',{encoding:'utf8'}); }
function exec(c){ try{ return execSync(c,{encoding:'utf8',timeout:240000}); }catch(e){ return 'ERR'; } }
(async()=>{
  exec('npm i playwright@1.44.0 2>&1 | tail -1');
  exec('npx playwright@1.44.0 install chromium 2>&1 | tail -1');
  let pw; try { pw = await import('playwright'); } catch(e){ commit('sb_meta.json', JSON.stringify({err:'no pw'})); return; }
  var meta={};
  try {
    const browser = await pw.chromium.launch({ headless:true, args:['--no-sandbox','--ignore-certificate-errors','--disable-gpu','--disable-dev-shm-usage'] });
    const ctx = await browser.newContext({ ignoreHTTPSErrors:true, viewport:{width:1400,height:1200} });
    const page = await ctx.newPage();
    // GRID
    await page.goto(BASE+'/daugiau-pigiau/', { waitUntil:'domcontentloaded', timeout:50000 });
    await page.waitForTimeout(4000);
    var g = await page.screenshot({ fullPage:true });
    cbin('rc_grid.png', g.toString('base64'));
    // pirmas produkto linkas (Miamor)
    var href = await page.evaluate(()=>{ var a=document.querySelector('.product-small a[href*="/product/"]'); return a?a.href:null; });
    meta.single_url = href;
    if(href){
      await page.goto(href, { waitUntil:'domcontentloaded', timeout:50000 });
      await page.waitForTimeout(4000);
      var s = await page.screenshot({ clip:{x:0,y:0,width:1400,height:1000} });
      cbin('rc_single.png', s.toString('base64'));
      // dydis galerijos nuotraukos
      var dims = await page.evaluate(()=>{ var img=document.querySelector('.woocommerce-product-gallery img'); return img?{w:img.naturalWidth,h:img.naturalHeight,dw:img.width,dh:img.height,src:img.currentSrc}:null; });
      meta.single_img = dims;
    }
    await browser.close();
    meta.ok=true;
  } catch(e){ meta.err=e.message.slice(0,200); }
  commit('sb_meta.json', JSON.stringify(meta));
  console.log('done');
})();
