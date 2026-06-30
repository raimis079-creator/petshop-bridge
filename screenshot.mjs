import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
function commitTxt(name,str){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }catch(e){}
}
const URLS = {
  cat: 'https://dev.avesa.lt/kategorija/rinkiniai/konservu-rinkiniai/',
  prod: 'https://dev.avesa.lt/product/animonda-grancarno-rinkinys-%c2%b7-6x400g/'
};
(async()=>{
  const log={ts:new Date().toISOString(), found:{}};
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:1500}});
  const page=await ctx.newPage();

  // 1. PRODUCT PAGE
  await page.goto(URLS.prod+'?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page.waitForTimeout(5000);
  const prod = await page.evaluate(()=>{
    const out={};
    // CLEAR SELECTIONS
    const clear = document.querySelector('a[href*="clear"], .mnm_reset_container, .clear_mnm, [class*="clear"], [class*="reset"]');
    out.clear_html = clear ? clear.outerHTML.slice(0,400) : 'NF';
    // ieskau pagal teksta
    const all = [...document.querySelectorAll('a, button, span')].filter(el => /clear selections/i.test(el.textContent||''));
    out.clear_by_text = all.map(el => ({tag:el.tagName, cls:el.className, href:el.href||null, txt:(el.textContent||'').trim().slice(0,40)}));
    // Add to cart
    const atc = document.querySelector('button.single_add_to_cart_button, .single_add_to_cart_button');
    out.atc_text = atc?.textContent?.trim() || 'NF';
    out.atc_attrs = atc ? Array.from(atc.attributes).map(a=>a.name+'='+a.value.slice(0,40)).join(', ') : 'NF';
    return out;
  });
  log.found.product = prod;

  // 2. CATEGORY PAGE
  await page.goto(URLS.cat+'?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page.waitForTimeout(5000);
  const cat = await page.evaluate(()=>{
    const out={};
    const allBtns = [...document.querySelectorAll('a.button, button.button, a.add_to_cart_button')];
    out.btns_sample = allBtns.slice(0,5).map(el => ({tag:el.tagName, cls:el.className, txt:(el.textContent||'').trim().slice(0,40), href:el.href||null}));
    return out;
  });
  log.found.category = cat;

  commitTxt('lt_recon.json', JSON.stringify(log,null,2));
  await ctx.close(); await browser.close();
  console.log("DONE");
})();
