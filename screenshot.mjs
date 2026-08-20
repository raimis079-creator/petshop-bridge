process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDE1NSddKSA/ICRfR0VUWydwc19oMTU1J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxODApOwogJG89YXJyYXkoJ3YnPT4nSDE1NScsJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSwnUkVaSU1BUyc9PidSRUNPTi1PTkxZJyk7CiAkZj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWthdGFsb2dhcy5waHAnOwogJG9bJ21kNSddPUBtZDVfZmlsZSgkZik7ICRvWydkeWRpcyddPUBmaWxlc2l6ZSgkZik7CiAkZWlsPUBmaWxlKCRmKTsgJG9bJ2VpbHVjaXUnXT1jb3VudCgkZWlsKTsKICRyYXN0aT1mdW5jdGlvbigkZnJhZ21lbnRhaSkgdXNlICgkZWlsKXsKICAgJGg9YXJyYXkoKTsKICAgZm9yZWFjaCgkZWlsIGFzICRpPT4kbCl7IGZvcmVhY2goJGZyYWdtZW50YWkgYXMgJGZyKXsgaWYoc3RyaXBvcygkbCwkZnIpIT09ZmFsc2UpeyAkaFtdPSgkaSsxKS4nOiAnLnRyaW0obWJfc3Vic3RyKCRsLDAsMTQwKSk7IGJyZWFrOyB9IH0gfQogICByZXR1cm4gJGg7CiB9OwogJG9bJ3piX3F0eSddICAgID0gJHJhc3RpKGFycmF5KCdfemJfcXR5JykpOwogJG9bJ3ZmX3F0eSddICAgID0gJHJhc3RpKGFycmF5KCdfdmZfcXR5JykpOwogJG9bJ3NhbmRlbGlzJ10gID0gJHJhc3RpKGFycmF5KCdfcHNfc2FuZGVsaXMnKSk7CiAvKiBpc2thcnBvcyBhcGxpbmsgemlub21hcyB2aWV0YXMgKi8KIGZvcmVhY2goYXJyYXkoYXJyYXkoOTAwLDk3NSksYXJyYXkoNDIzMCw0MzQwKSxhcnJheSg3NDAsODAwKSkgYXMgJHJnKXsKICAgJG9bJ2lza18nLiRyZ1swXV0gPSBpbXBsb2RlKCJcbiIsIGFycmF5X21hcChmdW5jdGlvbigkaykgdXNlKCRlaWwpe3JldHVybiAoJGsrMSkuJzogJy5ydHJpbSgkZWlsWyRrXSk7fSwgcmFuZ2UoJHJnWzBdLTEsbWluKCRyZ1sxXS0xLGNvdW50KCRlaWwpLTEpKSkpOwogfQogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H155'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H155 Monge merge APPLY',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rA=await fetch(WP+'/?ps_h155=GO'); const tA=await rA.text();
  try{ out.A=JSON.parse(tA); }catch(e){ out.A={ZALIAS:tA.slice(0,700)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h155.json', Buffer.from(JSON.stringify(out,null,1)), 'h155 Monge merge APPLY');
