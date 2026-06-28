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
  const page=await ctx.newPage();
  const out={};
  // Bandysim IT, US, IN, MT
  for(const u of [
    'https://www.farmina.com/it/eshop/alimenti-per-gatti/matisse/154-kitten.html',
    'https://www.farmina.com/it/eshop/alimenti-per-gatti/matisse/154-kitten-1-12-months.html',
    'https://www.farmina.com/in/eshop/cat-food/matisse/154-kitten-1-12-months.html'
  ]){
    try{
      const r=await page.goto(u,{waitUntil:'domcontentloaded',timeout:45000});
      await page.waitForTimeout(3500);
      const pdf=await page.evaluate(()=>{
        const a=document.querySelector('a[href*="fotoprodotti/dosi/"]');
        if(a)return a.href;
        const img=document.querySelector('img[src*="fotoprodotti/dosi/"]');
        if(img)return img.src;
        return null;
      });
      out[u]={status:r?r.status():'?',pdf};
      if(pdf){
        try{
          const buf=await ctx.request.get(pdf);
          const body=await buf.body();
          const fn=pdf.split('/').pop().replace(/%20/g,'_');
          putBin('matisse_kitten_'+fn, Buffer.from(body));
          out[u].downloaded=fn;
          out[u].bytes=body.length;
        }catch(e){out[u].dlErr=String(e).slice(0,100);}
      }
    }catch(e){out[u]={err:String(e).slice(0,150)};}
  }
  await ctx.close();
  await browser.close();
  commit('matisse_kitten_probe.json',JSON.stringify(out,null,1));
  console.log("DONE");
})();
