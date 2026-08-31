process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEJyZXZv4oaSU2VuZGVyIGFwcGx5ICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPShpc3NldCgkX0dFVFsncHNfYnJ2J10pPyRfR0VUWydwc19icnYnXTonJyk7IGlmKCRmIT09J0FQUExZJyYmJGYhPT0nVkVSJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nQlJWMicsJ2ZhemUnPT4kZik7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogICAgaWYoJGY9PT0nQVBQTFknKXsKICAgICAgZm9yZWFjaChhcnJheSgzNDUyNSwzNDUyNikgYXMgJGlkKXsKICAgICAgICAkYz0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHBvc3RfY29udGVudCBGUk9NIHskcH1wb3N0cyBXSEVSRSBJRD0lZCIsJGlkKSk7CiAgICAgICAgJHI9YXJyYXkoJ2lkJz0+JGlkLCdtZDVfcHJpZXMnPT5tZDUoJGMpLCdicmV2b19wcmllcyc9PnN1YnN0cl9jb3VudChzdHJ0b2xvd2VyKCRjKSwnYnJldm8nKSwnc2liX3ByaWVzJz0+c3Vic3RyX2NvdW50KHN0cnRvbG93ZXIoJGMpLCdlbmRpbmJsdWUnKSk7CiAgICAgICAgdXBkYXRlX29wdGlvbigncHNfYmFrX2JyZXZvXycuJGlkLCRjLGZhbHNlKTsKICAgICAgICAkbj0kYzsKICAgICAgICAvLyAzNDUyNTog4oCeQnJldm8iIChTZW5kaW5ibHVlKSDihpIg4oCeU2VuZGVyIiAoc2VuZGVyLm5ldCkg4oCUIGthYnV0xJdzIGnFoXNhdWdvbW9zIGtva2lvcyBidXZvCiAgICAgICAgJG49cHJlZ19yZXBsYWNlKCcv4oCeQnJldm8oW+KAnOKAnSJdKVxzKlwoU2VuZGluYmx1ZVwpL3UnLCfigJ5TZW5kZXIkMSAoc2VuZGVyLm5ldCknLCRuLC0xLCRrMSk7CiAgICAgICAgLy8gMzQ1MjY6IEJyZXZvIOKAkyBlbC4gcGHFoXRvIHJpbmtvZGFyb3MgZnVua2Npb25hbHVtdWkgKGplaSBuYXVkb2phbWEpCiAgICAgICAgJG49cHJlZ19yZXBsYWNlKCcvQnJldm8oXHMqW+KAky1dXHMqZWxcLlxzKnBhxaF0byByaW5rb2Rhcm9zIGZ1bmtjaW9uYWx1bXVpKVxzKlwoamVpIG5hdWRvamFtYVwpL3UnLCdTZW5kZXIkMSAobmF1amllbmxhacWha2lhbXMpJywkbiwtMSwkazIpOwogICAgICAgICRyWydrMSddPSRrMTsgJHJbJ2syJ109JGsyOwogICAgICAgIGlmKCRuIT09JGMpewogICAgICAgICAgJHU9d3BfdXBkYXRlX3Bvc3QoYXJyYXkoJ0lEJz0+JGlkLCdwb3N0X2NvbnRlbnQnPT4kbiksdHJ1ZSk7CiAgICAgICAgICAkclsndXBkYXRlJ109aXNfd3BfZXJyb3IoJHUpPyR1LT5nZXRfZXJyb3JfbWVzc2FnZSgpOiR1OwogICAgICAgICAgJGMyPSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgcG9zdF9jb250ZW50IEZST00geyRwfXBvc3RzIFdIRVJFIElEPSVkIiwkaWQpKTsKICAgICAgICAgICRyWydicmV2b19wbyddPXN1YnN0cl9jb3VudChzdHJ0b2xvd2VyKCRjMiksJ2JyZXZvJyk7ICRyWydzaWJfcG8nXT1zdWJzdHJfY291bnQoc3RydG9sb3dlcigkYzIpLCdlbmRpbmJsdWUnKTsgJHJbJ3NlbmRlcl9wbyddPXN1YnN0cl9jb3VudCgkYzIsJ1NlbmRlcicpOwogICAgICAgICAgJGk9c3RycG9zKCRjMiwnU2VuZGVyJyk7ICRyWydjdHgnXT10cmltKHByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJyx3cF9zdHJpcF9hbGxfdGFncyhzdWJzdHIoJGMyLG1heCgwLCRpLTkwKSwyMjApKSkpOwogICAgICAgIH0gZWxzZSAkclsndXBkYXRlJ109J05FUEFLSVRPJzsKICAgICAgICAkb1sncGFnZXMnXVtdPSRyOwogICAgICB9CiAgICAgIGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfZmx1c2gnKSkgd3BfY2FjaGVfZmx1c2goKTsKICAgIH0gZWxzZSB7CiAgICAgICRoPXdwX3JlbW90ZV9nZXQoJ2h0dHBzOi8vZGV2LmF2ZXNhLmx0L3ByaXZhdHVtby1wb2xpdGlrYS8/bmM9Jy50aW1lKCksYXJyYXkoJ3RpbWVvdXQnPT4zMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ2hlYWRlcnMnPT5hcnJheSgnQ2FjaGUtQ29udHJvbCc9Piduby1jYWNoZScpKSk7CiAgICAgICRiPWlzX3dwX2Vycm9yKCRoKT8nJzp3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkaCk7CiAgICAgICRvWydodHRwJ109aXNfd3BfZXJyb3IoJGgpPyRoLT5nZXRfZXJyb3JfbWVzc2FnZSgpOndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRoKTsKICAgICAgJG9bJ2h0bWxfYnJldm8nXT1zdWJzdHJfY291bnQoc3RydG9sb3dlcigkYiksJ2JyZXZvJyk7ICRvWydodG1sX3NpYiddPXN1YnN0cl9jb3VudChzdHJ0b2xvd2VyKCRiKSwnZW5kaW5ibHVlJyk7ICRvWydodG1sX3NlbmRlciddPXN1YnN0cl9jb3VudCgkYiwnU2VuZGVyJyk7CiAgICAgICRpPXN0cnBvcygkYiwnU2VuZGVyJyk7IGlmKCRpIT09ZmFsc2UpICRvWydjdHgnXT10cmltKHByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJyx3cF9zdHJpcF9hbGxfdGFncyhzdWJzdHIoJGIsbWF4KDAsJGktMTUwKSwzMDApKSkpOwogICAgICAkb1snZGJfYnJldm9fcGFnZXMnXT0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIENPTkNBVChJRCwnOicscG9zdF9zdGF0dXMpIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncGFnZScgQU5EIChwb3N0X2NvbnRlbnQgTElLRSAnJUJyZXZvJScgT1IgcG9zdF9jb250ZW50IExJS0UgJyVlbmRpbmJsdWUlJykiKTsKICAgIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-071403';
const GKEY='ps_brv';
const PHASES=["APPLY", "VER"];
const OUT='analize/brevo_apply.json';
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
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
