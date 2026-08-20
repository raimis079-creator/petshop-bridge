process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDE3NyddKSA/ICRfR0VUWydwc19oMTc3J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxODApOwogJG89YXJyYXkoJ3YnPT4nSDE3NycsJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSwnUkVaSU1BUyc9PidBVkFSSU5JUyBBVFNUQVRZTUFTJyk7CiAka2VsPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Ata2F0YWxvZ2FzLnBocCc7CiAkYmQ9dHJhaWxpbmdzbGFzaGl0KHdwX3VwbG9hZF9kaXIoKVsnYmFzZWRpciddKS4ncHMtYmFja3Vwcy8nOwogJGJrPSRiZC4ncGV0c2hvcC1rYXRhbG9nYXMtdjg3My1CQUNLVVAtMjAyNi0wOC0yMS5waHAnOwogJG9bJ21kNV9kYWJhciddPUBtZDVfZmlsZSgka2VsKTsKICRvWydiYWNrdXBfeXJhJ109ZmlsZV9leGlzdHMoJGJrKTsKICRvWydiYWNrdXBfbWQ1J109QG1kNV9maWxlKCRiayk7CiBpZighZmlsZV9leGlzdHMoJGJrKSl7ICRvWydTVE9QJ109J2JhY2t1cCBuZXJhc3Rhcyc7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiAkc2VuPWZpbGVfZ2V0X2NvbnRlbnRzKCRiayk7CiB0cnkgeyB0b2tlbl9nZXRfYWxsKCRzZW4sIFRPS0VOX1BBUlNFKTsgJG9bJ2JhY2t1cF9waHAnXT0nT0snOyB9CiBjYXRjaChUaHJvd2FibGUgJGUpeyAkb1snYmFja3VwX3BocCddPSdLTEFJREEg4oCUIE5FUkFTQVUnOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogJG9bJ2lyYXN5dGEnXT1maWxlX3B1dF9jb250ZW50cygka2VsLCRzZW4pOwogJG9bJ21kNV9wbyddPUBtZDVfZmlsZSgka2VsKTsKICRvWydzdXRhbXBhJ109KCRvWydtZDVfcG8nXT09PSRvWydiYWNrdXBfbWQ1J10pPydUQUlQJzonTkUnOwogaWYoZnVuY3Rpb25fZXhpc3RzKCdvcGNhY2hlX3Jlc2V0JykpIEBvcGNhY2hlX3Jlc2V0KCk7CiBpZihmdW5jdGlvbl9leGlzdHMoJ29wY2FjaGVfaW52YWxpZGF0ZScpKSBAb3BjYWNoZV9pbnZhbGlkYXRlKCRrZWwsdHJ1ZSk7CiAkcj13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvJyksYXJyYXkoJ3RpbWVvdXQnPT4yNSwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ3JlZGlyZWN0aW9uJz0+MCkpOwogJG9bJ2xvb3BiYWNrJ109aXNfd3BfZXJyb3IoJHIpPyRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpOihpbnQpd3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpOwogJHIyPXdwX3JlbW90ZV9nZXQoYWRtaW5fdXJsKCdhZG1pbi5waHA/cGFnZT1wcy1rYXRhbG9nYXMnKSxhcnJheSgndGltZW91dCc9PjI1LCdzc2x2ZXJpZnknPT5mYWxzZSwncmVkaXJlY3Rpb24nPT4wKSk7CiAkb1snYWRtaW5fa29kYXMnXT1pc193cF9lcnJvcigkcjIpPydFUlInOihpbnQpd3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIyKTsKICRvWydhZG1pbl9iZV9wYXJzZV9lcnJvciddPWlzX3dwX2Vycm9yKCRyMik/Jz8nOigoc3RycG9zKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyMiksJ1BhcnNlIGVycm9yJyk9PT1mYWxzZSk/J1RBSVAnOidORScpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H177'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H177 Monge merge APPLY',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rA=await fetch(WP+'/?ps_h177=GO'); const tA=await rA.text();
  try{ out.A=JSON.parse(tA); }catch(e){ out.A={ZALIAS:tA.slice(0,700)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h177.json', Buffer.from(JSON.stringify(out,null,1)), 'h177 Monge merge APPLY');
