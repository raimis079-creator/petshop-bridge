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
  // Bandysim per Farmina IT brand puslapi atrasti visus N&D feline linijas
  // O kartu paimam tiesiogiai zinomus PDF URL'us per request.get
  // Pirma — testuojam pumpkin neutered lamb 710 ar ID egzistuoja kaip kitokia versija mūsų reikia tikrinti adult ne-neutered
  const reqs={
    // PRIME CAT
    prime_144: 'https://www.farmina.com/fotoprodotti/dosi/144_16_nd-prime-feline-1-chicken-kitten.pdf',
    prime_149: 'https://www.farmina.com/fotoprodotti/dosi/149_01_nd-prime-feline-4-lamb.pdf',
    // OCEAN CAT
    ocean_494: 'https://www.farmina.com/fotoprodotti/dosi/494_01_nd-ocean-feline-herring-orange.pdf',
    ocean_495: 'https://www.farmina.com/fotoprodotti/dosi/495_24_nd-ocean-feline-herring-pumpkin-orange.pdf',
    ocean_496: 'https://www.farmina.com/fotoprodotti/dosi/496_24_nd-ocean-feline-cod-spelt-oats-orange.pdf',
    // QUINOA CAT
    quinoa_476: 'https://www.farmina.com/fotoprodotti/dosi/476_03_476_53_tabela-quantidades-diarias-quinoa-feline-weight-management.pdf',
    // TROPICAL canine+feline universalus
    tropical_1049: 'https://www.farmina.com/fotoprodotti/dosi/1049_41_tabela-quantidades-linha%20dry-ND-tropical%20selection-canine_feline_11.pdf',
    // MATISSE 
    matisse_155: 'https://www.farmina.com/fotoprodotti/dosi/155_36_20170517_Matisse%20feeding%20guide%20GB@web-CHICKEN&RICE.pdf',
    matisse_156: 'https://www.farmina.com/fotoprodotti/dosi/156_01_20170517_Matisse%20feeding%20guide%20GB@web-CHICKEN&VEGETABLE.pdf',
    matisse_158: 'https://www.farmina.com/fotoprodotti/dosi/158_05_20170517_Matisse%20feeding%20guide%20GB@web-NEUTERED.pdf'
  };
  const out={direct:{}};
  for(const [k,u] of Object.entries(reqs)){
    try{
      const r=await ctx.request.get(u);
      const body=await r.body();
      if(r.status()===200 && body.length>1000){
        const fn=u.split('/').pop().replace(/%20/g,'_');
        putBin(k+'_'+fn, Buffer.from(body));
        out.direct[k]={status:200, bytes:body.length, fn};
      } else {
        out.direct[k]={status:r.status(), bytes:body.length};
      }
    }catch(e){out.direct[k]={err:String(e).slice(0,100)};}
  }
  // Antra: per IT eshop top puslapi randam visas brand linijas
  const page=await ctx.newPage();
  try{
    await page.goto('https://www.farmina.com/it/farmina/',{waitUntil:'domcontentloaded',timeout:45000});
    await page.waitForTimeout(5000);
    const brands=await page.evaluate(()=>{
      return [...new Set(Array.from(document.querySelectorAll('a[href]')).map(a=>a.href).filter(h=>/\/it\/(farmina|eshop-cat|eshop-dog)/i.test(h)))].slice(0,60);
    });
    out.itBrands=brands;
  }catch(e){out.itBrands={err:String(e).slice(0,150)};}
  await ctx.close();
  await browser.close();
  commit('par8.json',JSON.stringify(out,null,1));
  console.log("PAR8 DONE");
})();
