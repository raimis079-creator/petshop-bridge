import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const env = { ...process.env };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
function putBin(name,buf){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:buf.toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const urls=[
  // Natural Superpremium DOG (~25)
  'all-breeds-light-al-salmone-e-riso',
  'all-breeds-adult-salmon-and-rice',
  'all-breeds-adult-duck-rice-and-potatoes',
  'maxi-adult-rich-in-chicken',
  'all-breeds-adult-lamb-rice-and-potatoes',
  'all-breeds-adult-monoprotein-beef-with-rice',
  'all-breeds-adult-monoprotein-trout-with-rice-and-potatoes',
  'all-breeds-adult-pork-rice-and-potatoes',
  'all-breeds-active-chicken',
  'medium-adult-rich-in-chicken',
  'all-breeds-hypoallergenic-al-salmone-e-tonno',
  'monge-natural-superpremium-all-breeds-adult-monoprotein-turkey-with-rice-and-potatoes',
  'all-breeds-puppy-junior-agnello-riso-e-patate',
  'all-breeds-puppy-junior-con-salmone-e-riso',
  'mini-senior-ricco-in-pollo',
  'mini-starter-con-pollo',
  'extra-small-adult-con-pollo',
  'mini-adult-con-salmone-e-riso',
  'extra-small-puppy-junior-rich-in-chicken',
  'all-breeds-adult-rich-in-chicken',  // spejimas
  'mini-adult-rich-in-chicken',         // spejimas
  'mini-puppy-junior-rich-in-chicken',  // spejimas
  'medium-puppy-junior-rich-in-chicken',// spejimas
  'maxi-puppy-junior-rich-in-chicken',  // spejimas
  // BWild
  'low-grain-deer-all-breeds-puppy-junior',
  'grain-free-anchovies-with-potatoes-and-peas-mini-adult',
  'low-grain-wild-boar-all-breeds-adult',
  'grain-free-anchovies-with-potatoes-and-peas-all-breeds-adult',
  'grain-free-duck-with-potatoes-all-breeds-puppy-junior',
  'low-grain-wild-boar-all-breeds-puppy-junior',  // spejimas
  'low-grain-deer-all-breeds-adult',                // spejimas
  // CAT
  'hairball-rich-in-chicken',
  'sterilized-con-pollo',
  'sterilized-monoprotein-beef',  // spejimas
  'sterilized-monoprotein-duck',  // spejimas
  'sterilized-monoprotein-codfish', // spejimas
  'monoprotein-sterilised-cat-beef',  // spejimas alternatyva
  'monoprotein-sterilised-cat-duck',  // spejimas alternatyva
  'urinary-rich-in-chicken',
  'kitten-rich-in-chicken',
  'adult-cat-rich-in-chicken',
  'monoprotein-rich-in-chicken-cat'
];
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0'});
  const page=await ctx.newPage();
  // Pirma homepage cookies
  await page.goto('https://www.monge.it/en/',{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForTimeout(3000);
  const out={};
  let totalDownloaded=0;
  for(const slug of urls){
    const u='https://www.monge.it/en/product/'+slug+'/';
    try{
      const r=await page.goto(u,{waitUntil:'domcontentloaded',timeout:45000});
      await page.waitForTimeout(2500);
      if(r&&r.status()===404){out[slug]={status:404};continue;}
      const pdf=await page.evaluate(()=>{
        // Ieskom PDF link is product page
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
            totalDownloaded++;
          } else out[slug]={status:r.status(),pdf,err:'small_or_bad_'+body.length};
        }catch(e){out[slug]={status:r.status(),pdf,dlErr:String(e).slice(0,80)};}
      } else out[slug]={status:r.status(),err:'no_pdf'};
    }catch(e){out[slug]={err:String(e).slice(0,150)};}
  }
  await ctx.close();
  await browser.close();
  commit('monge_pdfs.json',JSON.stringify({totalDownloaded,results:out},null,1));
  console.log("DONE",totalDownloaded);
})();
