process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTgzYiByZWNvbiAocGFtZWd0b3MgLSBwbGF0ZXNuZSBwYWllc2thKSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3I4M2InXSl8fCRfR0VUWydwc19yODNiJ10hPT0nR08nKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgndic9PidTMTU4M2InKTsKICAkZnA9Z2V0X29wdGlvbigncGFnZV9vbl9mcm9udCcpOyAkYz1nZXRfcG9zdF9maWVsZCgncG9zdF9jb250ZW50JywkZnApOyAkb1snZnJvbnQnXT1hcnJheSgnaWQnPT4kZnAsJ2xlbic9PnN0cmxlbigkYykpOwogICRpPXN0cmlwb3MoJGMsJ3BhbScpOyAkb1snZnJvbnRfcGFtX3BvcyddPSRpOyBpZigkaSE9PWZhbHNlKSAkb1snZnJvbnRfZnJhZyddPXN1YnN0cigkYyxtYXgoMCwkaS0xMjAwKSwyMjAwKTsKICBwcmVnX21hdGNoX2FsbCgnL1xbKFthLXpfXSspLycsJGMsJG0pOyAkb1snZnJvbnRfc2hvcnRjb2RlcyddPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJG1bMV0pKTsKICAkb1snc25pcHMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIChjb2RlIExJS0UgJyVQaXJrJWrFsyUnIE9SIGNvZGUgTElLRSAnJcWgdW5pbXMlJyBPUiBjb2RlIExJS0UgJyVwYW1fZ3QlJykgQU5EIG5hbWUgTk9UIExJS0UgJ1RFTVAlJyIsQVJSQVlfQSk7CiAgZm9yZWFjaChnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJykgYXMgJHApeyAkeD1maWxlX2dldF9jb250ZW50cygkcCk7IGlmKHByZWdfbWF0Y2goJy9QaXJrLnsxLDN9ai57MSwzfSBwYW0vdScsJHgpfHxzdHJwb3MoJHgsJ3BhbcSXZ3QnKSE9PWZhbHNlKSAkb1snbXUnXVtdPWJhc2VuYW1lKCRwKTsgfQogIGZvcmVhY2goZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC0qL3sqLCovKn0ucGhwJyxHTE9CX0JSQUNFKSBhcyAkcCl7ICR4PWZpbGVfZ2V0X2NvbnRlbnRzKCRwKTsgaWYocHJlZ19tYXRjaCgnL1BpcmsuezEsM31qLnsxLDN9IHBhbS91JywkeCl8fHN0cnBvcygkeCwncGFtxJdndCcpIT09ZmFsc2UpICRvWydwbCddW109c3RyX3JlcGxhY2UoV1BfUExVR0lOX0RJUiwnJywkcCk7IH0KICAkb1snb3B0aW9ucyddPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1Qgb3B0aW9uX25hbWUgRlJPTSB7JHdwZGItPm9wdGlvbnN9IFdIRVJFIG9wdGlvbl92YWx1ZSBMSUtFICclcGFtxJdndG9zJScgTElNSVQgMTAiKTsKICAkb1sncG9zdHMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRCxwb3N0X3R5cGUscG9zdF90aXRsZSBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfY29udGVudCBMSUtFICclcGFtxJdndG9zJScgQU5EIHBvc3Rfc3RhdHVzIElOICgncHVibGlzaCcsJ2RyYWZ0JykgTElNSVQgMTAiLEFSUkFZX0EpOwogICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOyAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9KTsK';
const VER='dep-170623';
const GKEY='ps_r83b';
const PHASES=["GO"];
const OUT='analize/s1583b.json';
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
