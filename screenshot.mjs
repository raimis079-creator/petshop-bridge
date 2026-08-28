process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIEZCVCBBcHBseSB2MTUwCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogaWYoIWlzc2V0KCRfR0VUWydwc19mYnRhcHBseSddKSB8fCAkX0dFVFsncHNfZmJ0YXBwbHknXSE9PSdHTycpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsgJG89YXJyYXkoJ3YnPT4nRkJURTFCJyk7CiAkcGFpcnM9YXJyYXkoCiAgJ3NhdXNhcy1tYWlzdGFzLXN1bmltcyc9PmFycmF5KCdza2FuZXN0YWktc3VuaW1zJywnemFpc2xhaS1zdW5pbXMnLCdoaWdpZW5vcy1wcmllbW9uZXMtc3VuaW1zJywndml0YW1pbmFpLWlyLXBhcGlsZGFpLXN1bmltcycpLAogICdtYWlzdGFzLXN1bmltcyc9PmFycmF5KCdza2FuZXN0YWktc3VuaW1zJywnemFpc2xhaS1zdW5pbXMnLCdoaWdpZW5vcy1wcmllbW9uZXMtc3VuaW1zJywndml0YW1pbmFpLWlyLXBhcGlsZGFpLXN1bmltcycpLAogICdzYXVzYXMtbWFpc3Rhcy1rYXRlbXMnPT5hcnJheSgnc2thbmVzdGFpLWthdGVtcycsJ3phaXNsYWkta2F0ZW1zJywndml0YW1pbmFpLWlyLXBhcGlsZGFpLWthdGVtcycpLAogICdtYWlzdGFzLWthdGVtcyc9PmFycmF5KCdza2FuZXN0YWkta2F0ZW1zJywnemFpc2xhaS1rYXRlbXMnLCd2aXRhbWluYWktaXItcGFwaWxkYWkta2F0ZW1zJyksCiApOwogJHJ1bGVzPWFycmF5KCdza2FuZXN0YWktc3VuaW1zJz0+MTAsJ3NrYW5lc3RhaS1rYXRlbXMnPT4xMCwnemFpc2xhaS1zdW5pbXMnPT4xMCwnemFpc2xhaS1rYXRlbXMnPT4xMCwnaGlnaWVub3MtcHJpZW1vbmVzLXN1bmltcyc9PjEwLCd2aXRhbWluYWktaXItcGFwaWxkYWktc3VuaW1zJz0+MTAsJ3ZpdGFtaW5haS1pci1wYXBpbGRhaS1rYXRlbXMnPT4xMCk7CiB1cGRhdGVfb3B0aW9uKCdwZXRzaG9wX2ZidF9wYWlycycsJHBhaXJzKTsKIHVwZGF0ZV9vcHRpb24oJ3BldHNob3BfZmJ0X2NhdF9ydWxlcycsJHJ1bGVzKTsKICRvWydpcmFzeXRhX3BhaXJzJ109Z2V0X29wdGlvbigncGV0c2hvcF9mYnRfcGFpcnMnKTsKICRvWydpcmFzeXRhX3J1bGVzJ109Z2V0X29wdGlvbigncGV0c2hvcF9mYnRfY2F0X3J1bGVzJyk7CiAkaGlwbz1nZXRfcG9zdHMoYXJyYXkoJ3Bvc3RfdHlwZSc9Pidwcm9kdWN0JywnbnVtYmVycG9zdHMnPT4xLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywnZmllbGRzJz0+J2lkcycsJ3RheF9xdWVyeSc9PmFycmF5KAogIGFycmF5KCd0YXhvbm9teSc9PidwYV9zcGVjaWFsaV9taXR5YmEnLCdmaWVsZCc9PidzbHVnJywndGVybXMnPT5hcnJheSgnaGlwb2FsZXJnaW5pcycpKSwKICBhcnJheSgndGF4b25vbXknPT4ncHJvZHVjdF9jYXQnLCdmaWVsZCc9PidzbHVnJywndGVybXMnPT5hcnJheSgnc2F1c2FzLW1haXN0YXMtc3VuaW1zJykpLAogKSwnbWV0YV9xdWVyeSc9PmFycmF5KGFycmF5KCdrZXknPT4nX3N0b2NrX3N0YXR1cycsJ3ZhbHVlJz0+J2luc3RvY2snKSkpKTsKICRvWydoaXBvX3BpZCddPSRoaXBvPyhpbnQpJGhpcG9bMF06MDsKICRvWydoaXBvX3VybCddPSRoaXBvP2dldF9wZXJtYWxpbmsoJGhpcG9bMF0pOicnOwogaWYoJGhpcG8peyAkdD1nZXRfdGhlX3Rlcm1zKCRoaXBvWzBdLCdwYV9iYWx0eW11X3NhbHRpbmlzJyk7ICRvWydoaXBvX2JhbHR5bWFpJ109KCR0JiYhaXNfd3BfZXJyb3IoJHQpKT93cF9saXN0X3BsdWNrKCR0LCdzbHVnJyk6YXJyYXkoKTsgfQogJGlkcz13Y19nZXRfcHJvZHVjdHMoYXJyYXkoJ3N0YXR1cyc9PidwdWJsaXNoJywnbGltaXQnPT4xLCdzdG9ja19zdGF0dXMnPT4naW5zdG9jaycsJ2NhdGVnb3J5Jz0+YXJyYXkoJ3NhdXNhcy1tYWlzdGFzLXN1bmltcycpLCdyZXR1cm4nPT4naWRzJykpOwogJG9bJ3Rlc3RfcGlkJ109JGlkcz8oaW50KSRpZHNbMF06MDsgJG9bJ3Rlc3RfdXJsJ109JGlkcz9nZXRfcGVybWFsaW5rKCRpZHNbMF0pOicnOwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyR3cGRiLT5wcmVmaXh9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo=' ; const VER='FBTE1B';
const out={v:VER,zingsniai:[]}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(10000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  const temp=(Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''));
  for(const s of temp){ await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP FBT Apply v150',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const cr=JSON.parse(await c.text()); sid=cr.id; out.zingsniai.push('snip_id:'+sid);
  await miegok(9000);
  const r=await fx(WP+'/?ps_fbtapply=GO',{headers:{'Cache-Control':'no-cache'}},'get');
  const t=await r.text(); out.http=r.status;
  try{ out.duom=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,2000); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
// Vizualine patikra (Playwright)
try{
  const hipo = out.duom && out.duom.hipo_pid ? out.duom : null;
  const pw = await import('playwright');
  const br = await pw.chromium.launch();
  const ctx = await br.newContext({ignoreHTTPSErrors:true, viewport:{width:1280,height:1000}});
  const pg = await ctx.newPage();
  const url1 = (hipo && hipo.hipo_url) ? hipo.hipo_url : WP;
  await pg.goto(url1,{waitUntil:'domcontentloaded',timeout:45000});
  await pg.waitForTimeout(6000);
  try{ await pg.locator('.petshop-fbt').first().scrollIntoViewIfNeeded({timeout:5000}); out.zingsniai.push('preke_fbt_blokas:yra'); }
  catch(e){ out.zingsniai.push('preke_fbt_blokas:nerastas'); }
  await pg.waitForTimeout(1500);
  const s1 = await pg.screenshot({fullPage:true});
  await put('screenshots/fbt_preke.png', s1, VER);
  if(hipo && hipo.hipo_pid){
    await pg.goto(WP+'/?add-to-cart='+hipo.hipo_pid,{waitUntil:'domcontentloaded',timeout:45000});
    await pg.waitForTimeout(4000);
    await pg.goto(WP+'/krepselis/',{waitUntil:'domcontentloaded',timeout:45000});
    await pg.waitForTimeout(6000);
    const hasCart = await pg.locator('.petshop-fbt-cart').count();
    out.zingsniai.push('krepselio_blokas:'+hasCart);
    const s2 = await pg.screenshot({fullPage:true});
    await put('screenshots/fbt_krepselis.png', s2, VER);
  }
  await br.close();
}catch(e){ out.pw_klaida=String(e).slice(0,400); }
await put('deploy/fbte1b.json', Buffer.from(JSON.stringify(out,null,1)), VER);
