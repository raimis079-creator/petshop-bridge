process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2c4OTUnXSk/JF9HRVRbJ3BzX2c4OTUnXTonJykgIT09ICdHODk1JykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidHODk1Jyk7CiAkZj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXBpbG51bWFzLnBocCc7CiAkUz1maWxlX2dldF9jb250ZW50cygkZik7ICRMPWV4cGxvZGUoIlxuIiwkUyk7CiAkb1snZHlkaXMnXT1zdHJsZW4oJFMpOwogJGhpdHM9YXJyYXkoKTsKIGZvcmVhY2goJEwgYXMgJGk9PiR4KXsKICAgaWYocHJlZ19tYXRjaCgnL2FwcmFzeW18YXByYcWheW18TUlOX3xtaW5faWxnaXN8c3RybGVufG1iX3N0cmxlbi9pdScsJHgpKXsKICAgICAkY3R4PWFycmF5KCk7CiAgICAgZm9yKCRqPW1heCgwLCRpLTQpOyRqPD1taW4oY291bnQoJEwpLTEsJGkrNik7JGorKykgJGN0eFtdPSgkaisxKS4nOiAnLnRyaW0oc3Vic3RyKCRMWyRqXSwwLDE1MCkpOwogICAgICRoaXRzW109YXJyYXkoJ25yJz0+JGkrMSwnY3R4Jz0+JGN0eCk7CiAgIH0KIH0KICRvWydlaWx1Y2l1X3Jhc3RhJ109Y291bnQoJGhpdHMpOwogJG9bJ3ZpZXRvcyddPWFycmF5X3NsaWNlKCRoaXRzLDAsMTApOwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'G895'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
try{
  const s=await snip('TEMP G895 pilnumo taisykle',B64);
  await new Promise(r=>setTimeout(r,8000));
  const t=await (await fetch(WP+'/?ps_g895=G895')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/g895.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g895');
