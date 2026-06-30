import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
function putBin(name,buf){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }catch(e){}
}
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+String(e).slice(0,200); } }
(async()=>{
  // Paimu kategorijų URL per REST
  const cmd = `curl -sk -H "Authorization: ${AUTH}" "${BASE}/wp-json/wc/v3/products/categories?slug=skanestu-rinkiniai,konservu-rinkiniai&per_page=10"`;
  const raw = exec(cmd);
  let cats;
  try { cats = JSON.parse(raw); } catch(e) { cats = []; }
  let urls = {};
  for (const c of cats) {
    urls[c.slug] = { id: c.id, name: c.name, count: c.count, link: c.links && c.links.collection ? c.links.collection[0] : '' };
  }
  // Taip pat bandau su tėvine "rinkiniai" kategorija
  const cmd2 = `curl -sk -H "Authorization: ${AUTH}" "${BASE}/wp-json/wc/v3/products/categories?slug=rinkiniai&per_page=5"`;
  const raw2 = exec(cmd2);
  try { const c2 = JSON.parse(raw2); for(const c of c2) urls[c.slug] = {id:c.id, name:c.name, count:c.count}; } catch(e){}

  console.log(JSON.stringify(urls, null, 1));

  // Naudoju tavo screenshot URL - iš tavo nuotraukos matau, kad puslapyje rinkiniai buvo matomi
  // Greičiausiai tai buvo paieška arba tag page, ne category page
  // Pabandysiu Flatsome/WC shop page su ?product_cat=skanestu-rinkiniai
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:1000}});
  const page=await ctx.newPage();
  // Bandau shop page su filtru
  await page.goto(BASE+'/shop/?product_cat=skanestu-rinkiniai&nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page.waitForTimeout(5000);
  const title = await page.title();
  putBin('badge_shop.png', await page.screenshot({fullPage:false}));
  console.log("Title:", title);
  await ctx.close(); await browser.close();
})();
