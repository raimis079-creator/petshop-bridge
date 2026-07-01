import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putBin(name,buf){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb.json',JSON.stringify(body)); try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function commit(name, str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb2.json',JSON.stringify(body)); try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb2.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1280,height:900}});
  const page=await ctx.newPage();
  await page.goto('https://dev.avesa.lt/product/susirink-konservu-rinkini-sunims-pats/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page.waitForTimeout(8000);
  function countBtns(){ return page.evaluate(()=>document.querySelectorAll('.psc-cta-slot .single_add_to_cart_button').length); }
  var start = await countBtns();
  // Perjungiu dydžius: 6, 15, 12, 6, 15 (kelis kartus)
  var seq = ['6','15','12','6','15','12'];
  for(var s of seq){
    await page.evaluate((sz)=>{
      var btn = document.querySelector('.psc-size-btn[data-size="'+sz+'"]');
      if(btn) btn.click();
    }, s);
    await page.waitForTimeout(400);
  }
  await page.waitForTimeout(1000);
  var afterSizes = await countBtns();
  // Perjungiu svorį: 800, 400, 800
  for(var w of ['800','400','800']){
    await page.evaluate((ww)=>{ var b=document.querySelector('.psc-gram-btn[data-gram="'+ww+'"]'); if(b) b.click(); }, w);
    await page.waitForTimeout(400);
  }
  await page.waitForTimeout(1500);
  var afterAll = await countBtns();
  commit('btncount.json', JSON.stringify({start, afterSizes, afterAll},null,1));
  putBin('btncount.png', await page.screenshot({fullPage:false}));
  console.log(JSON.stringify({start, afterSizes, afterAll}));
  await ctx.close(); await browser.close();
})();
