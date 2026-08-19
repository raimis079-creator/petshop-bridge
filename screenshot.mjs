process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDA1OSddKT8kX0dFVFsncHNfaDA1OSddOicnKSE9PSdIMDU5JykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDMwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0gwNTknKTsKICRyPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHBvc3RfbmFtZSxwb3N0X2NvbnRlbnQgRlJPTSB7JFB9cG9zdHMKICAgV0hFUkUgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwb3N0X2NvbnRlbnQgTElLRSAnJXByaWV6aXVyb3MtcHJpZW1vbmVzJScKICAgT1JERVIgQlkgcG9zdF9uYW1lIExJTUlUIDIwIiwgQVJSQVlfQSk7CiAkb1snaXJhc3UnXT1jb3VudCgkcik7ICRvWydrb250ZWtzdGFpJ109YXJyYXkoKTsKIGZvcmVhY2goJHIgYXMgJHgpewogICAkYz0keFsncG9zdF9jb250ZW50J107CiAgICRwb3o9c3RyaXBvcygkYywncHJpZXppdXJvcy1wcmllbW9uZXMnKTsKICAgaWYoJHBvej09PWZhbHNlKSBjb250aW51ZTsKICAgJG51bz1tYXgoMCwkcG96LTQ1MCk7ICRmcmFnPXN1YnN0cigkYywkbnVvLDkwMCk7CiAgICRvWydrb250ZWtzdGFpJ11bXT1hcnJheSgnc2x1Zyc9PiR4Wydwb3N0X25hbWUnXSwKICAgICAnaHRtbCc9Pm1iX3N1YnN0cigkZnJhZywwLDcwMCksCiAgICAgJ3Rla3N0YXMnPT5tYl9zdWJzdHIodHJpbShwcmVnX3JlcGxhY2UoJy9ccysvdScsJyAnLHdwX3N0cmlwX2FsbF90YWdzKCRmcmFnKSkpLDAsMzIwKSk7CiB9CiAvKiBrYW5kaWRhdGVzIGthdGVnb3Jpam9zICovCiAkb1sna2FuZGlkYXRlcyddPWFycmF5KCk7CiBmb3JlYWNoKGdldF90ZXJtcyhhcnJheSgndGF4b25vbXknPT4ncHJvZHVjdF9jYXQnLCdoaWRlX2VtcHR5Jz0+ZmFsc2UpKSBhcyAkdCl7CiAgIGlmKGlzX3dwX2Vycm9yKCR0KSkgY29udGludWU7CiAgIGlmKHByZWdfbWF0Y2goJy9oaWdpZW58cHJpZXppdXJ8c3VrfHNlcGVjfHppcmt8bmFnL2l1JywkdC0+bmFtZSkpCiAgICAgJG9bJ2thbmRpZGF0ZXMnXVtdPWFycmF5KCdpZCc9PiR0LT50ZXJtX2lkLCd2Jz0+JHQtPm5hbWUsJ24nPT4kdC0+Y291bnQsJ3UnPT5wYXJzZV91cmwoZ2V0X3Rlcm1fbGluaygkdCksUEhQX1VSTF9QQVRIKSk7CiB9CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H059'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H059 prieziuros kontekstas',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:'KLAIDA';
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h059=H059'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,300); }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/h059.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h059 prieziuros kontekstas');
