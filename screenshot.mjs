process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLy8gVEVNUCBQUyBTMTU5MSByZWNvbjI6IFZGIHBvcmF2aW1vIGtvZGFzICsgZmVlZAphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24gKCkgewogICAgaWYgKCFpc3NldCgkX0dFVFsncHNfZXgyJ10pKSByZXR1cm47CiAgICBnbG9iYWwgJHdwZGI7ICRwID0gJHdwZGItPnByZWZpeDsgJG8gPSBbJ1ZFUlNJSkEnID0+ICdTMTU5MS1SMiddOwogICAgJGYgPSBXUF9QTFVHSU5fRElSLicvcGV0c2hvcC14bWwvcGV0c2hvcC14bWwucGhwJzsKICAgICRsbiA9IGZpbGUoJGYpOyAkb1snZWlsJ10gPSBjb3VudCgkbG4pOwogICAgLy8gZnVua2NpanUgemVtZWxhcGlzCiAgICBmb3JlYWNoICgkbG4gYXMgJGk9PiRsKSBpZiAocHJlZ19tYXRjaCgnL15ccyooZnVuY3Rpb258YWRkX2ZpbHRlcnxhZGRfYWN0aW9uKVxzKlwoP1xzKltcJyJdPyhbYS16XzAtOV0rKS9pJywkbCwkbSkpICRvWydtYXAnXVtdPSgkaSsxKS4nOicudHJpbShtYl9zdWJzdHIoJGwsMCwxMTApKTsKICAgIC8vIGJsb2NrX3ZmX2NyZWF0ZSBrdW5hcwogICAgJHM9bnVsbDsgZm9yZWFjaCAoJGxuIGFzICRpPT4kbCkgaWYgKHN0cnBvcygkbCwnZnVuY3Rpb24gcGV0c2hvcF94bWxfYmxvY2tfdmZfY3JlYXRlJykhPT1mYWxzZSl7JHM9JGk7YnJlYWs7fQogICAgaWYgKCRzIT09bnVsbCkgJG9bJ2Jsb2NrX3ZmX2NyZWF0ZSddID0gYXJyYXlfbWFwKGZuKCR4KT0+cnRyaW0oJHgpLCBhcnJheV9zbGljZSgkbG4sJHMsMTMwKSk7CiAgICAvLyBpc19wb3N0X3RvX2NyZWF0ZSAvIFZGIHBvcmF2aW1vIChfdmZfc3VwcGxpZXJfc2t1LCBmaW5kX2J5X2VhbikgdmlldG9zCiAgICBmb3JlYWNoICgkbG4gYXMgJGk9PiRsKSBpZiAocHJlZ19tYXRjaCgnL192Zl9zdXBwbGllcl9za3V8ZmluZF9ieV9lYW58YmxvY2tfbGVnYWN5X3VwZGF0ZXxfbGVnYWN5X21hbnVmYWN0dXJlci8nLCRsKSkgJG9bJ3ZmX3JlZiddW109KCRpKzEpLic6Jy50cmltKG1iX3N1YnN0cigkbCwwLDE1MCkpOwogICAgLy8gaW5jbHVkZXMgZmFpbGFpCiAgICBmb3JlYWNoIChnbG9iKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXhtbC9pbmNsdWRlcy8qLnBocCcpIGFzICRnKSB7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRnKTsgJG9bJ2luYyddW2Jhc2VuYW1lKCRnKV09c3RybGVuKCRjKTsKICAgICAgICBpZiAocHJlZ19tYXRjaF9hbGwoJy9eLiooX3ZmX3N1cHBsaWVyX3NrdXxmaW5kX2J5X2VhbnxmdW5jdGlvbiB1cGRhdGVfdmZfcXR5fHNrdV9pZCkuKiQvbScsJGMsJG1tKSkgJG9bJ2luY19yZWYnXVtiYXNlbmFtZSgkZyldPWFycmF5X3NsaWNlKGFycmF5X21hcChmbigkeCk9PnRyaW0obWJfc3Vic3RyKCR4LDAsMTUwKSksJG1tWzBdKSwwLDI1KTsgfQogICAgLy8gSW1wb3J0ICM1LyM3IHBteGkgb3B0aW9uczogdW5pcXVlIGtleSwgdXBkYXRlIGxvZ2ljCiAgICBmb3JlYWNoICgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCwgb3B0aW9ucyBGUk9NIHskcH1wbXhpX2ltcG9ydHMgV0hFUkUgaWQgSU4gKDUsNykiKSBhcyAkcikgewogICAgICAgICRvcCA9IG1heWJlX3Vuc2VyaWFsaXplKCRyLT5vcHRpb25zKTsgJGtlZXA9Wyd1bmlxdWVfa2V5JywnaXNfdXBkYXRlX21pc3NpbmdfY2YnLCd1cGRhdGVfYWxsX2RhdGEnLCdpc19rZWVwX2Zvcm1lcl9wb3N0cycsJ2lzX3VwZGF0ZV9zdGF0dXMnLCdpc191cGRhdGVfdGl0bGUnLCdpc191cGRhdGVfY29udGVudCcsJ2lzX3VwZGF0ZV9pbWFnZXMnLCdpc191cGRhdGVfY3VzdG9tX2ZpZWxkcycsJ2N1c3RvbV9maWVsZHNfbGlzdCcsJ2lzX3VwZGF0ZV9hdHRyaWJ1dGVzJywnY3VzdG9tX25hbWUnLCdpc19zZWxlY3RpdmVfaGFzaGluZycsJ3VwZGF0ZV9jdXN0b21fZmllbGRzX2xvZ2ljJywnc2V0X21pc3NpbmdfdG9fZHJhZnQnLCdjcmVhdGVfbmV3X3JlY29yZHMnLCdpc19kZWxldGVfbWlzc2luZycsJ2lzX3VwZGF0ZV9tZW51X29yZGVyJywnY3VzdG9tX3ZhbHVlJ107CiAgICAgICAgZm9yZWFjaCAoJGtlZXAgYXMgJGspIGlmIChpc3NldCgkb3BbJGtdKSkgJG9bJ3BteGknLiRyLT5pZF1bJGtdPSBpc19hcnJheSgkb3BbJGtdKSA/IGFycmF5X3NsaWNlKCRvcFska10sMCw2MCkgOiBtYl9zdWJzdHIoKHN0cmluZykkb3BbJGtdLDAsMzAwKTsKICAgIH0KICAgIC8vIDE4NTEyIHBhdnl6ZHlzIChkdWFsIGxlZ2FjeSt2ZikgdnMgMTg1OTMgKGF2IG9ubHkpCiAgICBmb3JlYWNoIChbMTg1MTIsMTg1OTMsMjA1MTddIGFzICRpZCkgJG9bJ21ldGEnLiRpZF0gPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtZXRhX2tleSwgTEVGVChtZXRhX3ZhbHVlLDYwKSB2IEZST00geyRwfXBvc3RtZXRhIFdIRVJFIHBvc3RfaWQ9JGlkIEFORCAobWV0YV9rZXkgTElLRSAnXF92ZiUnIE9SIG1ldGFfa2V5IExJS0UgJ1xfemIlJyBPUiBtZXRhX2tleSBMSUtFICdcX3BzJScgT1IgbWV0YV9rZXkgTElLRSAnXF9sZWdhY3klJyBPUiBtZXRhX2tleSBJTiAoJ19za3UnLCdfc3RvY2snLCdfbWFuYWdlX3N0b2NrJywnX3N0b2NrX3N0YXR1cycsJ19vd25fc3RvY2tfcXR5JywnX2dsb2JhbF91bmlxdWVfaWQnLCdfcHJpY2UnLCdfcmVndWxhcl9wcmljZScsJ19tYW51YWxfcHJpY2Vfb3ZlcnJpZGUnKSkgT1JERVIgQlkgbWV0YV9rZXkiLCBBUlJBWV9OKTsKICAgICRvWydwc19zb3VyY2VzXzE4NTkzJ10gPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00geyRwfXBzX3NvdXJjZXMgV0hFUkUgcHJvZHVjdF9pZCBJTiAoMTg1MTIsMTg1OTMpIiwgQVJSQVlfQSk7CiAgICAkb1sncHNfc291cmNlc19jb2xzJ10gPSAkd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRwfXBzX3NvdXJjZXMiKTsKICAgIC8vIFZGIGZlZWQ6IGZldGNoZXIgZmFpbGFzIGxva2FsaWFpCiAgICAkZnAgPSBBQlNQQVRILid3cC1jb250ZW50L3BldHNob3AteG1sLXZmLWZldGNoZXIucGhwJzsgJG9bJ2ZldGNoZXJfZXhpc3RzJ109ZmlsZV9leGlzdHMoJGZwKTsKICAgIGlmIChmaWxlX2V4aXN0cygkZnApKSB7ICRmYz1maWxlX2dldF9jb250ZW50cygkZnApOyAkb1snZmV0Y2hlcl9oZWFkJ109bWJfc3Vic3RyKCRmYywwLDE1MDApOyB9CiAgICAkdmYgPSAkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIHBhdGggRlJPTSB7JHB9cG14aV9pbXBvcnRzIFdIRVJFIGlkPTUiKTsKICAgIGZvcmVhY2ggKFskdmYsIHN0cl9yZXBsYWNlKCdodHRwczovL2Rldi5hdmVzYS5sdCcsJ2h0dHBzOi8vcGV0c2hvcC5sdCcsJHZmKV0gYXMgJHUpIHsKICAgICAgICAkeCA9IHdwX3JlbW90ZV9nZXQoJHUsIFsndGltZW91dCc9PjkwLCdzc2x2ZXJpZnknPT5mYWxzZV0pOyAkYiA9IGlzX3dwX2Vycm9yKCR4KT8oJ0VSUiAnLiR4LT5nZXRfZXJyb3JfbWVzc2FnZSgpKTp3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkeCk7CiAgICAgICAgJGsgPSBzdHJwb3MoJHUsJ2Rldi4nKSE9PWZhbHNlPydkZXYnOidwcm9kJzsgJG9bJ2ZlZWRfJy4ka109Wydjb2RlJz0+aXNfd3BfZXJyb3IoJHgpPzA6d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHgpLCdieXRlcyc9PnN0cmxlbigkYiksJ2hlYWQnPT5tYl9zdWJzdHIoJGIsMCwzMDApXTsKICAgICAgICBpZiAoc3RybGVuKCRiKT4xMDAwMCkgewogICAgICAgICAgICAkc2t1cz1bJ0FNMjAnLCdRTTM3JywnUE0zNycsJ1BNMjAnLCdWTTM3JywnSE0zNycsJ0RNMzcnLCdETTIwJywnSU5QTTExJywnTkdBTEE0MCddOwogICAgICAgICAgICBmb3JlYWNoICgkc2t1cyBhcyAkc2spIHsgJHBvcz1zdHJwb3MoJGIsJz4nLiRzay4nPCcpOyAkb1snZmVlZF8nLiRrXVsnc2t1J11bJHNrXT0gJHBvcz09PWZhbHNlP251bGw6bWJfc3Vic3RyKCRiLG1heCgwLCRwb3MtMjAwKSw3MDApOyB9CiAgICAgICAgICAgICRvWydmZWVkXycuJGtdWydleGNsX2NudCddPXByZWdfbWF0Y2hfYWxsKCcvRVhDTC91JywkYik7CiAgICAgICAgICAgIGJyZWFrOwogICAgICAgIH0KICAgIH0KICAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBlY2hvIGpzb25fZW5jb2RlKCRvLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-075704';
const GKEY='ps_ex2';
const PHASES=["R"];
const OUT='analize/s1591_recon2.json';
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
