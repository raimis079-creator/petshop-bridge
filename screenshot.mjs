process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDE4MCddKSA/ICRfR0VUWydwc19oMTgwJ10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxMjApOwogJG89YXJyYXkoJ3YnPT4nSDE4MCcsJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSk7CiAkdGlrID0gV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rYXRhbG9nYXMucGhwJzsKICRvZmYgPSBXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWthdGFsb2dhcy5waHAub2ZmJzsKICRvWydtZDUnXSA9IG1kNV9maWxlKCR0aWspOwogJG9bJ2R5ZGlzJ10gPSBmaWxlc2l6ZSgkdGlrKTsKIHRyeSB7IHRva2VuX2dldF9hbGwoZmlsZV9nZXRfY29udGVudHMoJHRpayksIFRPS0VOX1BBUlNFKTsgJG9bJ3NpbnRha3NlJ109J09LJzsgfQogY2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ3NpbnRha3NlJ109J0tMQUlEQTogJy4kZS0+Z2V0TWVzc2FnZSgpOyB9CiBpZihmaWxlX2V4aXN0cygkb2ZmKSl7ICRvWydvZmZfaXN0cmludGFzJ10gPSBAdW5saW5rKCRvZmYpID8gJ3RhaXAnIDogJ05FUEFWWUtPJzsgfQogJG9bJ2tsYXNlJ10gPSBjbGFzc19leGlzdHMoJ1BldHNob3BfS2F0YWxvZ2FzJykgPyAndXpzaWtyb3ZlJyA6ICdORSc7CiAvKiBrYXRhbG9nbyBwdXNsYXBpbyB1emtsYXVzYSAobmVwcmlzaWp1bmd1cyAtPiByZWRpcmVjdCBpIGxvZ2luLCB0YWkgT0spICovCiAkciA9IHdwX3JlbW90ZV9nZXQoYWRtaW5fdXJsKCdhZG1pbi5waHA/cGFnZT1wcy1rYXRhbG9nYXMnKSwgYXJyYXkoJ3RpbWVvdXQnPT4yNSwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ3JlZGlyZWN0aW9uJz0+MCkpOwogJG9bJ2FkbWluX2tvZGFzJ10gPSBpc193cF9lcnJvcigkcikgPyAkci0+Z2V0X2Vycm9yX21lc3NhZ2UoKSA6IChpbnQpd3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpOwogJG9bJ2JlX3BhcnNlX2Vycm9yJ10gPSBpc193cF9lcnJvcigkcikgPyAnPycgOiAoKHN0cnBvcyh3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkciksJ1BhcnNlIGVycm9yJyk9PT1mYWxzZSk/J1RBSVAnOidORScpOwogLyogdjguNy4yIHp5bWVzIGFyIGlzbGlrbyAqLwogJHQ9ZmlsZV9nZXRfY29udGVudHMoJHRpayk7CiAkb1sndjg3Ml9ha3QnXSA9IChzdHJwb3MoJHQsJ3Y4LjcuMjogUEFJRVNLQSBpciBFSUxFJykhPT1mYWxzZSk/J3lyYSc6J25lcmEnOwogJG9bJ3Y4NzNfcGFpZXNrYSddID0gKHN0cnBvcygkdCwndjguNy4zOiBQQUlFU0tPUyBMQVVLRUxJUycpIT09ZmFsc2UpPyd5cmEnOiduZXJhJzsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H180'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H180 Monge merge APPLY',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rA=await fetch(WP+'/?ps_h180=GO'); const tA=await rA.text();
  try{ out.A=JSON.parse(tA); }catch(e){ out.A={ZALIAS:tA.slice(0,700)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h180.json', Buffer.from(JSON.stringify(out,null,1)), 'h180 Monge merge APPLY');
