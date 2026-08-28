process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIE1vbm8gVmVyaWZ5IHYxICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiBpZiggKCRfR0VUWydwc19tb25vdmVyJ10gPz8gJycpICE9PSAnR08nICkgcmV0dXJuOwogZ2xvYmFsICR3cGRiOwogJG89Wyd2Jz0+J01PTk9WRVIxJ107CgogLy8gdmFsb20gV0MvWUlUSCBjYWNoZQogd3BfY2FjaGVfZmx1c2goKTsKIGRlbGV0ZV90cmFuc2llbnQoJ3djX3Rlcm1fY291bnRzJyk7CiAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnX3RyYW5zaWVudF93Y18lJyBPUiBvcHRpb25fbmFtZSBMSUtFICdfdHJhbnNpZW50X3RpbWVvdXRfd2NfJScgT1Igb3B0aW9uX25hbWUgTElLRSAnJXlpdGhfd2NhbiV0cmFuc2llbnQlJyIpOwogd3BfdXBkYXRlX3Rlcm1fY291bnRfbm93KCB3cF9saXN0X3BsdWNrKCBnZXRfdGVybXMoWyd0YXhvbm9teSc9PidwYV9tb25vcHJvdGVpbicsJ2hpZGVfZW1wdHknPT5mYWxzZV0pLCAndGVybV9pZCcpLCAncGFfbW9ub3Byb3RlaW4nKTsKCiAkdCA9IGdldF90ZXJtcyhbJ3RheG9ub215Jz0+J3BhX21vbm9wcm90ZWluJywnaGlkZV9lbXB0eSc9PmZhbHNlXSk7CiAkb1sndGVybWluYWknXSA9IGFycmF5X21hcChmbigkeCk9Plsnc2x1Zyc9PiR4LT5zbHVnLCdjb3VudCc9PiR4LT5jb3VudF0sICR0KTsKCiAkbWsgPSBmdW5jdGlvbigkY2F0PW51bGwpewogICAkdHE9W1sndGF4b25vbXknPT4ncGFfbW9ub3Byb3RlaW4nLCdmaWVsZCc9PidzbHVnJywndGVybXMnPT5bJ3RhaXAnXV1dOwogICBpZigkY2F0KSAkdHFbXT1bJ3RheG9ub215Jz0+J3Byb2R1Y3RfY2F0JywnZmllbGQnPT4nc2x1ZycsJ3Rlcm1zJz0+JGNhdF07CiAgIGlmKCRjYXQpICR0cVsncmVsYXRpb24nXT0nQU5EJzsKICAgJHE9bmV3IFdQX1F1ZXJ5KFsncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywncG9zdHNfcGVyX3BhZ2UnPT4xLCdmaWVsZHMnPT4naWRzJywndGF4X3F1ZXJ5Jz0+JHRxXSk7CiAgIHJldHVybiAoaW50KSRxLT5mb3VuZF9wb3N0czsKIH07CiAkb1sndmlzb190YWlwJ109JG1rKCk7CiAkb1snbWFpc3Rhc19zdW5pbXMnXT0kbWsoJ21haXN0YXMtc3VuaW1zJyk7CiAkb1snbWFpc3Rhc19rYXRlbXMnXT0kbWsoJ21haXN0YXMta2F0ZW1zJyk7CgogLy8ga29udHJvbGluZXMgcHJla2VzIGlzIFJhaW1pbyBla3Jhbm8KICRrb250cm9sZT1bMjEzMzksMjEzMTYsMTc5NTYsMTc5NTMsMTc5NTAsMTc5NDcsMjEzNjgsMjEzMzddOwogJGs9W107CiBmb3JlYWNoKCRrb250cm9sZSBhcyAkcGlkKXsKICAgJHR0PXdwX2dldF9vYmplY3RfdGVybXMoJHBpZCwncGFfbW9ub3Byb3RlaW4nLFsnZmllbGRzJz0+J3NsdWdzJ10pOwogICAka1tdPVsnaWQnPT4kcGlkLCduJz0+bWJfc3Vic3RyKGh0bWxfZW50aXR5X2RlY29kZShnZXRfdGhlX3RpdGxlKCRwaWQpKSwwLDU1KSwnbW9ubyc9PmlzX3dwX2Vycm9yKCR0dCl8fGVtcHR5KCR0dCk/Jy0nOmltcGxvZGUoJywnLCR0dCldOwogfQogJG9bJ2tvbnRyb2xlJ109JGs7CgogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyR3cGRiLT5wcmVmaXh9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo='; const VER='MONOVER1'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Mono Verify v1',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(8000);
  const r=await fx(WP+'/?ps_monover=GO',{headers:{'Cache-Control':'no-cache'}},'db');
  const t=await r.text(); try{ out.db=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,1200); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
try{
  const pw=await import('playwright'); const br=await pw.chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1400,height:1100}});
  const pg=await ctx.newPage();
  await pg.goto(WP+'/kategorija/sunims/maistas-sunims/?yith_wcan=1&filter_monoprotein=taip',{waitUntil:'domcontentloaded',timeout:60000});
  await pg.waitForTimeout(5000);
  out.fe_p1=(await pg.locator('.woocommerce-result-count').first().innerText().catch(()=>'n/a')).replace(/\s+/g,' ').trim();
  out.fe_pav = await pg.locator('.woocommerce-loop-product__title').allInnerTexts().catch(()=>[]);
  await put('screenshots/mono_po_apply.png', await pg.screenshot({fullPage:false}), VER);
  await br.close();
}catch(e){ out.pw_klaida=String(e).slice(0,300); }
await put('deploy/mono_verify.json', Buffer.from(JSON.stringify(out,null,1)), VER);
