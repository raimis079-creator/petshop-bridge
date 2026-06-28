import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const env = { ...process.env };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0',viewport:{width:1920,height:1080}});
  const page=await ctx.newPage();
  const out={};
  try{
    const r=await page.goto('https://www.monge.it/en/products/',{waitUntil:'networkidle',timeout:60000});
    await page.waitForTimeout(8000);
    // Bandysim klikteleti i filtrus "Cane" / "Gatto" - gali naujus produktus iskviesti
    try{
      await page.evaluate(()=>{
        // Klikam filter "Animale" su raktažodziu Dog
        document.querySelectorAll('input[type="checkbox"], button, [role="checkbox"]').forEach(el=>{
          const t=(el.innerText||el.value||el.getAttribute('aria-label')||'').toLowerCase();
          if(t.includes('cane')||t.includes('dog')||t.includes('gatto')||t.includes('cat')){
            try{el.click();}catch(e){}
          }
        });
      });
      await page.waitForTimeout(5000);
    }catch(e){}
    // Scroll heavy
    for(let i=0;i<60;i++){
      await page.evaluate(()=>window.scrollBy(0,500));
      await page.waitForTimeout(300);
    }
    // Bandysim "Load more" mygtuka
    try{
      for(let i=0;i<20;i++){
        const clicked=await page.evaluate(()=>{
          const btns=Array.from(document.querySelectorAll('button, a, [role="button"]'));
          for(const b of btns){
            const t=(b.innerText||'').toLowerCase();
            if(t.includes('load more')||t.includes('show more')||t.includes('mostra')||t.includes('carica')){
              try{b.click();return true;}catch(e){}
            }
          }
          return false;
        });
        if(!clicked) break;
        await page.waitForTimeout(2000);
        for(let j=0;j<10;j++){await page.evaluate(()=>window.scrollBy(0,500));await page.waitForTimeout(200);}
      }
    }catch(e){}
    const products=await page.evaluate(()=>{
      return [...new Set(Array.from(document.querySelectorAll('a[href]')).map(a=>a.href).filter(h=>/monge\.it\/en\/product\//.test(h)&&!h.includes('product-line')&&!h.includes('products/')&&!h.endsWith('/products/')))];
    });
    out.products=products;
    out.count=products.length;
    out.status=r?r.status():'?';
  }catch(e){out.err=String(e).slice(0,200);}
  await ctx.close();
  await browser.close();
  commit('monge_all_products.json',JSON.stringify(out,null,1));
  console.log("DONE",out.count||0);
})();
