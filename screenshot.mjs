process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4MjMnXSkpIHJldHVybjsKICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89WydWRVJTSUpBJz0+J1MxNTkzLVI0J107CiAgICAkb1sncG14aV9wb3N0c19jb2xzJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskcH1wbXhpX3Bvc3RzIik7CiAgICAkb1sncHBfMzI0NjMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00geyRwfXBteGlfcG9zdHMgV0hFUkUgcG9zdF9pZD0zMjQ2MyIsQVJSQVlfQSk7CiAgICAkb1sncHBfa2V5J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcHAuKiwgcG8ucG9zdF9zdGF0dXMsIHBvLnBvc3RfdHlwZSBGUk9NIHskcH1wbXhpX3Bvc3RzIHBwIExFRlQgSk9JTiB7JHB9cG9zdHMgcG8gT04gcG8uSUQ9cHAucG9zdF9pZCBXSEVSRSBwcC5pbXBvcnRfaWQ9MyBBTkQgcHAudW5pcXVlX2tleSBMSUtFICclMDFNMjIwODAxJSciLEFSUkFZX0EpOwogICAgJG9bJ3BwM19zdGF0J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcG8ucG9zdF9zdGF0dXMsIHBvLnBvc3RfdHlwZSwgQ09VTlQoKikgbiBGUk9NIHskcH1wbXhpX3Bvc3RzIHBwIExFRlQgSk9JTiB7JHB9cG9zdHMgcG8gT04gcG8uSUQ9cHAucG9zdF9pZCBXSEVSRSBwcC5pbXBvcnRfaWQ9MyBHUk9VUCBCWSBwby5wb3N0X3N0YXR1cywgcG8ucG9zdF90eXBlIixBUlJBWV9BKTsKICAgICRvWydwcDNfZHVwX2tleXMnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gKFNFTEVDVCB1bmlxdWVfa2V5IEZST00geyRwfXBteGlfcG9zdHMgV0hFUkUgaW1wb3J0X2lkPTMgR1JPVVAgQlkgdW5pcXVlX2tleSBIQVZJTkcgQ09VTlQoKik+MSkgeCIpOwogICAgJG9wPW1heWJlX3Vuc2VyaWFsaXplKCR3cGRiLT5nZXRfdmFyKCJTRUxFQ1Qgb3B0aW9ucyBGUk9NIHskcH1wbXhpX2ltcG9ydHMgV0hFUkUgaWQ9MyIpKTsKICAgIGZvcmVhY2ggKFsndW5pcXVlX2tleScsJ2N1c3RvbV9uYW1lJywnY3VzdG9tX3ZhbHVlJywnaXNfdXBkYXRlX2N1c3RvbV9maWVsZHMnLCd1cGRhdGVfY3VzdG9tX2ZpZWxkc19sb2dpYycsJ2N1c3RvbV9maWVsZHNfbGlzdCcsJ2lzX3VwZGF0ZV9zdG9jaycsJ2lzX3VwZGF0ZV9tZW51X29yZGVyJywndXBkYXRlX2FsbF9kYXRhJywncHJvZHVjdF9zdG9ja19xdHknLCdwcm9kdWN0X3N0b2NrX3N0YXR1cycsJ3Byb2R1Y3RfbWFuYWdlX3N0b2NrJywnaXNfcHJvZHVjdF91cGRhdGVfc3RvY2snLCdpc19rZWVwX2Zvcm1lcl9wb3N0cycsJ2NyZWF0ZV9uZXdfcmVjb3JkcycsJ2lzX3NlbGVjdGl2ZV9oYXNoaW5nJywnbWF0Y2hpbmdfdHlwZSddIGFzICRrKSBpZiAoaXNzZXQoJG9wWyRrXSkpICRvWydvcHQzJ11bJGtdPWlzX2FycmF5KCRvcFska10pP2pzb25fZW5jb2RlKCRvcFska10pOm1iX3N1YnN0cigoc3RyaW5nKSRvcFska10sMCwyMDApOwogICAgLy8gMzI0NjMgbWV0YQogICAgJG9bJ20zMjQ2MyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG1ldGFfa2V5LExFRlQobWV0YV92YWx1ZSw0MCkgdiBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPTMyNDYzIEFORCAobWV0YV9rZXkgTElLRSAnXF96YiUnIE9SIG1ldGFfa2V5IElOICgnX3N0b2NrJywnX3NrdScsJ19vd25fc3RvY2tfcXR5JywnX2FjdGl2ZV9mdWxmaWxsbWVudF9zb3VyY2UnLCdfd2NfcG14aV9pbXBvcnRfaWQnKSkiLEFSUkFZX04pOwogICAgLy8gWkIgc3RvY2sgc3luYyBob29rIGtvZGFzCiAgICAkYz1maWxlKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXhtbC9wZXRzaG9wLXhtbC5waHAnKTsgZm9yZWFjaCAoJGMgYXMgJGk9PiRsKSBpZiAocHJlZ19tYXRjaCgnL3BteGlfc2F2ZWRfcG9zdHxfemJfbGFzdF9zeW5jfHVwZGF0ZV96Yl9xdHl8emJfc3RvY2tfc3luY3xaQl9TVE9DS3xJTVBPUlRfSURTXHMqPXxkZWZpbmVcKFxzKi5QRVRTSE9QX1hNTF9aQi8nLCRsKSkgJG9bJ2hvb2snXVtdPSgkaSsxKS4nOicudHJpbShtYl9zdWJzdHIoJGwsMCwxNTApKTsKICAgICRzPW51bGw7IGZvcmVhY2ggKCRjIGFzICRpPT4kbCkgaWYgKHByZWdfbWF0Y2goJy9mdW5jdGlvbiBwZXRzaG9wX3htbF96Yl9zdG9ja19zeW5jfGZ1bmN0aW9uIHBldHNob3BfeG1sX3NhdmVkX3Bvc3R8ZnVuY3Rpb24gcGV0c2hvcF94bWxfYWZ0ZXJfc2F2ZS8nLCRsKSl7JHM9JGk7YnJlYWs7fQogICAgaWYgKCRzIT09bnVsbCkgJG9bJ2ZuJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcihhcnJheV9tYXAoJ3J0cmltJyxhcnJheV9zbGljZSgkYywkcyw3MCkpLGZuKCR4KT0+dHJpbSgkeCkhPT0nJyYmIXByZWdfbWF0Y2goJy9eXHMqKFwvXC98XCp8XC9cKikvJywkeCkpKTsKICAgIGZvcmVhY2ggKGdsb2IoV1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sL2luY2x1ZGVzLyoucGhwJykgYXMgJGcpIHsgJHQ9ZmlsZV9nZXRfY29udGVudHMoJGcpOyBpZiAocHJlZ19tYXRjaF9hbGwoJy9eLioocG14aV9zYXZlZF9wb3N0fF96Yl9sYXN0X3N5bmN8dXBkYXRlX3piX3F0eSkuKiQvbScsJHQsJG1tKSkgJG9bJ2luYyddW2Jhc2VuYW1lKCRnKV09YXJyYXlfc2xpY2UoYXJyYXlfbWFwKCd0cmltJywkbW1bMF0pLDAsMTIpOyB9CiAgICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUnxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-092736';
const GKEY='ps_ex23';
const PHASES=["R"];
const OUT='analize/s1593_r4.json';
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
