import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'yd2',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
(async()=>{
  const out={};
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  const ctx = await browser.newContext({ httpCredentials:{ username:WPU, password:WPP }, ignoreHTTPSErrors:true, viewport:{width:1280,height:1400} });
  const page = await ctx.newPage();
  await page.goto(DEV+'/kategorija/sunims/maistas-sunims/?nc='+Date.now(), { waitUntil:'domcontentloaded', timeout:60000 });
  await page.waitForTimeout(4000);
  // tikslus YITH filtru DOM
  out.yith = await page.evaluate(()=>{
    const filters=[];
    document.querySelectorAll('.yith-wcan-filter').forEach(f=>{
      const title=(f.querySelector('.yith-wcan-filter-title')||{}).innerText||'';
      const tax=f.getAttribute('data-taxonomy')||f.className;
      const terms=[];
      f.querySelectorAll('.term, .yith-wcan-term, li, .term-item').forEach(t=>{
        const lbl=(t.innerText||'').trim();
        if(lbl && lbl.length<40) terms.push(lbl);
      });
      filters.push({title:title.trim(), tax, terms:[...new Set(terms)].slice(0,15), html:f.outerHTML.slice(0,300)});
    });
    return filters;
  });
  await browser.close();
  putFile('yithdom.json', JSON.stringify(out));
})().catch(e=>{ console.log('ERR', String(e).slice(0,200)); });
