process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX205OTUnXSk/JF9HRVRbJ3BzX205OTUnXTonJykhPT0nTTk5NScpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgzMDApOwogJG89YXJyYXkoJ3YnPT4nTTk5NScpOwogJHB4PVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXhtbC9wZXRzaG9wLXhtbC5waHAnOyAkQT1maWxlKCRweCk7CiAkb1snYmxvY2tfdmZfY3JlYXRlJ109aW1wbG9kZSgnJyxhcnJheV9zbGljZSgkQSw0OTksOTgpKTsKICR2Zj1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC14bWwvaW5jbHVkZXMvY2xhc3MtdmYtaW1wb3J0LnBocCc7ICRCPWZpbGUoJHZmKTsKICRvWydpbml0aWFsX2ltcG9ydCddPWltcGxvZGUoJycsYXJyYXlfc2xpY2UoJEIsMTI4LDEyOCkpOwogJG9bJ2ZpbmRfYnlfc2t1J109aW1wbG9kZSgnJyxhcnJheV9zbGljZSgkQiw2NjksMjgpKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'M995'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
try{
  const s=await snip('TEMP M995',B64);
  await new Promise(r=>setTimeout(r,7000));
  const t=await (await fetch(WP+'/?ps_m995=M995')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('m995.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'm995 match');
