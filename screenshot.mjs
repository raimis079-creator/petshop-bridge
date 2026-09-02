process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4MjInXSkpIHJldHVybjsKICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89WydWRVJTSUpBJz0+J1MxNTkzLVIzJ107CiAgICAkdT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIHBhdGggRlJPTSB7JHB9cG14aV9pbXBvcnRzIFdIRVJFIGlkPTMiKTsgJGI9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkod3BfcmVtb3RlX2dldCgkdSxbJ3RpbWVvdXQnPT42MF0pKTsKICAgICRmZWVkPVtdOyBpZiAocHJlZ19tYXRjaF9hbGwoJy88Y29kZT4oLio/KTxcL2NvZGU+XHMqPGVhbj4oLio/KTxcL2Vhbj5ccyo8cXR5PiguKj8pPFwvcXR5Pi9zJywkYiwkbSxQUkVHX1NFVF9PUkRFUikpIGZvcmVhY2ggKCRtIGFzICR4KSAkZmVlZFt0cmltKCR4WzFdKV09WydlYW4nPT50cmltKCR4WzJdKSwncXR5Jz0+KGludCkkeFszXV07CiAgICAkb1snZmVlZF9pdGVtcyddPWNvdW50KCRmZWVkKTsKICAgIC8vIHZpc29zIFpCIHByZWtlcyAocHVibGlzaC9kcmFmdCkgc3UgX3piX3N1cHBsaWVyX3NrdTogcGFseWdpbnRpIF96Yl9xdHkgdnMgZmVlZAogICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbS5wb3N0X2lkLCBtLm1ldGFfdmFsdWUgc2t1LCBwby5wb3N0X3N0YXR1cywgcG8ucG9zdF9tb2RpZmllZCwgcG8ucG9zdF90aXRsZSBGUk9NIHskcH1wb3N0bWV0YSBtIEpPSU4geyRwfXBvc3RzIHBvIE9OIHBvLklEPW0ucG9zdF9pZCBXSEVSRSBtLm1ldGFfa2V5PSdfemJfc3VwcGxpZXJfc2t1JyBBTkQgbS5tZXRhX3ZhbHVlPD4nJyBBTkQgcG8ucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG8ucG9zdF9zdGF0dXMgSU4gKCdwdWJsaXNoJywnZHJhZnQnKSIpOwogICAgJHNrPVsnc3V0YW1wYSc9PjAsJ3NraXJpYXNpJz0+MCwnbmVyYV9mZWVkZSc9PjBdOyAkc2tpcj1bXTsgJG1vbmdlc2tpcj1bXTsKICAgIGZvcmVhY2ggKCRyb3dzIGFzICRyKSB7ICRxPShpbnQpZ2V0X3Bvc3RfbWV0YSgkci0+cG9zdF9pZCwnX3piX3F0eScsdHJ1ZSk7IGlmICghaXNzZXQoJGZlZWRbJHItPnNrdV0pKSB7ICRza1snbmVyYV9mZWVkZSddKys7IGNvbnRpbnVlOyB9ICRmcT0kZmVlZFskci0+c2t1XVsncXR5J107IGlmICgkZnE9PT0kcSkgJHNrWydzdXRhbXBhJ10rKzsgZWxzZSB7ICRza1snc2tpcmlhc2knXSsrOyAkZT1bJHItPnBvc3RfaWQsJHItPnNrdSwkci0+cG9zdF9zdGF0dXMsJ2RiJz0+JHEsJ2ZlZWQnPT4kZnEsc3Vic3RyKGdldF9wb3N0X21ldGEoJHItPnBvc3RfaWQsJ196Yl9sYXN0X3N5bmMnLHRydWUpLDAsMTYpLG1iX3N1YnN0cigkci0+cG9zdF90aXRsZSwwLDM1KV07IGlmIChjb3VudCgkc2tpcik8MjUpICRza2lyW109JGU7IGlmIChzdHJpcG9zKCRyLT5wb3N0X3RpdGxlLCdtb25nZScpIT09ZmFsc2UpICRtb25nZXNraXJbXT0kZTsgfSB9CiAgICAkb1snemJfcXR5X3ZzX2ZlZWQnXT0kc2s7ICRvWydza2lyaWFzaV9wdnonXT0kc2tpcjsgJG9bJ21vbmdlX3NraXJpYXNpJ109JG1vbmdlc2tpcjsKICAgIC8vIE1vbmdlIHBvc3RfbW9kaWZpZWQgcGFzaXNraXJzdHltYXMKICAgICRvWydtb25nZV9tb2RpZmllZCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIExFRlQocG9zdF9tb2RpZmllZCwxMCkgZCwgcG9zdF9zdGF0dXMsIENPVU5UKCopIG4gRlJPTSB7JHB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF90aXRsZSBMSUtFICclTW9uZ2UlJyBBTkQgcG9zdF9zdGF0dXMgSU4gKCdwdWJsaXNoJywnZHJhZnQnKSBHUk9VUCBCWSBkLHBvc3Rfc3RhdHVzIE9SREVSIEJZIGQgREVTQyBMSU1JVCAxNSIsQVJSQVlfTik7CiAgICAkb1snbW9uZ2VfMDYyOSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHBvc3Rfc3RhdHVzLExFRlQocG9zdF90aXRsZSw0MCkgdCBGUk9NIHskcH1wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3RpdGxlIExJS0UgJyVNb25nZSUnIEFORCBwb3N0X3N0YXR1cyBJTiAoJ3B1Ymxpc2gnLCdkcmFmdCcpIEFORCBwb3N0X21vZGlmaWVkIExJS0UgJzIwMjYtMDYtMjklJyBMSU1JVCAxMCIsQVJSQVlfTik7CiAgICAvLyA0IEFWIE1vbmdlIGthdGVzOiBhciBmZWVkJ2UgcGFnYWwgRUFOCiAgICBmb3JlYWNoIChbMTYyMTcsMTYyMjUsMTYyMjgsMTYyNDhdIGFzICRpZCkgeyAkZWFuPWdldF9wb3N0X21ldGEoJGlkLCdfZ2xvYmFsX3VuaXF1ZV9pZCcsdHJ1ZSk7ICRoaXQ9bnVsbDsgZm9yZWFjaCAoJGZlZWQgYXMgJGM9PiRmKSBpZiAoJGVhbiAmJiAkZlsnZWFuJ109PT0kZWFuKSB7ICRoaXQ9WyRjLCRmWydxdHknXV07IGJyZWFrOyB9ICRvWydhdl9rYXRlcyddWyRpZF09WydlYW4nPT4kZWFuLCdzdG9jayc9PmdldF9wb3N0X21ldGEoJGlkLCdfc3RvY2snLHRydWUpLCd6Yl9mZWVkJz0+JGhpdCwnbW9kaWZpZWQnPT5nZXRfcG9zdF9tb2RpZmllZF90aW1lKCdZLW0tZCcsZmFsc2UsJGlkKV07IH0KICAgIC8vIHBteGkgaW1wb3J0IDM6IGtpZWsgaXJhc3UgYXBkb3JvamEgKHVwZGF0ZWQgMTA2MSB2cyAxNTk4IHNraXBwZWQpIC0gYXIgTW9uZ2UgdGFycCBza2lwcGVkPyB0aWtyaW5hbSBwZXIgcG14aV9wb3N0cwogICAgJG9bJ3BteGkzX3Bvc3RzJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1wbXhpX3Bvc3RzIFdIRVJFIGltcG9ydF9pZD0zIik7CiAgICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUnxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-092540';
const GKEY='ps_ex22';
const PHASES=["R"];
const OUT='analize/s1593_r3.json';
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
