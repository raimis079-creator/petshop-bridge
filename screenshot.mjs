process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDE1OCddKSA/ICRfR0VUWydwc19oMTU4J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgyNDApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogJG89YXJyYXkoJ3YnPT4nSDE1OCcsJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSwnUkVaSU1BUyc9PidSRUNPTi1PTkxZIChCaW92ZXRlcmluYXJ5KScpOwoKICRpZHMgPSAkd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIElEIEZST00geyRQfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcKICAgQU5EIHBvc3Rfc3RhdHVzIElOICgncHVibGlzaCcsJ2RyYWZ0JykgQU5EIHBvc3RfdGl0bGUgTElLRSAnJWlvdmV0ZXIlJyIpOwogJGVpbD1hcnJheSgpOwogZm9yZWFjaCgkaWRzIGFzICRwaWQpewogICAkcGlkPShpbnQpJHBpZDsgJHA9Z2V0X3Bvc3QoJHBpZCk7CiAgICRzcmMgPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBzb3VyY2Usc3RvY2tfcXR5IEZST00geyRQfXBzX3NvdXJjZXMgV0hFUkUgcHJvZHVjdF9pZD0lZCIsJHBpZCksQVJSQVlfQSk7CiAgICRzbWFwPWFycmF5KCk7IGZvcmVhY2goJHNyYyBhcyAkcikgJHNtYXBbXT0kclsnc291cmNlJ10uJz0nLiRyWydzdG9ja19xdHknXTsKICAgJGVpbFtdPWFycmF5KCdpZCc9PiRwaWQsJ3N0Jz0+JHAtPnBvc3Rfc3RhdHVzLAogICAgICd0Jz0+bWJfc3Vic3RyKGh0bWxfZW50aXR5X2RlY29kZSgkcC0+cG9zdF90aXRsZSxFTlRfUVVPVEVTfEVOVF9IVE1MNSwnVVRGLTgnKSwwLDUyKSwKICAgICAnc2t1Jz0+KHN0cmluZylnZXRfcG9zdF9tZXRhKCRwaWQsJ19za3UnLHRydWUpLAogICAgICdlYW4nPT4oc3RyaW5nKWdldF9wb3N0X21ldGEoJHBpZCwnX2VhbicsdHJ1ZSksCiAgICAgJ3piX2Vhbic9PihzdHJpbmcpZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfemJfZWFuJyx0cnVlKSwKICAgICAnemJfcXR5Jz0+KHN0cmluZylnZXRfcG9zdF9tZXRhKCRwaWQsJ196Yl9xdHknLHRydWUpLAogICAgICd6Yl9jb3N0Jz0+KHN0cmluZylnZXRfcG9zdF9tZXRhKCRwaWQsJ196Yl9jb3N0Jyx0cnVlKSwKICAgICAnbGVnX21hbic9PihzdHJpbmcpZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfbGVnYWN5X21hbnVmYWN0dXJlcicsdHJ1ZSksCiAgICAgJ3NhbmQnPT4oc3RyaW5nKWdldF9wb3N0X21ldGEoJHBpZCwnX3BzX3NhbmRlbGlzJyx0cnVlKSwKICAgICAnc3RvY2snPT4oc3RyaW5nKWdldF9wb3N0X21ldGEoJHBpZCwnX3N0b2NrJyx0cnVlKSwKICAgICAncHJpY2UnPT4oc3RyaW5nKWdldF9wb3N0X21ldGEoJHBpZCwnX3ByaWNlJyx0cnVlKSwKICAgICAncHNfc3JjJz0+aW1wbG9kZSgnLCcsJHNtYXApKTsKIH0KICRvWydwcmVrZXMnXT0kZWlsOwoKIC8qIHBldHNob3AteG1sLnBocCB1cGRhdGUgZ2F0ZSBwaWxuYXMga3VuYXMgNDMwLTUzMCAqLwogJHg9QGZpbGUoV1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sL3BldHNob3AteG1sLnBocCcpOwogJG9bJ3htbF80MzBfNTMwJ109aW1wbG9kZSgiXG4iLGFycmF5X21hcChmdW5jdGlvbigkayl1c2UoJHgpe3JldHVybiAoJGsrMSkuJzogJy5ydHJpbSgkeFska10pO30scmFuZ2UoNDI5LG1pbig1MjksY291bnQoJHgpLTEpKSkpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H158'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H158 Monge merge APPLY',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rA=await fetch(WP+'/?ps_h158=GO'); const tA=await rA.text();
  try{ out.A=JSON.parse(tA); }catch(e){ out.A={ZALIAS:tA.slice(0,700)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h158.json', Buffer.from(JSON.stringify(out,null,1)), 'h158 Monge merge APPLY');
