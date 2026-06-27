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
  const out={pumpkin:[],pdfsFound:[]};
  try{
    await page.goto('https://www.farmina.com/us/eshop-dog/dog-food/50-n&d-pumpkin-grain-free-canine.html',{waitUntil:'networkidle',timeout:60000});
    await page.waitForTimeout(5000);
    // Collect all product links matching the URL pattern
    out.pumpkin=await page.evaluate(()=>{
      const links=Array.from(document.querySelectorAll('a[href*="n&d-pumpkin-grain-free-canine"]'));
      const seen=new Set();
      const xs=[];
      for(const a of links){
        const m=a.href.match(/n&d-pumpkin-grain-free-canine\/(\d+)-([^.]+)\.html/);
        if(m && !seen.has(m[1])){seen.add(m[1]);xs.push({id:m[1],slug:m[2],href:a.href,text:(a.innerText||'').slice(0,80)});}
      }
      return xs;
    });
  }catch(e){out.err=String(e).slice(0,200);}
  // For each found product URL, visit & extract PDF link
  const pdfs={};
  for(const p of out.pumpkin){
    try{
      await page.goto(p.href,{waitUntil:'domcontentloaded',timeout:60000});
      await page.waitForTimeout(2500);
      const pdfHref=await page.evaluate(()=>{
        const a=document.querySelector('a[href*="fotoprodotti/dosi/"]');
        return a?a.href:null;
      });
      if(pdfHref){
        pdfs[p.id]={slug:p.slug,pdfHref};
        // download via curl on runner
        const pdfPath=pdfHref.split('/').pop();
        try{
          execSync(`curl -sk -L --max-time 30 -A "Mozilla/5.0" "${pdfHref}" -o /tmp/pdf_${p.id}.pdf`,{maxBuffer:200000000});
          const sz=fs.statSync(`/tmp/pdf_${p.id}.pdf`).size;
          pdfs[p.id].bytes=sz;
          if(sz>5000)putBin(`pumpkin_${p.id}.pdf`, fs.readFileSync(`/tmp/pdf_${p.id}.pdf`));
        }catch(e){pdfs[p.id].dlErr=String(e).slice(0,100);}
      } else pdfs[p.id]={slug:p.slug,err:'no_pdf_link'};
    }catch(e){pdfs[p.id]={err:String(e).slice(0,100)};}
  }
  out.pdfs=pdfs;
  await browser.close();
  commit('pumpkin_catscan.json',JSON.stringify(out,null,1));
  console.log("CATSCAN DONE");
})();
