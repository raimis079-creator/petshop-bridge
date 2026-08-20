process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDE2MSddKSA/ICRfR0VUWydwc19oMTYxJ10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxODApOwogJG89YXJyYXkoJ3YnPT4nSDE2MScsJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSwnUkVaSU1BUyc9PidSRUNPTi1PTkxZJyk7CiAkZWlsPUBmaWxlKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Ata2F0YWxvZ2FzLnBocCcpOwogJGhpdHM9YXJyYXkoKTsKIGZvcmVhY2goJGVpbCBhcyAkaT0+JGwpewogICBpZihwcmVnX21hdGNoKCcvcGFyZHVvZGFtfFBBUkRVT0RBTXx0aWVrZWpvX3plbmtsfGJhZGdlfHplbmtsaXVrfFRJRUtFSkFTfFRpZWvEl2phcy9pdScsJGwpKXsKICAgICAkaGl0c1tdPSRpKzE7CiAgIH0KIH0KICRvWydoaXRfZWlsdXRlcyddPSRoaXRzOwogLyogaXN0cmF1a29zIGFwbGluayBwaXJtdXMgOCBoaXQndXMsIHN1anVuZ2lhbnQgYXJ0aW11cyAqLwogJGdydXBlcz1hcnJheSgpOyAkcGFzaz0tOTk7CiBmb3JlYWNoKCRoaXRzIGFzICRoKXsgaWYoJGgtJHBhc2s+MzApeyAkZ3J1cGVzW109JGg7IH0gJHBhc2s9JGg7IH0KIGZvcmVhY2goYXJyYXlfc2xpY2UoJGdydXBlcywwLDEwKSBhcyAkZyl7CiAgICRvWydpc2tfJy4kZ109aW1wbG9kZSgiXG4iLGFycmF5X21hcChmdW5jdGlvbigkayl1c2UoJGVpbCl7cmV0dXJuICgkaysxKS4nOiAnLnJ0cmltKCRlaWxbJGtdKTt9LHJhbmdlKG1heCgwLCRnLTgpLG1pbigkZyszMCxjb3VudCgkZWlsKS0xKSkpKTsKIH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H161'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H161 Monge merge APPLY',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rA=await fetch(WP+'/?ps_h161=GO'); const tA=await rA.text();
  try{ out.A=JSON.parse(tA); }catch(e){ out.A={ZALIAS:tA.slice(0,700)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h161.json', Buffer.from(JSON.stringify(out,null,1)), 'h161 Monge merge APPLY');
