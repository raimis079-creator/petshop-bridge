process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIFVJIHNhbHRpbmlzCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogaWYoIWlzc2V0KCRfR0VUWydwc191cyddKSB8fCAkX0dFVFsncHNfdXMnXSE9PSdVUzIwMjYwODI2JykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOwogJHA9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1hdGFza2FpdG9zLXVpLnBocCc7CiAkcz1maWxlX2dldF9jb250ZW50cygkcCk7CiAkVD1hcnJheSgndic9PidVUycsJ21kNSc9Pm1kNSgkcyksJ2R5ZGlzJz0+c3RybGVuKCRzKSwnYjY0Jz0+YmFzZTY0X2VuY29kZSgkcykpOwogLyoga2FzIG5hdWRvamEgc2kga2Fya2FzYSAqLwogJHg9YXJyYXkoKTsgJE1VPVdQTVVfUExVR0lOX0RJUjsKICRpdD1uZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJE1VLEZpbGVzeXN0ZW1JdGVyYXRvcjo6U0tJUF9ET1RTKSk7CiBmb3JlYWNoKCRpdCBhcyAkZil7IGlmKCEkZi0+aXNGaWxlKCl8fHN0cnRvbG93ZXIoJGYtPmdldEV4dGVuc2lvbigpKSE9PSdwaHAnKSBjb250aW51ZTsKICAgJGM9ZmlsZV9nZXRfY29udGVudHMoJGYtPmdldFBhdGhuYW1lKCkpOwogICBpZihzdHJwb3MoJGMsJ1BldHNob3BfQXRhc2thaXR1X1VJJykhPT1mYWxzZSkgJHhbXT1iYXNlbmFtZSgkZi0+Z2V0UGF0aG5hbWUoKSkuJyB4Jy5zdWJzdHJfY291bnQoJGMsJ1BldHNob3BfQXRhc2thaXR1X1VJJyk7IH0KICRUWyduYXVkb3RvamFpJ109JHg7CiAvKiBtZW5pdSB0ZXZhcyAqLwogJFRbJ3BldHNob3BfcmVwb3J0c195cmEnXT0oYm9vbCltZW51X3BhZ2VfdXJsKCdwZXRzaG9wLXJlcG9ydHMnLGZhbHNlKTsKIGdsb2JhbCAkbWVudSwkc3VibWVudTsKICRUWyd2aXNpX21lbml1J109YXJyYXkoKTsKIGZvcmVhY2goKGFycmF5KSRtZW51IGFzICRtKXsgaWYoIWVtcHR5KCRtWzJdKSkgJFRbJ3Zpc2lfbWVuaXUnXVtdPSRtWzBdLicgLT4gJy4kbVsyXTsgfQogZm9yZWFjaCgoYXJyYXkpJHN1Ym1lbnUgYXMgJHR2PT4kdmspeyBmb3JlYWNoKCR2ayBhcyAkdikgaWYoc3RyaXBvcygkdHYsJ3BldHNob3AnKSE9PWZhbHNlfHxzdHJpcG9zKCR2WzJdLCdwcy0nKT09PTB8fHN0cmlwb3MoJHZbMl0sJ3BldHNob3AnKSE9PWZhbHNlKSAkVFsnc3ViJ11bXT0kdHYuJyB8ICcud3Bfc3RyaXBfYWxsX3RhZ3MoJHZbMF0pLicgLT4gJy4kdlsyXTsgfQogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyR3cGRiLT5wcmVmaXh9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkVCxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9LDUpOwo='; const VER='US';
const out={v:VER}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP UI saltinis',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'s');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const r2=await fx(WP+'/?ps_us=US20260826',{},'t'); const t2=await r2.text();
  try{ out.recon=JSON.parse(t2); }catch(e){ out.t2=t2.slice(0,600); }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('deploy/us.json', Buffer.from(JSON.stringify(out,null,1)), VER);
