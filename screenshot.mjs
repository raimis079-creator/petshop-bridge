import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fm',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function putFile(n,s){ putBin(n, Buffer.from(s,'utf8')); }
(async()=>{
  const { chromium } = await import('playwright');
  const b = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  const cm = await b.newContext({ ignoreHTTPSErrors:true, viewport:{width:390,height:844} });
  const pm = await cm.newPage();
  await pm.goto(DEV+'/pagrindinis-test/?nc='+Date.now(), { waitUntil:'load', timeout:60000 });
  await pm.waitForTimeout(3500);

  // Patikra: ar header sticky (position: fixed/sticky mobile'e)
  const hdr = await pm.evaluate(()=>{
    const h = document.querySelector('header#header') || document.querySelector('header') || document.querySelector('#wrapper > header');
    if(!h) return { found: false };
    const cs = getComputedStyle(h);
    return {
      found: true,
      tag: h.tagName,
      id: h.id,
      cls: h.className.slice(0,80),
      position: cs.position,
      top: cs.top,
      height: Math.round(h.getBoundingClientRect().height),
      z: cs.zIndex,
    };
  });
  putFile('mob_hdr.json', JSON.stringify(hdr, null, 2));

  // Scroll iki APIE (custom_html-2) su block:'start' ir laukiu
  const apieTop = await pm.evaluate(()=>{
    const el = document.getElementById('custom_html-2');
    if(!el) return -1;
    el.scrollIntoView({ block: 'start', behavior: 'instant' });
    return el.getBoundingClientRect().top;
  });
  await pm.waitForTimeout(800);
  // Patikrinu ar APIE viršus dengiamas sticky header'io
  const apieAfter = await pm.evaluate(()=>{
    const el = document.getElementById('custom_html-2');
    if(!el) return null;
    const r = el.getBoundingClientRect();
    const h = document.querySelector('header');
    const hr = h ? h.getBoundingClientRect() : null;
    // Ar header perdengia?
    const overlap = hr && hr.bottom > r.top;
    return {
      apie_top: Math.round(r.top),
      apie_bottom_visible: Math.round(r.bottom),
      apie_title_visible: !!document.elementFromPoint(20, Math.max(0, r.top + 20))?.closest('#custom_html-2'),
      header_bottom: hr ? Math.round(hr.bottom) : null,
      header_position: hr ? getComputedStyle(h).position : '-',
      overlap: overlap,
    };
  });
  putFile('mob_check.json', JSON.stringify(apieAfter, null, 2));

  // Screenshot toje pozicijoje - "footer nuo pradzios"
  putBin('mob_footer_start.png', await pm.screenshot({ fullPage:false }));

  // Dar vienas su scroll poziciju iki pačio footer'io apacios (kad matytus kontaktai)
  await pm.evaluate(()=>{
    const el = document.getElementById('custom_html-5');
    if(el) el.scrollIntoView({ block: 'end' });
  });
  await pm.waitForTimeout(600);
  putBin('mob_footer_end.png', await pm.screenshot({ fullPage:false }));

  // Full-page screenshot - visas puslapis
  await pm.evaluate(()=>window.scrollTo(0,0));
  await pm.waitForTimeout(500);
  putBin('mob_fullpage.png', await pm.screenshot({ fullPage:true }));

  await cm.close();
  await b.close();
})().catch(e=>{ console.log('ERR', String(e).slice(0,250)); });
