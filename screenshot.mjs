import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const env = { ...process.env };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
function putBin(name,buf){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:buf.toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  // Brute scan – bandysim per known produktų URL'us is Google paieškos + alternatyvas
  // Pumpkin CAT zinome: 710 (Neutered Lamb Pumpkin Blueberry Adult)
  // Bandysim "browse" URL per N&D Cat brand puslapį
  const seedUrls=[
    {key:'pumpkin_cat', url:'https://www.farmina.com/us/eshop/cat-food/n&d-pumpkin-feline/'},
    {key:'prime_cat', url:'https://www.farmina.com/us/eshop/cat-food/n&d-prime-feline/'},
    {key:'ocean_cat', url:'https://www.farmina.com/us/eshop/cat-food/n&d-ocean-feline/'},
    {key:'quinoa_cat', url:'https://www.farmina.com/us/eshop/cat-food/n&d-quinoa-functional-feline/'},
    {key:'tropical_cat', url:'https://www.farmina.com/us/eshop/cat-food/n&d-tropical-selection-feline/'},
    {key:'matisse', url:'https://www.farmina.com/us/eshop/cat-food/matisse-feline/'},
  ];
  async function scanCat(cat){
    const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0'});
    const page=await ctx.newPage();
    let prods=[],errMsg='';
    try{
      const resp=await page.goto(cat.url,{waitUntil:'domcontentloaded',timeout:45000});
      await page.waitForTimeout(7000);
      // Scroll bottom (lazy load)
      await page.evaluate(()=>{return new Promise(r=>{let t=0;const iv=setInterval(()=>{window.scrollBy(0,500);t+=500;if(t>15000){clearInterval(iv);r();}},80);});});
      await page.waitForTimeout(2000);
      const allLinks=await page.evaluate(()=>{
        const a=Array.from(document.querySelectorAll('a[href]')).map(x=>x.href);
        return [...new Set(a.filter(h=>/eshop\/cat-food\/[^/]+\/\d+/i.test(h)))];
      });
      // Filter: tik šios kategorijos linijos
      const slug=cat.url.match(/cat-food\/([^/]+)\/?/)[1];
      prods=allLinks.filter(h=>h.toLowerCase().includes('/cat-food/'+slug.toLowerCase()+'/')).map(href=>{
        const m=href.match(/\/(\d+)-([^.]+)\.html/i);
        return m?{id:m[1],slug:m[2],href}:null;
      }).filter(Boolean);
      // Dedupe
      const seen=new Set();prods=prods.filter(p=>{if(seen.has(p.id))return false;seen.add(p.id);return true;});
      if(!prods.length){errMsg='no_products_in_category_'+slug+'_status_'+(resp?resp.status():'?');}
    }catch(e){errMsg=String(e).slice(0,200);}
    const map={};
    for(const p of prods){
      try{
        await page.goto(p.href,{waitUntil:'domcontentloaded',timeout:45000});
        await page.waitForTimeout(2500);
        const pdf=await page.evaluate(()=>{
          // Ieskom dosi PDF/IMG arba feeding guide table image
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
  // Padalinam i 3 paralelinius batchus po 2
  const results=await Promise.all(seedUrls.map(scanCat));
  await browser.close();
  commit('par6_run.json',JSON.stringify({results},null,1));
  console.log("PAR6 DONE");
})();
