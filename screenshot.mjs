process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4NjQnXSkpIHJldHVybjsKICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89WydWRVJTSUpBJz0+J1MxNjAxLVIyJ107CiAgICAkYz1maWxlKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Atcmlua2luaWFpLnBocCcpOyAkb1snc2FyZ2FzJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcihhcnJheV9tYXAoJ3J0cmltJyxhcnJheV9zbGljZSgkYyw0MTQsNjApKSxmbigkeCk9PnRyaW0oJHgpIT09JycmJiFwcmVnX21hdGNoKCcvXlxzKihcL1wvfFwqfFwvXCopLycsJHgpKSk7CiAgICBmb3JlYWNoIChnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJykgYXMgJGYpIHsgJHQ9ZmlsZSgkZik7IGZvcmVhY2ggKCR0IGFzICRpPT4kbCkgaWYgKHByZWdfbWF0Y2goJy9jb3VyaWVyX29ubHl8X3BzX3Rpa19rdXJqZXJpdS8nLCRsKSAmJiBiYXNlbmFtZSgkZikhPT0ncGV0c2hvcC1rYXRhbG9nYXMucGhwJykgJG9bJ2tpdGknXVtdPWJhc2VuYW1lKCRmKS4nOicuKCRpKzEpLic6Jy50cmltKG1iX3N1YnN0cigkbCwwLDE0MCkpOyB9CiAgICAkaz1maWxlKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Ata2F0YWxvZ2FzLnBocCcpOyBmb3JlYWNoICgkayBhcyAkaT0+JGwpIGlmIChwcmVnX21hdGNoKCcvY291cmllcl9vbmx5fGZ1bmN0aW9uIC4qa3VyamVyfHBhY2thZ2VfcmF0ZXMvJywkbCkpICRvWydrYXQnXVtdPSgkaSsxKS4nOicudHJpbShtYl9zdWJzdHIoJGwsMCwxNDApKTsKICAgIGZvcmVhY2ggKFsxNTkyOCwxNTkyMCwxNTg3MCwxOTE0MCwzNTQwMCwzNTQwMiwzNTM5Nl0gYXMgJGlkKSAkb1snZmxhZyddWyRpZF09W21iX3N1YnN0cihnZXRfdGhlX3RpdGxlKCRpZCksMCwzMCksZ2V0X3Bvc3RfbWV0YSgkaWQsJ19wc190aWtfa3VyamVyaXUnLHRydWUpXTsKICAgICRvWydrdXJqZXJpdV9wdnonXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwbS5wb3N0X2lkLCBMRUZUKHBvLnBvc3RfdGl0bGUsNDApIHQgRlJPTSB7JHB9cG9zdG1ldGEgcG0gSk9JTiB7JHB9cG9zdHMgcG8gT04gcG8uSUQ9cG0ucG9zdF9pZCBXSEVSRSBwbS5tZXRhX2tleT0nX3BzX3Rpa19rdXJqZXJpdScgQU5EIHBtLm1ldGFfdmFsdWU9J3llcycgTElNSVQgMTIiLEFSUkFZX04pOwogICAgJG9bJ2t1cmplcml1X24nXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSdfcHNfdGlrX2t1cmplcml1JyBBTkQgbWV0YV92YWx1ZT0neWVzJyIpOwogICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0Owp9KTsK';
const VER='dep-135622';
const GKEY='ps_ex64';
const PHASES=["R"];
const OUT='analize/s1601_r2.json';
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
