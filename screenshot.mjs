process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4MjAnXSkpIHJldHVybjsKICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89WydWRVJTSUpBJz0+J1MxNTkzLVIxJ107CiAgICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRCxwb3N0X3N0YXR1cyxwb3N0X3RpdGxlIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3RfdGl0bGUgTElLRSAnJU1vbmdlJScgQU5EIHBvc3Rfc3RhdHVzIElOICgncHVibGlzaCcsJ2RyYWZ0JywncHJpdmF0ZScpIE9SREVSIEJZIElEIixBUlJBWV9BKTsKICAgICRpZHM9YXJyYXlfbWFwKGZuKCRyKT0+KGludCkkclsnSUQnXSwkcm93cyk7ICRpbj1pbXBsb2RlKCcsJywkaWRzKTsKICAgICRtZXRhPVtdOyBmb3JlYWNoICgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwb3N0X2lkLG1ldGFfa2V5LG1ldGFfdmFsdWUgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZCBJTiAoJGluKSBBTkQgbWV0YV9rZXkgSU4gKCdfc2t1JywnX3piX3N1cHBsaWVyX3NrdScsJ196Yl9xdHknLCdfemJfY29zdCcsJ196Yl9sYXN0X3N5bmMnLCdfc3RvY2snLCdfb3duX3N0b2NrX3F0eScsJ19wc19zYW5kZWxpcycsJ19sZWdhY3lfbWFudWZhY3R1cmVyJywnX3BzX3NoYWRvd19vZicsJ19wcmljZScsJ19wZXRzaG9wX3Jldmlld19yZWFzb24nLCdfemJfc2tpcF9yZWFzb24nLCdfdmZfc3VwcGxpZXJfc2t1JykiKSBhcyAkbSkgJG1ldGFbJG0tPnBvc3RfaWRdWyRtLT5tZXRhX2tleV09JG0tPm1ldGFfdmFsdWU7CiAgICAkcG09W107IGZvcmVhY2ggKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHBvc3RfaWQsaW1wb3J0X2lkIEZST00geyRwfXBteGlfcG9zdHMgV0hFUkUgcG9zdF9pZCBJTiAoJGluKSIpIGFzICRyKSAkcG1bJHItPnBvc3RfaWRdW109KGludCkkci0+aW1wb3J0X2lkOwogICAgJHN0YXQ9W107CiAgICBmb3JlYWNoICgkcm93cyBhcyAkcikgeyAkbT0kbWV0YVskclsnSUQnXV0/P1tdOyAkZD1zdWJzdHIoJG1bJ196Yl9sYXN0X3N5bmMnXT8/JycsMCwxMCk7ICRrPSRyWydwb3N0X3N0YXR1cyddLid8Jy4oJG1bJ19wc19zYW5kZWxpcyddPz8nLScpLid8c3luYzonLigkZD86Jy0nKS4nfGxlZzonLihpc3NldCgkbVsnX2xlZ2FjeV9tYW51ZmFjdHVyZXInXSk/MTowKS4nfHNoYWRvdzonLihpc3NldCgkbVsnX3BzX3NoYWRvd19vZiddKT8xOjApLid8cG14aTonLmltcGxvZGUoJy8nLCRwbVskclsnSUQnXV0/P1tdKTsgJHN0YXRbJGtdPSgkc3RhdFska10/PzApKzE7CiAgICAgICRvWydsaXN0J11bXT1bJHJbJ0lEJ10sJHJbJ3Bvc3Rfc3RhdHVzJ10sbWJfc3Vic3RyKCRyWydwb3N0X3RpdGxlJ10sMCw0NSksJG1bJ19za3UnXT8/JycsJG1bJ196Yl9zdXBwbGllcl9za3UnXT8/JycsJG1bJ196Yl9xdHknXT8/JycsJG1bJ19zdG9jayddPz8nJywkbVsnX293bl9zdG9ja19xdHknXT8/JycsJG1bJ19wc19zYW5kZWxpcyddPz8nJywkZCwkbVsnX2xlZ2FjeV9tYW51ZmFjdHVyZXInXT8/JycsJG1bJ19wc19zaGFkb3dfb2YnXT8/JycsaW1wbG9kZSgnLycsJHBtWyRyWydJRCddXT8/W10pLCRtWydfemJfc2tpcF9yZWFzb24nXT8/KCRtWydfcGV0c2hvcF9yZXZpZXdfcmVhc29uJ10/PycnKV07IH0KICAgIGtzb3J0KCRzdGF0KTsgJG9bJ3N0YXQnXT0kc3RhdDsgJG9bJ3Zpc28nXT1jb3VudCgkcm93cyk7CiAgICAkb1snY29scyddPSdJRCxzdGF0dXMsdGl0bGUsX3NrdSxfemJfc3VwcGxpZXJfc2t1LF96Yl9xdHksX3N0b2NrLG93bixzYW5kZWxpcyx6Yl9zeW5jLGxlZ2FjeSxzaGFkb3dfb2YscG14aSxyZWFzb24nOwogICAgJG9bJ3BteGkyMyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHR5cGUsTEVGVChwYXRoLDYwKSBwYXRoLHByb2Nlc3NpbmcsdHJpZ2dlcmVkLGltcG9ydGVkLHVwZGF0ZWQsc2tpcHBlZCxjb3VudCxsYXN0X2FjdGl2aXR5IEZST00geyRwfXBteGlfaW1wb3J0cyBXSEVSRSBpZCBJTiAoMiwzKSIsQVJSQVlfQSk7CiAgICAkb1snaGlzdDInXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0eXBlLHRpbWVfcnVuLGRhdGUsc3VtbWFyeSBGUk9NIHskcH1wbXhpX2hpc3RvcnkgV0hFUkUgaW1wb3J0X2lkPTIgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAzIixBUlJBWV9BKTsKICAgICRvWydoaXN0MyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHR5cGUsdGltZV9ydW4sZGF0ZSxzdW1tYXJ5IEZST00geyRwfXBteGlfaGlzdG9yeSBXSEVSRSBpbXBvcnRfaWQ9MyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDMiLEFSUkFZX0EpOwogICAgJG9bJ3Nlc2VsaWFpJ109Z2V0X29wdGlvbigncHNfc2VzZWxpYWlfcGFza3V0aW5pcycpOwogICAgJG9bJ3piX3N5bmNfZGlzdCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIExFRlQobWV0YV92YWx1ZSwxMCkgZCwgQ09VTlQoKikgbiBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX3piX2xhc3Rfc3luYycgR1JPVVAgQlkgZCBPUkRFUiBCWSBkIERFU0MgTElNSVQgOCIsQVJSQVlfTik7CiAgICAvLyBaQiBmZWVkOiBNb25nZSBpcmFzYWkgKHN0b2Nrcy5waHApCiAgICAkdT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIHBhdGggRlJPTSB7JHB9cG14aV9pbXBvcnRzIFdIRVJFIGlkPTMiKTsgJHg9d3BfcmVtb3RlX2dldCgkdSxbJ3RpbWVvdXQnPT42MF0pOyAkYj13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkeCk7ICRvWyd6Yl9zdG9ja3MnXT1bJ2NvZGUnPT53cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkeCksJ2J5dGVzJz0+c3RybGVuKCRiKSwnaXRlbXMnPT5wcmVnX21hdGNoX2FsbCgnLzxpdGVtPi8nLCRiKSwnaGVhZCc9Pm1iX3N1YnN0cigkYiwwLDQwMCldOwogICAgJHUyPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgcGF0aCBGUk9NIHskcH1wbXhpX2ltcG9ydHMgV0hFUkUgaWQ9MiIpOyAkeDI9d3BfcmVtb3RlX2dldCgkdTIsWyd0aW1lb3V0Jz0+OTBdKTsgJGIyPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCR4Mik7ICRvWyd6Yl9wcm9kdWN0cyddPVsnY29kZSc9PndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCR4MiksJ2J5dGVzJz0+c3RybGVuKCRiMiksJ2l0ZW1zJz0+cHJlZ19tYXRjaF9hbGwoJy88aXRlbT4vJywkYjIpLCdtb25nZSc9PnByZWdfbWF0Y2hfYWxsKCcvTW9uZ2UvaScsJGIyKV07CiAgICBpZiAoJGIyICYmIHByZWdfbWF0Y2hfYWxsKCcvPGl0ZW0+Lio/PFwvaXRlbT4vcycsJGIyLCRpdCkpIHsgZm9yZWFjaCAoJGl0WzBdIGFzICRpKSBpZiAoc3RyaXBvcygkaSwnTW9uZ2UnKSE9PWZhbHNlKSB7IHByZWdfbWF0Y2goJy88Y29kZT4oLio/KTxcL2NvZGU+LycsJGksJGMpOyBwcmVnX21hdGNoKCcvPCg/Om5hbWV8dGl0bGUpPiguKj8pPFwvLycsJGksJG4pOyBwcmVnX21hdGNoKCcvPCg/OnF0eXxxdWFudGl0eXxzdG9jaylbXj5dKj4oLio/KTxcLy8nLCRpLCRxKTsgJG9bJ3piX21vbmdlX2ZlZWQnXVtdPVskY1sxXT8/JycsbWJfc3Vic3RyKHN0cmlwX3RhZ3MoJG5bMV0/PycnKSwwLDQ1KSwkcVsxXT8/JyddOyBpZihjb3VudCgkb1snemJfbW9uZ2VfZmVlZCddKT49ODApIGJyZWFrOyB9IH0KICAgIGlmICgkYjIgJiYgcHJlZ19tYXRjaCgnLzxpdGVtPi4qPzxcL2l0ZW0+L3MnLCRiMiwkZikpICRvWyd6Yl9pdGVtX3NhbXBsZSddPW1iX3N1YnN0cigkZlswXSwwLDkwMCk7CiAgICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUnxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-092159';
const GKEY='ps_ex20';
const PHASES=["R"];
const OUT='analize/s1593_recon.json';
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
