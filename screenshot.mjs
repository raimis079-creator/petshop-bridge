import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fc',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function putFile(n,s){ putBin(n, Buffer.from(s,'utf8')); }
(async()=>{
  const { chromium } = await import('playwright');
  const b = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  let out = '';

  // === SVARBIAUSIA: kontekstas BE Basic auth — kaip anoniminis lankytojas ===
  // Jei puslapis pats reikalauja auth, pamatysim. Jei tik media - irgi.
  const ctxNoAuth = await b.newContext({ ignoreHTTPSErrors:true, viewport:{width:1280,height:900} });
  const p1 = await ctxNoAuth.newPage();
  const netlog = [];
  p1.on('response', r => {
    const u = r.url();
    if(u.includes('/2026/07/') || u.includes('pagrindinis-test')) netlog.push(r.status()+' '+u.replace(DEV,''));
  });
  let pageStatus = '?';
  try{
    const resp = await p1.goto(DEV+'/pagrindinis-test/?nc='+Date.now(), { waitUntil:'load', timeout:60000 });
    pageStatus = resp ? resp.status() : '?';
  }catch(e){ pageStatus = 'ERR '+String(e).slice(0,80); }
  await p1.waitForTimeout(4000);
  out += '=== 1. BE AUTH (anoniminis) ===\n';
  out += 'puslapio HTTP: '+pageStatus+'\n';
  out += 'tinklo uzklausos (/2026/07/):\n';
  netlog.forEach(l=>out += '  '+l+'\n');
  const domNoAuth = await p1.evaluate(()=>{
    const heroBg = document.querySelector('.ph-hero-bg');
    const badge = document.querySelector('.ph-hero-badge img');
    const cats = [...document.querySelectorAll('.ph-cat-img')];
    const banners = [...document.querySelectorAll('.ph-banner-bg')];
    return {
      hero_bg_css: heroBg ? getComputedStyle(heroBg).backgroundImage.slice(0,140) : 'NERA .ph-hero-bg',
      badge_src: badge ? badge.src : 'NERA badge img',
      badge_naturalWidth: badge ? badge.naturalWidth : -1,
      badge_complete: badge ? badge.complete : false,
      cats_total: cats.length,
      cats_loaded: cats.filter(i=>i.complete&&i.naturalWidth>0).length,
      cats_broken: cats.filter(i=>!(i.complete&&i.naturalWidth>0)).map(i=>i.src.split('/').pop()),
      banners_total: banners.length,
      banner_bgs: banners.map(x=>(getComputedStyle(x).backgroundImage||'').slice(0,100)),
      body_start: document.body.innerText.slice(0,150).replace(/\s+/g,' '),
    };
  });
  out += 'DOM:\n'+JSON.stringify(domNoAuth,null,1)+'\n\n';
  putBin('fc_noauth.png', await p1.screenshot({ fullPage:false }));
  await ctxNoAuth.close();

  // === 2. SU AUTH (palyginimui) ===
  const ctxAuth = await b.newContext({ httpCredentials:{username:WPU,password:WPP}, ignoreHTTPSErrors:true, viewport:{width:1280,height:900} });
  const p2 = await ctxAuth.newPage();
  const netlog2 = [];
  p2.on('response', r => {
    const u = r.url();
    if(u.includes('/2026/07/')) netlog2.push(r.status()+' '+u.replace(DEV,''));
  });
  await p2.goto(DEV+'/pagrindinis-test/?nc='+Date.now(), { waitUntil:'load', timeout:60000 });
  await p2.waitForTimeout(4000);
  const domAuth = await p2.evaluate(()=>{
    const heroBg = document.querySelector('.ph-hero-bg');
    const badge = document.querySelector('.ph-hero-badge img');
    const cats = [...document.querySelectorAll('.ph-cat-img')];
    return {
      hero_bg_loaded_test: 'zr netlog',
      hero_bg_css: heroBg ? getComputedStyle(heroBg).backgroundImage.slice(0,140) : 'NERA',
      badge_naturalWidth: badge ? badge.naturalWidth : -1,
      cats_loaded: cats.filter(i=>i.complete&&i.naturalWidth>0).length+'/'+cats.length,
    };
  });
  out += '=== 2. SU AUTH ===\n';
  out += 'tinklo uzklausos:\n';
  netlog2.forEach(l=>out += '  '+l+'\n');
  out += 'DOM:\n'+JSON.stringify(domAuth,null,1)+'\n';
  putBin('fc_auth.png', await p2.screenshot({ fullPage:false }));
  await ctxAuth.close();
  await b.close();
  putFile('fullcheck.txt', out);
})().catch(e=>{ console.log('ERR', String(e).slice(0,250)); });
