process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDE0NCddKSA/ICRfR0VUWydwc19oMTQ0J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxODApOwogJG8gPSBhcnJheSgndic9PidIMTQ0JywnbGFpa2FzJz0+Y3VycmVudF90aW1lKCdteXNxbCcpLCdSRVpJTUFTJz0+J1JFQ09OLU9OTFknKTsKICRwb3JvcyA9IGFycmF5KAogICBhcnJheSgzMzU1MCwxNzM5NCksIGFycmF5KDMzNTUyLDE3NDAwKSwgYXJyYXkoMzM1NTQsMTczOTcpLCBhcnJheSgzMzU3NCwxNzQwNiksCiAgIGFycmF5KDMzNzA0LDE3NDE1KSwgYXJyYXkoMzM3MDYsMTc0MTIpLCBhcnJheSgzMzcwOCwxNzQyMSksIGFycmF5KDMzODE4LDE3NDE4KSwKICAgYXJyYXkoMzM4NjQsMTc0MDMpLCBhcnJheSgzMzg2OCwxNzQwOSksCiApOwogJGxhdWsgPSBhcnJheSgnX293bl9zdG9ja19xdHknLCdfemJfcXR5JywnX3ZmX3F0eScsJ19zdG9jaycsJ19zdG9ja19zdGF0dXMnLCdfbWFuYWdlX3N0b2NrJywnX2FjdGl2ZV9mdWxmaWxsbWVudF9zb3VyY2UnLCdfc2t1JywnX2VhbicsJ196Yl9lYW4nLCdfemJfY29zdCcsJ19wcmljZScpOwogJGVpbCA9IGFycmF5KCk7CiBmb3JlYWNoKCRwb3JvcyBhcyAkcHIpewogICBsaXN0KCR6LCRhKSA9ICRwcjsKICAgJHIgPSBhcnJheSgnWkInPT4keiwnQVYnPT4kYSk7CiAgIGZvcmVhY2goYXJyYXkoJ1pCJz0+JHosJ0FWJz0+JGEpIGFzICR6eW09PiRwaWQpewogICAgIGZvcmVhY2goJGxhdWsgYXMgJGspICRyWyR6eW0uJGtdID0gKHN0cmluZykgZ2V0X3Bvc3RfbWV0YSgkcGlkLCRrLHRydWUpOwogICAgICRyWyR6eW0uJ19zdGF0dXMnXSA9IGdldF9wb3N0X3N0YXR1cygkcGlkKTsKICAgICAkclskenltLidfdmlzJ10gPSAoc3RyaW5nKSBnZXRfcG9zdF9tZXRhKCRwaWQsJ192aXNpYmlsaXR5Jyx0cnVlKTsKICAgICAkcCA9IHdjX2dldF9wcm9kdWN0KCRwaWQpOwogICAgICRyWyR6eW0uJ193Y19zdG9jayddID0gJHAgPyAkcC0+Z2V0X3N0b2NrX3F1YW50aXR5KCkgOiBudWxsOwogICAgICRyWyR6eW0uJ19jYXR2aXMnXSA9ICRwID8gJHAtPmdldF9jYXRhbG9nX3Zpc2liaWxpdHkoKSA6IG51bGw7CiAgIH0KICAgJGVpbFtdID0gJHI7CiB9CiAkb1sncG9yb3MnXSA9ICRlaWw7CgogLyogYXIgU3RvY2tfU2VydmljZSAvIHBzX3NvdXJjZXMgYXBza3JpdGFpIGt2aWVjaWEgZnVsZmlsbG1lbnQgKi8KICRvWydrbGFzZXMnXSA9IGFycmF5KAogICAnUGV0c2hvcF9GdWxmaWxsbWVudCcgPT4gY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0Z1bGZpbGxtZW50JyksCiAgICdQZXRzaG9wX1N0b2NrX1NlcnZpY2UnID0+IGNsYXNzX2V4aXN0cygnUGV0c2hvcF9TdG9ja19TZXJ2aWNlJyksCiAgICdQZXRzaG9wX0Z1bGZpbGxtZW50X1NvdXJjZScgPT4gY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0Z1bGZpbGxtZW50X1NvdXJjZScpLAogKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H144'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H144 ZB blokavimo recon',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rr=await fetch(WP+'/?ps_h144=GO'); const tt=await rr.text();
  try{ out.D=JSON.parse(tt); }catch(e){ out.D={ZALIAS:tt.slice(0,800)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h144.json', Buffer.from(JSON.stringify(out,null,1)), 'h144 ZB blokavimo recon');
