import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'e2b',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function putFile(name,str){ putBin(name, Buffer.from(str,'utf8')); }
(async()=>{
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  const ctx = await browser.newContext({ httpCredentials:{ username:WPU, password:WPP }, ignoreHTTPSErrors:true, viewport:{width:1280,height:2000} });
  const page = await ctx.newPage();
  await page.goto(DEV+'/pagrindinis-test/?nc='+Date.now(), { waitUntil:'domcontentloaded', timeout:60000 });
  await page.waitForTimeout(5000);
  // Scroll iki banerių + rasti jų Y poziciją
  const pos = await page.evaluate(()=>{
    const b = document.querySelector('.ph-banners');
    if(!b) return null;
    const r = b.getBoundingClientRect();
    return { top: Math.round(r.top + window.scrollY), height: Math.round(r.height) };
  });
  putFile('e2b_pos.json', JSON.stringify(pos));
  if(pos){
    // Screenshot tik banerių zonos
    await page.evaluate((y)=>window.scrollTo(0, y-20), pos.top);
    await page.waitForTimeout(1000);
    putBin('e2b_banners.png', await page.screenshot({ fullPage:false, clip:{x:0, y:0, width:1280, height:Math.min(pos.height+40, 500)} }));
  }
  // Full page mažesnis - iškart JPEG kokybė
  const full = await page.screenshot({ fullPage:true });
  // padalinu per PIL runneryje negalima, tai crop viršų ir apačią atskirai
  putBin('e2b_top.png', await page.screenshot({ fullPage:false, clip:{x:0,y:0,width:1280,height:1000} }));
  await ctx.close();
  await browser.close();
})().catch(e=>{ console.log('ERR', String(e).slice(0,200)); });
