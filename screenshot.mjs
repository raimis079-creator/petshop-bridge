process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDAzNSddKT8kX0dFVFsncHNfaDAzNSddOicnKSE9PSdIMDM1JykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDkwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0gwMzUnKTsKCiAka2F0PWdldF90ZXJtcyhhcnJheSgndGF4b25vbXknPT4ncHJvZHVjdF9jYXQnLCdoaWRlX2VtcHR5Jz0+ZmFsc2UpKTsKICRvWydrYXRlZ29yaWpvcyddPWFycmF5KCk7CiBmb3JlYWNoKCRrYXQgYXMgJHQpewogICBpZihpc193cF9lcnJvcigkdCkpIGNvbnRpbnVlOwogICAkaWRzPWdldF9vYmplY3RzX2luX3Rlcm0oYXJyYXkoJHQtPnRlcm1faWQpLCdwcm9kdWN0X2NhdCcpOwogICBpZihpc193cF9lcnJvcigkaWRzKSB8fCBlbXB0eSgkaWRzKSl7CiAgICAgJG9bJ2thdGVnb3Jpam9zJ11bJHQtPnRlcm1faWRdPWFycmF5KCd2YXJkYXMnPT4kdC0+bmFtZSwndGV2YXMnPT4oaW50KSR0LT5wYXJlbnQsCiAgICAgICAncHJla2l1Jz0+MCwnYnJlbmRhaSc9PmFycmF5KCksJ2F0cmlidXRhaSc9PmFycmF5KCkpOwogICAgIGNvbnRpbnVlOwogICB9CiAgICRpZHM9YXJyYXlfbWFwKCdpbnR2YWwnLCRpZHMpOwogICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgSUQgRlJPTSB7JFB9cG9zdHMgV0hFUkUgSUQgSU4gKCIuaW1wbG9kZSgnLCcsJGlkcykuIikKICAgICAgICBBTkQgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIik7CiAgICRuPWNvdW50KCRpZHMpOwogICAkYnJlbmQ9YXJyYXkoKTsgJHBhaz1hcnJheSgpOyAkc3BlYz1hcnJheSgpOwogICBpZigkbil7CiAgICAgJGluPWltcGxvZGUoJywnLGFycmF5X21hcCgnaW50dmFsJywkaWRzKSk7CiAgICAgJGJyZW5kPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHQubmFtZSwgQ09VTlQoKikgYyBGUk9NIHskUH10ZXJtX3JlbGF0aW9uc2hpcHMgdHIKICAgICAgIEpPSU4geyRQfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIEFORCB0dC50YXhvbm9teT0ncHJvZHVjdF9icmFuZCcKICAgICAgIEpPSU4geyRQfXRlcm1zIHQgT04gdC50ZXJtX2lkPXR0LnRlcm1faWQKICAgICAgIFdIRVJFIHRyLm9iamVjdF9pZCBJTiAoJGluKSBHUk9VUCBCWSB0Lm5hbWUgT1JERVIgQlkgYyBERVNDIExJTUlUIDYiLCBBUlJBWV9BKTsKICAgICAkc3BlYz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0dC50YXhvbm9teSwgdC5uYW1lLCBDT1VOVCgqKSBjIEZST00geyRQfXRlcm1fcmVsYXRpb25zaGlwcyB0cgogICAgICAgSk9JTiB7JFB9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQKICAgICAgICAgQU5EIHR0LnRheG9ub215IElOICgncGFfc3BlY2lhbGlfbWl0eWJhJywncGFfYmVfZ3J1ZHUnLCdwYV9neXZ1bm9fYW16aXVzJywncGFfdmVpc2xlc19keWRpcycpCiAgICAgICBKT0lOIHskUH10ZXJtcyB0IE9OIHQudGVybV9pZD10dC50ZXJtX2lkCiAgICAgICBXSEVSRSB0ci5vYmplY3RfaWQgSU4gKCRpbikgR1JPVVAgQlkgdHQudGF4b25vbXksdC5uYW1lIE9SREVSIEJZIGMgREVTQyBMSU1JVCAxMCIsIEFSUkFZX0EpOwogICAgICRrYWluPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgTUlOKENBU1QobWV0YV92YWx1ZSBBUyBERUNJTUFMKDEwLDIpKSkgbW4sCiAgICAgICAgIE1BWChDQVNUKG1ldGFfdmFsdWUgQVMgREVDSU1BTCgxMCwyKSkpIG14CiAgICAgICBGUk9NIHskUH1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkIElOICgkaW4pIEFORCBtZXRhX2tleT0nX3ByaWNlJyBBTkQgbWV0YV92YWx1ZTw+JyciLCBBUlJBWV9BKTsKICAgfQogICAkb1sna2F0ZWdvcmlqb3MnXVskdC0+dGVybV9pZF09YXJyYXkoJ3ZhcmRhcyc9PiR0LT5uYW1lLCd0ZXZhcyc9PihpbnQpJHQtPnBhcmVudCwKICAgICAncHJla2l1Jz0+JG4sJ2JyZW5kYWknPT4kYnJlbmQsJ2F0cmlidXRhaSc9PiRzcGVjLCdrYWluYSc9Pmlzc2V0KCRrYWluKT8ka2FpbjpudWxsKTsKIH0KICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H035'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H035 kategoriju faktai',code,scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:('KLAIDA '+cr.s+' '+cr.t.slice(0,200));
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h035=H035'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.http=r.status; out.zalias=t.slice(0,500); }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
const zlib=await import('zlib');
await put('screenshots/h035.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h035 kategoriju faktai');
