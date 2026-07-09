import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fs',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function putFile(n,s){ putBin(n, Buffer.from(s,'utf8')); }
function api(path,method,obj){ let cmd='curl -sk -u "\$WPU:\$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -L --max-time 15 "'+DEV+u+'"',{encoding:'utf8',timeout:17000}).trim(); }catch(e){ return 'TO'; } }
(async()=>{
  let out='';

  // === 1. BEFORE: dabartinė būklė ===
  const before = api('/wp-json/wp/v2/settings');
  try{
    const j = JSON.parse(before);
    out += 'BEFORE: page_on_front='+j.page_on_front+' show_on_front='+j.show_on_front+'\\n\\n';
  }catch(e){}

  // === 2. PUT: page_on_front = 34543 ===
  const put = api('/wp-json/wp/v2/settings', 'POST', { page_on_front: 34543 });
  try{
    const j = JSON.parse(put);
    out += 'PUT rezultatas: page_on_front='+j.page_on_front+' show_on_front='+j.show_on_front+'\\n';
    if(j.page_on_front !== 34543){
      out += 'NEPAKEISTA - stabdau\\n';
      putFile('frontswitch.txt', out);
      return;
    }
  }catch(e){ out += 'PUT ERR: '+put.slice(0,300)+'\\n'; putFile('frontswitch.txt', out); return; }

  await new Promise(r=>setTimeout(r,3000));

  // === 3. HTTP patikra ===
  out += '\\n=== HTTP kodai po pakeitimo ===\\n';
  out += '  '+code('/')+'  /\\n';
  out += '  '+code('/pagrindinis-test/')+'  /pagrindinis-test/\\n';
  out += '  '+code('/shop/')+'  /shop/\\n';
  out += '  '+code('/parduotuve/')+'  /parduotuve/\\n';
  out += '\\n';

  // === 4. Playwright verifikacija ===
  const { chromium } = await import('playwright');
  const b = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });

  // DESKTOP anoniminis - dev.avesa.lt/ (be pagrindinis-test)
  const ctx = await b.newContext({ ignoreHTTPSErrors:true, viewport:{width:1280,height:900} });
  const p = await ctx.newPage();
  const nlog = [];
  p.on('response', r => { const u = r.url(); if(u.includes('/2026/07/')) nlog.push(r.status()+' '+u.replace(DEV,'').split('?')[0]); });
  await p.goto(DEV+'/?nc='+Date.now(), { waitUntil:'load', timeout:60000 });
  await p.waitForTimeout(4000);
  const chk = await p.evaluate(()=>{
    const h1 = document.querySelector('h1')?.innerText || 'NERA';
    const heroBg = document.querySelector('.ph-hero-bg');
    const badge = document.querySelector('.ph-hero-badge img');
    const cats = [...document.querySelectorAll('.ph-cat-img')];
    const tb = document.querySelector('.ph-tb');
    const e5 = document.querySelector('.ph-e5');
    const footer = document.querySelectorAll('#custom_html-2, #custom_html-3, #custom_html-4, #custom_html-5').length;
    return {
      h1: h1.slice(0,80),
      hero_bg_loaded: heroBg ? getComputedStyle(heroBg).backgroundImage.includes('hero-augintiniai') : false,
      badge_natural: badge ? badge.naturalWidth+'x'+badge.naturalHeight : '-',
      cats_loaded: cats.filter(i=>i.complete&&i.naturalWidth>0).length+'/'+cats.length,
      tb_exists: !!tb,
      tb_items: document.querySelectorAll('.ph-tb-item').length,
      e5_exists: !!e5,
      footer_widgets: footer,
      page_title: document.title.slice(0,80),
      body_class_snippet: document.body.className.split(' ').filter(c=>c.startsWith('page-id')||c.startsWith('home')||c.startsWith('woocommerce-shop')).join(','),
    };
  });
  out += '=== DESKTOP / (anoniminis) ===\\n';
  out += 'tinklo /2026/07/:\\n';
  nlog.forEach(l=>out += '  '+l+'\\n');
  out += 'DOM:\\n'+JSON.stringify(chk,null,1)+'\\n';
  putBin('fs_root_desktop.png', await p.screenshot({ fullPage:false }));
  // Scroll iki E5 + footer
  await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
  await p.waitForTimeout(1200);
  putBin('fs_root_bottom.png', await p.screenshot({ fullPage:false }));
  await ctx.close();

  // Dublikato patikra: /pagrindinis-test/
  const ctx2 = await b.newContext({ ignoreHTTPSErrors:true, viewport:{width:1280,height:900} });
  const p2 = await ctx2.newPage();
  await p2.goto(DEV+'/pagrindinis-test/?nc='+Date.now(), { waitUntil:'load', timeout:60000 });
  await p2.waitForTimeout(3500);
  const chk2 = await p2.evaluate(()=>({
    h1: (document.querySelector('h1')?.innerText||'').slice(0,80),
    tb_items: document.querySelectorAll('.ph-tb-item').length,
    e5_exists: !!document.querySelector('.ph-e5'),
  }));
  out += '\\n=== /pagrindinis-test/ (dublikato patikra) ===\\n'+JSON.stringify(chk2)+'\\n';
  await ctx2.close();

  // Shop patikra
  const ctx3 = await b.newContext({ ignoreHTTPSErrors:true, viewport:{width:1280,height:900} });
  const p3 = await ctx3.newPage();
  await p3.goto(DEV+'/shop/?nc='+Date.now(), { waitUntil:'load', timeout:60000 });
  await p3.waitForTimeout(3000);
  const chk3 = await p3.evaluate(()=>({
    body_class_snippet: document.body.className.split(' ').filter(c=>c.includes('shop')||c.includes('archive')).join(','),
    title: document.title.slice(0,80),
    has_products: !!document.querySelector('.product, .products, ul.products'),
  }));
  out += '\\n=== /shop/ (Shop archive patikra) ===\\n'+JSON.stringify(chk3)+'\\n';
  putBin('fs_shop.png', await p3.screenshot({ fullPage:false }));
  await ctx3.close();

  // MOBILE dev.avesa.lt/
  const cm = await b.newContext({ ignoreHTTPSErrors:true, viewport:{width:390,height:844} });
  const pm = await cm.newPage();
  await pm.goto(DEV+'/?nc='+Date.now(), { waitUntil:'load', timeout:60000 });
  await pm.waitForTimeout(3500);
  putBin('fs_root_mobile.png', await pm.screenshot({ fullPage:false }));
  await cm.close();

  await b.close();
  putFile('frontswitch.txt', out);
})().catch(e=>{ console.log('ERR', String(e).slice(0,300)); });
