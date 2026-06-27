import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const env = { ...process.env };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
function putBin(name,buf){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:buf.toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  // 3 kategorijos lygiagrečiai: Ocean, Quinoa, Brown
  const cats=[
    {key:'ocean', url:'https://www.farmina.com/us/eshop-dog/Dog-food/63-N&D-Ocean-canine.html', re:/eshop\/dog-food\/n&d-ocean-canine\/(\d+)-([^.]+)\.html/i},
    {key:'quinoa', url:'https://www.farmina.com/us/eshop-dog/Dog-food/54-N&D-Quinoa-Functional-Canine.html', re:/eshop\/dog-food\/n&d-quinoa-functional-canine\/(\d+)-([^.]+)\.html/i},
    {key:'brown', url:'https://www.farmina.com/us/eshop-dog/Dog-food/89-N&D-Brown.html', re:/eshop\/dog-food\/n&d-brown\/(\d+)-([^.]+)\.html/i},
    {key:'white', url:'https://www.farmina.com/us/eshop-dog/Dog-food/88-N&D-White.html', re:/eshop\/dog-food\/n&d-white\/(\d+)-([^.]+)\.html/i}
  ];
  async function scanCat(cat){
    const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0'});
    const page=await ctx.newPage();
    let prods=[];
    try{
      await page.goto(cat.url,{waitUntil:'domcontentloaded',timeout:45000});
      await page.waitForTimeout(7000);
      prods=await page.evaluate((reSrc)=>{
        const re=new RegExp(reSrc,'i');
        const links=Array.from(document.querySelectorAll('a[href]'));
        const seen=new Set();const out=[];
        for(const a of links){
          const m=a.href.match(re);
          if(m && !seen.has(m[1])){seen.add(m[1]);out.push({id:m[1],slug:m[2],href:a.href});}
        }
        return out;
      }, cat.re.source);
    }catch(e){await ctx.close();return {key:cat.key,err:String(e).slice(0,150)};}
    // For each product, fetch PDF
    const map={};
    for(const p of prods){
      try{
        await page.goto(p.href,{waitUntil:'domcontentloaded',timeout:45000});
        await page.waitForTimeout(2500);
        const pdf=await page.evaluate(()=>{const a=document.querySelector('a[href*="fotoprodotti/dosi/"]');return a?a.href:null;});
        if(pdf){
          try{
            const buf=await page.context().request.get(pdf);
            const body=await buf.body();
            const fn=pdf.split('/').pop();
            putBin(cat.key+'_'+fn, Buffer.from(body));
            map[p.id]={slug:p.slug, downloaded:fn, bytes:body.length};
          }catch(e){map[p.id]={slug:p.slug, dlErr:String(e).slice(0,100)};}
        } else map[p.id]={slug:p.slug, err:'no_pdf_link'};
      }catch(e){map[p.id]={err:String(e).slice(0,100)};}
    }
    await ctx.close();
    return {key:cat.key, products:prods.length, map};
  }
  const results=await Promise.all(cats.map(scanCat));
  await browser.close();
  commit('par3_run.json',JSON.stringify({results},null,1));
  console.log("PAR3 DONE");
})();
