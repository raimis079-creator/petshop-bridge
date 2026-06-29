import { execSync } from "child_process";
import fs from "fs";
const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
function putBin(name,buf){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:buf.toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});}

// Patikrinkim kelias URL'as
const targets=[
  ['rascocom_home','https://www.rascopremium.cz/'],
  ['rascocom_adult_lamb','https://www.rascopremium.cz/produkty/granule-pro-psy/rasco-premium-adult-lamb-rice'],
  ['rasco_cz','https://www.rasco.cz/'],
  ['supzoo_lamb','https://www.superzoo.cz/rasco-premium-adult-lamb-rice-15kg/'],
];

(async()=>{
  // npm install playwright-extra (skipping - tarpas package'as)
  execSync('cd /tmp && npm install --silent puppeteer-extra puppeteer-extra-plugin-stealth playwright-extra 2>&1 | tail -5',{encoding:'utf8',stdio:'inherit'});
  
  const { chromium } = await import('playwright-extra');
  const stealth = (await import('puppeteer-extra-plugin-stealth')).default();
  chromium.use(stealth);
  
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',viewport:{width:1366,height:900}});
  const page=await ctx.newPage();
  
  const results={};
  for(const [name,url] of targets){
    try{
      await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
      await page.waitForTimeout(3500);
      const buf=await page.screenshot({fullPage:true});
      putBin(`rasco_${name}.png`,buf);
      const html=await page.content();
      // Iškirpkim 5000 simbolių aplink "dávk" arba "tabulk"
      const lc=html.toLowerCase();
      const idx=Math.max(lc.search(/krmn[áé]\s*d[áa]vka/),lc.search(/krmn[áé]\s*tabulka/),lc.search(/feeding/),lc.search(/krmivo\/den/),lc.search(/g\/den/),lc.search(/hmotnost\s*psa/));
      const snippet=idx>=0?html.substring(Math.max(0,idx-500),idx+3000):html.substring(0,3000);
      results[name]={url,snippetIdx:idx,htmlLen:html.length,snippet};
    }catch(e){results[name]={url,err:String(e).slice(0,150)};}
  }
  commit('rasco_fetch.json',JSON.stringify(results,null,1));
  await ctx.close();
  await browser.close();
  console.log("done");
})();
