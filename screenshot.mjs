process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDA1NSddKT8kX0dFVFsncHNfaDA1NSddOicnKSE9PSdIMDU1JykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0gwNTUnKTsKICRyPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHBvc3RfdHlwZSxwb3N0X25hbWUscG9zdF90aXRsZSxwb3N0X3N0YXR1cywKICAgICBMRU5HVEgocG9zdF9jb250ZW50KSB6biwgcG9zdF9kYXRlCiAgIEZST00geyRQfXBvc3RzIFdIRVJFIHBvc3RfdHlwZSBJTiAoJ3BhZ2UnLCdwb3N0JykgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJwogICBPUkRFUiBCWSBMRU5HVEgocG9zdF9jb250ZW50KSBERVNDIiwgQVJSQVlfQSk7CiAkb1snaXJhc2FpJ109YXJyYXkoKTsKIGZvcmVhY2goJHIgYXMgJHgpewogICAkYz0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHBvc3RfY29udGVudCBGUk9NIHskUH1wb3N0cyBXSEVSRSBJRD0lZCIsJHhbJ0lEJ10pKTsKICAgJHQ9dHJpbShwcmVnX3JlcGxhY2UoJy9ccysvdScsJyAnLHdwX3N0cmlwX2FsbF90YWdzKCRjKSkpOwogICAkc2VuPXByZWdfbWF0Y2hfYWxsKCcjLy8od3d3XC4pP3BldHNob3BcLmx0LyMnLCRjKTsKICAgJHZpZD1wcmVnX21hdGNoX2FsbCgnI2hyZWY9Ii8oPyEvKSMnLCRjKTsKICAgJG9bJ2lyYXNhaSddW109YXJyYXkoJ2lkJz0+KGludCkkeFsnSUQnXSwndGlwYXMnPT4keFsncG9zdF90eXBlJ10sJ3NsdWcnPT4keFsncG9zdF9uYW1lJ10sCiAgICAgJ3Bhdic9Pm1iX3N1YnN0cigkeFsncG9zdF90aXRsZSddLDAsNjQpLCd6b2R6aXUnPT5jb3VudChhcnJheV9maWx0ZXIoZXhwbG9kZSgnICcsJHQpKSksCiAgICAgJ3Nlbm9zX251b3JvZG9zJz0+JHNlbiwnc2FudHlraW5lcyc9PiR2aWQsCiAgICAgJ2gyJz0+cHJlZ19tYXRjaF9hbGwoJy88aDIvaScsJGMpLCdpbWcnPT5wcmVnX21hdGNoX2FsbCgnLzxpbWcvaScsJGMpKTsKIH0KICRvWydraWVrJ109Y291bnQoJG9bJ2lyYXNhaSddKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H055'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H055 straipsniu apimtis',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:'KLAIDA';
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h055=H055'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,300); }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/h055.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h055 straipsniu apimtis');
