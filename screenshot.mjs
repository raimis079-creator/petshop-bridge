import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'vf',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function putFile(name,str){ putBin(name, Buffer.from(str,'utf8')); }
(async()=>{
  const out={};
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  // Desktop
  const ctx = await browser.newContext({ httpCredentials:{ username:WPU, password:WPP }, ignoreHTTPSErrors:true, viewport:{width:1280,height:1600} });
  const page = await ctx.newPage();
  await page.goto(DEV+'/pagrindinis-test/?nc='+Date.now(), { waitUntil:'domcontentloaded', timeout:60000 });
  await page.waitForTimeout(4000);
  out.desktop = await page.evaluate(()=>{
    const chips = document.querySelectorAll('.ph-hero-chip');
    const seps = document.querySelectorAll('.ph-hero-chip-sep');
    const need = document.querySelectorAll('.ph-need-card');
    const catG = document.querySelector('.ph-cat-grid');
    const needG = document.querySelector('.ph-need-grid');
    // Chip pozicijos - ar visi vienoj eiluteje?
    const chipYs = [...chips].map(c=>Math.round(c.getBoundingClientRect().top));
    const chipUnique = [...new Set(chipYs)].length;
    // Need grid columns
    const needCols = needG ? [...new Set([...needG.querySelectorAll('.ph-need-card')].map(c=>Math.round(c.getBoundingClientRect().left)))].length : 0;
    return {
      chips_count: chips.length,
      seps_count: seps.length,
      chip_rows_unique: chipUnique,
      need_cards: need.length,
      cat_display: catG ? getComputedStyle(catG).display : 'none',
      need_display: needG ? getComputedStyle(needG).display : 'none',
      need_cols: needCols,
      chip_first_bg: chips[0] ? getComputedStyle(chips[0]).backgroundColor : '',
      chip_first_color: chips[0] ? getComputedStyle(chips[0]).color : '',
    };
  });
  putBin('final_desktop_full.png', await page.screenshot({ fullPage:true }));
  putBin('final_desktop_hero.png', await page.screenshot({ fullPage:false, clip:{x:0,y:0,width:1280,height:700} }));
  await ctx.close();
  // Mobile
  const ctxM = await browser.newContext({ httpCredentials:{ username:WPU, password:WPP }, ignoreHTTPSErrors:true, viewport:{width:390,height:844} });
  const pageM = await ctxM.newPage();
  await pageM.goto(DEV+'/pagrindinis-test/?nc='+Date.now(), { waitUntil:'domcontentloaded', timeout:60000 });
  await pageM.waitForTimeout(4000);
  out.mobile = await pageM.evaluate(()=>{
    const chips = document.querySelectorAll('.ph-hero-chip');
    const need = document.querySelectorAll('.ph-need-card');
    const needG = document.querySelector('.ph-need-grid');
    const needCols = needG ? [...new Set([...needG.querySelectorAll('.ph-need-card')].map(c=>Math.round(c.getBoundingClientRect().left)))].length : 0;
    return { chips_count: chips.length, need_cards: need.length, need_cols_mobile: needCols };
  });
  putBin('final_mobile.png', await pageM.screenshot({ fullPage:false, clip:{x:0,y:0,width:390,height:1500} }));
  await browser.close();
  // Landing puslapiai screenshot'ai
  const b2 = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  for(const slug of ['hipoalerginis-maistas','monoproteinis-maistas','be-grudu-maistas','odai-ir-kailiui']){
    const c = await b2.newContext({ httpCredentials:{ username:WPU, password:WPP }, ignoreHTTPSErrors:true, viewport:{width:1280,height:1200} });
    const p = await c.newPage();
    try{
      await p.goto(DEV+'/'+slug+'/?nc='+Date.now(), { waitUntil:'domcontentloaded', timeout:45000 });
      await p.waitForTimeout(2500);
      putBin('landing_'+slug+'.png', await p.screenshot({ fullPage:false, clip:{x:0,y:0,width:1280,height:1200} }));
      out['landing_'+slug] = await p.evaluate(()=>{
        const h1 = document.querySelector('h1');
        const intro = document.querySelector('.petshop-intro');
        const cta = document.querySelectorAll('.petshop-cta-primary, .petshop-cta-secondary');
        const safety = document.querySelector('.petshop-safety');
        return { h1: h1?h1.innerText.trim().slice(0,60):'no', intro: !!intro, cta_count: cta.length, safety: !!safety };
      });
    }catch(e){ out['landing_'+slug]='ERR:'+String(e).slice(0,80); }
    await c.close();
  }
  await b2.close();
  putFile('verify.json', JSON.stringify(out));
})().catch(e=>{ console.log('ERR', String(e).slice(0,200)); });
