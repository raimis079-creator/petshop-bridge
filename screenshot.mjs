import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}

(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0'});
  const page=await ctx.newPage();
  
  const products=[
    {petshopId:12828,url:'https://www.gyvunams24.lt/sausas-pasaras-sunims/3277-real-dog-sensitive-pasaras-suaugusiems-sunims-su-eriena-ir-ryziais-15kg.html'},
    {petshopId:12719,url:'https://www.gyvunams24.lt/sausas-pasaras-sunims/3279-real-dog-sensitive-pasaras-suaugusiems-sunims-su-antiena-.html'},
    {petshopId:12718,url:'https://www.gyvunams24.lt/sausas-pasaras-sunims/3281-real-dog-small-breeds-visavertis-pasaras-mazu-veisliu-suaugusiems-sunims-su-vistiena-10kg.html'},
    {petshopId:14276,url:'https://www.gyvunams24.lt/sausas-pasaras-sunims/5616-real-dog-adult-all-breeds-horse-rice-sausas-pasaras-sunims-20kg.html'},
    {petshopId:14277,url:'https://www.gyvunams24.lt/sausas-pasaras-sunims/5617-real-dog-adult-all-breeds-pork-rice-sausas-pasaras-sunims-20kg.html'},
    {petshopId:14278,url:'https://www.gyvunams24.lt/sausas-pasaras-sunims/5618-real-dog-adult-all-breeds-salmon-rice-sausas-pasaras-sunims-20kg.html'},
    {petshopId:14279,url:'https://www.gyvunams24.lt/sausas-pasaras-sunims/5619-real-dog-adult-all-breeds-chicken-rice-sausas-pasaras-sunims-20kg.html'},
    {petshopId:14280,url:'https://www.gyvunams24.lt/sausas-pasaras-sunims/5621-real-dog-adult-large-giant-breeds-chicken-rice-sausas-pasaras-sunims-20kg.html'},
    {petshopId:14281,url:'https://www.gyvunams24.lt/sausas-pasaras-sunims/5622-real-dog-puppy-junior-all-breeds-pork-rice-sausas-pasaras-suniukam-su-20kg.html'},
    {petshopId:14467,url:'https://www.gyvunams24.lt/sausas-pasaras-sunims/7103-real-dog-sp-puppy-all-breeds-lamb-pork-buffalo-with-brown-rice-sausas-pasaras-suniukams-12-kg-.html'},
    {petshopId:14468,url:'https://www.gyvunams24.lt/sausas-pasaras-sunims/7104-real-dog-sp-adult-mini-lambrice-sausas-pasaras-sunims-12-kg.html'},
    {petshopId:14469,url:'https://www.gyvunams24.lt/sausas-pasaras-sunims/7105-real-dog-sp-adult-medium-lambrice-sausas-pasaras-sunims-12-kg.html'},
    {petshopId:14470,url:'https://www.gyvunams24.lt/sausas-pasaras-sunims/7106--real-dog-sp-adult-maxi-lambrice-sausas-pasaras-sunims-12-kg.html'},
    {petshopId:14471,url:'https://www.gyvunams24.lt/sausas-pasaras-sunims/7107-real-dog-sp-adult-all-breeds-venisonrice-sausas-pasaras-sunims-12-kg.html'},
    {petshopId:14472,url:'https://www.gyvunams24.lt/sausas-pasaras-sunims/7108-real-dog-sp-adult-all-breeds-buffalorice-sausas-pasaras-sunims-12-kg.html'}
  ];
  
  const out={};
  for(const p of products){
    try{
      const r=await page.goto(p.url,{waitUntil:'domcontentloaded',timeout:45000});
      if(r&&r.status()===404){out[p.petshopId]={status:404};continue;}
      await page.waitForTimeout(1500);
      // Surask šerimo lenteles - paimkim viso teksto bloko apatinę dalį (po "Šėrimo")
      // Paspaudžiam Description tab
      try{await page.click('a[href="#description"]',{timeout:3000});await page.waitForTimeout(500);}catch(e){}
      const data=await page.evaluate(()=>{
        const main=document.body.innerText;
        // Bandymai keliais markeriais
        let idx=main.search(/Šėrimo\s*rekomendacij/i);
        if(idx<0)idx=main.search(/Šėrimo\s*instrukcij/i);
        if(idx<0)idx=main.search(/Šėrimo\s*norm/i);
        if(idx<0)idx=main.search(/Šuns svoris/i);
        if(idx<0){
          const html=document.body.innerHTML.substring(0,3000);
          return {err:'no_marker',hint:html.substring(0,500)};
        }
        const block=main.substring(idx,idx+2500);
        return {block};
      });
      out[p.petshopId]=data;
    }catch(e){out[p.petshopId]={err:String(e).slice(0,100)};}
  }
  await ctx.close();
  await browser.close();
  commit('real_feed_data.json',JSON.stringify(out,null,1));
  console.log("done");
})();
