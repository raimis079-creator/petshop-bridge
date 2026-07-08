import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ren',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
(async()=>{
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  const ctx = await browser.newContext({ ignoreHTTPSErrors:true, viewport:{width:1280,height:1600} });
  const page = await ctx.newPage();
  await page.goto('https://petshop.lt/apie-mus', { waitUntil:'networkidle', timeout:60000 });
  await page.waitForTimeout(4000);
  // scroll'as, kad triggerintu lazy load
  await page.evaluate(async()=>{ for(let y=0;y<8000;y+=400){ window.scrollTo(0,y); await new Promise(r=>setTimeout(r,150)); } window.scrollTo(0,0); });
  await page.waitForTimeout(2500);
  // istraukiam page__content HTML
  const html = await page.evaluate(()=>{ const el=document.querySelector('.page__content') || document.querySelector('#information'); return el?el.outerHTML:''; });
  putFile('rendered_apie.html', html);
  console.log('rendered', html.length);
  await browser.close();
})().catch(e=>{ console.log('ERR', String(e).slice(0,150)); });
