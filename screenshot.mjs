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
  // CAT URL spejimai - kelios formos
  const slugs=[
    // CAT - vistiena/lasisa/jautiena
    'monoprotein-sterilised-cat-codfish','monoprotein-sterilised-cat-salmon',
    'monoprotein-sterilised-cat-anchovies','sterilised-monoprotein-codfish',
    'monoprotein-sterilised-codfish','monoprotein-sterilised-salmon','monoprotein-sterilised-beef','monoprotein-sterilised-duck',
    'adult-cat-rich-in-chicken','adult-rich-in-chicken-cat',
    'adult-cat-con-pollo','urinary-cat','urinary',
    'monge-natural-superpremium-monoprotein-sterilised-cat-codfish',
    'monge-natural-superpremium-monoprotein-sterilised-cat-beef',
    'monge-natural-superpremium-monoprotein-sterilised-cat-duck',
    'monge-natural-superpremium-monoprotein-sterilised-cat-salmon',
    // DOG papildomi
    'mini-adult-con-pollo','mini-adult-rich-in-chicken-2',
    'all-breeds-adult-rich-in-chicken-rice','all-breeds-adult-chicken-rice',
    'medium-puppy-junior-con-pollo','medium-puppy-junior-rich-in-chicken-rice',
    'maxi-puppy-junior-rich-in-chicken-2','low-grain-wild-boar-all-breeds-puppy',
    // BWild atskirai
    'grain-free-irregular-cut-chunks-in-gravy-duck-with-pumpkin-and-zucchini-puppy-junior',
    'grain-free-irregular-cut-chunkies-in-gravy-duck-with-pumpkin-and-zucchini-mini-adult',
    'grain-free-irregular-cut-chunks-in-gravy-salmon-with-pumpkin-and-zucchini-adult',
    'grain-free-irregular-cut-chunks-in-gravy-turkey-with-pumpkin-and-zucchini-adult',
    'grain-free-irregular-cut-chunks-in-gravy-lamb-with-pumpkin-and-zucchini-adult'
  ];
  const out={};
  let total=0;
  for(const slug of slugs){
    const u='https://www.monge.it/en/product/'+slug+'/';
    try{
      const r=await page.goto(u,{waitUntil:'domcontentloaded',timeout:45000});
      await page.waitForTimeout(2000);
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
            out[slug]={status:200,pdf,bytes:body.length,fn};
            total++;
          } else out[slug]={status:r.status(),pdf,err:'small_'+body.length};
        }catch(e){out[slug]={status:r.status(),dlErr:String(e).slice(0,80)};}
      } else out[slug]={status:r.status(),err:'no_pdf'};
    }catch(e){out[slug]={err:String(e).slice(0,150)};}
  }
  await ctx.close();
  await browser.close();
  commit('monge_pdfs2.json',JSON.stringify({total,results:out},null,1));
  console.log("DONE",total);
})();
