import { execSync } from "child_process";
import fs from "fs";

try {execSync('node -e "require(\'playwright-extra\')"',{stdio:'pipe'});}catch(e){execSync('npm install playwright-extra puppeteer-extra-plugin-stealth',{stdio:'inherit'});}
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
  
  // gyvunams24.lt URL'ai - tik SP + 12718 + 12720
  const products=[
    {pid:12718,u:'https://www.gyvunams24.lt/sausas-pasaras-sunims/3281-real-dog-small-breeds-visavertis-pasaras-mazu-veisliu-suaugusiems-sunims-su-vistiena-10kg.html'},
    {pid:14467,u:'https://www.gyvunams24.lt/sausas-pasaras-sunims/7103-real-dog-sp-puppy-all-breeds-lamb-pork-buffalo-with-brown-rice-sausas-pasaras-suniukams-12-kg-.html'},
    {pid:14468,u:'https://www.gyvunams24.lt/sausas-pasaras-sunims/7104-real-dog-sp-adult-mini-lambrice-sausas-pasaras-sunims-12-kg.html'},
    {pid:14469,u:'https://www.gyvunams24.lt/sausas-pasaras-sunims/7105-real-dog-sp-adult-medium-lambrice-sausas-pasaras-sunims-12-kg.html'},
    {pid:14470,u:'https://www.gyvunams24.lt/sausas-pasaras-sunims/7106--real-dog-sp-adult-maxi-lambrice-sausas-pasaras-sunims-12-kg.html'},
    {pid:14471,u:'https://www.gyvunams24.lt/sausas-pasaras-sunims/7107-real-dog-sp-adult-all-breeds-venisonrice-sausas-pasaras-sunims-12-kg.html'},
    {pid:14472,u:'https://www.gyvunams24.lt/sausas-pasaras-sunims/7108-real-dog-sp-adult-all-breeds-buffalorice-sausas-pasaras-sunims-12-kg.html'},
  ];
  
  const out={};
  for(const p of products){
    try{
      await page.goto(p.u,{waitUntil:'domcontentloaded',timeout:45000});
      await page.waitForTimeout(6000);
      const data=await page.evaluate(()=>{
        const fullText=document.body.innerText||document.body.textContent;
        const idx=fullText.search(/Šėrimo\s*(?:rekomendacij|instrukcij|norm)|Šuns svoris/i);
        const ctx=idx>=0?fullText.substring(idx,idx+1500):'NONE';
        return {ctx,bodyLen:fullText.length};
      });
      out[p.pid]=data;
      console.log(`${p.pid}: bodyLen=${data.bodyLen} hasCtx=${data.ctx!=='NONE'}`);
    }catch(e){out[p.pid]={err:String(e).slice(0,100)};}
  }
  await ctx.close();
  await browser.close();
  commit('real_stealth_gy.json',JSON.stringify(out,null,1));
  console.log("done");
})();
