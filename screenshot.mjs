process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3B1bGwnXSk/JF9HRVRbJ3BzX3B1bGwnXTonJykhPT0nS0FUOTAxJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogJGY9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rYXRhbG9nYXMucGhwJzsKIGhlYWRlcignQ29udGVudC1UeXBlOiB0ZXh0L3BsYWluJyk7CiBpZighZmlsZV9leGlzdHMoJGYpKXsgZWNobyAnTkVSQSc7IGV4aXQ7IH0KIGhlYWRlcignWC1LQVQtTUQ1OiAnLm1kNV9maWxlKCRmKSk7CiByZWFkZmlsZSgkZik7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'PULL901'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  const r=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
  return r.status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
  const s=await snip('TEMP PULL901',B64);
  await new Promise(r=>setTimeout(r,6000));
  const r=await fetch(WP+'/?ps_pull=KAT901');
  out.md5=r.headers.get('x-kat-md5'); out.http=r.status;
  const buf=Buffer.from(await r.arrayBuffer());
  out.dydis=buf.length;
  // gzip, kad tilptu i Contents API
  const zlib=await import('zlib');
  const gz=zlib.gzipSync(buf);
  out.gz=gz.length;
  out.put=await put('kat_srv.php.gz', gz, 'kat srv pull');
  await off(s);
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('pull901.json', Buffer.from(JSON.stringify(out)), 'pull901');
