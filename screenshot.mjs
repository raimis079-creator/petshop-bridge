process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt'; const VER='MONO4';
const out={v:VER,url_testai:{}};
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u){ for(let i=0;i<5;i++){ try{ return await fetch(u,{headers:{'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'}}); }catch(e){ await new Promise(r=>setTimeout(r,6000)); } } throw new Error('fx'); }
const T={
 raimio: WP+'/kategorija/sunims/maistas-sunims/page/4?yith_wcan=1&product_cat=maistas-sunims',
 svarus_p4: WP+'/kategorija/sunims/maistas-sunims/page/4/',
 su_filtru_p4: WP+'/kategorija/sunims/maistas-sunims/page/4/?yith_wcan=1&filter_monoprotein=taip'
};
for(const [k,u] of Object.entries(T)){
  try{ const h=await (await fx(u)).text();
    out.url_testai[k]={
      chosen_mono: /chosen-monoprotein/.test(h),
      chosen_bet_koks: (h.match(/class="[^"]*chosen[^"]*"/g)||[]).slice(0,5),
      hidden_input_mono: /name="filter_monoprotein"/.test(h),
      rez: (h.match(/woocommerce-result-count[\s\S]{0,180}?<\/p>/)||[''])[0].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').slice(0,120)
    };
  }catch(e){ out.url_testai[k]={klaida:String(e).slice(0,200)}; }
}
try{
  const pw=await import('playwright'); const br=await pw.chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1400,height:1100}});
  const pg=await ctx.newPage();
  await pg.goto(T.raimio,{waitUntil:'domcontentloaded',timeout:60000}); await pg.waitForTimeout(6000);
  out.narsykleje={ url:pg.url(),
    rez:(await pg.locator('.woocommerce-result-count').first().innerText().catch(()=>'n/a')).replace(/\s+/g,' ').trim(),
    pazymeti_checkboxai: await pg.locator('.yith-wcan-filters input[type=checkbox]:checked, .yith-wcan-filters .chosen').count(),
    aktyvus_filtrai_tekstas: (await pg.locator('.yith-wcan-active-filters').first().innerText().catch(()=>'n/a')).replace(/\s+/g,' ').trim().slice(0,150) };
  await put('screenshots/mono_raimio_url.png', await pg.screenshot({fullPage:false}), VER);
  await br.close();
}catch(e){ out.pw_klaida=String(e).slice(0,400); }
await put('deploy/mono_recon4.json', Buffer.from(JSON.stringify(out,null,1)), VER);
