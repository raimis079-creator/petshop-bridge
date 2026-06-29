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
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  // DESKTOP
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:900}, userAgent:'Mozilla/5.0'});
  const page=await ctx.newPage();
  await page.goto('https://dev.avesa.lt/', {waitUntil:'networkidle', timeout:60000});
  await page.waitForTimeout(2500);
  // top header/menu region
  let buf=await page.screenshot({clip:{x:0,y:0,width:1440,height:320}});
  putBin('menu_desktop.png', buf);
  // hover PASIULYMAI to reveal dropdown
  try{
    const el = page.locator('a', {hasText:'PASIŪLYMAI'}).first();
    await el.hover({timeout:5000});
    await page.waitForTimeout(1200);
    buf=await page.screenshot({clip:{x:0,y:0,width:1440,height:560}});
    putBin('menu_pasiulymai_dropdown.png', buf);
  }catch(e){ fs.writeFileSync('/tmp/e1.txt', String(e)); }
  // hover RINKINIAI
  try{
    const el = page.locator('a', {hasText:'RINKINIAI'}).first();
    await el.hover({timeout:5000});
    await page.waitForTimeout(1200);
    buf=await page.screenshot({clip:{x:0,y:0,width:1440,height:560}});
    putBin('menu_rinkiniai_dropdown.png', buf);
  }catch(e){ fs.writeFileSync('/tmp/e2.txt', String(e)); }
  await ctx.close();
  // MOBILE
  const m=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:390,height:850}, userAgent:'Mozilla/5.0 (iPhone)', isMobile:true});
  const mp=await m.newPage();
  await mp.goto('https://dev.avesa.lt/', {waitUntil:'networkidle', timeout:60000});
  await mp.waitForTimeout(2000);
  buf=await mp.screenshot({fullPage:false});
  putBin('menu_mobile_closed.png', buf);
  // try open burger
  try{
    const burger = mp.locator('a.icon-menu, .nav-icon, [data-open]').first();
    await burger.click({timeout:5000});
    await mp.waitForTimeout(1500);
    buf=await mp.screenshot({fullPage:false});
    putBin('menu_mobile_open.png', buf);
  }catch(e){ fs.writeFileSync('/tmp/e3.txt', String(e)); }
  await m.close();
  await browser.close();
  console.log("DONE");
})();
