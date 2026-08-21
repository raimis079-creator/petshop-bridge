process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDE4MSddKSA/ICRfR0VUWydwc19oMTgxJ10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxODApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogJG89YXJyYXkoJ3YnPT4nSDE4MScsJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSwnUkVaSU1BUyc9PidSWVRPIFBBVElLUkEnKTsKCiAvKiAxLiBzZXNlbGl1IHNpbmNocm9ubyBzYW50cmF1a2EgKi8KICRvWydwc19zZXNlbGlhaV9wYXNrdXRpbmlzJ10gPSBnZXRfb3B0aW9uKCdwc19zZXNlbGlhaV9wYXNrdXRpbmlzJyk7CiAkb1snY3Jvbl9raXRhcyddID0gd3BfbmV4dF9zY2hlZHVsZWQoJ3BzX3Nlc2VsaWFpX3ZhbGFuZGluaXMnKSA/IGRhdGUoJ0g6aScsIHdwX25leHRfc2NoZWR1bGVkKCdwc19zZXNlbGlhaV92YWxhbmRpbmlzJykpIDogJ05FU1VQTEFOVU9UQVMnOwoKIC8qIDIuIFdQIEFsbCBJbXBvcnQgbmFrdGluaXUgcnVuJ3UgaXN0b3JpamEgKi8KICRvWydpbXBvcnRhaV9uYWt0aXMnXSA9ICR3cGRiLT5nZXRfcmVzdWx0cygKICAgIlNFTEVDVCBpbXBvcnRfaWQsIHR5cGUsIHRpbWUsIE1BWChpZCkgaWQgRlJPTSB7JFB9cG14aV9oaXN0b3J5CiAgICBXSEVSRSB0aW1lID4gREFURV9TVUIoTk9XKCksIElOVEVSVkFMIDEyIEhPVVIpIEdST1VQIEJZIGltcG9ydF9pZCwgdGltZSBPUkRFUiBCWSB0aW1lIERFU0MgTElNSVQgMTAiLCBBUlJBWV9BKTsKCiAvKiAzLiBwb3J1IGtvbnRyb2xlIOKAlCAzIE1vbmdlICsgMiBCViAqLwogJHBvcm9zID0gYXJyYXkoMzM1NTA9PjE3Mzk0LCAzMzU1Mj0+MTc0MDAsIDMzNzA4PT4xNzQyMSwgMTMwMTU9PjE2OTUzLCAxMzg3MD0+MTkxMDcpOwogJGVpbD1hcnJheSgpOwogZm9yZWFjaCgkcG9yb3MgYXMgJHo9PiRhKXsKICAgJHA9d2NfZ2V0X3Byb2R1Y3QoJGEpOwogICAkZWlsW109YXJyYXkoJ3BvcmEnPT4iJHrihpIkYSIsCiAgICAgJ3Nlc2VsaW9femInPT4oc3RyaW5nKWdldF9wb3N0X21ldGEoJHosJ196Yl9xdHknLHRydWUpLAogICAgICdzZXNlbGlvX3N5bmMnPT4oc3RyaW5nKWdldF9wb3N0X21ldGEoJHosJ196Yl9sYXN0X3N5bmMnLHRydWUpLAogICAgICdhdl96Yic9PihzdHJpbmcpZ2V0X3Bvc3RfbWV0YSgkYSwnX3piX3F0eScsdHJ1ZSksCiAgICAgJ2F2X3N5bmMnPT4oc3RyaW5nKWdldF9wb3N0X21ldGEoJGEsJ196Yl9sYXN0X3N5bmMnLHRydWUpLAogICAgICdrbGllbnRhcyc9PiRwPyRwLT5nZXRfc3RvY2tfcXVhbnRpdHkoKTpudWxsLAogICAgICdidXNlbmEnPT4kcD8kcC0+Z2V0X3N0b2NrX3N0YXR1cygpOm51bGwpOwogfQogJG9bJ3Bvcm9zJ109JGVpbDsKCiAvKiA0LiBzdmVpa2F0b3MgcGF0aWtyYSAqLwogJG9bJ2thdGFsb2dhc19tZDUnXT1tZDVfZmlsZShXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWthdGFsb2dhcy5waHAnKTsKICRyPXdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8nKSxhcnJheSgndGltZW91dCc9PjIwLCdzc2x2ZXJpZnknPT5mYWxzZSwncmVkaXJlY3Rpb24nPT4wKSk7CiAkb1snZnJvbnRhcyddPWlzX3dwX2Vycm9yKCRyKT8nRVJSJzooaW50KXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H181'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H181 Monge merge APPLY',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rA=await fetch(WP+'/?ps_h181=GO'); const tA=await rA.text();
  try{ out.A=JSON.parse(tA); }catch(e){ out.A={ZALIAS:tA.slice(0,700)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h181.json', Buffer.from(JSON.stringify(out,null,1)), 'h181 Monge merge APPLY');
