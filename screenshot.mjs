process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3I5MDYnXSk/JF9HRVRbJ3BzX3I5MDYnXTonJykhPT0nUjkwNicpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCg2MDApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidSOTA2JywndHMnPT5kYXRlKCdZLW0tZCBIOmk6cycpKTsKIC8vIDEuIEJBQ0tVUCBCVVNFTkEKIGZvcmVhY2goYXJyYXkoJ2JrJz0+Jy9ob21lL2d5dnVuYWkyL2JhY2t1cHMvLnBzLWJhY2t1cC1zdGF0ZS5qc29uJywKICAgICAgICAgICAgICAgJ3d0Jz0+Jy9ob21lL2d5dnVuYWkyL2JhY2t1cHMvLnBzLXdhdGNoLXN0YXRlLmpzb24nKSBhcyAkaz0+JGYpewogICBpZihAaXNfcmVhZGFibGUoJGYpKXsgJG9bJGtdPWpzb25fZGVjb2RlKEBmaWxlX2dldF9jb250ZW50cygkZiksdHJ1ZSk7ICRvWyRrLidfbXRpbWUnXT1kYXRlKCdZLW0tZCBIOmknLCBAZmlsZW10aW1lKCRmKSk7IH0KICAgZWxzZSAkb1ska109J05FUEFTSUVLSUFNQSc7CiB9CiAvLyAyLiBQSUxOQVMgTEVOVEVMSVUgU0FSQVNBUwogJHJzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHRhYmxlX25hbWUgdCwgZW5naW5lIGUsIHRhYmxlX3Jvd3MgciwKICAgIFJPVU5EKChkYXRhX2xlbmd0aCtpbmRleF9sZW5ndGgpLzEwMjQvMTAyNCwzKSBtYiwgdGFibGVfY29sbGF0aW9uIGNvbAogICAgRlJPTSBpbmZvcm1hdGlvbl9zY2hlbWEudGFibGVzIFdIRVJFIHRhYmxlX3NjaGVtYT1EQVRBQkFTRSgpIEFORCBlbmdpbmU9J015SVNBTScKICAgIE9SREVSIEJZIChkYXRhX2xlbmd0aCtpbmRleF9sZW5ndGgpIEFTQyIsIEFSUkFZX0EpOwogJEw9YXJyYXkoKTsKIGZvcmVhY2goJHJzIGFzICR4KXsKICAgJHQ9JHhbJ3QnXTsKICAgLy8gdGlrc2x1cyBlaWx1Y2l1IHNrYWljaXVzICh0YWJsZV9yb3dzIE15SVNBTSB0aWtzbHVzLCBiZXQgcGFzaXRpa3JpbmFtIGRpZGVsaXVvc2UpCiAgICRncnVwZT0na2l0YSc7CiAgIGlmKHByZWdfbWF0Y2goJy9fYmFrX3xfYmFrJHxfYmFja3VwL2knLCR0KSkgJGdydXBlPSdiYWsnOwogICBlbHNlaWYoc3RycG9zKCR0LCRQLidwc18nKT09PTApICRncnVwZT0ncHMnOwogICBlbHNlaWYocHJlZ19tYXRjaCgnL14nLnByZWdfcXVvdGUoJFAsJy8nKS4nKHBvc3RzfHBvc3RtZXRhfG9wdGlvbnN8dXNlcnN8dXNlcm1ldGF8dGVybXN8dGVybW1ldGF8dGVybV90YXhvbm9teXx0ZXJtX3JlbGF0aW9uc2hpcHN8Y29tbWVudHN8Y29tbWVudG1ldGF8bGlua3MpJC8nLCR0KSkgJGdydXBlPSd3cF9jb3JlJzsKICAgZWxzZWlmKHN0cnBvcygkdCwkUC4nd2NfJyk9PT0wIHx8IHN0cnBvcygkdCwkUC4nd29vY29tbWVyY2VfJyk9PT0wKSAkZ3J1cGU9J3dvbyc7CiAgIGVsc2VpZihzdHJwb3MoJHQsJFAuJ2FjdGlvbnNjaGVkdWxlcicpPT09MCkgJGdydXBlPSdhcyc7CiAgICRMW109YXJyYXkoJ3QnPT4kdCwncic9PihpbnQpJHhbJ3InXSwnbWInPT4oZmxvYXQpJHhbJ21iJ10sJ2cnPT4kZ3J1cGUsJ2NvbCc9PiR4Wydjb2wnXSk7CiB9CiAkb1snbGVudGVsZXMnXT0kTDsgJG9bJ24nXT1jb3VudCgkTCk7CiAkZz1hcnJheSgpOyBmb3JlYWNoKCRMIGFzICR4KXsgaWYoIWlzc2V0KCRnWyR4WydnJ11dKSkgJGdbJHhbJ2cnXV09YXJyYXkoMCwwLjApOyAkZ1skeFsnZyddXVswXSsrOyAkZ1skeFsnZyddXVsxXSs9JHhbJ21iJ107IH0KIGZvcmVhY2goJGcgYXMgJGs9PiR2KSAkZ1ska109YXJyYXkoJ24nPT4kdlswXSwnbWInPT5yb3VuZCgkdlsxXSwxKSk7CiAkb1snZ3J1cGVzJ109JGc7CiAvLyAzLiBUSUtST1MgZWlsdWNpdSBzdW1vcyBrb250cm9saW5laSBzdW1haSAoQ09VTlQoKikgdmlzb21zKQogJGNudD1hcnJheSgpOyBmb3JlYWNoKCRMIGFzICR4KXsgJGNudFskeFsndCddXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSBgeyR4Wyd0J119YCIpOyB9CiAkb1snY291bnRfcHJpZXMnXT0kY250OyAkb1snZWlsX3Zpc28nXT1hcnJheV9zdW0oJGNudCk7CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'R906'};
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
  const s=await snip('TEMP R906',B64);
  await new Promise(r=>setTimeout(r,6000));
  const r=await fetch(WP+'/?ps_r906=R906');
  out.duom=JSON.parse(await r.text());
  await off(s);
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('r906.json', Buffer.from(JSON.stringify(out)), 'r906');
