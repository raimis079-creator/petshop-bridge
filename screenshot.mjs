import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'sp',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function putFile(name,str){ putBin(name, Buffer.from(str,'utf8')); }
(async()=>{
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  const out = {};
  for(const [name, url] of [['pasiulymai','/pasiulymai/'], ['akcijos','/akcijos/']]){
    const ctx = await browser.newContext({ httpCredentials:{ username:WPU, password:WPP }, ignoreHTTPSErrors:true, viewport:{width:1280,height:1600} });
    const page = await ctx.newPage();
    await page.goto(DEV+url+'?nc='+Date.now(), { waitUntil:'domcontentloaded', timeout:60000 });
    await page.waitForTimeout(4000);
    out[name] = await page.evaluate(()=>{
      // Realių produktų kortelės, be footer widgetų
      const mainProducts = document.querySelectorAll('.products .product, main .product-small, .shop-container .product');
      const h1 = document.querySelector('h1');
      const bodyText = document.body.innerText.slice(0, 500);
      return {
        h1: h1?h1.innerText.trim().slice(0,100):'?',
        main_products: mainProducts.length,
        body_first: bodyText.replace(/\s+/g,' ').slice(0,300),
      };
    });
    putBin('shot_'+name+'.png', await page.screenshot({ fullPage:false, clip:{x:0,y:0,width:1280,height:1600} }));
    await ctx.close();
  }
  await browser.close();
  putFile('shot_pasiul.json', JSON.stringify(out));
})().catch(e=>{ console.log('ERR', String(e).slice(0,200)); });
