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
  for(const u of [
    // Natural Superpremium Adult sample
    'https://www.monge.it/en/product/all-breeds-light-al-salmone-e-riso/',
    // VetSolution Gastrointestinal sample
    'https://www.monge.it/en/product/vetsolution-dog-gastrointestinal/',
    // Products kategorijos puslapis
    'https://www.monge.it/en/products/'
  ]){
    try{
      const r=await page.goto(u,{waitUntil:'domcontentloaded',timeout:45000});
      await page.waitForTimeout(5000);
      // Klikinejam vsus tabs/accordions
      try{await page.evaluate(()=>{document.querySelectorAll('.elementor-tab-title, .accordion-header, [data-toggle], [data-tab]').forEach(b=>{try{b.click();}catch(e){}});});await page.waitForTimeout(2000);}catch(e){}
      const data=await page.evaluate(()=>{
        const allHref=Array.from(document.querySelectorAll('a[href]')).map(a=>a.href);
        const imgs=Array.from(document.querySelectorAll('img')).map(i=>i.src||i.dataset.src||'').filter(Boolean);
        // Ieskom feeding table 
        const fdLinks=allHref.filter(h=>/feeding|razione|dosi|guide|\.pdf/i.test(h));
        const fdImgs=imgs.filter(s=>/feeding|razione|dosi|table|guide/i.test(s));
        const tables=Array.from(document.querySelectorAll('table'));
        const tablesData=tables.map(t=>t.innerText.slice(0,800));
        // Veterinaro deklaravimas
        const body=document.body?.innerText||'';
        const vetRefs=[];
        for(const re of [/veterinari/i,/prescription/i,/dietetic/i,/dietetinis/i,/specialist/i]){
          const m=body.match(new RegExp('[^.]{0,80}'+re.source+'[^.]{0,80}','i'));
          if(m) vetRefs.push(m[0].slice(0,200));
        }
        return {pdfsInHref:fdLinks.slice(0,15),pdfsInImg:fdImgs.slice(0,15),tableCount:tables.length,tablesPreview:tablesData.slice(0,3),vetRefs,bodyLen:body.length};
      });
      out[u]={status:r?r.status():'?',data};
    }catch(e){out[u]={err:String(e).slice(0,200)};}
  }
  await ctx.close();
  await browser.close();
  commit('monge_probe.json',JSON.stringify(out,null,1));
  console.log("DONE");
})();
