import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fc',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function putFile(name,str){ putBin(name, Buffer.from(str,'utf8')); }
(async()=>{
  const out={};
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  const ctx = await browser.newContext({ httpCredentials:{ username:WPU, password:WPP }, ignoreHTTPSErrors:true, viewport:{width:1280,height:1400} });
  const page = await ctx.newPage();
  // konsolės klaidos
  const errors=[];
  page.on('console', m=>{ if(m.type()==='error') errors.push(m.text().slice(0,120)); });
  page.on('pageerror', e=>{ errors.push('PAGEERR: '+String(e).slice(0,120)); });
  // SAUSAS MAISTAS kategorija
  await page.goto(DEV+'/kategorija/sunims/maistas-sunims/?nc='+Date.now(), { waitUntil:'domcontentloaded', timeout:60000 });
  await page.waitForTimeout(4000);
  out.errors=errors.slice(0,8);
  // ar filtru widgetai renderinasi? YITH / speciali mityba / grudai
  out.filters = await page.evaluate(()=>{
    const bodyText=document.body.innerText;
    return {
      has_speciali: bodyText.includes('Speciali mityba')||bodyText.includes('speciali mityba'),
      has_grudai: bodyText.includes('Grūdų')||bodyText.includes('grūdų')||bodyText.includes('Be grūdų'),
      has_baltymu: bodyText.includes('Baltymų')||bodyText.includes('baltym'),
      has_monoprotein: bodyText.includes('onoprotein'),
      has_kaina: bodyText.includes('Kaina')||bodyText.includes('FILTRUOTI'),
      product_count: (document.querySelectorAll('.product, li.product, .product-small').length),
      yith_widget: !!document.querySelector('.yith-wcan, .yith-wcan-filters, [class*="yith"]'),
      sidebar: !!document.querySelector('.sidebar, #secondary, .widget-area, .shop-sidebar'),
      // ar rodo "nerasta" ar produktus?
      no_products: bodyText.includes('Nerasta produktų')||bodyText.includes('No products')
    };
  });
  putBin('filtcheck_maistas.png', await page.screenshot({ fullPage:false, clip:{x:0,y:0,width:1280,height:1400} }));
  await browser.close();
  putFile('filtcheck.json', JSON.stringify(out));
})().catch(e=>{ console.log('ERR', String(e).slice(0,200)); });
