process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt'; const VER='MONO3';
const out={v:VER,zingsniai:[]};
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
try{
  const pw=await import('playwright');
  const br=await pw.chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1400,height:1000}});
  const pg=await ctx.newPage();
  const rc=async()=>{ try{ return (await pg.locator('.woocommerce-result-count').first().innerText()).replace(/\s+/g,' ').trim(); }catch(e){ return 'n/a'; } };
  const chip=async()=>{ try{ return (await pg.locator('.yith-wcan-active-filters').first().innerText()).replace(/\s+/g,' ').trim().slice(0,120); }catch(e){ return 'n/a'; } };

  await pg.goto(WP+'/kategorija/sunims/maistas-sunims/',{waitUntil:'domcontentloaded',timeout:60000});
  await pg.waitForTimeout(4000);
  out.zingsniai.push({z:'1_pradzia', url:pg.url(), rez:await rc()});

  // paspaudziam "Tik monoprotein"
  const cb=pg.locator('a,label,span').filter({hasText:/Tik monoprotein/i}).first();
  await cb.scrollIntoViewIfNeeded(); await cb.click({timeout:15000});
  await pg.waitForTimeout(6000);
  out.zingsniai.push({z:'2_po_filtro', url:pg.url(), rez:await rc(), chip:await chip()});
  await put('screenshots/mono_2_filtras.png', await pg.screenshot({fullPage:false}), VER);

  // pereinam i 4 puslapi
  const p4=pg.locator('.woocommerce-pagination a, nav.woocommerce-pagination a').filter({hasText:/^4$/}).first();
  const yra=await p4.count();
  out.zingsniai.push({z:'3_p4_nuoroda_yra', n:yra, href: yra? await p4.getAttribute('href') : null});
  if(yra){
    await p4.scrollIntoViewIfNeeded(); await p4.click({timeout:15000});
    await pg.waitForTimeout(7000);
    out.zingsniai.push({z:'4_po_p4', url:pg.url(), rez:await rc(), chip:await chip()});
    await put('screenshots/mono_4_p4.png', await pg.screenshot({fullPage:false}), VER);
  }
  await br.close();
}catch(e){ out.klaida=String(e).slice(0,500); }
await put('deploy/mono_recon3.json', Buffer.from(JSON.stringify(out,null,1)), VER);
