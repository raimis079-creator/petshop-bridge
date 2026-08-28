process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIE1vbm8gTG9va3VwIEZpeCB2MSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogJHJleiA9ICRfR0VUWydwc19tb25vbG9vayddID8/ICcnOwogaWYoICRyZXohPT0nRElBRycgJiYgJHJleiE9PSdGSVgnICkgcmV0dXJuOwogZ2xvYmFsICR3cGRiOwogJG89Wyd2Jz0+J01PTk9MT09LMScsJ3JlemltYXMnPT4kcmV6XTsKCiAkbHQgPSAkd3BkYi0+cHJlZml4Lid3Y19wcm9kdWN0X2F0dHJpYnV0ZXNfbG9va3VwJzsKICRvWydsZW50ZWxlX3lyYSddID0gKCR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICckbHQnIikgPT09ICRsdCk7CgogJGlkcyA9IGdldF9vcHRpb24oJ3BzX21vbm9fYXRzYXVraW1hc19NT05PMjYwODI4MDk1MDI0JywgW10pOwogJG9bJ251aW10dV9raWVraXMnXSA9IGNvdW50KCRpZHMpOwoKIGlmKCRvWydsZW50ZWxlX3lyYSddKXsKICAgJG9bJ2xvb2t1cF90YWlwX3Zpc28nXSA9IChpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRsdCBXSEVSRSB0YXhvbm9teT0ncGFfbW9ub3Byb3RlaW4nIEFORCB0ZXJtX2lkPTI5NSIpOwogICBpZigkaWRzKXsKICAgICAkaW4gPSBpbXBsb2RlKCcsJywgYXJyYXlfbWFwKCdpbnR2YWwnLCRpZHMpKTsKICAgICAkb1snbG9va3VwX3RhcnBfbnVpbXR1J10gPSAoaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkbHQgV0hFUkUgdGF4b25vbXk9J3BhX21vbm9wcm90ZWluJyBBTkQgdGVybV9pZD0yOTUgQU5EIHByb2R1Y3Rfb3JfcGFyZW50X2lkIElOICgkaW4pIik7CiAgICAgaWYoJHJlej09PSdGSVgnKXsKICAgICAgICRvWydpc3RyaW50YSddID0gJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSAkbHQgV0hFUkUgdGF4b25vbXk9J3BhX21vbm9wcm90ZWluJyBBTkQgdGVybV9pZD0yOTUgQU5EIHByb2R1Y3Rfb3JfcGFyZW50X2lkIElOICgkaW4pIik7CiAgICAgICAkb1snbG9va3VwX3RhaXBfcG8nXSA9IChpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRsdCBXSEVSRSB0YXhvbm9teT0ncGFfbW9ub3Byb3RlaW4nIEFORCB0ZXJtX2lkPTI5NSIpOwogICAgIH0KICAgfQogfQogLy8gYXIgZGFyIGt1ciBub3JzIGtlc3VvamFtYQogd3BfY2FjaGVfZmx1c2goKTsgZGVsZXRlX3RyYW5zaWVudCgnd2NfdGVybV9jb3VudHMnKTsKICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICdfdHJhbnNpZW50XyV3Y18lJyBPUiBvcHRpb25fbmFtZSBMSUtFICdfdHJhbnNpZW50XyV5aXRoJSciKTsKCiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sNSk7Cg=='; const VER='MONOLOOK1'; const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){ await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Mono Lookup Fix v1',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(8000);
  const d=await fx(WP+'/?ps_monolook=DIAG',{headers:{'Cache-Control':'no-cache'}},'diag');
  const dt=await d.text(); try{ out.diag=JSON.parse(dt); }catch(e){ out.diag_zalias=dt.slice(0,900); }
  if(out.diag && out.diag.lentele_yra){
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:true})});
    await miegok(8000);
    const f=await fx(WP+'/?ps_monolook=FIX',{headers:{'Cache-Control':'no-cache'}},'fix');
    const ft=await f.text(); try{ out.fix=JSON.parse(ft); }catch(e){ out.fix_zalias=ft.slice(0,900); }
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
try{
  const pw=await import('playwright'); const br=await pw.chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1400,height:1100}});
  const pg=await ctx.newPage();
  await pg.goto(WP+'/kategorija/sunims/maistas-sunims/?yith_wcan=1&filter_monoprotein=taip',{waitUntil:'domcontentloaded',timeout:60000});
  await pg.waitForTimeout(5000);
  out.fe_p1=(await pg.locator('.woocommerce-result-count').first().innerText().catch(()=>'n/a')).replace(/\s+/g,' ').trim();
  out.fe_pav=(await pg.locator('.woocommerce-loop-product__title').allInnerTexts().catch(()=>[])).slice(0,12);
  await put('screenshots/mono_galutinis.png', await pg.screenshot({fullPage:false}), VER);
  await br.close();
}catch(e){ out.pw_klaida=String(e).slice(0,300); }
await put('deploy/mono_lookup.json', Buffer.from(JSON.stringify(out,null,1)), VER);
