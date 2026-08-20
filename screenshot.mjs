process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDE3MCddKSA/ICRfR0VUWydwc19oMTcwJ10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxODApOwogJG89YXJyYXkoJ3YnPT4nSDE3MCcsJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSwnUkVaSU1BUyc9PidPUENBQ0hFICsgcGF0aWtyYScpOwogJGtlbCA9IFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Ata2F0YWxvZ2FzLnBocCc7CiAkb1snbWQ1X2Rpc2tlJ10gPSBtZDVfZmlsZSgka2VsKTsKCiAvKiAxLiBvcGNhY2hlIGJ1a2xlIGlyIHBpbG5hcyByZXNldGFzICovCiAkb1snb3BjYWNoZV9panVuZ3RhcyddID0gZnVuY3Rpb25fZXhpc3RzKCdvcGNhY2hlX2dldF9zdGF0dXMnKSA/IChib29sKUBvcGNhY2hlX2dldF9zdGF0dXMoZmFsc2UpIDogJ2Z1bmtjaWpvcyBuZXJhJzsKIGlmKGZ1bmN0aW9uX2V4aXN0cygnb3BjYWNoZV9nZXRfc3RhdHVzJykpewogICAkc3QgPSBAb3BjYWNoZV9nZXRfc3RhdHVzKHRydWUpOwogICBpZihpc19hcnJheSgkc3QpICYmIGlzc2V0KCRzdFsnc2NyaXB0cyddKSl7CiAgICAgZm9yZWFjaCgkc3RbJ3NjcmlwdHMnXSBhcyAkc2s9PiRzaSl7CiAgICAgICBpZihzdHJwb3MoJHNrLCdwZXRzaG9wLWthdGFsb2dhcycpIT09ZmFsc2UpewogICAgICAgICAkb1snb3BjYWNoZV90dXJpX2ZhaWxhJ10gPSBhcnJheSgna2VsaWFzJz0+JHNrLCd0cyc9PmRhdGUoJ1ktbS1kIEg6aTpzJywgJHNpWyd0aW1lc3RhbXAnXSA/PyAwKSk7CiAgICAgICB9CiAgICAgfQogICB9CiB9CiBpZihmdW5jdGlvbl9leGlzdHMoJ29wY2FjaGVfcmVzZXQnKSl7ICRvWydvcGNhY2hlX3Jlc2V0J10gPSBAb3BjYWNoZV9yZXNldCgpID8gJ0lWWUtEWVRBJyA6ICduZXBhdnlrbyc7IH0KIGlmKGZ1bmN0aW9uX2V4aXN0cygnb3BjYWNoZV9pbnZhbGlkYXRlJykpeyAkb1snaW52YWxpZGF0ZSddID0gQG9wY2FjaGVfaW52YWxpZGF0ZSgka2VsLHRydWUpID8gJ3RhaXAnOiduZSc7IH0KCiAvKiAyLiB2YWxpZGF0ZV90aW1lc3RhbXBzIC8gcmV2YWxpZGF0ZV9mcmVxIOKAlCBqZWkgMC9pc2p1bmd0YSwgYmUgcmVzZXQgZmFpbGFzIE5JRUtBREEgbmVhdHNpbmF1amluYSAqLwogJG9bJ2luaSddID0gYXJyYXkoCiAgICdvcGNhY2hlLmVuYWJsZScgICAgICAgICAgICAgID0+IGluaV9nZXQoJ29wY2FjaGUuZW5hYmxlJyksCiAgICdvcGNhY2hlLnZhbGlkYXRlX3RpbWVzdGFtcHMnID0+IGluaV9nZXQoJ29wY2FjaGUudmFsaWRhdGVfdGltZXN0YW1wcycpLAogICAnb3BjYWNoZS5yZXZhbGlkYXRlX2ZyZXEnICAgICA9PiBpbmlfZ2V0KCdvcGNhY2hlLnJldmFsaWRhdGVfZnJlcScpLAogKTsKCiAvKiAzLiBMVFUgcmFpZHppdSBwYXRpa3JhIGZhaWxlIOKAlCBhciBtYW5vIGlyYXN5dG9zIGVpbHV0ZXMgdGlrcmFpIGRpc2tlICovCiAkdD1maWxlX2dldF9jb250ZW50cygka2VsKTsKICRvWydkaXNrZV95cmFfcGF0YWlzYSddID0gKHN0cnBvcygkdCwidjguNy4yOiBQQUlFU0tBIGlyIEVJTEUiKSE9PWZhbHNlKSA/ICdUQUlQJzonTkUnOwogJG9bJ2Rpc2tlX3lyYV92aWV3X251bGwnXSA9IHN1YnN0cl9jb3VudCgkdCwiJ3ZpZXcnPT5udWxsIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'H170'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H170 Monge merge APPLY',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rA=await fetch(WP+'/?ps_h170=GO'); const tA=await rA.text();
  try{ out.A=JSON.parse(tA); }catch(e){ out.A={ZALIAS:tA.slice(0,700)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h170.json', Buffer.from(JSON.stringify(out,null,1)), 'h170 Monge merge APPLY');
