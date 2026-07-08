import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fd',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function jget(path){ try{ return JSON.parse(execSync('curl -sk -u "$WPU:$WPP" --max-time 25 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:10000000,timeout:27000,env:{...process.env,WPU,WPP}})); }catch(e){ return null; } }
const out={};
// 1. YITH filtro presetai/konfiguracija - kaip filtrai sukonfiguruoti?
// YITH saugo filtrus kaip 'yith_wcan_filters' post type arba option
// Tikrinam ka rodo puslapyje realiai per JS
const { chromium } = await import('playwright');
const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
const ctx = await browser.newContext({ httpCredentials:{ username:WPU, password:WPP }, ignoreHTTPSErrors:true, viewport:{width:1280,height:1400} });
const page = await ctx.newPage();
await page.goto(DEV+'/kategorija/sunims/maistas-sunims/?nc='+Date.now(), { waitUntil:'domcontentloaded', timeout:60000 });
await page.waitForTimeout(4000);
// istraukiam VISAS filtru reiksmes is sidebar'o
out.filterValues = await page.evaluate(()=>{
  const result={};
  // YITH filtru blokai
  const blocks=document.querySelectorAll('.yith-wcan-filters .yith-wcan-filter, .widget_yith-wcan-filters, aside .widget, .sidebar .widget');
  const all=[];
  document.querySelectorAll('aside, .sidebar, #secondary, .shop-sidebar').forEach(sb=>{
    sb.querySelectorAll('h3,h4,.widget-title,.yith-wcan-filter-title').forEach(h=>{
      const title=h.innerText.trim();
      // reiksmes po antraste
      let values=[];
      let sib=h.closest('.widget, .yith-wcan-filter')||h.parentElement;
      if(sib){ sib.querySelectorAll('label,a,.term-name,li').forEach(l=>{ const t=l.innerText.trim(); if(t&&t.length<40) values.push(t); }); }
      if(title) all.push({title, values:[...new Set(values)].slice(0,12)});
    });
  });
  return all;
});
await browser.close();
putFile('filtdiag.json',JSON.stringify(out));
// 2. YITH filter preset config - per REST ar snippet
