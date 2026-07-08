import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'mc',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function putFile(name,str){ putBin(name, Buffer.from(str,'utf8')); }
(async()=>{
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  const ctx = await browser.newContext({ httpCredentials:{ username:WPU, password:WPP }, ignoreHTTPSErrors:true, viewport:{width:390,height:844} });
  const page = await ctx.newPage();
  await page.goto(DEV+'/pagrindinis-test/?nc='+Date.now(), { waitUntil:'domcontentloaded', timeout:60000 });
  await page.waitForTimeout(5000);
  const info = await page.evaluate(()=>{
    // Rasti visus fixed/sticky elementus viršuje
    const stickies = [];
    document.querySelectorAll('header, .header, #header, .header-wrapper, .stuck, [class*="sticky"]').forEach(el=>{
      const cs = getComputedStyle(el);
      if(cs.position === 'fixed' || cs.position === 'sticky'){
        const r = el.getBoundingClientRect();
        stickies.push({ cls: el.className.toString().slice(0,60), pos: cs.position, top: Math.round(r.top), height: Math.round(r.height), z: cs.zIndex });
      }
    });
    return { stickies, scrollY: window.scrollY };
  });
  // Scroll natūraliai iki banerių (kaip vartotojas)
  const natural = await page.evaluate(()=>{
    const b = document.querySelector('.ph-banners');
    if(!b) return null;
    const top = b.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top - 100); // vartotojas paprastai sustoja su tarpu
    return { banners_doc_top: Math.round(top) };
  });
  await page.waitForTimeout(1200);
  const after = await page.evaluate(()=>{
    const b = document.querySelector('.ph-banners');
    const badge = document.querySelector('.ph-banner-badge');
    const bRect = b.getBoundingClientRect();
    const badgeRect = badge.getBoundingClientRect();
    // Ar kažkas fixed dengia badge? elementFromPoint badge centre
    const cx = badgeRect.left + badgeRect.width/2;
    const cy = badgeRect.top + badgeRect.height/2;
    const topEl = document.elementFromPoint(cx, cy);
    // Sticky header realus aukštis dabar
    let stickyBottom = 0;
    document.querySelectorAll('*').forEach(el=>{
      const cs = getComputedStyle(el);
      if((cs.position==='fixed'||cs.position==='sticky') && el.getBoundingClientRect().top <= 0+5){
        const r = el.getBoundingClientRect();
        if(r.bottom > stickyBottom && r.height > 20 && r.height < 300) stickyBottom = Math.round(r.bottom);
      }
    });
    return {
      banners_viewport_top: Math.round(bRect.top),
      badge_viewport_top: Math.round(badgeRect.top),
      badge_text: badge.innerText,
      element_at_badge_center: topEl ? (topEl.className.toString().slice(0,50) || topEl.tagName) : 'null',
      badge_covered: topEl ? !topEl.closest('.ph-banner') : true,
      sticky_bottom_px: stickyBottom,
    };
  });
  putFile('mobcheck.json', JSON.stringify({ stickies: info.stickies, natural, after }));
  putBin('mob_natural.png', await page.screenshot({ fullPage:false }));
  await ctx.close();
  await browser.close();
})().catch(e=>{ console.log('ERR', String(e).slice(0,200)); });
