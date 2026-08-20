process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDE1OSddKSA/ICRfR0VUWydwc19oMTU5J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgyNDApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogJG89YXJyYXkoJ3YnPT4nSDE1OScsJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSwnUkVaSU1BUyc9PidSRUNPTjogWkIgZmVlZCBCViBrb2RhaScpOwogJHVybCA9ICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgcGF0aCBGUk9NIHskUH1wbXhpX2ltcG9ydHMgV0hFUkUgaWQ9MiIpOwogJG9bJ3VybF95cmEnXSA9IChib29sKSR1cmw7CiAkciA9IHdwX3JlbW90ZV9nZXQoJHVybCwgYXJyYXkoJ3RpbWVvdXQnPT42MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsKIGlmKGlzX3dwX2Vycm9yKCRyKSl7ICRvWydrbGFpZGEnXT0kci0+Z2V0X2Vycm9yX21lc3NhZ2UoKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICR4ID0gd3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpOwogJG9bJ2ZlZWRfZHlkaXMnXSA9IHN0cmxlbigkeCk7CiBsaWJ4bWxfdXNlX2ludGVybmFsX2Vycm9ycyh0cnVlKTsKICRzeCA9IHNpbXBsZXhtbF9sb2FkX3N0cmluZygkeCwgJ1NpbXBsZVhNTEVsZW1lbnQnLCBMSUJYTUxfTk9DREFUQSk7CiBpZighJHN4KXsgJG9bJ2tsYWlkYSddPSdYTUwgbmVwYXJzaW5hJzsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICRrb2RhaSA9IGFycmF5KCcwMUJWMDEwMScsJzAxQlYwMjAxJywnMDFCVjAzMDEnLCcwMUJWMDQwMScsJzAxQlYwNjAxJywnMDFCVjA3MDEnKTsKICRyYXN0YSA9IGFycmF5KCk7CiAkZWl0aSA9IGZ1bmN0aW9uKCRub2RlKSB1c2UgKCYkZWl0aSwmJHJhc3RhLCRrb2RhaSl7CiAgIGZvcmVhY2goJG5vZGUtPmNoaWxkcmVuKCkgYXMgJHZhaWthcyl7CiAgICAgJHRla3N0YWkgPSBhcnJheSgpOwogICAgIGZvcmVhY2goJHZhaWthcy0+Y2hpbGRyZW4oKSBhcyAkaz0+JHYpewogICAgICAgaWYoY291bnQoJHYtPmNoaWxkcmVuKCkpPT09MCl7CiAgICAgICAgICR2YWwgPSB0cmltKChzdHJpbmcpJHYpOwogICAgICAgICAkdGVrc3RhaVska10gPSBtYl9zdWJzdHIoJHZhbCwwLDkwKTsKICAgICAgIH0gZWxzZSB7CiAgICAgICAgICR0ZWtzdGFpWyRrXSA9ICdbJy5jb3VudCgkdi0+Y2hpbGRyZW4oKSkuJyB2YWlrdV0nOwogICAgICAgfQogICAgIH0KICAgICAkaGl0ID0gZmFsc2U7CiAgICAgZm9yZWFjaCgkdGVrc3RhaSBhcyAkdmFsKXsgaWYoaW5fYXJyYXkoJHZhbCwka29kYWksdHJ1ZSkpeyAkaGl0PXRydWU7IGJyZWFrOyB9IH0KICAgICBpZigkaGl0KXsgJHJhc3RhW10gPSAkdGVrc3RhaTsgfQogICAgIGVsc2VpZihjb3VudCgkdmFpa2FzLT5jaGlsZHJlbigpKT4wICYmIGNvdW50KCRyYXN0YSk8MTApeyAkZWl0aSgkdmFpa2FzKTsgfQogICB9CiB9OwogJGVpdGkoJHN4KTsKICRvWydyYXN0YV9raWVrJ10gPSBjb3VudCgkcmFzdGEpOwogJG9bJ2lyYXNhaSddID0gJHJhc3RhOwogJG9bJ3Nha25pbmlzJ10gPSAkc3gtPmdldE5hbWUoKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H159'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H159 Monge merge APPLY',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rA=await fetch(WP+'/?ps_h159=GO'); const tA=await rA.text();
  try{ out.A=JSON.parse(tA); }catch(e){ out.A={ZALIAS:tA.slice(0,700)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h159.json', Buffer.from(JSON.stringify(out,null,1)), 'h159 Monge merge APPLY');
