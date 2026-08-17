process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3N2J10pPyRfR0VUWydwc19zdiddOicnKSE9PSdERVA4NjEnKSByZXR1cm47CiBAc2V0X3RpbWVfbGltaXQoNjAwKTsKIGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nREVQODYxJywndHMnPT5kYXRlKCdZLW0tZCBIOmk6cycpKTsKICR1cmw9J2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9yYWltaXMwNzktY3JlYXRvci9wZXRzaG9wLWJyaWRnZS9tYWluL2RlcGxveS9wZXRzaG9wLWthdGFsb2dhcy5waHAnOwogJHI9d3BfcmVtb3RlX2dldCgkdXJsLCBhcnJheSgndGltZW91dCc9PjYwKSk7CiBpZiAoaXNfd3BfZXJyb3IoJHIpKSB7ICRvWydTVE9QJ109J2ZldGNoOiAnLiRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogJE49d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpOwogJG9bJ2dhdXRhJ109c3RybGVuKCROKTsgJG9bJ2dhdXRhX21kNSddPW1kNSgkTik7CiBpZiAoJG9bJ2dhdXRhX21kNSddIT09J2ZhYWFmZWIwMWQ5MzJhY2IzNDcyNjE2MTE0MjU0MDgyJykgeyAkb1snU1RPUCddPSdNRDUgbmVzdXRhbXBhJzsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KIHRyeSB7IEB0b2tlbl9nZXRfYWxsKCROLCBUT0tFTl9QQVJTRSk7IH0gY2F0Y2ggKFxQYXJzZUVycm9yICRlKSB7ICRvWydTVE9QJ109J1NJTlRBS1NFOiAnLiRlLT5nZXRNZXNzYWdlKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiAkZj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWthdGFsb2dhcy5waHAnOyAkc2VuYT1maWxlX2dldF9jb250ZW50cygkZik7CiAkb1snc2VuYV9tZDUnXT1tZDUoJHNlbmEpOwogaWYgKCRvWydzZW5hX21kNSddIT09Jzg5NzlhYjhmNmE1MWFkNzIyZTE2MmQ4ZTAwM2YxNDU5JykgeyAkb1snU1RPUCddPSdTRU5BUyBmYWlsYXMgbmUgdGFzJzsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KIEB3cF9ta2Rpcl9wKFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wcy1iYWNrdXBzJyk7CiBAZmlsZV9wdXRfY29udGVudHMoV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cHMvcGV0c2hvcC1rYXRhbG9nYXMucGhwLnY4NmEuJy5nbWRhdGUoJ1ltZC1IaXMnKS4nLmJhaycsICRzZW5hKTsKIGZpbGVfcHV0X2NvbnRlbnRzKCRmLCAkTik7IGNsZWFyc3RhdGNhY2hlKHRydWUsJGYpOwogJG9bJ2lyYXN5dGEnXT0obWQ1X2ZpbGUoJGYpPT09bWQ1KCROKSk/J0lESUVHVEEnOidORVNVVEFNUEEnOwogZGVsZXRlX3RyYW5zaWVudCgncHNfa2F0X2R1b21lbnlzJyk7CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'DEP861'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
  const s=await snip('TEMP DEP861',B64);
  await new Promise(r=>setTimeout(r,6000));
  const t=await (await fetch(WP+'/?ps_sv=DEP861')).text();
  try{ out.rez=JSON.parse(t); }catch(e){ out.raw=t.slice(0,1500); }
  await off(s);
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('dep861.json', Buffer.from(JSON.stringify(out)), 'dep861');
console.log('ok');
