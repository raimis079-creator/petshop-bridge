process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium, devices } from 'playwright';
const TOK=process.env.GH_TOKEN, REPO=process.env.GH_REPO, WP=process.env.WP_URL||'https://dev.avesa.lt';
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'}; let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){} const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const out={v:'S1579'}; const PREKE='/product/royal-canin-cat-fussy-exigent-10-kg-sausas-pasaras-isrankioms-katems/'; const sl=ms=>new Promise(r=>setTimeout(r,ms));
const br=await chromium.launch();
const klas=u=>{ if(/google-analytics\.com\/g\/collect|analytics\.google\.com\/g\/collect/.test(u)) return 'ga4:'+((u.match(/[?&]gcs=([^&]+)/)||[])[1]||'?')+':'+((u.match(/[?&]en=([^&]+)/)||[])[1]||''); if(/googletagmanager\.com\/gtm\.js/.test(u)) return 'gtm.js'; if(/googletagmanager\.com\/gtag\/js/.test(u)) return 'gtag.js'; if(/facebook\.(net|com)/.test(u)) return 'fb:'+((u.match(/[?&]ev=([^&]+)/)||[])[1]||'js'); if(/doubleclick|googleadservices|googlesyndication/.test(u)) return 'ads:'+new URL(u).hostname; return null; };
async function goto(pg,path,o){ for(let i=0;i<3;i++){ const r=await pg.goto(WP+path+(path.includes('?')?'&':'?')+'gtm_test=1',{waitUntil:'domcontentloaded',timeout:60000}); const st=r?r.status():0; const len=(await pg.content()).length; (o.docs||(o.docs=[])).push(path+' '+st+' '+len); if(st===200&&len>5000) return true; await sl(8000); } return false; }
async function scen(label,dev,veiksmas){
  const ctx=await br.newContext({...dev,ignoreHTTPSErrors:true}); const pg=await ctx.newPage(); const o={errs:[],pries:[],po:[]}; let faze='pries';
  pg.on('console',m=>{ if(m.type()==='error') o.errs.push(m.text().slice(0,140)); }); pg.on('pageerror',e=>o.errs.push('PAGEERROR '+String(e).slice(0,140)));
  pg.on('request',r=>{ const k=klas(r.url()); if(k) o[faze].push(k); });
  try{
    await goto(pg,'/',o); await pg.mouse.wheel(0,300); await pg.waitForTimeout(6000);
    faze='po';
    if(veiksmas==='priimti') await pg.click('.cmplz-cookiebanner .cmplz-accept',{timeout:5000});
    if(veiksmas==='x') await pg.click('.cmplz-cookiebanner .cmplz-close',{timeout:5000});
    await pg.waitForTimeout(5000);
    o.po_veiksmo=await pg.evaluate(()=>({ banner_matomas:(()=>{const b=document.querySelector('.cmplz-cookiebanner'); return b?getComputedStyle(b).display!=='none'&&b.getBoundingClientRect().height>0&&!b.classList.contains('cmplz-dismissed'):false;})(), consent_update:JSON.stringify((window.dataLayer||[]).filter(x=>x[0]==='consent'&&x[1]==='update').map(x=>x[2]).slice(-1)).slice(0,250), cmplz:(document.cookie.match(/cmplz_(marketing|statistics|banner-status)=[^;]+/g)||[]) }));
    await sl(5000); await goto(pg,PREKE,o); await pg.mouse.wheel(0,300); await pg.waitForTimeout(4000);
    let frag=''; for(let i=0;i<2&&frag!=='1';i++){ try{ await pg.click('.single_add_to_cart_button',{timeout:6000}); await pg.waitForTimeout(4000); frag=await pg.evaluate(()=>(document.querySelector('.cart-icon strong')||{}).innerText||''); }catch(e){ o.atc_err=String(e).slice(0,100);} }
    o.cart_fragment=frag;
    o.po_prekes=await pg.evaluate(()=>({ dl:(window.dataLayer||[]).map(x=>x.event||'').filter(e=>e&&!/^gtm\./.test(e)).slice(-8), banner_matomas:(()=>{const b=document.querySelector('.cmplz-cookiebanner'); return b?getComputedStyle(b).display!=='none'&&b.getBoundingClientRect().height>0&&!b.classList.contains('cmplz-dismissed'):false;})(), gtag:typeof gtag }));
    o.cookies_po=(await ctx.cookies()).map(c=>c.name).filter(n=>/^_ga|_gid|_fbp|_gcl/.test(n));
    if(veiksmas==='niekas'){ await sl(5000); await goto(pg,'/kasa/',o); await pg.waitForTimeout(6000);
      o.kasa_baneris=await pg.evaluate(()=>{ const b=document.querySelector('.cmplz-cookiebanner'); const btn=document.querySelector('#place_order'); if(!btn) return {btn:false}; btn.scrollIntoView({block:'center'}); const rb=btn.getBoundingClientRect(); const bb=b?b.getBoundingClientRect():null; const overlap=bb&&bb.height>0&&!(rb.bottom<bb.top||rb.top>bb.bottom||rb.right<bb.left||rb.left>bb.right); const el=document.elementFromPoint(rb.left+rb.width/2,rb.top+rb.height/2); return {btn:true,banner_matomas:!!bb&&bb.height>0,overlap:!!overlap,virsuje:el?(el.id||String(el.className)||el.tagName).slice(0,60):null,banner:bb?{top:Math.round(bb.top),h:Math.round(bb.height)}:null,btn_top:Math.round(rb.top),vh:innerHeight}; });
      await put('screenshots/s1579_kasa_baneris.png',await pg.screenshot(),'S1577 kasa baneris'); }
    await put('screenshots/s1579_'+label+'.png',await pg.screenshot(),'S1577 '+label);
  }catch(e){ o.klaida=String(e).slice(0,300); }
  o.pries=[...new Set(o.pries)]; o.po=[...new Set(o.po)]; await ctx.close(); out[label]=o; await sl(10000);
}
await scen('mob_priimti',devices['Pixel 5'],'priimti');
await scen('mob_atmesti',devices['Pixel 5'],'x');
await br.close(); await put('analize/s1579_consent2.json',Buffer.from(JSON.stringify(out,null,1)),'S1579 gtm_test'); console.log('ok');
