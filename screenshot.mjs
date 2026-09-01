process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium, devices } from 'playwright';
const TOK=process.env.GH_TOKEN, REPO=process.env.GH_REPO, WP=process.env.WP_URL||'https://dev.avesa.lt';
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'}; let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){} const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const out={}; const pages={pradinis:'/',kategorija:'/kategorija/sunims/maistas-sunims/sausas-maistas-sunims/',preke:'/product/royal-canin-cat-fussy-exigent-10-kg-sausas-pasaras-isrankioms-katems/',krepselis:'/krepselis/',taksas:'/taksas/'};
const br=await chromium.launch(); const ctx=await br.newContext({...devices['Pixel 5'],ignoreHTTPSErrors:true}); 
for(const [k,path] of Object.entries(pages)){ const pg=await ctx.newPage(); const errs=[]; const failed=[]; pg.on('console',m=>{ if(m.type()==='error') errs.push(m.text().slice(0,160)); }); pg.on('pageerror',e=>errs.push('PAGEERROR '+String(e).slice(0,160))); pg.on('requestfailed',r=>failed.push(r.url().slice(0,120)));
  try{ const t0=Date.now(); await pg.goto(WP+path,{waitUntil:'domcontentloaded',timeout:60000}); const dcl=Date.now()-t0; await pg.waitForTimeout(4000);
    const info=await pg.evaluate(()=>({ font:getComputedStyle(document.body).fontFamily.slice(0,60), h1:(document.querySelector('h1')||{}).innerText||'', jq:typeof jQuery, gtm:!!(window.google_tag_manager), dl:(window.dataLayer||[]).length, addToCart:document.querySelectorAll('.add_to_cart_button,.single_add_to_cart_button').length, imgs:document.images.length, lcpCandidates:[...document.querySelectorAll('img')].slice(0,3).map(i=>i.currentSrc.split('/').pop()) }));
    // interakcija: scroll → GTM turi užsikrauti
    await pg.mouse.wheel(0,600); await pg.waitForTimeout(2500); info.gtm_po_scroll=await pg.evaluate(()=>!!window.google_tag_manager);
    if(k==='preke'){ try{ await pg.click('.single_add_to_cart_button',{timeout:5000}); await pg.waitForTimeout(3000); info.cart_count=await pg.evaluate(()=>document.body.innerText.match(/Krepšel\w*/i)?1:0); info.cart_fragment=await pg.evaluate(()=>(document.querySelector('.cart-icon strong, .header-cart-item .cart-icon strong')||{}).innerText||''); }catch(e){ info.atc_err=String(e).slice(0,120);} }
    const png=await pg.screenshot({fullPage:false}); await put('screenshots/s1565_'+k+'.png',png,'S1565 regress '+k);
    out[k]={dcl,errs,failed:failed.slice(0,8),...info};
  }catch(e){ out[k]={klaida:String(e).slice(0,300),errs}; } await pg.close(); }
await br.close(); await put('analize/s1565_regress.json',Buffer.from(JSON.stringify(out,null,1)),'S1565 regress'); console.log(JSON.stringify(out).slice(0,800));
