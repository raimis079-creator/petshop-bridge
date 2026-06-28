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
  // 12534 Monge maxi adult chicken
  const out={};
  for(const id of [12534,13991]){
    try{
      const url=`https://dev.avesa.lt/?p=${id}`;
      await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
      await page.waitForTimeout(4000);
      // Klikam i Information tab jei yra
      try{
        await page.evaluate(()=>{
          document.querySelectorAll('.tabs li a, [data-tab-id], .accordion-header').forEach(a=>{
            const t=(a.innerText||'').toLowerCase();
            if(t.includes('informacij')||t.includes('information')||t.includes('papildom')) a.click();
          });
        });
      }catch(e){}
      await page.waitForTimeout(2000);
      // Scroll i appacia
      await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
      await page.waitForTimeout(1500);
      // Issitraukiame teksta
      const text=await page.evaluate(()=>document.body.innerText);
      const hasSvoris=/Svoris\s+\d+[,.]?\d*\s*kg/.test(text);
      const hasIsmat=/Išmatavimai\s+\d+/.test(text);
      // Screenshot
      const ss=await page.screenshot({fullPage:true,type:'png'});
      putBin(`verify_hide_${id}.png`,Buffer.from(ss));
      out[id]={hasSvoris,hasIsmat,bytes:ss.length};
    }catch(e){out[id]={err:String(e).slice(0,200)};}
  }
  await ctx.close();
  await browser.close();
  commit('verify_hide.json',JSON.stringify(out,null,1));
  console.log("DONE");
})();
