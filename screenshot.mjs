process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2s5ODEnXSk/JF9HRVRbJ3BzX2s5ODEnXTonJykhPT0nSzk4MScpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgzMDApOwogJHZmPVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXhtbC9pbmNsdWRlcy9jbGFzcy12Zi1pbXBvcnQucGhwJzsKICRMPWZpbGUoJHZmKTsKICRvPWFycmF5KCd2Jz0+J0s5ODEnKTsKICRvWydzdG9ja19zeW5jJ109aW1wbG9kZSgnJyxhcnJheV9zbGljZSgkTCwxMTEsMTgpKTsKICRvWydhdHRhY2hfdG9fZXhpc3RpbmcnXT1pbXBsb2RlKCcnLGFycmF5X3NsaWNlKCRMLDI1NSw3NikpOwogJG9bJ3dyaXRlX3ByaWNlJ109aW1wbG9kZSgnJyxhcnJheV9zbGljZSgkTCw2MTAsNjApKTsKICRvWydpc19wcmljZV9sb2NrZWQnXT1pbXBsb2RlKCcnLGFycmF5X3NsaWNlKCRMLDY5NiwxMCkpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'K981'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
try{
  const s=await snip('TEMP K981',B64);
  await new Promise(r=>setTimeout(r,7000));
  const t=await (await fetch(WP+'/?ps_k981=K981')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('k981.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'k981 kunai');
