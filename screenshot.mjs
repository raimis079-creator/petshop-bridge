process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2c4OTcnXSk/JF9HRVRbJ3BzX2c4OTcnXTonJykgIT09ICdHODk3JykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidHODk3Jyk7CiAkZj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXBpbG51bWFzLnBocCc7CiAkcz1maWxlX2dldF9jb250ZW50cygkZik7CiAkb1sncGlsbnVtYXMnXT1hcnJheSgnbWQ1Jz0+bWQ1KCRzKSwnZHlkaXMnPT5zdHJsZW4oJHMpLCdiNjQnPT5iYXNlNjRfZW5jb2RlKGd6ZW5jb2RlKCRzLDYpKSk7CiAvKiBrdXIgZGFyIGd5dmVuYSAxMjAgKi8KICRrdD1hcnJheSgpOwogZm9yZWFjaChhcnJheShXUE1VX1BMVUdJTl9ESVIsV1BfUExVR0lOX0RJUikgYXMgJGIpewogICAkcmlpPW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkYikpOwogICBmb3JlYWNoKCRyaWkgYXMgJHgpewogICAgIGlmKCR4LT5pc0RpcigpfHxzdWJzdHIoJHgtPmdldEZpbGVuYW1lKCksLTQpIT09Jy5waHAnKSBjb250aW51ZTsKICAgICAkYz1AZmlsZV9nZXRfY29udGVudHMoJHgtPmdldFBhdGhuYW1lKCkpOwogICAgIGlmKCRjPT09ZmFsc2UpIGNvbnRpbnVlOwogICAgIGZvcmVhY2goZXhwbG9kZSgiXG4iLCRjKSBhcyAkaT0+JEwpewogICAgICAgaWYocHJlZ19tYXRjaCgnLyg+PXw+fDx8PD0pXHMqMTIwXGIvJywkTCkgJiYgcHJlZ19tYXRjaCgnL3N0cmxlbnxhcHJhc3ltfGFwcmFzL2knLCRMKSl7CiAgICAgICAgICRrdFtdPWFycmF5KCdmJz0+c3RyX3JlcGxhY2UoYXJyYXkoV1BNVV9QTFVHSU5fRElSLFdQX1BMVUdJTl9ESVIpLCcnLCR4LT5nZXRQYXRobmFtZSgpKSwnbnInPT4kaSsxLCdrb2Rhcyc9PnRyaW0oc3Vic3RyKCRMLDAsMTUwKSkpOwogICAgICAgfQogICAgIH0KICAgfQogfQogJG9bJ2t1cl8xMjAnXT0ka3Q7CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'G897'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
try{
  const s=await snip('TEMP G897 pilnumo pull',B64);
  await new Promise(r=>setTimeout(r,8000));
  const t=await (await fetch(WP+'/?ps_g897=G897')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/g897.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g897');
