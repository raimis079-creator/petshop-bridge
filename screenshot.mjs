import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const env = { ...process.env };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
function putBin(name,buf){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:buf.toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0',viewport:{width:1400,height:1000}});
  const page=await ctx.newPage();
  // Mix: VetSolution + b2b-black lentele + bare + draft
  // 14805 VetSolution Dog Struvite 12kg | 12533 Maxi puppy (lentele) | 12522 Extra Small adult | 12581 Urinary (bare) | 17400 Wet konservai
  const ids=[14805, 12533, 12522, 12581, 17400, 12534];
  const out={};
  for(const id of ids){
    try{
      await page.goto(`https://dev.avesa.lt/?p=${id}`,{waitUntil:'domcontentloaded',timeout:60000});
      await page.waitForTimeout(3000);
      try{
        await page.evaluate(()=>{
          document.querySelectorAll('.tabs li a, [data-tab-id], .accordion-header, .accordion-title').forEach(a=>{
            const t=(a.innerText||'').toLowerCase();
            if(t.includes('informacij')||t.includes('information')||t.includes('papildom')||t.includes('savyb')) a.click();
          });
        });
      }catch(e){}
      await page.waitForTimeout(1500);
      await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
      await page.waitForTimeout(1500);
      const text=await page.evaluate(()=>document.body.innerText);
      const hasSvoris=/(?:^|\n)\s*Svoris\s*\n?\s*\d/i.test(text)||/Svoris[\s:]+\d+[,.]?\d*\s*kg/i.test(text);
      const hasIsmat=/(?:^|\n)\s*Išmatavim[ai]+\s*\n?\s*\d/i.test(text)||/Išmatavimai[\s:]+\d/i.test(text);
      out[id]={hasSvoris,hasIsmat,title:await page.title()};
    }catch(e){out[id]={err:String(e).slice(0,200)};}
  }
  await ctx.close();
  await browser.close();
  commit('verify_hide_multi.json',JSON.stringify(out,null,1));
  console.log("DONE");
})();
