process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium, devices } from 'playwright';
const TOK=process.env.GH_TOKEN, REPO=process.env.GH_REPO, WP=process.env.WP_URL||'https://dev.avesa.lt';
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'}; let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){} const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const out={v:'S1572'}; const PREKE='/product/royal-canin-cat-fussy-exigent-10-kg-sausas-pasaras-isrankioms-katems/';
const br=await chromium.launch();
async function scenarijus(label,ctxOpts){
  const ctx=await br.newContext({...ctxOpts,ignoreHTTPSErrors:true}); const pg=await ctx.newPage(); const o={errs:[],failed:[],resp:{}};
  pg.on('console',m=>{ if(m.type()==='error') o.errs.push(m.text().slice(0,160)); }); pg.on('pageerror',e=>o.errs.push('PAGEERROR '+String(e).slice(0,200)));
  pg.on('requestfailed',r=>o.failed.push(r.url().slice(0,120)));
  pg.on('response',r=>{ const u=new URL(r.url()); if(u.origin.includes('dev.avesa.lt')&&r.request().resourceType()==='document'){ o.resp[u.pathname]={st:r.status(),cc:r.headers()['cache-control']||'',wpsc:(r.headers()['wp-super-cache']||'')}; } });
  try{
    // 1. pradinis — Complianz baneris
    await pg.goto(WP+'/',{waitUntil:'domcontentloaded',timeout:60000}); await pg.waitForTimeout(3500);
    o.baneris=await pg.evaluate(()=>{ const b=document.querySelector('.cmplz-cookiebanner'); if(!b) return {yra:false}; const r=b.getBoundingClientRect(); return {yra:true,matomas:r.width>0&&r.height>0&&!b.classList.contains('cmplz-dismissed'),klases:b.className.slice(0,120),mygtukai:[...b.querySelectorAll('button')].map(x=>x.innerText.trim()).filter(Boolean).slice(0,6)}; });
    o.gtm_pries_sutikima=await pg.evaluate(()=>({gtm:!!window.google_tag_manager,dl:(window.dataLayer||[]).map(x=>x.event||x[0]||'?').slice(0,15),consent_default:JSON.stringify((window.dataLayer||[]).filter(x=>x[0]==='consent').map(x=>[x[1],x[2]])).slice(0,300)}));
    // sutikti
    try{ await pg.click('.cmplz-cookiebanner .cmplz-accept',{timeout:4000}); await pg.waitForTimeout(2500); o.po_sutikimo=await pg.evaluate(()=>({banner_dismissed:!!document.querySelector('.cmplz-cookiebanner.cmplz-dismissed')||!document.querySelector('.cmplz-cookiebanner')||getComputedStyle(document.querySelector('.cmplz-cookiebanner')).display==='none',cookie:document.cookie.split(';').map(s=>s.trim().split('=')[0]).filter(k=>/cmplz|_ga|_gid|_fbp|_gcl/.test(k)),gtm:!!window.google_tag_manager,dl_events:(window.dataLayer||[]).map(x=>x.event||(x[0]==='consent'?'consent:'+x[1]:'')||'?').slice(-12),consent_update:JSON.stringify((window.dataLayer||[]).filter(x=>x[0]==='consent'&&x[1]==='update').map(x=>x[2])).slice(0,300)})); }catch(e){ o.sutikimo_klaida=String(e).slice(0,150); }
    await put('screenshots/s1572_'+label+'_pradinis.png',await pg.screenshot(),'S1572 '+label+' pradinis');
    // 2. preke -> krepselis
    await pg.goto(WP+PREKE,{waitUntil:'domcontentloaded',timeout:60000}); await pg.waitForTimeout(2500);
    await pg.click('.single_add_to_cart_button',{timeout:8000}); await pg.waitForTimeout(3500);
    o.cart_fragment=await pg.evaluate(()=>(document.querySelector('.cart-icon strong, .header-cart-item .cart-icon strong')||{}).innerText||'');
    // 3. kasa
    const errsPries=o.errs.length;
    await pg.goto(WP+'/kasa/',{waitUntil:'domcontentloaded',timeout:60000}); await pg.waitForTimeout(6000);
    o.kasa=await pg.evaluate(()=>{ const q=s=>[...document.querySelectorAll(s)];
      return { url:location.pathname, h1:(document.querySelector('h1')||{}).innerText||'', form:!!document.querySelector('form.checkout'),
        laukai:q('form.checkout input[name],form.checkout select[name],form.checkout textarea[name]').map(i=>i.name).filter(n=>!/^(_|wc|woo)/.test(n)).slice(0,40),
        siuntimas:q('#shipping_method li, .woocommerce-shipping-methods li').map(l=>l.innerText.replace(/\s+/g,' ').trim().slice(0,70)),
        mokejimai:q('.wc_payment_methods li').map(l=>(l.querySelector('input')||{}).value+':'+(l.querySelector('label')||{}).innerText?.trim().slice(0,40)),
        lp_js:q('script[src]').filter(s=>/lithuaniapost/.test(s.src)).length, lp_css:q('link[rel=stylesheet]').filter(l=>/lithuaniapost/.test(l.href)).length,
        select2_src:q('script[src]').filter(s=>/select2/.test(s.src)).map(s=>s.src.replace(/^https?:\/\/[^/]+/,'').slice(0,80)), select2_fn:typeof jQuery!=='undefined'&&typeof jQuery.fn.select2,
        selectwoo:typeof jQuery!=='undefined'&&typeof jQuery.fn.selectWoo, jq:typeof jQuery, defer_head:q('head script[src][defer]').length, head_scripts:q('head script[src]').length,
        mygtukas:!!document.querySelector('#place_order'), pren:q('[class*=pren],[id*=pren]').length, dl:(window.dataLayer||[]).map(x=>x.event||'').filter(Boolean).slice(-8) }; });
    o.kasa.console_klaidos_kasoje=o.errs.slice(errsPries);
    await put('screenshots/s1572_'+label+'_kasa.png',await pg.screenshot({fullPage:true}),'S1572 '+label+' kasa');
    // 4. LP Express terminalo pasirinkimas — select2
    try{ const lp=await pg.$('input.shipping_method[value*=lithuaniapost_lpexpress_terminal]'); if(lp){ await lp.click({force:true}); await pg.waitForTimeout(5000);
        o.lp=await pg.evaluate(()=>{ const s=document.querySelector('select[name*=lpexpress], select[id*=lpexpress], select[name*=terminal], select[id*=terminal], select[name*=lithuaniapost]'); const s2=document.querySelector('.select2-container'); return {select:s?{name:s.name||s.id,opt:s.options.length}:null,select2_container:!!s2,s2_visible:s2?getComputedStyle(s2).display!=='none':null}; });
        if(o.lp.select2_container){ try{ await pg.click('.woocommerce-checkout .select2-selection--single',{timeout:4000}); await pg.waitForTimeout(1500); o.lp.dropdown=await pg.evaluate(()=>({open:!!document.querySelector('.select2-container--open'),opts:document.querySelectorAll('.select2-results__option').length})); await pg.keyboard.press('Escape'); }catch(e){ o.lp.dropdown_err=String(e).slice(0,120);} }
        await put('screenshots/s1572_'+label+'_lp.png',await pg.screenshot({fullPage:false}),'S1572 '+label+' lp'); } else o.lp='LP radio nerastas'; }catch(e){ o.lp_err=String(e).slice(0,200); }
    // 5. Venipak kurjeris + bacs + užsakymas
    try{ const vk=await pg.$('input.shipping_method[value*=venipak_shipping_courier]'); if(vk){ await vk.click({force:true}); await pg.waitForTimeout(4000); }
      const fill=async(sel,val)=>{ const e=await pg.$(sel); if(e){ await e.fill(val); return true;} return false; };
      o.uzpildyta={};
      for(const [n,v] of Object.entries({billing_first_name:'Testas',billing_last_name:'Kasos',billing_email:'ps-s1572@avesa.lt',billing_phone:'+37060000000',billing_address_1:'Testo g. 1',billing_city:'Vilnius',billing_postcode:'01100'})) o.uzpildyta[n]=await fill('#'+n,v);
      const cnt=await pg.$('#billing_country'); if(cnt){ try{ await pg.selectOption('#billing_country','LT'); }catch(e){} }
      await pg.waitForTimeout(3000);
      const bacs=await pg.$('#payment_method_bacs'); if(bacs){ await bacs.click({force:true}); await pg.waitForTimeout(1500); }
      const chk=await pg.$$('form.checkout input[type=checkbox][name=terms]'); for(const c of chk){ try{ await c.check({force:true}); }catch(e){} }
      const urlPries=pg.url(); await pg.click('#place_order',{timeout:8000});
      await pg.waitForFunction(u=>location.href!==u||document.querySelector('.woocommerce-error, .woocommerce-NoticeGroup-checkout'),urlPries,{timeout:45000}).catch(()=>{}); await pg.waitForTimeout(3000);
      o.uzsakymas=await pg.evaluate(()=>({url:location.pathname.slice(0,80),klaidos:[...document.querySelectorAll('.woocommerce-error li')].map(l=>l.innerText.trim().slice(0,120)),received:!!document.querySelector('.woocommerce-order-received, .woocommerce-thankyou-order-received, .woocommerce-order'),order_id:(document.body.innerText.match(/Užsakymo numeris[:\s]*#?(\d+)|Order number[:\s]*#?(\d+)|#(\d{4,})/)||[])[0]||'',dl:(window.dataLayer||[]).map(x=>x.event||'').filter(Boolean).slice(-6),purchase:JSON.stringify(((window.dataLayer||[]).filter(x=>x.event==='purchase')[0]||{}).ecommerce||null).slice(0,300)}));
      await put('screenshots/s1572_'+label+'_uzsakymas.png',await pg.screenshot({fullPage:true}),'S1572 '+label+' uzsakymas');
    }catch(e){ o.uzsakymo_klaida=String(e).slice(0,300); }
  }catch(e){ o.klaida=String(e).slice(0,300); }
  await ctx.close(); out[label]=o;
}
await scenarijus('mob',devices['Pixel 5']);
await scenarijus('desk',{viewport:{width:1366,height:900}});
await br.close(); await put('analize/s1572_kasa.json',Buffer.from(JSON.stringify(out,null,1)),'S1572 kasa regress'); console.log('ok');
