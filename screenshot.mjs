import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const env = { ...process.env };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0'});
  const page=await ctx.newPage();
  // Pirma noras: iš homepage paimti VISUS product-line URL'us
  const out={};
  try{
    await page.goto('https://www.monge.it/en/',{waitUntil:'domcontentloaded',timeout:45000});
    await page.waitForTimeout(5000);
    const lines=await page.evaluate(()=>{
      return [...new Set(Array.from(document.querySelectorAll('a[href]')).map(a=>a.href).filter(h=>/monge\.it\/en\/product-line\//.test(h)))];
    });
    out.allProductLines=lines;
  }catch(e){out.allProductLines=['err:'+String(e).slice(0,100)];}
  // Bandysim atskirai
  for(const slug of ['monge-natural-superpremium','vetsolution','monge-bwild','monge-monoprotein','monge-special-dog','speciality-line','monge-grill','monge-fruits','monge-fresh','b-wild','natural-superpremium','vet-solution']){
    const u=`https://www.monge.it/en/product-line/${slug}/`;
    try{
      const r=await page.goto(u,{waitUntil:'domcontentloaded',timeout:45000});
      await page.waitForTimeout(4000);
      await page.evaluate(()=>{return new Promise(r=>{let t=0;const iv=setInterval(()=>{window.scrollBy(0,500);t+=500;if(t>20000){clearInterval(iv);r();}},80);});});
      await page.waitForTimeout(2000);
      const products=await page.evaluate(()=>{
        return [...new Set(Array.from(document.querySelectorAll('a[href]')).map(a=>a.href).filter(h=>/monge\.it\/en\/product\//.test(h)&&!h.includes('product-line')&&!h.includes('products')))];
      });
      out[slug]={status:r?r.status():'?',products,count:products.length};
    }catch(e){out[slug]={err:String(e).slice(0,150)};}
  }
  await ctx.close();
  await browser.close();
  commit('monge_lines.json',JSON.stringify(out,null,1));
  console.log("DONE");
})();
