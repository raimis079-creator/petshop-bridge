import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const env = { ...process.env };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
function putBin(name,buf){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:buf.toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0'});
  // IT/US produktu URL'ai - per page.goto, dosi link parsisiunciam
  const products={
    // PRIME CAT
    'prime_146': 'https://www.farmina.com/it/eshop/alimenti-per-gatti/n&d-prime-feline/146-chicken-&-pomegranate-neutered.html',
    'prime_147': 'https://www.farmina.com/it/eshop/alimenti-per-gatti/n&d-prime-feline/147-boar-&-apple-adult.html',
    // OCEAN CAT
    'ocean_708': 'https://www.farmina.com/it/eshop/alimenti-per-gatti/n&d-ocean-feline/708-neutered,-herring-&-orange-adult.html',
    'ocean_709': 'https://www.farmina.com/it/eshop/alimenti-per-gatti/n&d-ocean-feline/709-cod,-shrimp,-pumpkin-and-cantaloupe-melon-kitten.html',
    // QUINOA CAT
    'quinoa_437': 'https://www.farmina.com/us/eshop/cat-food/n&d-quinoa-functional-feline/437-skin-&-coat-quail.html',
    'quinoa_438': 'https://www.farmina.com/it/eshop/alimenti-per-gatti/n&d-quinoa-feline/438-urinary-duck.html',
    'quinoa_697': 'https://www.farmina.com/it/eshop/alimenti-per-gatti/n&d-quinoa-feline/697-quinoa-neutered.html',
    // TROPICAL CAT
    'tropical_1011': 'https://www.farmina.com/it/eshop/alimenti-per-gatti/n&d-tropical-selection-feline/1011-chicken-and-tropical-fruits-feline.html',
    'tropical_1013': 'https://www.farmina.com/it/eshop/alimenti-per-gatti/n&d-tropical-selection-feline/1013-neutered-%E2%80%A2-chicken-and-tropical-fruits-feline.html',
    'tropical_1014': 'https://www.farmina.com/it/eshop/alimenti-per-gatti/n&d-tropical-selection-feline/1014-neutered-%E2%80%A2-lamb-and-tropical-fruits-feline.html',
    // MATISSE 
    'matisse_157': 'https://www.farmina.com/it/eshop/alimenti-per-gatti/matisse/157-salmon-&-tuna.html',
    'matisse_159': 'https://www.farmina.com/it/eshop/alimenti-per-gatti/matisse/159-neutered-salmon.html'
  };
  const out={products:{},directPdfs:{}};
  const page=await ctx.newPage();
  for(const [k,u] of Object.entries(products)){
    try{
      const r=await page.goto(u,{waitUntil:'domcontentloaded',timeout:45000});
      await page.waitForTimeout(3000);
      const pdf=await page.evaluate(()=>{
        const a=document.querySelector('a[href*="fotoprodotti/dosi/"]');
        if(a)return a.href;
        const img=document.querySelector('img[src*="fotoprodotti/dosi/"]');
        if(img)return img.src;
        return null;
      });
      if(pdf){
        try{
          const buf=await ctx.request.get(pdf);
          const body=await buf.body();
          const fn=pdf.split('/').pop().replace(/%20/g,'_').replace(/[?&].*/,'');
          putBin(k+'_'+fn, Buffer.from(body));
          out.products[k]={status:r.status(), pdf, fn, bytes:body.length};
        }catch(e){out.products[k]={status:r.status(), pdf, dlErr:String(e).slice(0,100)};}
      } else {
        out.products[k]={status:r?r.status():'?', err:'no_dosi_link'};
      }
    }catch(e){out.products[k]={err:String(e).slice(0,150)};}
  }
  // Matisse KITTEN brute scan: 150-165 with KITTEN suffix
  for(const id of [150,151,152,153,154,160,161,162,163,164,165]){
    const url=`https://www.farmina.com/fotoprodotti/dosi/${id}_00_20170517_Matisse_feeding_guide_GB@web-KITTEN.pdf`;
    try{
      const r=await ctx.request.head(url);
      out.directPdfs['matisse_kitten_'+id]=r.status();
    }catch(e){out.directPdfs['matisse_kitten_'+id]='err';}
  }
  // Bandymas Matisse KITTEN per IT produktu sarasa
  try{
    await page.goto('https://www.farmina.com/it/eshop/alimenti-per-gatti/matisse/',{waitUntil:'domcontentloaded',timeout:45000});
    await page.waitForTimeout(5000);
    const links=await page.evaluate(()=>{
      return [...new Set(Array.from(document.querySelectorAll('a[href]')).map(a=>a.href).filter(h=>/eshop\/alimenti-per-gatti\/matisse\/\d+/i.test(h)))];
    });
    out.matisse_listing=links;
  }catch(e){out.matisse_listing=['err:'+String(e).slice(0,100)];}
  await ctx.close();
  await browser.close();
  commit('par10.json',JSON.stringify(out,null,1));
  console.log("PAR10 DONE");
})();
