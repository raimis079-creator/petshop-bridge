process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTczIChrYXNvcyB0ZXN0byB2YWx5bWFzICsgc2thbmVzdGFpLWthdGVtcyAzMDEgdHlyaW1hcykgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9aXNzZXQoJF9HRVRbJ3BzX3I3MyddKT8kX0dFVFsncHNfcjczJ106Jyc7IGlmKCRmIT09J0dPJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgndic9PidTMTU3MycpOwogIHRyeXsKICAgIC8vIDEuIFRlc3RvIHZhbHltYXMKICAgICRFTT0ncHMtczE1NzJAYXZlc2EubHQnOwogICAgJG9yZHM9d2NfZ2V0X29yZGVycyhhcnJheSgnYmlsbGluZ19lbWFpbCc9PiRFTSwnbGltaXQnPT4yMCwnc3RhdHVzJz0+YXJyYXlfa2V5cyh3Y19nZXRfb3JkZXJfc3RhdHVzZXMoKSkpKTsKICAgIGZvcmVhY2goJG9yZHMgYXMgJG9kKXsgJG9bJ2lzdF91enNha3ltYWknXVtdPSRvZC0+Z2V0X2lkKCkuJzonLiRvZC0+Z2V0X3N0YXR1cygpLic6Jy4kb2QtPmdldF90b3RhbCgpOyAkb2QtPmRlbGV0ZSh0cnVlKTsgfQogICAgJG9bJ3V6czM1MzA4X2xpa28nXT0oYm9vbCl3Y19nZXRfb3JkZXIoMzUzMDgpOwogICAgJHU9ZW1haWxfZXhpc3RzKCRFTSk7IGlmKCR1KXsgcmVxdWlyZV9vbmNlIEFCU1BBVEguJ3dwLWFkbWluL2luY2x1ZGVzL3VzZXIucGhwJzsgJG9bJ2lzdF91c2VyJ109JHUuJzonLndwX2RlbGV0ZV91c2VyKCR1KTsgfQogICAgJG9bJ3VzZXJfbGlrbyddPShib29sKWVtYWlsX2V4aXN0cygkRU0pOwogICAgJG9bJ3BldF9kcmFmdHMnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnByZWZpeH1wc19wZXRfZHJhZnRzIFdIRVJFIGVtYWlsPSVzIiwkRU0pKTsKICAgIC8vIFdDIGN1c3RvbWVyIGxvb2t1cAogICAgJG9bJ2N1c3RfbG9va3VwJ109JHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJERUxFVEUgRlJPTSB7JHdwZGItPnByZWZpeH13Y19jdXN0b21lcl9sb29rdXAgV0hFUkUgZW1haWw9JXMiLCRFTSkpOwogICAgLy8gMi4gc2thbmVzdGFpLWthdGVtcwogICAgJG1hcD1qc29uX2RlY29kZShmaWxlX2dldF9jb250ZW50cyhXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWxlZ2FjeS0zMDEtbWFwLmpzb24nKSx0cnVlKTsKICAgIGZvcmVhY2goYXJyYXkoJ3NrYW5lc3RhaS1rYXRlbXMnLCdrYXRlbXMvc2thbmVzdGFpLWthdGVtcycpIGFzICRrKXsgJG9bJ21hcCddWyRrXT1pc3NldCgkbWFwWyRrXSk/JG1hcFska106J05FUkEnOyB9CiAgICAkdD1nZXRfdGVybV9ieSgnc2x1ZycsJ3NrYW5lc3RhaS1rYXRlbXMnLCdwcm9kdWN0X2NhdCcpOyBpZigkdCl7ICRvWyd0ZXJtJ109YXJyYXkoJ2lkJz0+JHQtPnRlcm1faWQsJ25hbWUnPT4kdC0+bmFtZSwnY291bnQnPT4kdC0+Y291bnQsJ3BhcmVudCc9PiR0LT5wYXJlbnQsJ2xpbmsnPT5nZXRfdGVybV9saW5rKCR0KSk7IH0KICAgIC8vIGxvb3BiYWNrIHBlciBhYnUga2VsaXVzLCByZWRpcmVjdD1tYW51YWwKICAgICRob21lPWhvbWVfdXJsKCk7CiAgICBmb3JlYWNoKGFycmF5KCdza2FuZXN0YWkta2F0ZW1zJywna2F0ZW1zL3NrYW5lc3RhaS1rYXRlbXMnKSBhcyAkayl7CiAgICAgICRyPXdwX3JlbW90ZV9oZWFkKCRob21lLicvJy4kayxhcnJheSgncmVkaXJlY3QnPT4wLCd0aW1lb3V0Jz0+MjAsJ3NzbHZlcmlmeSc9PmZhbHNlLCd1c2VyLWFnZW50Jz0+J1BldHNob3BTRU8tUUEtcnVubmVyJykpOwogICAgICAkc3Q9d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpOyAkbG9jPXdwX3JlbW90ZV9yZXRyaWV2ZV9oZWFkZXIoJHIsJ2xvY2F0aW9uJyk7ICRvWydob3AxJ11bJGtdPWFycmF5KCRzdCwkbG9jKTsKICAgICAgaWYoJGxvYyl7ICRyMj13cF9yZW1vdGVfaGVhZCgkbG9jLGFycmF5KCdyZWRpcmVjdCc9PjAsJ3RpbWVvdXQnPT4yMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ3VzZXItYWdlbnQnPT4nUGV0c2hvcFNFTy1RQS1ydW5uZXInKSk7ICRvWydob3AyJ11bJGtdPWFycmF5KHdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyMiksd3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcigkcjIsJ2xvY2F0aW9uJykpOwogICAgICAgIC8vIEdFVCBzdSBNb3ppbGxhIFVBCiAgICAgICAgJHIzPXdwX3JlbW90ZV9oZWFkKCRsb2MsYXJyYXkoJ3JlZGlyZWN0Jz0+MCwndGltZW91dCc9PjIwLCdzc2x2ZXJpZnknPT5mYWxzZSwndXNlci1hZ2VudCc9PidNb3ppbGxhLzUuMCcpKTsgJG9bJ2hvcDJfbW96aWxsYSddWyRrXT1hcnJheSh3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcjMpLHdwX3JlbW90ZV9yZXRyaWV2ZV9oZWFkZXIoJHIzLCdsb2NhdGlvbicpKTsgfQogICAgfQogICAgLy8ga2FzIGdhbGkgMzAyJ2ludGkgxK8gd3AtYWRtaW46IGthdGVnb3Jpam9zIHNsdWcga29saXppamEgc3Uga2l0dSB0dXJpbml1PwogICAgJG9bJ3Bvc3RzX3N1X3NsdWcnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRCxwb3N0X3R5cGUscG9zdF9zdGF0dXMgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X25hbWU9J3NrYW5lc3RhaS1rYXRlbXMnIixBUlJBWV9BKTsKICAgICRvWyd0ZXJtc19zdV9zbHVnJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdC50ZXJtX2lkLHR0LnRheG9ub215LHR0LmNvdW50IEZST00geyR3cGRiLT50ZXJtc30gdCBKT0lOIHskd3BkYi0+dGVybV90YXhvbm9teX0gdHQgT04gdHQudGVybV9pZD10LnRlcm1faWQgV0hFUkUgdC5zbHVnPSdza2FuZXN0YWkta2F0ZW1zJyIsQVJSQVlfQSk7CiAgICAkb1snY2F0X2Jhc2UnXT1nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9wZXJtYWxpbmtzJyk7CiAgICAvLyBURU1QIGxpa3XEjWlhaQogICAgJG9bJ3RlbXAnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIixBUlJBWV9BKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRGaWxlKCkuJzonLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0pOwo=';
const VER='dep-154758';
const GKEY='ps_r73';
const PHASES=["GO"];
const OUT='analize/s1573.json';
const DATA=[];
const out={v:VER};
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
  try{ const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); } }catch(e){ out.list_praleistas=String(e).slice(0,80); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  let dq='';
  if(DATA.length){ out.data={}; for(const p of DATA){ const name=p.split('/').pop();
      const g=await fx('https://api.github.com/repos/'+REPO+'/contents/'+p,{headers:{Authorization:'Bearer '+TOK,Accept:'application/vnd.github.raw+json'}},'gh_'+name);
      const buf=Buffer.from(await g.arrayBuffer());
      const m=await fx(WP+'/wp-json/wp/v2/media',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain','Content-Disposition':'attachment; filename="'+name+'"'},body:buf},'media_'+name);
      const mt=await m.text(); try{ const j=JSON.parse(mt); out.data[name]={id:j.id,status:m.status}; dq+='&d_'+name.replace(/\W/g,'_')+'='+j.id; }catch(e){ out.data[name]={status:m.status,err:mt.slice(0,200)}; } } }
  await miegok(9000);
  if(process.env.GTM_SA_JSON){ try{ const sr=await fx(WP+'/wp-json/ps-seo-temp/v1/sa',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain'},body:process.env.GTM_SA_JSON},'sa'); out.sa_push={status:sr.status,body:(await sr.text()).slice(0,200)}; }catch(e){ out.sa_push=String(e).slice(0,200);} }
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f)+dq,{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
