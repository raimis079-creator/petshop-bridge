import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
// Tikrai paprasta: ID 100-1300, kiekvienam tikrinam ar dosi puslapyje yra failas su "feline" ar "matisse"
// Per HEAD su google paieska netinka, tad bandysim listing per HTTP requests pavyzdziui per gauk-katalog.
// Geriausias kelias: dosi index puslapis arba paprasti GET su pattern '/{ID}_*'
// Bet siaip dosi katalogo nera, todel Googlename
// Sis brute SCAN nepavyks be tikslaus failo vardo.
//
// Sutariam: iesim per Playwright -> Google paieska kiekvienai linijai (mes turim WP receptu pavadinimus, todel ziurim)
import { chromium } from "playwright";
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0'});
  const page=await ctx.newPage();
  // Per Google paieska kiekvienai linijai dosi PDF/JPG/PNG
  // Owner direktyva: gamintojo puslapis = farmina.com — tad pakanka tikrinti URL is google ir parsisiusti tiesiogiai
  const queries=[
    {key:'prime', q:'site:farmina.com fotoprodotti dosi nd-prime-feline'},
    {key:'ocean', q:'site:farmina.com fotoprodotti dosi nd-ocean-feline'},
    {key:'quinoa', q:'site:farmina.com fotoprodotti dosi nd-quinoa-functional-feline'},
    {key:'tropical', q:'site:farmina.com fotoprodotti dosi nd-tropical-selection-feline'},
    {key:'matisse', q:'site:farmina.com fotoprodotti dosi matisse'},
  ];
  const out={};
  for(const {key,q} of queries){
    try{
      const url='https://www.google.com/search?q='+encodeURIComponent(q);
      await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
      await page.waitForTimeout(3000);
      const links=await page.evaluate(()=>{
        return [...new Set(Array.from(document.querySelectorAll('a[href]')).map(a=>a.href).filter(h=>/farmina\.com\/fotoprodotti\/dosi\//i.test(h)).map(h=>{const m=h.match(/farmina\.com\/fotoprodotti\/dosi\/[^&"\s]+/i);return m?m[0]:h;}))].slice(0,30);
      });
      out[key]={query:q,links};
    }catch(e){out[key]={err:String(e).slice(0,150)};}
    await page.waitForTimeout(1500);
  }
  await ctx.close();
  await browser.close();
  commit('google_dosi.json',JSON.stringify(out,null,1));
  console.log("DONE");
})();
