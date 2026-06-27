import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const env = { ...process.env };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
function putBin(name,buf){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:buf.toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
(async()=>{
  const log=[];
  const browser=await chromium.launch({args:['--no-sandbox']});
  async function fetchPdfDirect(url, savename){
    try{
      const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0'});
      const req=ctx.request;
      const r=await req.get(url);
      const body=await r.body();
      putBin(savename, Buffer.from(body));
      await ctx.close();
      return {bytes:body.length};
    }catch(e){return {err:String(e).slice(0,120)};}
  }
  // Mission 1: re-fetch 715, 716 jpgs
  const j1=await fetchPdfDirect('https://www.farmina.com/fotoprodotti/dosi/715_50_pumpkin-puppy-starter-chicken-pomegranate-2,5kg-feeding-guide.jpg', 'fix_715.jpg');
  const j2=await fetchPdfDirect('https://www.farmina.com/fotoprodotti/dosi/716_10_pumpkin-puppy-mini-chicken-pomegranate-2,5kg-feeding-guide.jpg', 'fix_716.jpg');
  log.push('j1:'+JSON.stringify(j1));log.push('j2:'+JSON.stringify(j2));
  // Mission 2: Scan Prime DOG category + visit all + grab pdfs (4 paraleliniai agentai)
  const ctx0=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0'});
  const page0=await ctx0.newPage();
  let prods=[];
  try{
    await page0.goto('https://www.farmina.com/us/eshop-dog/Dog-food/10-N&D-Prime-Canine.html',{waitUntil:'domcontentloaded',timeout:45000});
    await page0.waitForTimeout(8000);
    prods=await page0.evaluate(()=>{
      const links=Array.from(document.querySelectorAll('a[href]'));
      const seen=new Set();const out=[];
      for(const a of links){
        const m=a.href.match(/eshop\/dog-food\/n&d-prime-canine\/(\d+)-([^.]+)\.html/i);
        if(m && !seen.has(m[1])){seen.add(m[1]);out.push({id:m[1],slug:m[2],href:a.href});}
      }
      return out;
    });
  }catch(e){log.push('prime_cat_err:'+String(e).slice(0,150));}
  await ctx0.close();
  log.push('prime_found:'+prods.length);

  async function agent(name, urls){
    const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0'});
    const page=await ctx.newPage();
    const ag={name,results:[]};
    for(const u of urls){
      try{
        await page.goto(u,{waitUntil:'domcontentloaded',timeout:45000});
        await page.waitForTimeout(2500);
        const pdf=await page.evaluate(()=>{const a=document.querySelector('a[href*="fotoprodotti/dosi/"]');return a?a.href:null;});
        ag.results.push({url:u,pdf});
        if(pdf){
          try{
            const buf=await page.context().request.get(pdf);
            const body=await buf.body();
            const fn=pdf.split('/').pop();
            putBin('prime_'+fn, Buffer.from(body));
            ag.results[ag.results.length-1].downloaded=fn;
            ag.results[ag.results.length-1].bytes=body.length;
          }catch(e){ag.results[ag.results.length-1].dlErr=String(e).slice(0,100);}
        }
      }catch(e){ag.results.push({url:u,err:String(e).slice(0,120)});}
    }
    await ctx.close();
    return ag;
  }
  const urls=prods.map(p=>p.href);
  const chunks=[[],[],[],[]];
  urls.forEach((u,i)=>chunks[i%4].push(u));
  const ags=await Promise.all(chunks.map((c,i)=>agent('P'+(i+1),c)));
  const map={};
  for(const a of ags){
    for(const r of a.results){
      const m=r.url.match(/\/(\d+)-([^.]+)\.html/);
      if(m){map[m[1]]={slug:m[2],pdf:r.pdf,downloaded:r.downloaded,bytes:r.bytes,err:r.err||r.dlErr};}
    }
  }
  await browser.close();
  commit('par2_run.json',JSON.stringify({log,products:prods,map},null,1));
  console.log("PAR2 DONE");
})();
