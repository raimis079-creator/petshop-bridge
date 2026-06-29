import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putBin(name,buf){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});
}
const URL='https://dev.avesa.lt/product/test-konservu-rinkinys-6-vnt-mnm/';
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  // DESKTOP
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:1000}, userAgent:'Mozilla/5.0'});
  const page=await ctx.newPage();
  await page.goto(URL+'?nc='+Date.now(), {waitUntil:'networkidle', timeout:60000});
  await page.waitForTimeout(2500);
  putBin('mnm_desktop_top.png', await page.screenshot({clip:{x:0,y:170,width:1440,height:830}}));
  // full page to see all components
  putBin('mnm_desktop_full.png', await page.screenshot({fullPage:true}));
  // grab text of the mnm area for out-of-stock evidence
  try{
    const txt = await page.evaluate(()=>{
      const el = document.querySelector('.mnm_form, .wc-mnm-form, form.cart, .mnm_child_products, .products');
      return el ? el.innerText.slice(0,1500) : document.body.innerText.slice(0,1500);
    });
    fs.writeFileSync('/tmp/t.txt', txt);
    const url='https://api.github.com/repos/'+repo+'/contents/screenshots/mnm_text.txt';
    let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
    const body={message:'r',branch:'main',content:Buffer.from(txt,'utf8').toString('base64')}; if(sha) body.sha=sha;
    fs.writeFileSync('/tmp/cb2.json',JSON.stringify(body));
    execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb2.json "'+url+'"',{encoding:'utf8'});
  }catch(e){}
  await ctx.close();
  // MOBILE
  const m=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:390,height:900}, userAgent:'Mozilla/5.0 (iPhone)', isMobile:true});
  const mp=await m.newPage();
  await mp.goto(URL+'?nc='+Date.now(), {waitUntil:'networkidle', timeout:60000});
  await mp.waitForTimeout(2500);
  putBin('mnm_mobile_full.png', await mp.screenshot({fullPage:true}));
  await m.close();
  await browser.close();
  console.log("DONE");
})();
