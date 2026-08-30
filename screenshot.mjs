process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIGZsYWcgZ2VzaW5pbWFzICsga2VzYXMgcGF0aWtyYSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZigoaXNzZXQoJF9HRVRbJ3BzX2YxOSddKT8kX0dFVFsncHNfZjE5J106JycpIT09J1RNJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nRklYMi0xLjAnKTsKICB0cnl7CiAgICBnbG9iYWwgJHdwZGI7CiAgICAvLyAxLiBHRVNJTlUgZmxhZyB0aWVzaWFpIERCIChhcGVpbnUgb3B0aW9ucyBrZXNhKQogICAgJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyR3cGRiLT5vcHRpb25zfSBTRVQgb3B0aW9uX3ZhbHVlPSduZScgV0hFUkUgb3B0aW9uX25hbWU9J3BzX3ByZW51bWVyYXRhX2lqdW5ndGEnIik7CiAgICB3cF9jYWNoZV9kZWxldGUoJ3BzX3ByZW51bWVyYXRhX2lqdW5ndGEnLCdvcHRpb25zJyk7IHdwX2NhY2hlX2RlbGV0ZSgnYWxsb3B0aW9ucycsJ29wdGlvbnMnKTsKICAgICRvWydmbGFnX2RiJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBvcHRpb25fdmFsdWUgRlJPTSB7JHdwZGItPm9wdGlvbnN9IFdIRVJFIG9wdGlvbl9uYW1lPSdwc19wcmVudW1lcmF0YV9panVuZ3RhJyIpOwogICAgLy8gMi4ga2VzbyBoaXBvdGV6ZTogaWp1bmdpdSBmbGFnIERCLCBpbXUgcHJla2UsIEdFVCBzdSBjYWNoZS1idXN0ZXIKICAgICRwaWQ9KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIHAuSUQgRlJPTSB7JHdwZGItPnBvc3RzfSBwIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gbSBPTiBtLnBvc3RfaWQ9cC5JRCBBTkQgbS5tZXRhX2tleT0nX3NrdScgQU5EIG0ubWV0YV92YWx1ZTw+JycgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBrIE9OIGsucG9zdF9pZD1wLklEIEFORCBrLm1ldGFfa2V5PSdfcHJpY2UnIEFORCBrLm1ldGFfdmFsdWU+MCBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIE9SREVSIEJZIHAuSUQgREVTQyBMSU1JVCAxIik7CiAgICAkcHI9d2NfZ2V0X3Byb2R1Y3QoJHBpZCk7ICRza3U9c3RydG91cHBlcih0cmltKCRwci0+Z2V0X3NrdSgpKSk7CiAgICAkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIlVQREFURSB7JHdwZGItPm9wdGlvbnN9IFNFVCBvcHRpb25fdmFsdWU9JXMgV0hFUkUgb3B0aW9uX25hbWU9J3BzX3ByZW51bWVyYXRhX3NrdSciLHNlcmlhbGl6ZShhcnJheSgkc2t1KSkpKTsKICAgIGlmKCEkd3BkYi0+cm93c19hZmZlY3RlZCkgJHdwZGItPmluc2VydCgkd3BkYi0+b3B0aW9ucyxhcnJheSgnb3B0aW9uX25hbWUnPT4ncHNfcHJlbnVtZXJhdGFfc2t1Jywnb3B0aW9uX3ZhbHVlJz0+c2VyaWFsaXplKGFycmF5KCRza3UpKSwnYXV0b2xvYWQnPT4nbm8nKSk7CiAgICAkd3BkYi0+cXVlcnkoIlVQREFURSB7JHdwZGItPm9wdGlvbnN9IFNFVCBvcHRpb25fdmFsdWU9J3RhaXAnIFdIRVJFIG9wdGlvbl9uYW1lPSdwc19wcmVudW1lcmF0YV9panVuZ3RhJyIpOwogICAgZGVsZXRlX3RyYW5zaWVudCgncHNfcHJlbl9za3VfaWQnKTsKICAgIHdwX2NhY2hlX2ZsdXNoKCk7CiAgICAkdXJsPWdldF9wZXJtYWxpbmsoJHBpZCk7CiAgICAkZzE9d3BfcmVtb3RlX2dldCgkdXJsLGFycmF5KCd0aW1lb3V0Jz0+MzAsJ3NzbHZlcmlmeSc9PmZhbHNlLCdoZWFkZXJzJz0+YXJyYXkoJ0NhY2hlLUNvbnRyb2wnPT4nbm8tY2FjaGUnLCdQcmFnbWEnPT4nbm8tY2FjaGUnKSkpOwogICAgJGgxPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRnMSk7CiAgICAkZzI9d3BfcmVtb3RlX2dldChhZGRfcXVlcnlfYXJnKCdwc25jJyx0aW1lKCksJHVybCksYXJyYXkoJ3RpbWVvdXQnPT4zMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ2hlYWRlcnMnPT5hcnJheSgnQ2FjaGUtQ29udHJvbCc9Piduby1jYWNoZScpKSk7CiAgICAkaDI9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJGcyKTsKICAgICRvWydvbl9iZV9idXN0ZXJpbyddPXN0cnBvcygkaDEsJ3BzLXByZW4tYmxva2FzJykhPT1mYWxzZT8nUk9ET01BUyc6J05FUk9ET01BUyc7CiAgICAkb1snb25fc3VfYnVzdGVyaXUnXT1zdHJwb3MoJGgyLCdwcy1wcmVuLWJsb2thcycpIT09ZmFsc2U/J1JPRE9NQVMnOidORVJPRE9NQVMnOwogICAgJG9bJ2tlc29fYW50cmFzdGVzJ109YXJyYXlfaW50ZXJzZWN0X2tleSh3cF9yZW1vdGVfcmV0cmlldmVfaGVhZGVycygkZzEpLT5nZXRBbGwoKSwKICAgICAgYXJyYXlfZmxpcChhcnJheSgneC1saXRlc3BlZWQtY2FjaGUnLCd4LWNhY2hlJywnY2YtY2FjaGUtc3RhdHVzJywnY2FjaGUtY29udHJvbCcsJ2FnZScpKSk7CiAgICAvLyAzLiBHRVNJTlUgYXRnYWwgKyBwYXRpa3JhIHN1IGJ1c3Rlcml1CiAgICAkd3BkYi0+cXVlcnkoIlVQREFURSB7JHdwZGItPm9wdGlvbnN9IFNFVCBvcHRpb25fdmFsdWU9J25lJyBXSEVSRSBvcHRpb25fbmFtZT0ncHNfcHJlbnVtZXJhdGFfaWp1bmd0YSciKTsKICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiVVBEQVRFIHskd3BkYi0+b3B0aW9uc30gU0VUIG9wdGlvbl92YWx1ZT0lcyBXSEVSRSBvcHRpb25fbmFtZT0ncHNfcHJlbnVtZXJhdGFfc2t1JyIsc2VyaWFsaXplKGFycmF5KCkpKSk7CiAgICBkZWxldGVfdHJhbnNpZW50KCdwc19wcmVuX3NrdV9pZCcpOyB3cF9jYWNoZV9mbHVzaCgpOwogICAgJGczPXdwX3JlbW90ZV9nZXQoYWRkX3F1ZXJ5X2FyZygncHNuYycsdGltZSgpKzEsJHVybCksYXJyYXkoJ3RpbWVvdXQnPT4zMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ2hlYWRlcnMnPT5hcnJheSgnQ2FjaGUtQ29udHJvbCc9Piduby1jYWNoZScpKSk7CiAgICAkb1snb2ZmX3N1X2J1c3Rlcml1J109c3RycG9zKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRnMyksJ3BzLXByZW4tYmxva2FzJyk9PT1mYWxzZT8nTkVST0RPTUFTKGdlcmFpKSc6J1JPRE9NQVMoYmxvZ2FpKSc7CiAgICAkb1snZ2FsdXRpbmlzX2ZsYWcnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIG9wdGlvbl92YWx1ZSBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX25hbWU9J3BzX3ByZW51bWVyYXRhX2lqdW5ndGEnIik7CiAgICAkb1snZ2FsdXRpbmlzX3NrdSddPWNvdW50KChhcnJheSltYXliZV91bnNlcmlhbGl6ZSgkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIG9wdGlvbl92YWx1ZSBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX25hbWU9J3BzX3ByZW51bWVyYXRhX3NrdSciKSkpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='f19_fix2-102333';
const GKEY='ps_f19';
const PHASES=["TM"];
const OUT='analize/f19_fix2_1788085413.json';
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
  await miegok(9000);
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f),{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,1500); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
