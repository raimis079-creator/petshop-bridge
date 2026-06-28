import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const env = { ...process.env };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
function putBin(name,buf){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:buf.toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  // IT puslapis veikia: /it/eshop-cat/alimenti-per-gatti/{ID}-{slug}.html
  // ID 55 = Pumpkin feline (mūsų US buvo 51 — neegzistuoja)
  // Bandysim auto-discover IT ID per pirmą puslapį iš Farmina N&D brand IT
  const cats=[
    {key:'pumpkin_cat', url:'https://www.farmina.com/it/eshop-cat/alimenti-per-gatti/55-n&d-pumpkin-feline.html'},
    {key:'prime_cat', url:'https://www.farmina.com/it/eshop-cat/alimenti-per-gatti/53-n&d-prime-feline.html'},
    {key:'ocean_cat', url:'https://www.farmina.com/it/eshop-cat/alimenti-per-gatti/56-n&d-ocean-feline.html'},
    {key:'quinoa_cat', url:'https://www.farmina.com/it/eshop-cat/alimenti-per-gatti/57-n&d-quinoa-functional-feline.html'},
    {key:'tropical_cat', url:'https://www.farmina.com/it/eshop-cat/alimenti-per-gatti/95-n&d-tropical-selection-feline.html'},
    {key:'matisse', url:'https://www.farmina.com/it/eshop-cat/alimenti-per-gatti/8-matisse-feline.html'}
  ];
  async function scanCat(cat){
    const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0'});
    const page=await ctx.newPage();
    let prods=[],errMsg='';
    try{
      const resp=await page.goto(cat.url,{waitUntil:'domcontentloaded',timeout:45000});
      await page.waitForTimeout(7000);
      await page.evaluate(()=>{return new Promise(r=>{let t=0;const iv=setInterval(()=>{window.scrollBy(0,500);t+=500;if(t>15000){clearInterval(iv);r();}},80);});});
      await page.waitForTimeout(2000);
      const links=await page.evaluate(()=>{
        const a=Array.from(document.querySelectorAll('a[href]')).map(x=>x.href);
        return [...new Set(a.filter(h=>/eshop\/alimenti-per-gatti\/[^/]+\/\d+/i.test(h)))].slice(0,30);
      });
      // Take only this category
      const slug=cat.url.match(/\d+-([^.]+)\.html/)[1];
      prods=links.filter(h=>h.toLowerCase().includes('/'+slug.toLowerCase()+'/')).map(href=>{
        const m=href.match(/\/(\d+)-([^.]+)\.html/i);
        return m?{id:m[1],slug:m[2],href}:null;
      }).filter(Boolean);
      const seen=new Set();prods=prods.filter(p=>{if(seen.has(p.id))return false;seen.add(p.id);return true;});
      if(!prods.length){errMsg='no_products_in_'+slug+'_status_'+(resp?resp.status():'?');}
    }catch(e){errMsg=String(e).slice(0,200);}
    const map={};
    for(const p of prods){
      try{
        await page.goto(p.href,{waitUntil:'domcontentloaded',timeout:45000});
        await page.waitForTimeout(2500);
        const pdf=await page.evaluate(()=>{
          const a=document.querySelector('a[href*="fotoprodotti/dosi/"]');
          if(a)return a.href;
          const img=document.querySelector('img[src*="fotoprodotti/dosi/"]');
          if(img)return img.src;
          return null;
        });
        if(pdf){
          try{
            const buf=await page.context().request.get(pdf);
            const body=await buf.body();
            const fn=pdf.split('/').pop();
            putBin(cat.key+'_'+fn, Buffer.from(body));
            map[p.id]={slug:p.slug, downloaded:fn, bytes:body.length};
          }catch(e){map[p.id]={slug:p.slug, dlErr:String(e).slice(0,100)};}
        } else map[p.id]={slug:p.slug, err:'no_pdf_link'};
      }catch(e){map[p.id]={err:String(e).slice(0,100)};}
    }
    await ctx.close();
    return {key:cat.key, products:prods.length, map, errMsg};
  }
  const results=await Promise.all(cats.map(scanCat));
  await browser.close();
  commit('par7_run.json',JSON.stringify({results},null,1));
  console.log("PAR7 DONE");
})();
