import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const env = { ...process.env };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const out={};
  // 1) Pumpkin CAT su scroll
  const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0'});
  const page=await ctx.newPage();
  try{
    await page.goto('https://www.farmina.com/us/eshop-cat/Cat-food/51-N&D-Pumpkin-Grain-Free-Feline.html',{waitUntil:'domcontentloaded',timeout:45000});
    await page.waitForTimeout(5000);
    // Scroll iki apacios
    await page.evaluate(()=>{return new Promise(res=>{let total=0;const itv=setInterval(()=>{window.scrollBy(0,500);total+=500;if(total>20000){clearInterval(itv);res();}},100);});});
    await page.waitForTimeout(3000);
    const links=await page.evaluate(()=>{
      const arr=Array.from(document.querySelectorAll('a[href]'));
      return [...new Set(arr.map(a=>a.href).filter(h=>/eshop\/cat-food\/[^/]+\/\d+/i.test(h)))].slice(0,25);
    });
    out.pumpkin_cat={links};
    if(links.length){
      // Picked one and inspect entire HTML for any data tabular section + img + pdf
      await page.goto(links[0],{waitUntil:'domcontentloaded',timeout:45000});
      await page.waitForTimeout(3000);
      const data=await page.evaluate(()=>{
        const allHref=Array.from(document.querySelectorAll('a[href]')).map(a=>a.href);
        const imgs=Array.from(document.querySelectorAll('img')).map(i=>i.src);
        // Ieskom feeding guide/table imgs
        const fg=allHref.filter(h=>/fotoprodotti|feeding|dosi|guide|table|\.pdf|\.jpg|\.png/i.test(h));
        const fgImg=imgs.filter(s=>/fotoprodotti|feeding|dosi|guide|table/i.test(s));
        // Visi a tagai su zodziu "feeding" ar "guide" 
        const labels=Array.from(document.querySelectorAll('a, button')).filter(e=>/feeding|guide|dose|razione/i.test(e.innerText||'')).map(e=>({text:e.innerText.slice(0,50), href:e.href||''})).slice(0,10);
        return {pdfsInHref:fg.slice(0,15), pdfsInImg:fgImg.slice(0,15), labels};
      });
      out.pumpkin_cat.sampleProduct=links[0];
      out.pumpkin_cat.sampleData=data;
    }
  }catch(e){out.pumpkin_cat={err:String(e).slice(0,200)};}
  await ctx.close();

  // 2) Vet Life DOG sample produktas — pilna HTML inspekcija ieskant lenteles
  const ctx2=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0'});
  const page2=await ctx2.newPage();
  try{
    await page2.goto('https://www.farmina.com/us/eshop/dog-food/farmina-vet-life-canine/736-gastrointestinal-canine.html',{waitUntil:'domcontentloaded',timeout:45000});
    await page2.waitForTimeout(4000);
    const data=await page2.evaluate(()=>{
      const allHref=Array.from(document.querySelectorAll('a[href]')).map(a=>a.href);
      const imgs=Array.from(document.querySelectorAll('img')).map(i=>i.src);
      const fg=allHref.filter(h=>/fotoprodotti|feeding|dosi|guide|table|\.pdf|\.jpg|\.png/i.test(h));
      const fgImg=imgs.filter(s=>/fotoprodotti|feeding|dosi|guide|table/i.test(s));
      // Tables?
      const tablesData=Array.from(document.querySelectorAll('table')).map(t=>t.innerText.slice(0,500));
      // Pažiūrim tabs / accordion sekcijas
      const accordion=Array.from(document.querySelectorAll('[data-bs-toggle], .accordion-button, .tabs li, .tab-link, [data-tab]')).map(e=>e.innerText.slice(0,80));
      return {pdfsInHref:fg.slice(0,15), pdfsInImg:fgImg.slice(0,10), tableCount:tablesData.length, tablesPreview:tablesData.slice(0,3), accordion:accordion.slice(0,15)};
    });
    out.vetlife_dog={sampleProduct:'736-gastrointestinal-canine.html', sampleData:data};
  }catch(e){out.vetlife_dog={err:String(e).slice(0,200)};}
  await ctx2.close();

  await browser.close();
  commit('probe2.json',JSON.stringify(out,null,1));
  console.log("PROBE2 DONE");
})();
