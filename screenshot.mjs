process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDEzNyddKSA/ICRfR0VUWydwc19oMTM3J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxODApOwogJG8gPSBhcnJheSgndic9PidIMTM3JywnbGFpa2FzJz0+Y3VycmVudF90aW1lKCdteXNxbCcpKTsKICRkaXIgPSBXUF9QTFVHSU5fRElSLicvcGV0c2hvcC14bWwnOwoKICRpciA9IEBmaWxlX2dldF9jb250ZW50cygkZGlyLicvaW5jbHVkZXMvY2xhc3MtaW1wb3J0LXJ1bGVzLnBocCcpOwogJG9bJ2NsYXNzX2ltcG9ydF9ydWxlcyddID0gJGlyICE9PSBmYWxzZSA/ICRpciA6ICdORVJBJzsKCiAkZWlsID0gQGZpbGUoJGRpci4nL3BldHNob3AteG1sLnBocCcpOwogJG9bJ3htbF9laWx1Y2l1J10gPSBpc19hcnJheSgkZWlsKSA/IGNvdW50KCRlaWwpIDogMDsKICRibG9rID0gYXJyYXkoKTsKIGlmKGlzX2FycmF5KCRlaWwpKXsKICAgZm9yKCRpPTIzMDsgJGk8NDQwICYmICRpPGNvdW50KCRlaWwpOyAkaSsrKXsKICAgICAkYmxva1tdID0gKCRpKzEpLic6ICcucnRyaW0oJGVpbFskaV0pOwogICB9CiB9CiAkb1sneG1sXzIzMV80NDAnXSA9IGltcGxvZGUoIlxuIiwgJGJsb2spOwoKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H137'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H137 ZB blokavimo recon',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rr=await fetch(WP+'/?ps_h137=GO'); const tt=await rr.text();
  try{ out.D=JSON.parse(tt); }catch(e){ out.D={ZALIAS:tt.slice(0,800)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h137.json', Buffer.from(JSON.stringify(out,null,1)), 'h137 ZB blokavimo recon');
