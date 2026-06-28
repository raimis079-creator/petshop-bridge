import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const env = { ...process.env };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  // Probe 1: Pumpkin CAT — nuskanok visus link kandidatus
  const out={};
  for(const u of [
    'https://www.farmina.com/us/eshop-cat/Cat-food/51-N&D-Pumpkin-Grain-Free-Feline.html',
    'https://www.farmina.com/us/eshop-cat/cat-food/51-n&d-pumpkin-grain-free-feline.html',
    'https://www.farmina.com/us/eshop-cat/Cat-food/8-Matisse-Feline.html',
    'https://www.farmina.com/us/eshop-dog/Dog-food/74-Farmina-Vet-Life-Canine.html',
  ]){
    const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0'});
    const page=await ctx.newPage();
    try{
      await page.goto(u,{waitUntil:'domcontentloaded',timeout:45000});
      await page.waitForTimeout(8000);
      const links=await page.evaluate(()=>{
        const arr=Array.from(document.querySelectorAll('a[href]'));
        // imam visus URL kuriose yra "eshop" + "cat-food" arba "dog-food"
        return [...new Set(arr.map(a=>a.href).filter(h=>/eshop\/(cat|dog)-food\/[^/]+\/\d+/i.test(h)))].slice(0,12);
      });
      out[u]={links};
      // Take 1 product link, get PDF link from Vet Life style
      if(links.length){
        await page.goto(links[0],{waitUntil:'domcontentloaded',timeout:45000});
        await page.waitForTimeout(3500);
        const pdfs=await page.evaluate(()=>{
          const arr=Array.from(document.querySelectorAll('a[href]'));
          return [...new Set(arr.map(a=>a.href).filter(h=>/fotoprodotti|\.pdf|\.jpg|\.png|dosi|feeding|guide/i.test(h)))].slice(0,8);
        });
        out[u].sampleProduct=links[0];
        out[u].sampleProductPdfs=pdfs;
      }
    }catch(e){out[u]={err:String(e).slice(0,150)};}
    await ctx.close();
  }
  await browser.close();
  commit('cat_probe.json',JSON.stringify(out,null,1));
  console.log("PROBE DONE");
})();
