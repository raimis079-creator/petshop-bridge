process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDA3MiddKT8kX0dFVFsncHNfaDA3MiddOicnKSE9PSdIMDcyJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDMwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICR0PSRQLidwc19zYXJnYXNfa2xhaWRvcyc7ICRvPWFycmF5KCd2Jz0+J0gwNzInKTsKCiAvKiAxLiBBVE1JTlRJRVMgUklCT1MgKi8KICRvWydhdG1pbnRpcyddPWFycmF5KAogICAncGhwX21lbW9yeV9saW1pdCc9PmluaV9nZXQoJ21lbW9yeV9saW1pdCcpLAogICAnV1BfTUVNT1JZX0xJTUlUJz0+ZGVmaW5lZCgnV1BfTUVNT1JZX0xJTUlUJyk/V1BfTUVNT1JZX0xJTUlUOm51bGwsCiAgICdXUF9NQVhfTUVNT1JZX0xJTUlUJz0+ZGVmaW5lZCgnV1BfTUFYX01FTU9SWV9MSU1JVCcpP1dQX01BWF9NRU1PUllfTElNSVQ6bnVsbCwKICAgJ2RhYmFyX25hdWRvamFtYV9NQic9PnJvdW5kKG1lbW9yeV9nZXRfdXNhZ2UodHJ1ZSkvMTA0ODU3NiwxKSwKICAgJ3Bpa2FzX01CJz0+cm91bmQobWVtb3J5X2dldF9wZWFrX3VzYWdlKHRydWUpLzEwNDg1NzYsMSksCiApOwoKIC8qIDIuIEZBVEFMIGlyYXN1IHBpbG5vcyBkZXRhbGVzICovCiAkb1snZmF0YWwnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBsYWlrYXMsemludXRlLGZhaWxhcyxlaWx1dGUsdXJsLGtpZWsKICAgRlJPTSAkdCBXSEVSRSBseWdpcz0nZmF0YWwnIE9SREVSIEJZIGxhaWthcyIsIEFSUkFZX0EpOwoKIC8qIDMuIGFyIHBhc2lrYXJ0b2pvIHBvIHJ1Z3BqdWNpbyAxOCAqLwogJG9bJ2ZhdGFsX3BvXzA4MTgnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkdCBXSEVSRSBseWdpcz0nZmF0YWwnIEFORCBsYWlrYXMgPiAnMjAyNi0wOC0xOCAxMjowMDowMCciKTsKCiAvKiA0LiBLQVMgVllLTyAyMzoxMiDigJQgY3JvbiBpc3RvcmlqYSAqLwogJG9bJ2Nyb25fYXBpZSddPWFycmF5KCk7CiAkYz1fZ2V0X2Nyb25fYXJyYXkoKTsKIGlmKGlzX2FycmF5KCRjKSkgZm9yZWFjaCgkYyBhcyAkdHM9PiRrKSBmb3JlYWNoKCRrIGFzICR2PT4keCkKICAgJG9bJ2Nyb25fYXBpZSddW109YXJyYXkoJ2thYmxpdWthcyc9PiR2LCdrYWRhJz0+ZGF0ZSgnWS1tLWQgSDppJywkdHMpKTsKICRvWydjcm9uX2FwaWUnXT1hcnJheV9zbGljZSgkb1snY3Jvbl9hcGllJ10sMCwxMik7CgogLyogNS4gcG9zdGl0IHBsdWdpbmFzIOKAlCBrYXMgdGFpICovCiAkb1sncG9zdGl0J109YXJyYXkoKTsKIGZvcmVhY2goZ2xvYihXUF9QTFVHSU5fRElSLicvKicpIGFzICRkKXsKICAgJGI9YmFzZW5hbWUoJGQpOwogICBpZihzdHJpcG9zKCRiLCdwb3N0JykhPT1mYWxzZSB8fCBzdHJpcG9zKCRiLCdwb3MnKT09PTApewogICAgICRha3Q9aW5fYXJyYXkoJGIuJy8nLiRiLicucGhwJywoYXJyYXkpZ2V0X29wdGlvbignYWN0aXZlX3BsdWdpbnMnKSx0cnVlKTsKICAgICAkZmY9Z2xvYigkZC4nLyoucGhwJyk7CiAgICAgJHZhcmRhcz1udWxsOwogICAgIGZvcmVhY2goYXJyYXlfc2xpY2UoJGZmLDAsMykgYXMgJGYpewogICAgICAgJGg9QGZpbGVfZ2V0X2NvbnRlbnRzKCRmLGZhbHNlLG51bGwsMCw5MDApOwogICAgICAgaWYoJGggJiYgcHJlZ19tYXRjaCgnL1BsdWdpbiBOYW1lOlxzKiguKykvaScsJGgsJG0pKXsgJHZhcmRhcz10cmltKCRtWzFdKTsgYnJlYWs7IH0KICAgICB9CiAgICAgJG9bJ3Bvc3RpdCddW109YXJyYXkoJ2thdGFsb2dhcyc9PiRiLCd2YXJkYXMnPT4kdmFyZGFzLCdha3R5dnVzX3NhcmFzZSc9PiRha3Q/MTowKTsKICAgfQogfQogJG9bJ2FrdHl2dXNfcGx1Z2luYWknXT1jb3VudCgoYXJyYXkpZ2V0X29wdGlvbignYWN0aXZlX3BsdWdpbnMnKSk7CgogLyogNi4gZGlkemlhdXNpb3MgbGVudGVsZXMgKGFyIG1ldGEgbmVpc2F1Z28pICovCiAkb1snbWV0YV9keWRpcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHRhYmxlX25hbWUgQVMgbGVudGVsZSwKICAgIFJPVU5EKCgoZGF0YV9sZW5ndGgraW5kZXhfbGVuZ3RoKS8xMDI0LzEwMjQpLDEpIEFTIG1iLCB0YWJsZV9yb3dzCiAgIEZST00gaW5mb3JtYXRpb25fc2NoZW1hLlRBQkxFUyBXSEVSRSB0YWJsZV9zY2hlbWE9REFUQUJBU0UoKQogICBPUkRFUiBCWSAoZGF0YV9sZW5ndGgraW5kZXhfbGVuZ3RoKSBERVNDIExJTUlUIDgiLCBBUlJBWV9BKTsKCiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H072'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H072 atminties tyrimas',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:'KLAIDA';
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h072=H072'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/h072.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h072 atminties tyrimas');
