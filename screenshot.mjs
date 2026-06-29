import { execSync } from "child_process";
import fs from "fs";

// Install playwright-extra and stealth if missing
try {
  execSync('node -e "require(\'playwright-extra\')"',{stdio:'pipe'});
} catch(e) {
  console.log("Installing playwright-extra...");
  execSync('npm install playwright-extra puppeteer-extra-plugin-stealth',{stdio:'inherit'});
}

const { chromium } = await import("playwright-extra");
const stealth = (await import("puppeteer-extra-plugin-stealth")).default();
chromium.use(stealth);

const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}

(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({
    ignoreHTTPSErrors:true,
    userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    viewport:{width:1920,height:1080},
    locale:'lt-LT',
    timezoneId:'Europe/Vilnius',
    extraHTTPHeaders:{
      'Accept-Language':'lt-LT,lt;q=0.9,en;q=0.8',
      'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    }
  });
  const page=await ctx.newPage();
  
  const products=[
    {pid:14279,u:'https://boniveta.lt/real-dog-adult-all-breeds-chickenrice-20kg/'},
    {pid:14276,u:'https://boniveta.lt/real-dog-adult-all-breeds-horserice-20kg/'},
    {pid:14277,u:'https://boniveta.lt/real-dog-adult-all-breeds-porkrice-20kg/'},
    {pid:14278,u:'https://boniveta.lt/real-dog-adult-all-breeds-salmon-rice-20kg/'},
    {pid:14280,u:'https://boniveta.lt/real-dog-adult-largegiant-breeds-chickenrice-20kg/'},
    {pid:12718,u:'https://boniveta.lt/real-dog-adult-small-breeds-10kg/'},
    {pid:14281,u:'https://boniveta.lt/real-dog-puppyjunior-all-breeds-porkrice-20kg/'},
    {pid:12719,u:'https://boniveta.lt/real-dog-sensitive-duck-vegetables-15kg/'},
    {pid:12828,u:'https://boniveta.lt/real-dog-sensitive-ramb-rice-15kg/'},
    {pid:14467,u:'https://boniveta.lt/real-dog-puppy-all-breeds-lamb-pork-buffalo-with-brown-rice-12-kg/'},
    {pid:14472,u:'https://boniveta.lt/real-dog-sp-all-breeds-buffalorice-12kg/'},
    {pid:14473,u:'https://boniveta.lt/real-dog-sp-all-breeds-horserice-12kg/'},
    {pid:14471,u:'https://boniveta.lt/real-dog-sp-all-breeds-venisonrice-12kg/'},
    {pid:14470,u:'https://boniveta.lt/real-dog-sp-maxi-adult-lambrice-12kg/'},
    {pid:14469,u:'https://boniveta.lt/real-dog-sp-medium-adult-lambrice-12kg/'},
    {pid:14468,u:'https://boniveta.lt/real-dog-sp-mini-adult-lambrice-12kg/'},
    {pid:12720,u:'https://boniveta.lt/real-dog-adult-breeds/'},
  ];
  
  const out={};
  for(const p of products){
    try{
      await page.goto(p.u,{waitUntil:'networkidle',timeout:60000});
      await page.waitForTimeout(2500);
      try{await page.click('a[href="#tab-description"]',{timeout:2000});await page.waitForTimeout(500);}catch(e){}
      const data=await page.evaluate(()=>{
        const tables=Array.from(document.querySelectorAll('table'));
        const feedTables=tables.filter(t=>{
          const tx=(t.innerText||t.textContent||'').toLowerCase();
          return tx.includes('paros norm')||tx.includes('dienos norm')||tx.includes('šuns svoris')||tx.includes('svoris');
        }).map(t=>t.outerHTML);
        const fullText=document.body.innerText||document.body.textContent;
        const idx=fullText.search(/REKOMENDUOJAMA PAROS NORMA|Šėrimo|Šuns svoris/i);
        const ctx=idx>=0?fullText.substring(idx,idx+1500):'NONE';
        return {tables:feedTables,ctx,bodyLen:fullText.length};
      });
      out[p.pid]=data;
      console.log(`${p.pid}: tables=${data.tables.length} bodyLen=${data.bodyLen}`);
    }catch(e){out[p.pid]={err:String(e).slice(0,100)};}
  }
  await ctx.close();
  await browser.close();
  commit('real_stealth.json',JSON.stringify(out,null,1));
  console.log("done");
})();
