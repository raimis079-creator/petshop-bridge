import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const env = { ...process.env };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
function putBin(name,buf){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:buf.toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0'});
  const page=await ctx.newPage();
  await page.goto('https://www.monge.it/en/',{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForTimeout(2000);
  const slugs=[
    // Patvirtinti
    'low-grain-hare-adult',
    'all-breeds-adult-con-coniglio-con-riso-e-patate',
    'adult-monoprotein-rabbit',
    'monge-natural-superpremium-all-breeds-puppy-and-junior-monoprotein-duck-with-rice-and-potatoes',
    'monge-natural-superpremium-all-breeds-puppy-and-junior-monoprotein-pork-with-rice-and-potatoes',
    'monge-natural-superpremium-mini-puppy-and-junior-monoprotein-salmon-with-rice',
    'grain-free-duck-with-potatoes-mini-adult',
    // Spec.Line monoprotein Adult Lamb 
    'monge-natural-superpremium-mini-adult-monoprotein-lamb',
    'all-breeds-adult-monoprotein-lamb-with-rice-and-potatoes',
    'mini-adult-monoprotein-lamb-with-rice-and-potatoes',
    // BWild Buffalo dog
    'low-grain-buffalo-all-breeds-adult',
    'low-grain-buffalo-large-breed',
    'grain-free-buffalo-large-breeds',
    'low-grain-buffalo-adult',
    // CAT BWild Buffalo Large Breeds  
    'low-grain-buffalo-adult-cat',
    'grain-free-buffalo-large-breeds-cat',
    'large-breeds-buffalo',
    // Spec.Line Mini Puppy Lamb
    'mini-puppy-junior-agnello-riso-e-patate',
    'monge-natural-superpremium-mini-puppy-and-junior-monoprotein-lamb-with-rice-and-potatoes',
    // CAT Hairball / Anchovies BWild
    'low-grain-anchovies-adult-cat',
    'bwild-low-grain-anchovies-cat',
    // Hare/Coniglio
    'low-grain-hare-puppy-junior',
    // Special Dog Excellence
    'mini-adult','maxi-adult','all-breeds-adult','medium-puppy','mini-puppy',
    // Sterilised Adult Duck (12583)
    'sterilised-duck','sterilised-adult-duck','sterilizes-monoprotein-adult-duck'
  ];
  const out={};
  let total=0;
  for(const slug of slugs){
    const u='https://www.monge.it/en/product/'+slug+'/';
    try{
      const r=await page.goto(u,{waitUntil:'domcontentloaded',timeout:45000});
      await page.waitForTimeout(1500);
      if(r&&r.status()===404){out[slug]={status:404};continue;}
      const pdf=await page.evaluate(()=>{
        const a=Array.from(document.querySelectorAll('a[href]')).find(a=>/\.pdf/i.test(a.href)&&/Monge/i.test(a.href)&&!/Informativa/i.test(a.href));
        return a?a.href:null;
      });
      if(pdf){
        try{
          const buf=await ctx.request.get(pdf);
          const body=await buf.body();
          if(buf.status()===200 && body.length>3000){
            const fn='monge_'+slug+'.pdf';
            putBin(fn,Buffer.from(body));
            out[slug]={status:200,bytes:body.length};
            total++;
          } else out[slug]={status:r.status(),err:'small_'+body.length};
        }catch(e){out[slug]={status:r.status(),dlErr:String(e).slice(0,80)};}
      } else out[slug]={status:r.status(),err:'no_pdf'};
    }catch(e){out[slug]={err:String(e).slice(0,150)};}
  }
  await ctx.close();
  await browser.close();
  commit('monge_pdfs4.json',JSON.stringify({total,results:out},null,1));
  console.log("DONE",total);
})();
