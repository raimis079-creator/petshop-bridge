import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putBin(name,buf){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:buf.toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});}
function commit(name,str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});}

(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0',viewport:{width:1366,height:900}});
  const page=await ctx.newPage();
  
  // 1. Bandymai naujų extensions
  const baseIds=['1704-10434','1704-10334','1704-10324','1704-10034','1704-10634'];
  const exts=['Rm','C','B','F','D','Feeding','-feeding','-table','tab'];
  const results={};
  for(const base of baseIds){
    for(const ext of exts){
      const url=`https://rasco.pet/wp-content/uploads/2021/11/${base}-${ext}.png`;
      try{
        const r=await page.goto(url,{waitUntil:'domcontentloaded',timeout:10000});
        if(r&&r.status()===200){
          const buf=await r.body();
          results[`${base}-${ext}`]={size:buf.length,status:200};
          if(buf.length>5000) putBin(`rasco_${base}_${ext}.png`,buf);
        }
      }catch(e){}
    }
  }
  
  // 2. Pasižiūrėkim Adult Lamb individualų puslapį - galbūt jis turi PDF link
  try{
    await page.goto('https://rasco.pet/for-dogs-en/dog-dry/',{waitUntil:'networkidle',timeout:30000});
    await page.waitForTimeout(2000);
    const links=await page.evaluate(()=>{
      const all=document.querySelectorAll('a, img');
      return Array.from(all).map(el=>({
        tag:el.tagName,
        href:el.href||el.src||'',
        text:(el.innerText||el.alt||'').slice(0,80)
      })).filter(x=>x.href.includes('rasco'));
    });
    results['_links']=links.slice(0,80);
  }catch(e){results['_links_err']=e.message.slice(0,100);}
  
  commit('rasco_explore.json',JSON.stringify(results,null,1));
  await ctx.close();
  await browser.close();
})();
