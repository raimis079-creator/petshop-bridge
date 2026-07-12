import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
function putBinary(n,buf){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'ht '+n,branch:'main',content:buf.toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pb.json',JSON.stringify(b));const r=execSync('curl -s --max-time 50 -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'log',branch:'main',content:Buffer.from(s).toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pt.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pt.json "'+url+'"');}catch(e){}}
let R={};
function getCount(page){return page.evaluate(()=>{
  var els=document.querySelectorAll('.cart-icon strong,.cart-item .cart-icon strong,.header-cart-link .cart-count,.cart-count,li.cart-item strong');
  for(var i=0;i<els.length;i++){var t=(els[i].textContent||'').replace(/\D/g,'');if(t!=='')return t;}
  return 'nerasta';
});}
(async()=>{
  const URL='https://dev.avesa.lt/';
  let browser;
  try{
    browser=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
    // ===== DESKTOP =====
    const ctx=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:900}});
    const page=await ctx.newPage();
    await page.goto(URL,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(3500);
    // cookie priimti
    try{ const cb=await page.$('text=PRIIMTI'); if(cb){await cb.click();await page.waitForTimeout(800);} }catch(e){}
    // #7 horizontalus overflow
    R.overflow=await page.evaluate(()=>({scrollW:document.documentElement.scrollWidth,clientW:document.documentElement.clientWidth,horiz:document.documentElement.scrollWidth>document.documentElement.clientWidth+2}));
    // blokas yra?
    R.blokas_yra=await page.evaluate(()=>!!document.querySelector('.ps-pop'));
    // scroll i bloka + screenshot
    await page.evaluate(()=>{var e=document.querySelector('.ps-pop');if(e)e.scrollIntoView({block:'center'});});
    await page.waitForTimeout(1200);
    const blk=await page.$('.ps-pop');
    if(blk){const b=await blk.screenshot();putBinary('home_block_desktop.png',b);R.blok_shot='ok';}
    // #6 rodyklės konteinerio ribose
    R.arrow=await page.evaluate(()=>{var a=document.querySelector('.ps-pop-arrow--next');var inner=document.querySelector('.ps-pop-inner');if(!a||!inner)return 'nerasta';var ar=a.getBoundingClientRect();var ir=inner.getBoundingClientRect();return {arrow_right:Math.round(ar.right),inner_right:Math.round(ir.right),uz_ribu:ar.right>ir.right+2};});
    // #1 + #2 AJAX add-to-cart (pirmas mygtukas)
    R.count_pries=await getCount(page);
    const urlPries=page.url();
    try{
      const btn=await page.$('.ps-pop-panel.is-active .ps-pop-btn.ajax_add_to_cart');
      if(btn){ await btn.click(); await page.waitForTimeout(3500); }
      else R.add='mygtukas nerastas (gal visi variantiniai)';
    }catch(e){R.add='klaida '+e;}
    R.count_po=await getCount(page);
    R.url_nepakito=(page.url()===urlPries);
    // #3 dvigubas paspaudimas (antras mygtukas)
    R.count_pries2=await getCount(page);
    try{
      const btns=await page.$$('.ps-pop-panel.is-active .ps-pop-btn.ajax_add_to_cart');
      if(btns[1]){ await btns[1].click({clickCount:2,delay:40}); await page.waitForTimeout(3500); }
    }catch(e){R.dbl='klaida '+e;}
    R.count_po2=await getCount(page);
    // #4 tab perjungimas + aukstis
    R.aukstis_dog=await page.evaluate(()=>{var p=document.querySelector('.ps-pop-panel[data-panel="dog"]');return p?Math.round(p.getBoundingClientRect().height):0;});
    try{ const t=await page.$('.ps-pop-tab[data-tab="cat"]'); if(t){await t.click();await page.waitForTimeout(900);} }catch(e){}
    R.aukstis_cat=await page.evaluate(()=>{var p=document.querySelector('.ps-pop-panel[data-panel="cat"]');return p?Math.round(p.getBoundingClientRect().height):0;});
    R.cat_aktyvus=await page.evaluate(()=>{var p=document.querySelector('.ps-pop-panel[data-panel="cat"]');return p?p.classList.contains('is-active'):false;});
    const blk2=await page.$('.ps-pop'); if(blk2){const b=await blk2.screenshot();putBinary('home_block_cat.png',b);}
    await ctx.close();
    // ===== MOBILE =====
    const ctxM=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    const pM=await ctxM.newPage();
    await pM.goto(URL,{waitUntil:'domcontentloaded',timeout:60000});
    await pM.waitForTimeout(3500);
    try{ const cb=await pM.$('text=PRIIMTI'); if(cb){await cb.click();await pM.waitForTimeout(600);} }catch(e){}
    R.overflow_mobile=await pM.evaluate(()=>({scrollW:document.documentElement.scrollWidth,clientW:document.documentElement.clientWidth,horiz:document.documentElement.scrollWidth>document.documentElement.clientWidth+2}));
    await pM.evaluate(()=>{var e=document.querySelector('.ps-pop');if(e)e.scrollIntoView({block:'center'});});
    await pM.waitForTimeout(1000);
    // swipe testas: scrollBy grid
    R.swipe=await pM.evaluate(()=>{var g=document.querySelector('.ps-pop-panel.is-active .ps-pop-grid');if(!g)return 'nerasta';var b=g.scrollLeft;g.scrollBy({left:200});return {pries:b,po:g.scrollLeft,veikia:g.scrollLeft>b};});
    await pM.waitForTimeout(600);
    const blkM=await pM.$('.ps-pop'); if(blkM){const b=await blkM.screenshot();putBinary('home_block_mobile.png',b);}
    await ctxM.close();
  }catch(e){R.FATAL=''+e;}
  finally{if(browser)await browser.close();putText('hometest.json',JSON.stringify(R,null,2));}
})();
