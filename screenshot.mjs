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
    viewport:{width:1920,height:1080}
  });
  const page=await ctx.newPage();
  
  const products=[
    {pid:14467,u:'https://boniveta.lt/real-dog-puppy-all-breeds-lamb-pork-buffalo-with-brown-rice-12-kg/'},
    {pid:14472,u:'https://boniveta.lt/real-dog-sp-all-breeds-buffalorice-12kg/'},
    {pid:14470,u:'https://boniveta.lt/real-dog-sp-maxi-adult-lambrice-12kg/'},
  ];
  
  const out={};
  for(const p of products){
    try{
      await page.goto(p.u,{waitUntil:'networkidle',timeout:60000});
      await page.waitForTimeout(2500);
      try{await page.click('a[href="#tab-description"]',{timeout:2000});await page.waitForTimeout(800);}catch(e){}
      const data=await page.evaluate(()=>{
        // Aprašymo tab description content
        const desc=document.querySelector('#tab-description');
        const descHtml=desc?desc.outerHTML:'';
        // Visus lenteles
        const tables=Array.from(document.querySelectorAll('table'));
        const tableHtml=tables.map(t=>t.outerHTML).join('\n\n');
        // Pirmas 5000 simb. desc HTML
        return {descHtml:descHtml.substring(0,8000),tableHtml:tableHtml.substring(0,5000),tableCount:tables.length};
      });
      out[p.pid]=data;
    }catch(e){out[p.pid]={err:String(e).slice(0,100)};}
  }
  await ctx.close();
  await browser.close();
  commit('real_sp_deep.json',JSON.stringify(out,null,1));
  console.log("done");
})();
