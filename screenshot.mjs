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
  // 1. Visit homepage to set cookies/session
  const page=await ctx.newPage();
  await page.goto('https://www.monge.it/en/',{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForTimeout(3000);
  // 2. Fetch sample PDFs via ctx.request
  const pdfs=[
    'https://www.monge.it/wp-content/uploads/2023/09/Monge-natural-superpremium-all-breeds-adult-light-ENG.pdf',
    // Bandysim atspeti dar vieno produkto PDF formato
  ];
  const out={};
  for(const u of pdfs){
    try{
      const r=await ctx.request.get(u);
      const body=await r.body();
      const fn=u.split('/').pop();
      if(r.status()===200 && body.length>1000){
        putBin('monge_'+fn,Buffer.from(body));
        out[u]={status:200, bytes:body.length, fn};
      } else {
        out[u]={status:r.status(), bytes:body.length};
      }
    }catch(e){out[u]={err:String(e).slice(0,150)};}
  }
  // 3. Aplankykime ir natural superpremium puslapi, paziurime kategoriju struktura
  try{
    await page.goto('https://www.monge.it/en/product-line/monge-natural-superpremium/',{waitUntil:'domcontentloaded',timeout:45000});
    await page.waitForTimeout(5000);
    await page.evaluate(()=>{return new Promise(r=>{let t=0;const iv=setInterval(()=>{window.scrollBy(0,500);t+=500;if(t>15000){clearInterval(iv);r();}},80);});});
    await page.waitForTimeout(2000);
    const links=await page.evaluate(()=>{
      return [...new Set(Array.from(document.querySelectorAll('a[href]')).map(a=>a.href).filter(h=>/monge\.it\/en\/product\//.test(h)))].slice(0,40);
    });
    out['_naturalLinks']=links;
  }catch(e){out['_naturalLinks']=['err:'+String(e).slice(0,100)];}
  // VetSolution puslapis
  try{
    await page.goto('https://www.monge.it/en/product-line/vetsolution/',{waitUntil:'domcontentloaded',timeout:45000});
    await page.waitForTimeout(5000);
    await page.evaluate(()=>{return new Promise(r=>{let t=0;const iv=setInterval(()=>{window.scrollBy(0,500);t+=500;if(t>15000){clearInterval(iv);r();}},80);});});
    await page.waitForTimeout(2000);
    const links=await page.evaluate(()=>{
      return [...new Set(Array.from(document.querySelectorAll('a[href]')).map(a=>a.href).filter(h=>/monge\.it\/en\/product\//.test(h)))].slice(0,40);
    });
    out['_vetSolutionLinks']=links;
  }catch(e){out['_vetSolutionLinks']=['err:'+String(e).slice(0,100)];}
  await ctx.close();
  await browser.close();
  commit('monge_getpdf.json',JSON.stringify(out,null,1));
  console.log("DONE");
})();
