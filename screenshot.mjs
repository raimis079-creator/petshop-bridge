process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2I5NzAnXSk/JF9HRVRbJ3BzX2I5NzAnXTonJykhPT0nQjk3MCcpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCg2MDApOwogJG89YXJyYXkoJ3YnPT4nQjk3MCcpOwogJHA9V1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sL3BldHNob3AteG1sLnBocCc7ICRMPWZpbGUoJHApOwogLyogYmxvY2tfdmZfY3JlYXRlIHBpbG5hcyBrdW5hcyAqLwogJG9bJ2Jsb2NrX3ZmX2NyZWF0ZSddPWltcGxvZGUoJycsYXJyYXlfc2xpY2UoJEwsNDk5LDEwMCkpOwogLyogZXhjbHVkZWQgYnJhbmQgc2FyYXNhcyAqLwogJHJhc3RhPWFycmF5KCk7CiBmb3JlYWNoKGFycmF5KCdwZXRzaG9wLXhtbC9pbmNsdWRlcy9jbGFzcy1ydWxlcy5waHAnLCdwZXRzaG9wLXhtbC9pbmNsdWRlcy9jbGFzcy1pbXBvcnQtcnVsZXMucGhwJywncGV0c2hvcC14bWwvaW5jbHVkZXMvY2xhc3MtaW1wb3J0LXJ1bGVzLXZmLnBocCcpIGFzICRyZWwpewogICAkZj1XUF9QTFVHSU5fRElSLicvJy4kcmVsOyBpZighaXNfcmVhZGFibGUoJGYpKSB7ICRyYXN0YVskcmVsXT0nTkVSQSc7IGNvbnRpbnVlOyB9CiAgICRDPWZpbGUoJGYpOyAkZWlsPWFycmF5KCk7CiAgIGZvcmVhY2goJEMgYXMgJGk9PiRyb3cpewogICAgIGlmKHByZWdfbWF0Y2goJy9leGNsdWRlZHxFWENMVURFRF9CUkFORHxzaG91bGRfaW1wb3J0fGlzX2V4Y2x1ZGVkL2knLCRyb3cpKSAkZWlsW109YXJyYXkoJGkrMSx0cmltKG1iX3N1YnN0cigkcm93LDAsMTQwKSkpOwogICB9CiAgICRyYXN0YVskcmVsXT0kZWlsOwogfQogJG9bJ3RhaXN5a2xpdV9mYWlsYWknXT0kcmFzdGE7CiAvKiBpc19leGNsdWRlZF9icmFuZCBrdW5hcyArIHNhcmFzYXMgKi8KIGZvcmVhY2goYXJyYXkoJ1BldHNob3BfUnVsZXMnLCdQZXRzaG9wX0ltcG9ydF9SdWxlcycsJ1BldHNob3BfSW1wb3J0X1J1bGVzX1ZGJykgYXMgJGtsKXsKICAgaWYoIWNsYXNzX2V4aXN0cygka2wpKSB7ICRvWydrbGFzZXMnXVska2xdPSduZXJhJzsgY29udGludWU7IH0KICAgJG9bJ2tsYXNlcyddWyRrbF09J1lSQSc7CiAgICRyPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJGtsKTsKICAgJG9bJ2tsYXNpdV9mYWlsYWknXVska2xdPXN0cl9yZXBsYWNlKEFCU1BBVEgsJycsJHItPmdldEZpbGVOYW1lKCkpOwogICBmb3JlYWNoKCRyLT5nZXRNZXRob2RzKCkgYXMgJG0pewogICAgIGlmKCRtLT5jbGFzcyE9PSRrbCkgY29udGludWU7CiAgICAgaWYocHJlZ19tYXRjaCgnL2V4Y2x1ZHxzaG91bGRfaW1wb3J0L2knLCRtLT5nZXROYW1lKCkpKXsKICAgICAgICRGPWZpbGUoJHItPmdldEZpbGVOYW1lKCkpOwogICAgICAgJG9bJ21ldG9kYWknXVska2wuJzo6Jy4kbS0+Z2V0TmFtZSgpXT1pbXBsb2RlKCcnLGFycmF5X3NsaWNlKCRGLCRtLT5nZXRTdGFydExpbmUoKS0xLCRtLT5nZXRFbmRMaW5lKCktJG0tPmdldFN0YXJ0TGluZSgpKzEpKTsKICAgICB9CiAgIH0KICAgZm9yZWFjaCgkci0+Z2V0Q29uc3RhbnRzKCkgYXMgJGs9PiR2KXsKICAgICBpZihwcmVnX21hdGNoKCcvZXhjbHVkfHNraXB8YmxvY2svaScsJGspKSAkb1sna29uc3RhbnRvcyddWyRrbC4nOjonLiRrXT1tYl9zdWJzdHIobWF5YmVfc2VyaWFsaXplKCR2KSwwLDYwMCk7CiAgIH0KIH0KIC8qIEFSIFZGIFVQREFURSBMSUVDSUEgS0FJTkEgKi8KICR2Zj1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC14bWwvaW5jbHVkZXMvY2xhc3MtdmYtaW1wb3J0LnBocCc7CiBpZihpc19yZWFkYWJsZSgkdmYpKXsKICAgJFY9ZmlsZSgkdmYpOyAkZWlsPWFycmF5KCk7CiAgIGZvcmVhY2goJFYgYXMgJGk9PiRyb3cpewogICAgIGlmKHByZWdfbWF0Y2goIi91cGRhdGVfcG9zdF9tZXRhfHNldF9yZWd1bGFyX3ByaWNlfHNldF9wcmljZXwtPnNhdmVcKFwpLyIsJHJvdykpICRlaWxbXT1hcnJheSgkaSsxLHRyaW0obWJfc3Vic3RyKCRyb3csMCwxMzApKSk7CiAgIH0KICAgJG9bJ3ZmX3Jhc3ltYWknXT0kZWlsOwogfQogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'U970'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  const r=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
  return r.status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
  const s=await snip('TEMP U970',B64);
  await new Promise(r=>setTimeout(r,6000));
  const r=await fetch(WP+'/?ps_u970=U970');
  const buf=Buffer.from(await r.arrayBuffer());
  out.baitai=buf.length;
  const zlib=await import('zlib');
  out.put=await put('u970.json.gz', zlib.gzipSync(buf), 'r950');
  await off(s);
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('u970.json', Buffer.from(JSON.stringify(out)), 'r950 meta');
