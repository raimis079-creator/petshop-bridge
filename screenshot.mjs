process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDE3NSddKSA/ICRfR0VUWydwc19oMTc1J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxODApOwogJG89YXJyYXkoJ3YnPT4nSDE3NScsJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSwnUkVaSU1BUyc9PidKUyBQQVRJS1JBJyk7CiAkdD1maWxlX2dldF9jb250ZW50cyhXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWthdGFsb2dhcy5waHAnKTsKCiAvKiBpc3RyYXVraWFtIFZJU1VTIGVjaG8gJzxzY3JpcHQ+IC4uLiA8L3NjcmlwdD4nOyBibG9rdXMgaXIgdGlrcmluYW0gc2tsaWF1c3R1cyAqLwogcHJlZ19tYXRjaF9hbGwoIi9lY2hvICc8c2NyaXB0PiguKj8pPFxcL3NjcmlwdD4nOy9zIiwgJHQsICRtKTsKICRvWydzY3JpcHRfYmxva3UnXT1jb3VudCgkbVsxXSk7CiAkYmw9YXJyYXkoKTsKIGZvcmVhY2goJG1bMV0gYXMgJGk9PiRqcyl7CiAgICRqczI9c3RyX3JlcGxhY2UoYXJyYXkoIlxcJyIsIlxcXFwiKSxhcnJheSgiJyIsIlxcIiksJGpzKTsKICAgJGJsW109YXJyYXkoJ25yJz0+JGksJ2lsZ2lzJz0+c3RybGVuKCRqczIpLAogICAgICdmaWd1cmluaWFpJz0+c3Vic3RyX2NvdW50KCRqczIsJ3snKS4nLycuc3Vic3RyX2NvdW50KCRqczIsJ30nKSwKICAgICAnc2tsaWF1c3RhaSc9PnN1YnN0cl9jb3VudCgkanMyLCcoJykuJy8nLnN1YnN0cl9jb3VudCgkanMyLCcpJyksCiAgICAgJ29rJz0+KHN1YnN0cl9jb3VudCgkanMyLCd7Jyk9PT1zdWJzdHJfY291bnQoJGpzMiwnfScpICYmIHN1YnN0cl9jb3VudCgkanMyLCcoJyk9PT1zdWJzdHJfY291bnQoJGpzMiwnKScpKT8nVEFJUCc6J05FJywKICAgICAndHVyaV9tdXN1Jz0+KHN0cnBvcygkanMyLCdpbnB1dFt0eXBlPXNlYXJjaF1bbmFtZT1xXScpIT09ZmFsc2UpPydUQUlQJzonLScpOwogfQogJG9bJ2Jsb2thaSddPSRibDsKCiAvKiBtdXN1IGtvZG8gaXNrYXJwYSBpcyBGQUlMTyAobmUgaXMgcmVnZXgpICovCiAkcD1zdHJwb3MoJHQsJ3Y4LjcuMzogUEFJRVNLT1MgTEFVS0VMSVMnKTsKIGlmKCRwIT09ZmFsc2UpeyAkb1snaXNrYXJwYSddPXN1YnN0cigkdCwkcC0yNjAsMTkwMCk7IH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H175'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H175 Monge merge APPLY',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rA=await fetch(WP+'/?ps_h175=GO'); const tA=await rA.text();
  try{ out.A=JSON.parse(tA); }catch(e){ out.A={ZALIAS:tA.slice(0,700)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h175.json', Buffer.from(JSON.stringify(out,null,1)), 'h175 Monge merge APPLY');
