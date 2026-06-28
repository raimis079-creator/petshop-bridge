import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const env = { ...process.env };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0'});
  const page=await ctx.newPage();
  const out={};
  // Pavyzdziai: Gastrointestinal (jautriam virskinimui), Renal, Diabetic, Hypoallergenic - skirtingos butines
  const urls=[
    'https://www.farmina.com/us/eshop/dog-food/farmina-vet-life-canine/736-gastrointestinal-canine.html',
    'https://www.farmina.com/us/eshop/dog-food/farmina-vet-life-canine/740-renal-canine.html',
    'https://www.farmina.com/us/eshop/dog-food/farmina-vet-life-canine/741-caloric-control-canine.html',
    'https://www.farmina.com/us/eshop/dog-food/farmina-vet-life-canine/743-hp-derma-canine.html'
  ];
  for(const u of urls){
    try{
      await page.goto(u,{waitUntil:'domcontentloaded',timeout:45000});
      await page.waitForTimeout(4500);
      // pilnas tekstinis turinys + visi accordion/tab section'ai 
      const data=await page.evaluate(()=>{
        // Klikinejam visus accordion mygtukus
        document.querySelectorAll('.accordion-button, [data-toggle="collapse"], [data-bs-toggle="collapse"], .tab-button, .tab-link').forEach(b=>{try{b.click();}catch(e){}});
        // Ieskom feeding-related sekcijų
        const feedKw=/feed|dosi|razione|porzion|dose|amount|quantit/i;
        const all=Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,p,li,td,th,div'));
        const matches=all.filter(e=>feedKw.test(e.innerText||'')).map(e=>({tag:e.tagName, text:(e.innerText||'').slice(0,400)})).slice(0,30);
        // Pilnas main content
        const main=document.querySelector('main,article,#main,.main-content,.product-info,body')?.innerText||'';
        return {feedRelated:matches, fullTextLen:main.length, fullText:main.slice(0,8000)};
      });
      out[u]=data;
    }catch(e){out[u]={err:String(e).slice(0,200)};}
    await page.waitForTimeout(500);
  }
  await ctx.close();
  await browser.close();
  commit('vetlife_full.json',JSON.stringify(out,null,1));
  console.log("VL FULL DONE");
})();
