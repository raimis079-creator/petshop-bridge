process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4NDInXSkpIHJldHVybjsKICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89WydWRVJTSUpBJz0+J1MxNTk2LVIxJ107CiAgICAkb1snc2x1ZyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHBvc3Rfc3RhdHVzLHBvc3RfbmFtZSxwb3N0X3RpdGxlLHBvc3RfbW9kaWZpZWQgRlJPTSB7JHB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgKHBvc3RfbmFtZSBMSUtFICd0ZXN0LWtvbnNlcnZ1LWRlemUta2F0ZSUnIE9SIHBvc3RfdGl0bGUgTElLRSAnJWRleiUga2F0JScgT1IgcG9zdF90aXRsZSBMSUtFICclZMSXxb4lIGthdCUnKSBPUkRFUiBCWSBJRCIsQVJSQVlfQSk7CiAgICAvLyBtZW5pdSBSaW5raW5pYWkgLT4gU3VzaWRlawogICAgJG1lbnU9d3BfZ2V0X25hdl9tZW51X29iamVjdCgnUGFncmluZGluaXMgbWVuaXUnKTsgJGl0ZW1zPXdwX2dldF9uYXZfbWVudV9pdGVtcygkbWVudS0+dGVybV9pZCk7CiAgICBmb3JlYWNoICgkaXRlbXMgYXMgJGl0KSBpZiAocHJlZ19tYXRjaCgnL1N1c2lkxJdrfHJpbmtpbmkvaXUnLCRpdC0+dGl0bGUpKSB7ICRzdD1udWxsOyBpZiAoJGl0LT5vYmplY3Q9PT0ncHJvZHVjdCd8fCRpdC0+b2JqZWN0PT09J3BhZ2UnKSAkc3Q9Z2V0X3Bvc3Rfc3RhdHVzKCRpdC0+b2JqZWN0X2lkKTsgZWxzZWlmICgkaXQtPnR5cGU9PT0nY3VzdG9tJykgeyAkcHRoPXBhcnNlX3VybCgkaXQtPnVybCxQSFBfVVJMX1BBVEgpOyAkc2x1Zz1iYXNlbmFtZSh0cmltKCRwdGgsJy8nKSk7ICRwaWQ9JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBJRCBGUk9NIHskcH1wb3N0cyBXSEVSRSBwb3N0X25hbWU9JXMgQU5EIHBvc3RfdHlwZSBJTiAoJ3Byb2R1Y3QnLCdwYWdlJykgTElNSVQgMSIsJHNsdWcpKTsgJHN0PSRwaWQ/Z2V0X3Bvc3Rfc3RhdHVzKCRwaWQpLicgIycuJHBpZDonTkVSQVNUQSc7IH0gJG9bJ21lbml1J11bXT1bJGl0LT5JRCwkaXQtPnRpdGxlLCRpdC0+dHlwZSwkaXQtPm9iamVjdCwoaW50KSRpdC0+b2JqZWN0X2lkLCRpdC0+dXJsLCRzdF07IH0KICAgIC8vIHZpc29zIGxhdWthcyBkZXplcwogICAgZm9yZWFjaCAoJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcC5JRCxwLnBvc3Rfc3RhdHVzLHAucG9zdF9uYW1lLHAucG9zdF90aXRsZSxtLm1ldGFfdmFsdWUgZyBGUk9NIHskcH1wb3N0cyBwIEpPSU4geyRwfXBvc3RtZXRhIG0gT04gbS5wb3N0X2lkPXAuSUQgQU5EIG0ubWV0YV9rZXk9J19wc19sYXVrYXNfZ3J1cGUnIE9SREVSIEJZIHAuSUQiLEFSUkFZX0EpIGFzICRyKSAkb1snZGV6ZXMnXVtdPSRyOwogICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0Owp9KTsK';
const VER='dep-115757';
const GKEY='ps_ex42';
const PHASES=["R"];
const OUT='analize/s1596_r.json';
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
