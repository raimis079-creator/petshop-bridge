process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3N2J10pPyRfR0VUWydwc19zdiddOicnKSE9PSdSRUNBJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDMwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1JFQ0EnLCd0cyc9PmRhdGUoJ1ktbS1kIEg6aTpzJykpOwogJGY9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rYXRhbG9nYXMucGhwJzsgJHM9ZmlsZV9nZXRfY29udGVudHMoJGYpOwogJG9bJ21kNSddPW1kNSgkcyk7ICRvWydkeWRpcyddPXN0cmxlbigkcyk7CiAkTD1leHBsb2RlKCJcbiIsJHMpOyAkb1snZWlsdWNpdSddPWNvdW50KCRMKTsKCiAvKiAxLiBWaXNvcyBmdW5rY2lqb3M6IHZhcmRhcyArIGVpbHV0ZSArIGlsZ2lzICovCiAkZm49YXJyYXkoKTsgJGN1cj1udWxsOwogZm9yZWFjaCgkTCBhcyAkaT0+JGxuKXsKICAgaWYgKHByZWdfbWF0Y2goJy9eXHMqKD86cHVibGljfHByaXZhdGV8cHJvdGVjdGVkKT9ccyooPzpzdGF0aWNccyspP2Z1bmN0aW9uXHMrKFthLXpBLVowLTlfXSspXHMqXCgvJywkbG4sJG0pKSB7CiAgICAgaWYoJGN1cikgeyAkZm5bY291bnQoJGZuKS0xXVsnaWxnaXMnXT0kaSsxLSRjdXI7IH0KICAgICAkZm5bXT1hcnJheSgndic9PiRtWzFdLCdudW8nPT4kaSsxLCdpbGdpcyc9PjApOyAkY3VyPSRpKzE7CiAgIH0KIH0KIGlmKCRjdXIgJiYgJGZuKSAkZm5bY291bnQoJGZuKS0xXVsnaWxnaXMnXT1jb3VudCgkTCktJGN1cjsKIHVzb3J0KCRmbiwgZnVuY3Rpb24oJGEsJGIpeyByZXR1cm4gJGJbJ2lsZ2lzJ10tJGFbJ2lsZ2lzJ107IH0pOwogJG9bJ2Z1bmtjaWpvc192aXNvJ109Y291bnQoJGZuKTsKICRvWydkaWR6aWF1c2lvcyddPWFycmF5X3NsaWNlKCRmbiwwLDIyKTsKCiAvKiAyLiBLdXIgYXBpYnJlenRvcyBFSUxFUyAodmlldykgKi8KICRoPWFycmF5KCk7CiBmb3JlYWNoKCRMIGFzICRpPT4kbG4pewogICBpZiAocHJlZ19tYXRjaCgnL3ZpZXcuKj09fGNhc2VccysuW2Etel9dKy46fFwkZVxbfGVpbGVzXCh8emVtaWF1X3JpYm9zfGJlX3NhdmlrYWlub3N8dXpzYWt5dGl8YXZfcGFzaWJhaWdlfG5lZ3l2b3N8YmVfZWFufGJlX251b3RyYXVrb3MvaScsJGxuKSl7CiAgICAgJHQ9dHJpbSgkbG4pOyBpZigkdCE9PScnJiZzdHJsZW4oJHQpPDIwMCkgJGhbXT1hcnJheSgkaSsxLCR0KTsKICAgfQogfQogJG9bJ2VpbGVzX24nXT1jb3VudCgkaCk7ICRvWydlaWxlcyddPWFycmF5X3NsaWNlKCRoLDAsNjApOwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'RECA'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
  const s=await snip('TEMP RECA',B64);
  await new Promise(r=>setTimeout(r,6000));
  const t=await (await fetch(WP+'/?ps_sv=RECA')).text();
  try{ out.rez=JSON.parse(t); }catch(e){ out.raw=t.slice(0,1500); }
  await off(s);
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('reca.json', Buffer.from(JSON.stringify(out)), 'reca');
console.log('ok');
