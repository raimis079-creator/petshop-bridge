process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDE2MyddKSA/ICRfR0VUWydwc19oMTYzJ10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxODApOwogJG89YXJyYXkoJ3YnPT4nSDE2MycsJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSwnUkVaSU1BUyc9PidSRUNPTi1PTkxZJyk7CiAkb1snc3Nfa2xhc2UnXT1jbGFzc19leGlzdHMoJ1BldHNob3BfU3RvY2tfU2VydmljZScpOwogJG9bJ3NvdXJjZXNfa2xhc2UnXT1jbGFzc19leGlzdHMoJ1BldHNob3BfU291cmNlcycpOwogaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX1NvdXJjZXMnKSl7CiAgICRyYz1uZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX1NvdXJjZXMnKTsKICAgJG9bJ3NyY19mYWlsYXMnXT1zdHJfcmVwbGFjZShXUF9DT05URU5UX0RJUiwnJywkcmMtPmdldEZpbGVOYW1lKCkpOwogICAkb1snc3JjX2R5ZGlzJ109ZmlsZXNpemUoJHJjLT5nZXRGaWxlTmFtZSgpKTsKICAgaWYoJG9bJ3NyY19keWRpcyddPDIwMDAwKSAkb1snc3JjX3R1cmlueXMnXT1maWxlX2dldF9jb250ZW50cygkcmMtPmdldEZpbGVOYW1lKCkpOwogfQogLyogc2FyYXNvIGVpbHV0ZXMgZm9ybWF2aW1hcyBrYXRhbG9nZTogaWVza29tIEFWL1RJRUtFSk8vUEFSRFVPREFNQSBzdHVscGVsaXUgbWFzeXZvICovCiAkZWlsPUBmaWxlKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Ata2F0YWxvZ2FzLnBocCcpOwogJGlzcD1hcnJheSgpOwogZm9yZWFjaCgkZWlsIGFzICRpPT4kbCl7CiAgIGlmKHByZWdfbWF0Y2goJy9hdl9raWVraXN8dGlla19raWVraXN8cGFyZHVvfHNlbGxhYmxlfFNvdXJjZXM6OnxiYWRnZXx6ZW5rbC9pJywkbCkpewogICAgIGZvcigkaz1tYXgoMCwkaS0zKTskazw9bWluKGNvdW50KCRlaWwpLTEsJGkrNik7JGsrKykgJGlzcFska109KCRrKzEpLic6ICcucnRyaW0oJGVpbFska10pOwogICB9CiB9CiBrc29ydCgkaXNwKTsKICRvWydrYXQnXT1pbXBsb2RlKCJcbiIsYXJyYXlfc2xpY2UoJGlzcCwwLDMwMCkpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H163'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H163 Monge merge APPLY',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rA=await fetch(WP+'/?ps_h163=GO'); const tA=await rA.text();
  try{ out.A=JSON.parse(tA); }catch(e){ out.A={ZALIAS:tA.slice(0,700)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h163.json', Buffer.from(JSON.stringify(out,null,1)), 'h163 Monge merge APPLY');
