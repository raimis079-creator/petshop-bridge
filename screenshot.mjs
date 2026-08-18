process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDAzOSddKT8kX0dFVFsncHNfaDAzOSddOicnKSE9PSdIMDM5JykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0gwMzknKTsKICRmPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtbGVnYWN5LTMwMS1tYXAuanNvbic7CiAkbT1qc29uX2RlY29kZShmaWxlX2dldF9jb250ZW50cygkZiksIHRydWUpOwogJGtpdGE9YXJyYXkoKTsgCiBmb3JlYWNoKCRtIGFzICRzPT4kdCl7CiAgIGlmKHN0cnBvcygkdCwnL3Byb2R1Y3QvJyk9PT1mYWxzZSAmJiBzdHJwb3MoJHQsJy9rYXRlZ29yaWphLycpPT09ZmFsc2UgJiYgc3RycG9zKCR0LCcvZ2FtaW50b2phcy8nKT09PWZhbHNlKQogICAgICRraXRhWyRzXT0kdDsKIH0KICRvWydraXRhJ109JGtpdGE7CiAkb1sna2l0YV9raWVrJ109Y291bnQoJGtpdGEpOwogLyogYXIgemVtZWxhcHlqZSB5cmEgamF1dHJ1cy12aXJza2luaW1hcyAqLwogJG9bJ2phdXRydXNfemVtZWxhcHlqZSddPWFycmF5KCk7CiBmb3JlYWNoKCRtIGFzICRzPT4kdCl7IGlmKHN0cnBvcygkcywnamF1dHJ1cycpIT09ZmFsc2UgfHwgc3RycG9zKCR0LCdqYXV0cnVzJykhPT1mYWxzZSkgJG9bJ2phdXRydXNfemVtZWxhcHlqZSddWyRzXT0kdDsgfQogLyoga29rcyBvYmpla3RhcyB5cmEgamF1dHJ1cy12aXJza2luaW1hcyAqLwogJHQ9Z2V0X3Rlcm1fYnkoJ3NsdWcnLCdqYXV0cnVzLXZpcnNraW5pbWFzJywncHJvZHVjdF9jYXQnKTsKICRvWyd0ZXJtaW5hcyddPSR0JiYhaXNfd3BfZXJyb3IoJHQpP2FycmF5KCdpZCc9PiR0LT50ZXJtX2lkLCd2YXJkYXMnPT4kdC0+bmFtZSwndGV2YXMnPT4kdC0+cGFyZW50LCd1cmwnPT5nZXRfdGVybV9saW5rKCR0KSwnY291bnQnPT4kdC0+Y291bnQpOm51bGw7CiAkcD1nZXRfcGFnZV9ieV9wYXRoKCdqYXV0cnVzLXZpcnNraW5pbWFzJyk7CiAkb1sncHVzbGFwaXMnXT0kcD9hcnJheSgnaWQnPT4kcC0+SUQsJ3RpcGFzJz0+JHAtPnBvc3RfdHlwZSwnc3RhdHVzJz0+JHAtPnBvc3Rfc3RhdHVzKTpudWxsOwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H039'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function seka(u,maxHop=6){
  const k=[]; let cur=u;
  for(let i=0;i<maxHop;i++){
    const r=await fetch(cur,{redirect:'manual'});
    const loc=r.headers.get('location');
    k.push({u:cur.replace('https://dev.avesa.lt',''),st:r.status,xrb:r.headers.get('x-redirect-by')||''});
    if(r.status>=300&&r.status<400&&loc){ cur=loc.startsWith('http')?loc:'https://dev.avesa.lt'+loc; continue; }
    break;
  }
  return k;
}
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){
    if(String(s.name||'').startsWith('TEMP') && s.active){
      await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})});
    }
  }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H039 kita ir kontrole',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:'KLAIDA';
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h039=H039'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }

  out.jautrus=await seka('https://dev.avesa.lt/jautrus-virskinimas/');
  out.jautrus_be=await seka('https://dev.avesa.lt/jautrus-virskinimas');
  /* visi „kita" taikiniai */
  out.kita_testai=[]; out.i_pradzia=[];
  if(out.d && out.d.kita){
    for(const [sena,taik] of Object.entries(out.d.kita)){
      const k=await seka('https://dev.avesa.lt'+(sena.startsWith('/')?sena:'/'+sena));
      const pask=k[k.length-1];
      const irec = pask.u==='/'||pask.u===''||pask.u==='/?';
      if(irec) out.i_pradzia.push({sena,taik,kelias:k});
      if(out.kita_testai.length<40) out.kita_testai.push({sena,taik,st:k[0].st,suoliu:k.length,gal:pask.st,url:pask.u});
      await new Promise(s=>setTimeout(s,80));
    }
  }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
const zlib=await import('zlib');
await put('screenshots/h039.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h039 kita ir kontrole');
