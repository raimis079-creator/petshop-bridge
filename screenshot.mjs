process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDA1NCddKT8kX0dFVFsncHNfaDA1NCddOicnKSE9PSdIMDU0JykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDMwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0gwNTQnKTsKIGZvcmVhY2goYXJyYXkoJ3Rha3NhcycsJ2pvcmtzeXJvLXRlcmplcmFzJywncnVzdS1tZWx5bm9qaScsJ2thdWthem8tYXZpZ2FuaXMnKSBhcyAkcyl7CiAgICRyPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgSUQscG9zdF90eXBlLHBvc3Rfc3RhdHVzLHBvc3RfdGl0bGUscG9zdF9wYXJlbnQsCiAgICAgICAgTEVOR1RIKHBvc3RfY29udGVudCkgaWxnaXMsIHBvc3RfZGF0ZSwgcG9zdF9tb2RpZmllZAogICAgICBGUk9NIHskUH1wb3N0cyBXSEVSRSBwb3N0X25hbWU9JXMgTElNSVQgMSIsJHMpLCBBUlJBWV9BKTsKICAgJG9bJ3BhZ2FsX3NsdWcnXVskc109JHI7CiAgIGlmKCRyKSAkb1sncGFnYWxfc2x1ZyddWyRzXVsndXJsJ109Z2V0X3Blcm1hbGluaygkclsnSUQnXSk7CiB9CiAkb1sndGlwdV9zdXZlc3RpbmUnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwb3N0X3R5cGUscG9zdF9zdGF0dXMsQ09VTlQoKikgbgogICBGUk9NIHskUH1wb3N0cyBXSEVSRSBwb3N0X3N0YXR1cyBJTiAoJ3B1Ymxpc2gnLCdkcmFmdCcsJ3ByaXZhdGUnKQogICBHUk9VUCBCWSBwb3N0X3R5cGUscG9zdF9zdGF0dXMgT1JERVIgQlkgbiBERVNDIiwgQVJSQVlfQSk7CiAvKiBraWVrIGlyYXN1IHR1cmkgYWJzb2xpdWNpYXMgcGV0c2hvcC5sdCBudW9yb2RhcyAqLwogJG9bJ3N1X3Nlbm9taXNfbnVvcm9kb21pcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHBvc3RfdHlwZSxDT1VOVCgqKSBuCiAgIEZST00geyRQfXBvc3RzIFdIRVJFIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgcG9zdF9jb250ZW50IExJS0UgJyUvL3BldHNob3AubHQvJScKICAgR1JPVVAgQlkgcG9zdF90eXBlIiwgQVJSQVlfQSk7CiAkb1sndmlzb19udW9yb2R1J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIFNVTSggKExFTkdUSChwb3N0X2NvbnRlbnQpLUxFTkdUSChSRVBMQUNFKHBvc3RfY29udGVudCwnLy9wZXRzaG9wLmx0LycsJycpKSkvMTQgKQogICBGUk9NIHskUH1wb3N0cyBXSEVSRSBwb3N0X3N0YXR1cz0ncHVibGlzaCciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H054'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H054 straipsniu tipai',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:'KLAIDA';
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h054=H054'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  /* ar sena petshop.lt turi tuos straipsnius */
  out.sena=[];
  for(const s of ['taksas','jorksyro-terjeras','rusu-melynoji']){
    try{ const x=await fetch('https://petshop.lt/'+s); const h=await x.text();
      out.sena.push({s,http:x.status,zn:h.length,
        h1:(h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||['',''])[1].replace(/<[^>]+>/g,'').trim().slice(0,50)}); }
    catch(e){ out.sena.push({s,kl:String(e).slice(0,60)}); }
  }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/h054.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h054 straipsniu tipai');
