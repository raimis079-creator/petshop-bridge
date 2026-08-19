process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDExMyddKSA/ICRfR0VUWydwc19oMTEzJ10gOiAnJykgIT09ICdSRUFEJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDEyMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7CiAkbyA9IGFycmF5KCd2Jz0+J0gxMTMnLCdyZXppbWFzJz0+J1RJSyBTS0FJVFlNQVMnKTsKICRmID0gV1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sL3BldHNob3AteG1sLnBocCc7CiBpZighZmlsZV9leGlzdHMoJGYpKXsgJG9bJ2tsYWlkYSddPSdmYWlsYXMgbmVyYXN0YXMnOyB9CiBlbHNlIHsKICAgJG9bJ2ZhaWxhcyddID0gYXJyYXkoJ2R5ZGlzJz0+ZmlsZXNpemUoJGYpLCAnbWQ1Jz0+bWQ1X2ZpbGUoJGYpLCAncGFrZWlzdGFzJz0+ZGF0ZSgnWS1tLWQgSDppJywgZmlsZW10aW1lKCRmKSkpOwogICAkZWlsID0gZmlsZSgkZiwgRklMRV9JR05PUkVfTkVXX0xJTkVTKTsKICAgJG9bJ2VpbHVjaXVfdmlzbyddID0gY291bnQoJGVpbCk7CiAgIGZvcmVhY2goYXJyYXkoYXJyYXkoMzMwLDM1MiksIGFycmF5KDUwMCw1MjIpKSBhcyAkcil7CiAgICAgJGsgPSAnZWlsdXRlc18nLiRyWzBdLidfJy4kclsxXTsKICAgICAkb1ska10gPSBhcnJheSgpOwogICAgIGZvcigkaT0kclswXTsgJGk8PSRyWzFdICYmICRpPD1jb3VudCgkZWlsKTsgJGkrKyl7CiAgICAgICAkb1ska11bXSA9IHN0cl9wYWQoJGksNCwnICcsU1RSX1BBRF9MRUZUKS4nOiAnLm1iX3N1YnN0cihydHJpbSgkZWlsWyRpLTFdKSwwLDE5MCk7CiAgICAgfQogICB9CiAgIC8qIHJhc3RpIGZ1bmtjaWphLCBrdXJpYWkgcHJpa2xhdXNvIGVpbHV0ZXMgKi8KICAgJG9bJ2Z1bmtjaWpvcyddID0gYXJyYXkoKTsKICAgZm9yZWFjaCgkZWlsIGFzICRpPT4kbCl7CiAgICAgaWYocHJlZ19tYXRjaCgnfl5ccyooPzpwdWJsaWMgfHByaXZhdGUgfHByb3RlY3RlZCB8c3RhdGljICkqZnVuY3Rpb25ccysoW2EtekEtWjAtOV9dKyl+JywgJGwsICRtKSkKICAgICAgICRvWydmdW5rY2lqb3MnXVtdID0gKCRpKzEpLic6ICcuJG1bMV07CiAgIH0KICAgJG9bJ2Z1bmtjaWpvcyddID0gYXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcigkb1snZnVua2Npam9zJ10sIGZ1bmN0aW9uKCR4KXsKICAgICAkbj0oaW50KWV4cGxvZGUoJzonLCR4KVswXTsgcmV0dXJuICgkbj4zMDAgJiYgJG48NTYwKTsKICAgfSkpOwogfQogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H113'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H113 xml skaitymas',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rr=await fetch(WP+'/?ps_h113=READ'); const tt=await rr.text();
  try{ out.D=JSON.parse(tt); }catch(e){ out.D={ZALIAS:tt.slice(0,600)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h113.json', Buffer.from(JSON.stringify(out,null,1)), 'h113 petshop-xml skaitymas');
