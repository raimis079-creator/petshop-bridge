import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const env = { ...process.env };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
function putBin(name,buf){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:buf.toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  // 4 agentai paraleliai per N&D feline linijas — IT eshop puslapis veikia su parent line
  const lines=[
    {key:'prime_cat', parent:'https://www.farmina.com/it/eshop/alimenti-per-gatti/n&d-prime-feline/'},
    {key:'ocean_cat', parent:'https://www.farmina.com/it/eshop/alimenti-per-gatti/n&d-ocean-feline/'},
    {key:'quinoa_cat', parent:'https://www.farmina.com/it/eshop/alimenti-per-gatti/n&d-quinoa-feline/'},
    {key:'tropical_cat', parent:'https://www.farmina.com/it/eshop/alimenti-per-gatti/n&d-tropical-selection-feline/'},
    {key:'matisse', parent:'https://www.farmina.com/it/eshop/alimenti-per-gatti/matisse/'}
  ];
  async function scanLine(L){
    const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0'});
    const page=await ctx.newPage();
    let prods=[],errMsg='';
    try{
      const resp=await page.goto(L.parent,{waitUntil:'domcontentloaded',timeout:45000});
      await page.waitForTimeout(6000);
      await page.evaluate(()=>{return new Promise(r=>{let t=0;const iv=setInterval(()=>{window.scrollBy(0,500);t+=500;if(t>20000){clearInterval(iv);r();}},80);});});
      await page.waitForTimeout(2000);
      const links=await page.evaluate((seg)=>{
        return [...new Set(Array.from(document.querySelectorAll('a[href]')).map(a=>a.href).filter(h=>h.includes(seg) && /\d+-[^/]+\.html$/.test(h)))];
      }, L.parent.match(/alimenti-per-gatti\/[^/]+/)[0]);
      prods=links.map(href=>{const m=href.match(/\/(\d+)-([^.]+)\.html$/);return m?{id:m[1],slug:m[2],href}:null;}).filter(Boolean);
      const seen=new Set();prods=prods.filter(p=>{if(seen.has(p.id))return false;seen.add(p.id);return true;});
      if(!prods.length) errMsg='no_prods_status_'+(resp?resp.status():'?');
    }catch(e){errMsg=String(e).slice(0,200);}
    const map={};
    for(const p of prods){
      try{
        await page.goto(p.href,{waitUntil:'domcontentloaded',timeout:45000});
        await page.waitForTimeout(2500);
        // Ieskom dosi PDF/JPG/PNG visomis formomis
        const pdf=await page.evaluate(()=>{
          const a=document.querySelector('a[href*="fotoprodotti/dosi/"]');
          if(a)return a.href;
          const img=document.querySelector('img[src*="fotoprodotti/dosi/"]');
          if(img)return img.src;
          return null;
        });
        if(pdf){
          try{
            const buf=await page.context().request.get(pdf);
            const body=await buf.body();
            const fn=pdf.split('/').pop().replace(/%20/g,'_');
            putBin(L.key+'_'+fn, Buffer.from(body));
            map[p.id]={slug:p.slug, downloaded:fn, bytes:body.length};
          }catch(e){map[p.id]={slug:p.slug, dlErr:String(e).slice(0,100)};}
        } else map[p.id]={slug:p.slug, err:'no_pdf_link'};
      }catch(e){map[p.id]={err:String(e).slice(0,100)};}
    }
    await ctx.close();
    return {key:L.key, products:prods.length, map, errMsg};
  }
  const results=await Promise.all(lines.map(scanLine));
  await browser.close();
  commit('par9_run.json',JSON.stringify({results},null,1));
  console.log("PAR9 DONE");
})();
