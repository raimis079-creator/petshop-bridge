process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEpvc2VyYSByZWNvbiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2pvJ10pfHwkX0dFVFsncHNfam8nXSE9PSdSJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7ICRvPWFycmF5KCk7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJFRFPSRwLidwc19pc3RfZWlsdXRlcyc7CiAgJG9bJ3djX2pvc2VyYSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHAuSUQscC5wb3N0X3RpdGxlLHAucG9zdF9zdGF0dXMsKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyRwfXBvc3RtZXRhIG0gV0hFUkUgbS5wb3N0X2lkPXAuSUQgQU5EIG0ubWV0YV9rZXk9J19za3UnKSBza3UgRlJPTSB7JHB9cG9zdHMgcCBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF90aXRsZSBMSUtFICclSm9zZXJhJScgT1JERVIgQlkgcC5wb3N0X3RpdGxlIixBUlJBWV9BKTsKICAkb1snaXN0X25lc3VzaWV0YSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG1vZGVsaXMscGF2YWRpbmltYXMsQ09VTlQoKikgbixST1VORChTVU0oc3VtYSkpIHN1bWEgRlJPTSBgJFRFYCBXSEVSRSB3Y19wcm9kdWN0X2lkIElTIE5VTEwgR1JPVVAgQlkgbW9kZWxpcyBPUkRFUiBCWSBzdW1hIERFU0MgTElNSVQgNjAiLEFSUkFZX0EpOwogICRvWyduZXN1c2lldGFfdmlzbyddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgbW9kZWxpcykgbW9kZWxpdSxDT1VOVCgqKSBlaWx1Y2l1LFJPVU5EKFNVTShzdW1hKSkgc3VtYSBGUk9NIGAkVEVgIFdIRVJFIHdjX3Byb2R1Y3RfaWQgSVMgTlVMTCIsQVJSQVlfQSk7CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-155617';
const GKEY='ps_jo';
const PHASES=["R"];
const OUT='analize/jos_recon.json';
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
