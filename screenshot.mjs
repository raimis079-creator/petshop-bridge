process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDE1MyddKSA/ICRfR0VUWydwc19oMTUzJ10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxODApOwogJG89YXJyYXkoJ3YnPT4nSDE1MycsJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSwnUkVaSU1BUyc9PidSRUNPTi1PTkxZJyk7CgogLyogcmFzdGkgUGV0c2hvcF9BVl9TdG9jayBrbGFzZSAqLwogaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0FWX1N0b2NrJykpewogICAkcmMgPSBuZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX0FWX1N0b2NrJyk7CiAgICRvWydmYWlsYXMnXSA9IHN0cl9yZXBsYWNlKFdQX0NPTlRFTlRfRElSLCcnLCRyYy0+Z2V0RmlsZU5hbWUoKSk7CiAgICRvWyd0dXJpbnlzJ10gPSBmaWxlX2dldF9jb250ZW50cygkcmMtPmdldEZpbGVOYW1lKCkpOwogfSBlbHNlIHsKICAgJG9bJ2tsYXNlJ10gPSAnTkVVWlNJS1JPVlVTSSc7CiAgIGZvcmVhY2goZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLSoucGhwJykgYXMgJGYpewogICAgICRjPUBmaWxlX2dldF9jb250ZW50cygkZik7CiAgICAgaWYoJGMhPT1mYWxzZSAmJiBzdHJwb3MoJGMsJ1BldHNob3BfQVZfU3RvY2snKSE9PWZhbHNlKSAkb1sncmFzdGFfJy5iYXNlbmFtZSgkZildPWZpbGVzaXplKCRmKTsKICAgfQogfQoKIC8qIGthcyBkYXIgbmF1ZG9qYSBfb3duX3N0b2NrX3F0eSBpciBQZXRzaG9wX0FWX1N0b2NrIOKAlCB2aXNhbWUgbXUgKyBwZXRzaG9wLXhtbCAqLwogJG5hdWRvdG9qYWk9YXJyYXkoKTsKICRmYWlsYWkgPSBhcnJheV9tZXJnZShnbG9iKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtKi5waHAnKSwgZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC14bWwvaW5jbHVkZXMvKi5waHAnKSwgYXJyYXkoV1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sL3BldHNob3AteG1sLnBocCcpKTsKIGZvcmVhY2goJGZhaWxhaSBhcyAkZil7CiAgICRlaWw9QGZpbGUoJGYpOyBpZighJGVpbCkgY29udGludWU7CiAgIGZvcmVhY2goJGVpbCBhcyAkaT0+JGwpewogICAgIGlmKHN0cnBvcygkbCwnX293bl9zdG9ja19xdHknKSE9PWZhbHNlIHx8IHN0cnBvcygkbCwnUGV0c2hvcF9BVl9TdG9jaycpIT09ZmFsc2UpewogICAgICAgJG5hdWRvdG9qYWlbYmFzZW5hbWUoJGYpXVtdID0gKCRpKzEpLic6ICcudHJpbShtYl9zdWJzdHIoJGwsMCwxNTApKTsKICAgICB9CiAgIH0KIH0KICRvWyduYXVkb3RvamFpJ109JG5hdWRvdG9qYWk7CgogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H153'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ try{const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()};}catch(e){return {s:0,t:String(e).slice(0,200)};} }
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); } }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H153 Monge merge APPLY',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rA=await fetch(WP+'/?ps_h153=GO'); const tA=await rA.text();
  try{ out.A=JSON.parse(tA); }catch(e){ out.A={ZALIAS:tA.slice(0,700)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h153.json', Buffer.from(JSON.stringify(out,null,1)), 'h153 Monge merge APPLY');
