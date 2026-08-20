process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDE2MiddKSA/ICRfR0VUWydwc19oMTYyJ10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxODApOwogJG89YXJyYXkoJ3YnPT4nSDE2MicsJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSwnUkVaSU1BUyc9PidSRUNPTi1PTkxZJyk7CgogLyogU3RvY2tfU2VydmljZSBrbGFzZXMgZmFpbGFzIGlyIHBpbG5hcyB0dXJpbnlzIGplaSBtYXphcyAqLwogaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX1N0b2NrX1NlcnZpY2UnKSl7CiAgICRyYz1uZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX1N0b2NrX1NlcnZpY2UnKTsKICAgJG9bJ3NzX2ZhaWxhcyddPXN0cl9yZXBsYWNlKFdQX0NPTlRFTlRfRElSLCcnLCRyYy0+Z2V0RmlsZU5hbWUoKSk7CiAgICRvWydzc19keWRpcyddPWZpbGVzaXplKCRyYy0+Z2V0RmlsZU5hbWUoKSk7CiAgIGlmKCRvWydzc19keWRpcyddPDE1MDAwKSAkb1snc3NfdHVyaW55cyddPWZpbGVfZ2V0X2NvbnRlbnRzKCRyYy0+Z2V0RmlsZU5hbWUoKSk7CiB9CiAvKiBrYXRhbG9nbyB2aWV0b3MsIGt1ciBrdmllY2lhbWFzIFN0b2NrX1NlcnZpY2UgYXJiYSBmb3JtdW9qYW1hIHNhcmFzbyBlaWx1dGUgKi8KICRlaWw9QGZpbGUoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rYXRhbG9nYXMucGhwJyk7CiAkaXNwPWFycmF5KCk7CiBmb3JlYWNoKCRlaWwgYXMgJGk9PiRsKXsKICAgaWYoc3RycG9zKCRsLCdTdG9ja19TZXJ2aWNlJykhPT1mYWxzZSB8fCBzdHJwb3MoJGwsIid0aWVrJyIpIT09ZmFsc2UgfHwgc3RycG9zKCRsLCcidGllayInKSE9PWZhbHNlIHx8IHN0cnBvcygkbCwiJ3BhcmR1b2RhbWEnIikhPT1mYWxzZSl7CiAgICAgZm9yKCRrPW1heCgwLCRpLTQpOyRrPD1taW4oY291bnQoJGVpbCktMSwkaSs4KTskaysrKSAkaXNwWyRrXT0oJGsrMSkuJzogJy5ydHJpbSgkZWlsWyRrXSk7CiAgIH0KIH0KIGtzb3J0KCRpc3ApOwogJG9bJ2thdF9rb250ZWtzdGFzJ109aW1wbG9kZSgiXG4iLGFycmF5X3NsaWNlKCRpc3AsMCwyNjApKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H162'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H162 Monge merge APPLY',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rA=await fetch(WP+'/?ps_h162=GO'); const tA=await rA.text();
  try{ out.A=JSON.parse(tA); }catch(e){ out.A={ZALIAS:tA.slice(0,700)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h162.json', Buffer.from(JSON.stringify(out,null,1)), 'h162 Monge merge APPLY');
