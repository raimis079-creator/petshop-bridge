process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfZm9vdGVyJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDAzMSddKT8kX0dFVFsncHNfaDAzMSddOicnKSE9PSdIMDMxJykgcmV0dXJuOwogaWYoIWZ1bmN0aW9uX2V4aXN0cygnaXNfcHJvZHVjdF9jYXRlZ29yeScpIHx8ICFpc19wcm9kdWN0X2NhdGVnb3J5KCkpIHJldHVybjsKIGdsb2JhbCAkd3BkYiwkd3BfZmlsdGVyOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidIMDMxJyk7CgogJHZhcmRhcz1mdW5jdGlvbigkY2IpewogICBpZihpc19zdHJpbmcoJGNiKSkgcmV0dXJuICRjYjsKICAgaWYoaXNfYXJyYXkoJGNiKSkgcmV0dXJuIChpc19vYmplY3QoJGNiWzBdKT9nZXRfY2xhc3MoJGNiWzBdKTooc3RyaW5nKSRjYlswXSkuJzo6Jy4kY2JbMV07CiAgIGlmKCRjYiBpbnN0YW5jZW9mIENsb3N1cmUpewogICAgIHRyeXsgJHI9bmV3IFJlZmxlY3Rpb25GdW5jdGlvbigkY2IpOwogICAgICAgcmV0dXJuICdDbG9zdXJlQCcuc3RyX3JlcGxhY2UoQUJTUEFUSCwnJywkci0+Z2V0RmlsZU5hbWUoKSkuJzonLiRyLT5nZXRTdGFydExpbmUoKTsgfQogICAgIGNhdGNoKEV4Y2VwdGlvbiAkZSl7IHJldHVybiAnQ2xvc3VyZSg/KSc7IH0KICAgfQogICByZXR1cm4gJ29iamVrdGFzJzsKIH07CiAka2FibGl1a2FpPWFycmF5KCd3b29jb21tZXJjZV9hcmNoaXZlX2Rlc2NyaXB0aW9uJywnd29vY29tbWVyY2VfYmVmb3JlX21haW5fY29udGVudCcsCiAgICd3b29jb21tZXJjZV9iZWZvcmVfc2hvcF9sb29wJywnd29vY29tbWVyY2VfYWZ0ZXJfc2hvcF9sb29wJywnd29vY29tbWVyY2VfYWZ0ZXJfbWFpbl9jb250ZW50JywKICAgJ3dvb2NvbW1lcmNlX3Nob3BfbG9vcF9oZWFkZXInLCdmbGF0c29tZV9jYXRlZ29yeV90aXRsZScpOwogZm9yZWFjaCgka2FibGl1a2FpIGFzICRoKXsKICAgaWYoIWlzc2V0KCR3cF9maWx0ZXJbJGhdKSkgeyAkb1sna2FibGl1a2FpJ11bJGhdPSdORVJFR0lTVFJVT1RBUyc7IGNvbnRpbnVlOyB9CiAgICRzYXI9YXJyYXkoKTsKICAgZm9yZWFjaCgkd3BfZmlsdGVyWyRoXS0+Y2FsbGJhY2tzIGFzICRwcj0+JGNicykKICAgICBmb3JlYWNoKCRjYnMgYXMgJGlkPT4kYykgJHNhcltdPSRwci4nIHwgJy4kdmFyZGFzKCRjWydmdW5jdGlvbiddKTsKICAgJG9bJ2thYmxpdWthaSddWyRoXT0kc2FyOwogfQoKIC8qIGt1ciB0ZW1vamUgbWluaW1hcyB0ZXJtLWRlc2NyaXB0aW9uICovCiAkcmFkbz1hcnJheSgpOwogZm9yZWFjaChhcnJheShnZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKSwgZ2V0X3RlbXBsYXRlX2RpcmVjdG9yeSgpKSBhcyAkZGlyKXsKICAgaWYoIWlzX2RpcigkZGlyKSkgY29udGludWU7CiAgIHRyeXsKICAgICAkaXQ9bmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRkaXIpKTsKICAgICAkbj0wOwogICAgIGZvcmVhY2goJGl0IGFzICRmKXsKICAgICAgIGlmKCRuKys+NjAwMCkgYnJlYWs7CiAgICAgICBpZighJGYtPmlzRmlsZSgpKSBjb250aW51ZTsKICAgICAgIGlmKHN0cnRvbG93ZXIocGF0aGluZm8oJGYtPmdldEZpbGVuYW1lKCksUEFUSElORk9fRVhURU5TSU9OKSkhPT0ncGhwJykgY29udGludWU7CiAgICAgICAkcz1AZmlsZV9nZXRfY29udGVudHMoJGYtPmdldFBhdGhuYW1lKCkpOwogICAgICAgaWYoJHM9PT1mYWxzZSkgY29udGludWU7CiAgICAgICBpZihzdHJwb3MoJHMsJ3Rlcm0tZGVzY3JpcHRpb24nKSE9PWZhbHNlIHx8IHN0cnBvcygkcywndGVybV9kZXNjcmlwdGlvbicpIT09ZmFsc2UpewogICAgICAgICBmb3JlYWNoKGV4cGxvZGUoIlxuIiwkcykgYXMgJGk9PiRsKXsKICAgICAgICAgICBpZihzdHJwb3MoJGwsJ3Rlcm0tZGVzY3JpcHRpb24nKSE9PWZhbHNlIHx8IHN0cnBvcygkbCwndGVybV9kZXNjcmlwdGlvbicpIT09ZmFsc2UpCiAgICAgICAgICAgICAkcmFkb1tdPXN0cl9yZXBsYWNlKEFCU1BBVEgsJycsJGYtPmdldFBhdGhuYW1lKCkpLic6Jy4oJGkrMSkuJyAnLnRyaW0obWJfc3Vic3RyKCRsLDAsMTEwKSk7CiAgICAgICAgIH0KICAgICAgIH0KICAgICB9CiAgIH1jYXRjaChFeGNlcHRpb24gJGUpe30KIH0KICRvWyd0ZW1vamUnXT1hcnJheV9zbGljZSgkcmFkbywwLDIwKTsKCiAvKiBXb29Db21tZXJjZSBudW1hdHl0b2ppIGZ1bmtjaWphICovCiAkb1snd2NfZnVua2NpamEnXT1mdW5jdGlvbl9leGlzdHMoJ3dvb2NvbW1lcmNlX3RheG9ub215X2FyY2hpdmVfZGVzY3JpcHRpb24nKT8neXJhJzonbmVyYSc7CiBpZihmdW5jdGlvbl9leGlzdHMoJ3dvb2NvbW1lcmNlX3RheG9ub215X2FyY2hpdmVfZGVzY3JpcHRpb24nKSl7CiAgIHRyeXsgJHI9bmV3IFJlZmxlY3Rpb25GdW5jdGlvbignd29vY29tbWVyY2VfdGF4b25vbXlfYXJjaGl2ZV9kZXNjcmlwdGlvbicpOwogICAgICRvWyd3Y19mYWlsYXMnXT1zdHJfcmVwbGFjZShBQlNQQVRILCcnLCRyLT5nZXRGaWxlTmFtZSgpKS4nOicuJHItPmdldFN0YXJ0TGluZSgpOyB9Y2F0Y2goRXhjZXB0aW9uICRlKXt9CiB9CiAkb1snY2hpbGRfZnVuY3Rpb25zX2R5ZGlzJ109QGZpbGVzaXplKGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvZnVuY3Rpb25zLnBocCcpOwogJG9bJ2thdGVnb3JpamEnXT1pc190YXgoKT9nZXRfcXVlcmllZF9vYmplY3QoKS0+bmFtZTpudWxsOwoKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiB3aGlsZShvYl9nZXRfbGV2ZWwoKSkgb2JfZW5kX2NsZWFuKCk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgOTk5KTsK';
const out={versija:'H031'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){
    if(String(s.name||'').startsWith('TEMP') && s.active){
      await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})});
    }
  }
  const code=Buffer.from(B64,'base64').toString('utf8');
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H031 kategorijos kabliukai',code,scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:('KLAIDA '+cr.s+' '+cr.t.slice(0,200));
  await new Promise(r=>setTimeout(r,9000));
  const u='https://dev.avesa.lt/kategorija/sunims/maistas-sunims/sausas-maistas-sunims/?ps_h031=H031';
  const r=await fetch(u); const t=await r.text();
  const i=t.lastIndexOf('{"v":"H031"');
  if(i>=0){ try{ out.d=JSON.parse(t.slice(i)); }catch(e){ out.parse=t.slice(i,i+400); } }
  else { out.http=r.status; out.zalias=t.slice(-500); }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
const zlib=await import('zlib');
await put('screenshots/h031.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h031 kategorijos kabliukai');
