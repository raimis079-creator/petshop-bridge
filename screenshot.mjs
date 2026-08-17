process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2s5ODAnXSk/JF9HRVRbJ3BzX2s5ODAnXTonJykhPT0nSzk4MCcpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgzMDApOwogJG89YXJyYXkoJ3YnPT4nSzk4MCcpOwogJHZmPVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXhtbC9pbmNsdWRlcy9jbGFzcy12Zi1pbXBvcnQucGhwJzsKIGlmKCFpc19yZWFkYWJsZSgkdmYpKXsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgna2xhaWRhJz0+J25lcmEgZmFpbG8nKSk7IGV4aXQ7IH0KICRMPWZpbGUoJHZmKTsgJG9bJ2VpbHVjaXUnXT1jb3VudCgkTCk7CiAvKiBWSVNJIHJhc3ltYWkgaSBwcmVrZSAqLwogJHJhcz1hcnJheSgpOwogZm9yZWFjaCgkTCBhcyAkaT0+JHJvdyl7CiAgIGlmKHByZWdfbWF0Y2goJy91cGRhdGVfcG9zdF9tZXRhXHMqXCh8c2V0X3JlZ3VsYXJfcHJpY2V8c2V0X3NhbGVfcHJpY2V8c2V0X3ByaWNlXHMqXCh8LT5zYXZlXHMqXChcKXx3cF91cGRhdGVfcG9zdC8nLCRyb3cpKXsKICAgICAkcmFzW109YXJyYXkoJGkrMSx0cmltKG1iX3N1YnN0cigkcm93LDAsMTUwKSkpOwogICB9CiB9CiAkb1sndmlzaV9yYXN5bWFpJ109JHJhczsKIC8qIGZ1bmtjaWp1IHNhcmFzYXMgKi8KICRmbj1hcnJheSgpOwogZm9yZWFjaCgkTCBhcyAkaT0+JHJvdykgaWYocHJlZ19tYXRjaCgnL15ccyoocHVibGljIHxwcml2YXRlIHxwcm90ZWN0ZWQgfHN0YXRpYyApKmZ1bmN0aW9uXHMrKFx3KykvJywkcm93LCRtKSkgJGZuW109YXJyYXkoJGkrMSx0cmltKCRyb3cpKTsKICRvWydmdW5rY2lqb3MnXT0kZm47CiAvKiBhciBrdXIgbm9ycyBtaW5pbWEga2FpbmEgYXBza3JpdGFpICovCiAkYz1pbXBsb2RlKCcnLCRMKTsKIGZvcmVhY2goYXJyYXkoJ19wcmljZScsJ19yZWd1bGFyX3ByaWNlJywnX3NhbGVfcHJpY2UnLCdQZXRzaG9wX1ByaWNpbmcnLCdjYWxjdWxhdGVfZmluYWxfcHJpY2UnLCdwcmV2aWV3X3ByaWNlJywnbWFudWFsX3ByaWNlX292ZXJyaWRlJykgYXMgJHopCiAgICRvWyd6b2R6aWFpJ11bJHpdPXN1YnN0cl9jb3VudCgkYywkeik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'K980'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  const r=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
  return r.status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
try{
  const s=await snip('TEMP K980',B64);
  out.snip=s;
  await new Promise(r=>setTimeout(r,7000));
  const r=await fetch(WP+'/?ps_k980=K980');
  out.http=r.status;
  const t=await r.text();
  out.ilgis=t.length;
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('k980.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'k980 vf kaina');
