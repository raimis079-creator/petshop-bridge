process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIE5hdWp1IFByZWtpdSBTa2VsYmltYXMgdjEuMCAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogJHI9JF9HRVRbJ3BzX3NrJ10gPz8gJyc7IGlmKCRyIT09J0RSWScgJiYgJHIhPT0nQVBQTFknKSByZXR1cm47CiAkaWRzPVszNTEwMiwzNTEwNCwzNTEwNiwzNTEwOCwzNTExMCwzNTExMiwzNTExNCwzNTExNiwzNTExOCwzNTEyMCwzNTEyMiwKICAgICAgIDM1MTI2LDM1MTI4LDM1MTMwLDM1MTMyLDM1MTM0LDM1MTM2LDM1MTM4LDM1MTQwLDM1MTQyLDM1MTQ0LDM1MTQ2LDM1MTQ3XTsKICRvPVsndic9PidTSzEnLCdyZXppbWFzJz0+JHIsJ3ByYWxlaXN0YSc9PlszNTEyND0+J2R1Ymxpa2F0YXMgIzE3MzEyJ10sJ2VpbCc9PltdXTsKIGZvcmVhY2goJGlkcyBhcyAkcGlkKXsKICAgJHA9Z2V0X3Bvc3QoJHBpZCk7CiAgICRlPVsnaWQnPT4kcGlkLCdwYXYnPT4kcD9tYl9zdWJzdHIoJHAtPnBvc3RfdGl0bGUsMCw1Mik6J05FUkEnLCdidXZvJz0+JHA/JHAtPnBvc3Rfc3RhdHVzOm51bGwsCiAgICAgICAna2FpbmEnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19yZWd1bGFyX3ByaWNlJyx0cnVlKSwKICAgICAgICdzYXZpa2FpbmEnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19jb3N0X3ByaWNlJyx0cnVlKSwKICAgICAgICdsaWt1dGlzJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfc3RvY2snLHRydWUpXTsKICAgaWYoISRwIHx8ICRwLT5wb3N0X3R5cGUhPT0ncHJvZHVjdCcpeyAkZVsndmVpa3NtYXMnXT0nUFJBTEVJU1RBJzsgJG9bJ2VpbCddW109JGU7IGNvbnRpbnVlOyB9CiAgIGlmKCRwLT5wb3N0X3N0YXR1cz09PSdwdWJsaXNoJyl7ICRlWyd2ZWlrc21hcyddPSdKQVUgUEFTS0VMQlRBJzsgJG9bJ2VpbCddW109JGU7IGNvbnRpbnVlOyB9CiAgIGlmKGdldF9wb3N0X21ldGEoJHBpZCwnX3BzX3JhbmthX2lzaW10YScsdHJ1ZSkpeyAkZVsndmVpa3NtYXMnXT0nUFJBTEVJU1RBIC0gcmFua2EgaXNpbXRhJzsgJG9bJ2VpbCddW109JGU7IGNvbnRpbnVlOyB9CiAgIGlmKCRlWydrYWluYSddPT09JycpeyAkZVsndmVpa3NtYXMnXT0nUFJBTEVJU1RBIC0gbmVyYSBrYWlub3MnOyAkb1snZWlsJ11bXT0kZTsgY29udGludWU7IH0KICAgaWYoJHI9PT0nQVBQTFknKXsKICAgICB3cF91cGRhdGVfcG9zdChbJ0lEJz0+JHBpZCwncG9zdF9zdGF0dXMnPT4ncHVibGlzaCddKTsKICAgICB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCRwaWQpOyBjbGVhbl9wb3N0X2NhY2hlKCRwaWQpOwogICAgICRlWyd0YXBvJ109Z2V0X3Bvc3Rfc3RhdHVzKCRwaWQpOyAkZVsndmVpa3NtYXMnXT0nUEFTS0VMQlRBJzsKICAgfSBlbHNlICRlWyd2ZWlrc21hcyddPSdCVVRVIFBBU0tFTEJUQSc7CiAgICRvWydlaWwnXVtdPSRlOwogfQogJG9bJ3N1bWEnXT1bJ3Zpc28nPT5jb3VudCgkb1snZWlsJ10pLAogICAncGFza2VsYnRhJz0+Y291bnQoYXJyYXlfZmlsdGVyKCRvWydlaWwnXSxmdW5jdGlvbigkeCl7cmV0dXJuICR4Wyd2ZWlrc21hcyddPT09J1BBU0tFTEJUQSc7fSkpLAogICAnYmVfc2F2aWthaW5vcyc9PmNvdW50KGFycmF5X2ZpbHRlcigkb1snZWlsJ10sZnVuY3Rpb24oJHgpe3JldHVybiAkeFsnc2F2aWthaW5hJ109PT0nJzt9KSldOwogLyogc2VpbXUgYnVrbGUgcG8gc2tlbGJpbW8gKi8KIGlmKCRyPT09J0FQUExZJyl7CiAgIGdsb2JhbCAkd3BkYjsKICAgJG9bJ3NlaW1vcyddPSR3cGRiLT5nZXRfcmVzdWx0cygKICAgICAiU0VMRUNUIG0ubWV0YV92YWx1ZSBzZWltYSwgQ09VTlQoKikgdmlzbywKICAgICAgICAgICAgIFNVTShDQVNFIFdIRU4gcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgVEhFTiAxIEVMU0UgMCBFTkQpIHBhc2tlbGJ0YQogICAgICAgIEZST00geyR3cGRiLT5wb3N0bWV0YX0gbSBKT0lOIHskd3BkYi0+cG9zdHN9IHAgT04gcC5JRD1tLnBvc3RfaWQKICAgICAgIFdIRVJFIG0ubWV0YV9rZXk9J19wc19keWR6aW9fc2VpbWEnIEdST1VQIEJZIG0ubWV0YV92YWx1ZSBPUkRFUiBCWSBtLm1ldGFfdmFsdWUiLCBBUlJBWV9BKTsKIH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LDk5KTsK'; const VER='SKELB-v1.0'; const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
const UA={'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'};
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Nauju Prekiu Skelbimas v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_sk=DRY',{headers:UA},'dry');
  let DJ=null; try{ DJ=JSON.parse(await d.text()); }catch(e){}
  out.dry=DJ&&DJ.suma;
  if(DJ){ await miegok(2500);
    const a=await fx(WP+'/?ps_sk=APPLY',{headers:UA},'apply');
    try{ out.apply=JSON.parse(await a.text()); }catch(e){} }
  await miegok(4000);
  const h=await fx(WP+'/?p=17312',{headers:UA},'fe'); const t=await h.text();
  out.frontend={http:h.status, blokas:/ps-dydziai/.test(t),
    mygtuku:(t.match(/class="ps-dydis/g)||[]).length, fatal:/Fatal error/.test(t)};
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/skelb_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
