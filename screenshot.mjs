process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDE4NCddKSA/ICRfR0VUWydwc19oMTg0J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxODApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogJG89YXJyYXkoJ3YnPT4nSDE4NCcsJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSwnUkVaSU1BUyc9PidSRUNPTi1PTkxZJyk7CgogJG9bJ2hvbGRfc3RvY2tfbWludXRlcyddPWdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX2hvbGRfc3RvY2tfbWludXRlcycpOwogJG9bJ21hbmFnZV9zdG9jayddPWdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX21hbmFnZV9zdG9jaycpOwoKIC8qIGFyICdhdHNhdWt0aScgZ3JhemluYSBwcmVrZXMgaSBsaWt1dGkg4oCUIGRlc2sga29kYXMgNDQ1LTQ4MCAqLwogJGVpbD1AZmlsZShXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWRlc2sucGhwJyk7CiAkb1snZGVza180NDVfNDg1J109aW1wbG9kZSgiXG4iLGFycmF5X21hcChmdW5jdGlvbigkayl1c2UoJGVpbCl7cmV0dXJuICgkaysxKS4nOiAnLnJ0cmltKCRlaWxbJGtdKTt9LHJhbmdlKDQ0NCxtaW4oNDg0LGNvdW50KCRlaWwpLTEpKSkpOwoKIC8qIFdDIHJlc3RvY2sga2FibGl1a2FpICovCiBnbG9iYWwgJHdwX2ZpbHRlcjsKIGZvcmVhY2goYXJyYXkoJ3dvb2NvbW1lcmNlX29yZGVyX3N0YXR1c19jYW5jZWxsZWQnLCd3b29jb21tZXJjZV9vcmRlcl9zdGF0dXNfY2hhbmdlZCcpIGFzICRoKXsKICAgJHM9YXJyYXkoKTsKICAgaWYoaXNzZXQoJHdwX2ZpbHRlclskaF0pKSBmb3JlYWNoKCR3cF9maWx0ZXJbJGhdLT5jYWxsYmFja3MgYXMgJHByPT4kY2IpIGZvcmVhY2goJGNiIGFzICRjKXsKICAgICAkZm49JGNbJ2Z1bmN0aW9uJ107IGlmKGlzX2FycmF5KCRmbikpICRmbj0oaXNfb2JqZWN0KCRmblswXSk/Z2V0X2NsYXNzKCRmblswXSk6KHN0cmluZykkZm5bMF0pLic6OicuJGZuWzFdOwogICAgIGVsc2VpZigkZm4gaW5zdGFuY2VvZiBDbG9zdXJlKSAkZm49J0Nsb3N1cmUnOyAkc1tdPSRwci4nICcuKGlzX3N0cmluZygkZm4pPyRmbjonPycpOyB9CiAgICRvWydrYWJsaXVrYWlfJy4kaF09JHM7CiB9CiAvKiBhciBhdHNhdWt0dW9zZSB1enNha3ltdW9zZSBsaWt1dGlzIGdyaXpvIOKAlCBpc3RvcmlqYSAqLwogJGF0cz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIGlkIEZST00geyRQfXdjX29yZGVycyBXSEVSRSBzdGF0dXM9J3djLWNhbmNlbGxlZCcgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAzIik7CiAkcD1hcnJheSgpOwogZm9yZWFjaCgkYXRzIGFzICRpZCl7CiAgICRudD13Y19nZXRfb3JkZXJfbm90ZXMoYXJyYXkoJ29yZGVyX2lkJz0+JGlkLCdsaW1pdCc9PjEwKSk7CiAgICR0az1hcnJheSgpOyBmb3JlYWNoKCRudCBhcyAkbil7ICR0PW1iX3N1YnN0cigkbi0+Y29udGVudCwwLDgwKTsgaWYoc3RyaXBvcygkdCwnbGlrdXQnKSE9PWZhbHNlfHxzdHJpcG9zKCR0LCdzdG9jaycpIT09ZmFsc2V8fHN0cmlwb3MoJHQsJ2F0c2FyZycpIT09ZmFsc2V8fHN0cmlwb3MoJHQsJ3BhZGlkaW4nKSE9PWZhbHNlKSAkdGtbXT0kdDsgfQogICAkcFtdPWFycmF5KCducic9PiRpZCwnbGlrdWNpb19wYXN0YWJvcyc9PiR0ayA/OiAnTkVSQVNUQScpOwogfQogJG9bJ2F0c2F1a3R1X3Bhc3RhYm9zJ109JHA7CgogLyogbGFpc2t1IHNpc3RlbWE6IGFyIHlyYSBzYXZpZW1zIGxhaXNrYW1zIGthcmthc2FzICovCiAkb1snd2NfZW1haWxzJ109YXJyYXlfa2V5cyhXQygpLT5tYWlsZXIoKS0+Z2V0X2VtYWlscygpKTsKICRvWydwc19sYWlza3VfbGVudGVsZXMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAneyRQfXBzXF8lJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H184'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H184 Monge merge APPLY',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rA=await fetch(WP+'/?ps_h184=GO'); const tA=await rA.text();
  try{ out.A=JSON.parse(tA); }catch(e){ out.A={ZALIAS:tA.slice(0,700)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h184.json', Buffer.from(JSON.stringify(out,null,1)), 'h184 Monge merge APPLY');
