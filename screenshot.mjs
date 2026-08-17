process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3g5OTEnXSk/JF9HRVRbJ3BzX3g5OTEnXTonJykhPT0nWDk5MScpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCg5MDApOyBAaW5pX3NldCgnbWVtb3J5X2xpbWl0JywnNTEyTScpOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidYOTkxJyk7CiAkdXJsPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgcGF0aCBGUk9NIHskUH1wbXhpX2ltcG9ydHMgV0hFUkUgaWQ9NSIpOwogJGJvZHk9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkod3BfcmVtb3RlX2dldCgkdXJsLGFycmF5KCd0aW1lb3V0Jz0+MTIwLCdzc2x2ZXJpZnknPT5mYWxzZSkpKTsKIGxpYnhtbF91c2VfaW50ZXJuYWxfZXJyb3JzKHRydWUpOyAkeD1zaW1wbGV4bWxfbG9hZF9zdHJpbmcoJGJvZHkpOwogaWYoISR4KXsgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgna2xhaWRhJz0+J3htbCcpKTsgZXhpdDsgfQoKICRicmFuZGFpPWFycmF5KCk7ICRyZXo9YXJyYXkoJ2V4Y2x1c2lvbic9PmFycmF5KCksJ2pvc2VyYSc9PmFycmF5KCksJ2dyZWVuJz0+YXJyYXkoKSk7CiBmb3JlYWNoKCR4LT5yb3cgYXMgJGl0KXsKICAgJGI9dHJpbSgoc3RyaW5nKSRpdC0+YnJhbmQpOyAkbj10cmltKChzdHJpbmcpJGl0LT5wcm9kdWN0X25hbWUpOwogICAkYnJhbmRhaVskYl09KGlzc2V0KCRicmFuZGFpWyRiXSk/JGJyYW5kYWlbJGJdOjApKzE7CiAgICRsYj1tYl9zdHJ0b2xvd2VyKCRiLicgJy4kbik7CiAgICRpcmFzYXM9YXJyYXkoJ3NrdSc9PihzdHJpbmcpJGl0LT5za3VfaWQsJ2Vhbic9PihzdHJpbmcpJGl0LT5iYXJjb2RlLCdwYXYnPT5tYl9zdWJzdHIoJG4sMCw1OCksCiAgICAgICAgICAgICAgICAgJ2JyYW5kJz0+JGIsJ3F0eSc9PihzdHJpbmcpJGl0LT5xdHksJ2thaW5hJz0+KHN0cmluZykkaXQtPmJhc2VfcHJpY2UsJ2thdCc9Pm1iX3N1YnN0cigoc3RyaW5nKSRpdC0+Y2F0ZWdvcnksMCw0MCkpOwogICBpZihzdHJwb3MoJGxiLCdleGNsdXNpb24nKSE9PWZhbHNlfHxzdHJwb3MoJGxiLCdleGNsJykhPT1mYWxzZXx8c3RycG9zKCRsYiwnaHlwb2FsbGVyZ2VuaWMnKSE9PWZhbHNlfHxzdHJwb3MoJGxiLCdpbnRlc3RpbmFsJykhPT1mYWxzZSkgJHJlelsnZXhjbHVzaW9uJ11bXT0kaXJhc2FzOwogICBlbHNlaWYoc3RycG9zKCRsYiwnam9zZXJhJykhPT1mYWxzZXx8c3RycG9zKCRsYiwnam9zaWRvZycpIT09ZmFsc2V8fHN0cnBvcygkbGIsJ2pvc2ljYXQnKSE9PWZhbHNlKSAkcmV6Wydqb3NlcmEnXVtdPSRpcmFzYXM7CiAgIGVsc2VpZihzdHJwb3MoJGxiLCdncmVlbicpIT09ZmFsc2V8fHN0cnBvcygkbGIsJ3ZlZ2dpZScpIT09ZmFsc2UpICRyZXpbJ2dyZWVuJ11bXT0kaXJhc2FzOwogfQogYXJzb3J0KCRicmFuZGFpKTsKICRvWydicmFuZHVfdG9wJ109YXJyYXlfc2xpY2UoJGJyYW5kYWksMCwyNSx0cnVlKTsKICRvWydicmFuZHVfdmlzbyddPWNvdW50KCRicmFuZGFpKTsKIGZvcmVhY2goJHJleiBhcyAkaz0+JHYpeyAkb1sna2llayddWyRrXT1jb3VudCgkdik7ICRvWyRrXT1hcnJheV9zbGljZSgkdiwwLDQ1KTsgfQogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'X991'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
try{
  const s=await snip('TEMP X991',B64);
  await new Promise(r=>setTimeout(r,7000));
  const t=await (await fetch(WP+'/?ps_x991=X991')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('x991.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'x991 brandai');
