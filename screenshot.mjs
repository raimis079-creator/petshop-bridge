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
  // 4 paraleliniai agentai: kiekvienas savo kontekstas + page
  async function agent(name, urls){
    const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0'});
    const page=await ctx.newPage();
    const ag={name,results:[]};
    for(const u of urls){
      try{
        await page.goto(u,{waitUntil:'domcontentloaded',timeout:45000});
        await page.waitForTimeout(2500);
        const pdf=await page.evaluate(()=>{
          const a=document.querySelector('a[href*="fotoprodotti/dosi/"]');
          return a?a.href:null;
        });
        const title=await page.title();
        ag.results.push({url:u,title,pdf});
        if(pdf){
          try{
            const buf=await page.context().request.get(pdf);
            const body=await buf.body();
            const fn=pdf.split('/').pop();
            putBin('p_'+fn, Buffer.from(body));
            ag.results[ag.results.length-1].downloaded=fn;
            ag.results[ag.results.length-1].bytes=body.length;
          }catch(e){ag.results[ag.results.length-1].dlErr=String(e).slice(0,120);}
        }
      }catch(e){ag.results.push({url:u,err:String(e).slice(0,120)});}
    }
    await ctx.close();
    return ag;
  }
  // KATEGORIJOS PUSLAPIS pirmiausia: surenkam visus produktų URL'us
  const ctx0=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0'});
  const page0=await ctx0.newPage();
  let prods=[];
  try{
    await page0.goto('https://www.farmina.com/us/eshop-dog/Dog-food/50-N&D-Pumpkin-Grain-Free-Canine.html',{waitUntil:'domcontentloaded',timeout:45000});
    await page0.waitForTimeout(8000);
    prods=await page0.evaluate(()=>{
      const links=Array.from(document.querySelectorAll('a[href]'));
      const seen=new Set(); const out=[];
      for(const a of links){
        const m=a.href.match(/eshop\/dog-food\/n&d-pumpkin-grain-free-canine\/(\d+)-([^.]+)\.html/i);
        if(m && !seen.has(m[1])){seen.add(m[1]); out.push({id:m[1],slug:m[2],href:a.href});}
      }
      return out;
    });
  }catch(e){log.push('cat_err:'+String(e).slice(0,150));}
  await ctx0.close();
  log.push('found_products:'+prods.length);
  // Paskirstom į 4 agentus
  const urls=prods.map(p=>p.href);
  const chunks=[[],[],[],[]];
  urls.forEach((u,i)=>chunks[i%4].push(u));
  const ags=await Promise.all(chunks.map((c,i)=>agent('A'+(i+1),c)));
  // Surenkam galutinį žemėlapį
  const map={};
  for(const a of ags){
    for(const r of a.results){
      const m=r.url.match(/\/(\d+)-([^.]+)\.html/);
      if(m){map[m[1]]={slug:m[2],pdf:r.pdf,downloaded:r.downloaded,bytes:r.bytes,err:r.err||r.dlErr,title:r.title};}
    }
  }
  await browser.close();
  commit('pumpkin_par_run.json',JSON.stringify({log,products:prods,agents:ags.map(a=>({name:a.name,n:a.results.length})),map},null,1));
  console.log("PAR DONE");
})();
