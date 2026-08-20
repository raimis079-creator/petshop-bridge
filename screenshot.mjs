process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDE2NSddKSA/ICRfR0VUWydwc19oMTY1J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxODApOwogJG89YXJyYXkoJ3YnPT4nSDE2NScsJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSwnUkVaSU1BUyc9PidSRUNPTi1PTkxZJyk7CiAkZWlsPUBmaWxlKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Ata2F0YWxvZ2FzLnBocCcpOwogJGltaz1mdW5jdGlvbigkYSwkYikgdXNlKCRlaWwpeyAkYT1tYXgoMSwkYSk7ICRiPW1pbihjb3VudCgkZWlsKSwkYik7CiAgIHJldHVybiBpbXBsb2RlKCJcbiIsYXJyYXlfbWFwKGZ1bmN0aW9uKCRrKXVzZSgkZWlsKXtyZXR1cm4gKCRrKzEpLic6ICcucnRyaW0oJGVpbFska10pO30scmFuZ2UoJGEtMSwkYi0xKSkpOyB9OwogJG9bJ0FfNTI0MF81MzM1J109JGltayg1MjQwLDUzMzUpOwogJG9bJ0JfZWlsZXNfNDQ0MF80NDcwJ109JGltayg0NDQwLDQ0NzApOwogJG9bJ0Nfdmlld180OTAwXzQ5NDUnXT0kaW1rKDQ5MDAsNDk0NSk7CiAvKiBzZWxmOjp1cmwgaXIgZWlsZXMgcGF2YWRpbmltYWkgKi8KICRyYz1uZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX0thdGFsb2dhcycpOwogZm9yZWFjaChhcnJheSgndXJsJywnZWlsZXMnKSBhcyAkbSl7CiAgIGlmKCRyYy0+aGFzTWV0aG9kKCRtKSl7ICRyPSRyYy0+Z2V0TWV0aG9kKCRtKTsgJG9bJ3BhcmFzYXNfJy4kbV09KHN0cmluZykkcjsKICAgICAkb1sna3VuYXNfJy4kbV09JGltaygkci0+Z2V0U3RhcnRMaW5lKCksbWluKCRyLT5nZXRFbmRMaW5lKCksJHItPmdldFN0YXJ0TGluZSgpKzQ1KSk7IH0KIH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H165'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H165 Monge merge APPLY',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rA=await fetch(WP+'/?ps_h165=GO'); const tA=await rA.text();
  try{ out.A=JSON.parse(tA); }catch(e){ out.A={ZALIAS:tA.slice(0,700)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h165.json', Buffer.from(JSON.stringify(out,null,1)), 'h165 Monge merge APPLY');
