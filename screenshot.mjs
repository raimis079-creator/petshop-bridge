import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'lk',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function putFile(n,s){ putBin(n, Buffer.from(s,'utf8')); }
(async()=>{
  const { chromium } = await import('playwright');
  const b = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  const ctx = await b.newContext({ httpCredentials:{username:WPU,password:WPP}, ignoreHTTPSErrors:true, viewport:{width:1280,height:1000} });
  const p = await ctx.newPage();
  await p.goto(DEV+'/pagrindinis-test/?nc='+Date.now(), { waitUntil:'domcontentloaded', timeout:60000 });
  await p.waitForTimeout(5000);
  // Sekciju inventorius
  const inv = await p.evaluate(()=>{
    const sel = ['.ph-hero','.ph-hero-badge','.ph-hero-chip','.ph-cat-grid','.ph-cat-card','.ph-banners','.ph-banner','.ph-trust','.ph-trust-item','.ph-need-grid','.ph-need-card','.ph-guide-grid','.ph-guide-card'];
    const r = {};
    for(const s of sel) r[s] = document.querySelectorAll(s).length;
    r._pageHeight = document.body.scrollHeight;
    r._h1 = document.querySelector('h1')?.innerText || 'NERA';
    r._h2s = [...document.querySelectorAll('h2')].map(x=>x.innerText.trim()).slice(0,10);
    // ar imgs uzsikrove
    r._catImgsLoaded = [...document.querySelectorAll('.ph-cat-img')].filter(i=>i.complete&&i.naturalWidth>0).length;
    r._badgeImg = !!document.querySelector('.ph-hero-badge img');
    r._bannerBgs = [...document.querySelectorAll('.ph-banner-bg')].map(x=>(getComputedStyle(x).backgroundImage||'').split('/').pop().replace(/["')]/g,''));
    return r;
  });
  putFile('look.json', JSON.stringify(inv,null,1));
  // Pilnas puslapis dalimis (fullPage gali grazinti 0)
  const H = inv._pageHeight;
  const step = 1000;
  let i = 0;
  for(let y=0; y<Math.min(H, 4000); y+=step){
    await p.evaluate((yy)=>window.scrollTo(0,yy), y);
    await p.waitForTimeout(700);
    putBin('look_'+i+'.png', await p.screenshot({ fullPage:false }));
    i++;
  }
  putFile('look_count.txt', String(i));
  await b.close();
})().catch(e=>{ console.log('ERR', String(e).slice(0,250)); });
