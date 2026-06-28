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
  const out={};
  for(const url of [
    'https://www.farmina.com/it/eshop-cat',
    'https://www.farmina.com/it/eshop-cat/alimenti-per-gatti/'
  ]){
    try{
      await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
      await page.waitForTimeout(5000);
      const links=await page.evaluate(()=>{
        return [...new Set(Array.from(document.querySelectorAll('a[href]')).map(a=>a.href).filter(h=>/eshop-cat\/alimenti-per-gatti\/\d+/i.test(h)))].slice(0,40);
      });
      out[url]=links;
    }catch(e){out[url]=['err:'+String(e).slice(0,150)];}
  }
  await ctx.close();
  await browser.close();
  commit('topdisc.json',JSON.stringify(out,null,1));
  console.log("DONE");
})();
