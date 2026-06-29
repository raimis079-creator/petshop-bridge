import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
function putBin(name,buf){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:buf.toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});}

const targets=[
  ['rasco_lamb','https://www.rascopremium.cz/produkty/granule-pro-psy/rasco-premium-adult-lamb-and-rice'],
  ['rasco_home','https://www.rascopremium.cz/'],
  ['superzoo_lamb','https://www.superzoo.cz/rasco-premium-adult-lamb-rice-15kg/'],
  ['superzoo_medium','https://www.superzoo.cz/rasco-premium-adult-medium-15kg/'],
  ['bastadomisky_lamb','https://www.bastadomisky.cz/RASCO-Premium-Adult-Lamb-Rice-15kg-d30294.htm'],
];

(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox','--disable-blink-features=AutomationControlled']});
  const ctx=await browser.newContext({
    ignoreHTTPSErrors:true,
    userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    viewport:{width:1366,height:900},
    locale:'cs-CZ',
    extraHTTPHeaders:{'Accept-Language':'cs-CZ,cs;q=0.9,en;q=0.8'}
  });
  const page=await ctx.newPage();
  await page.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
  
  const results={};
  for(const [name,url] of targets){
    try{
      await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
      await page.waitForTimeout(4000);
      const buf=await page.screenshot({fullPage:true});
      putBin(`rasco_${name}.png`,buf);
      const html=await page.content();
      const lc=html.toLowerCase();
      const m=[lc.search(/krmn[áé]\s*d[áa]vka/),lc.search(/krmn[áé]\s*tabulka/),lc.search(/hmotnost\s*psa/),lc.search(/feeding/),lc.search(/dávka/),lc.search(/g\/den/),lc.search(/g\s+per\s+day/)].filter(x=>x>=0);
      const idx=m.length?Math.min(...m):-1;
      const snippet=idx>=0?html.substring(Math.max(0,idx-500),idx+3000):html.substring(0,3000);
      results[name]={url,htmlLen:html.length,foundIdx:idx,snippet};
    }catch(e){results[name]={url,err:String(e).slice(0,150)};}
  }
  commit('rasco_fetch.json',JSON.stringify(results,null,1));
  await ctx.close();
  await browser.close();
  console.log("done");
})();
