import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fm2',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
(async()=>{
  const { chromium } = await import('playwright');
  const b = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  const cm = await b.newContext({ ignoreHTTPSErrors:true, viewport:{width:390,height:844} });
  const pm = await cm.newPage();
  await pm.goto(DEV+'/pagrindinis-test/?nc='+Date.now(), { waitUntil:'load', timeout:60000 });
  await pm.waitForTimeout(3500);

  // Suraskime absoliutų footer'io Y ir naudokime window.scrollTo tiksliai iki jo
  const footerY = await pm.evaluate(()=>{
    const el = document.getElementById('custom_html-2');
    if(!el) return -1;
    const rect = el.getBoundingClientRect();
    return Math.round(rect.top + window.scrollY);
  });
  // Scrollinam tiksliai iki APIE viršaus (0 offset)
  await pm.evaluate((y)=>window.scrollTo(0, y), footerY);
  await pm.waitForTimeout(1000);
  putBin('mob_footer_v2.png', await pm.screenshot({ fullPage:false }));

  // Fullpage screenshot mobile
  await pm.evaluate(()=>window.scrollTo(0,0));
  await pm.waitForTimeout(500);
  const fp = await pm.screenshot({ fullPage:true });
  putBin('mob_fp.png', fp);

  await cm.close();
  await b.close();
})().catch(e=>{ console.log('ERR', String(e).slice(0,250)); });
