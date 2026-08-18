process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2c4OTQnXSk/JF9HRVRbJ3BzX2c4OTQnXTonJykgIT09ICdHODk0JykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDkwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0c4OTQnKTsKCiBpZighY2xhc3NfZXhpc3RzKCdQZXRzaG9wX1BpbG51bWFzJykpeyAkb1snTlVUUkFVS1RBJ109J2tsYXNlIG5lcmFzdGEnOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogJHJtPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX1BpbG51bWFzJywncGVyc2thaWNpdW90aScpOwogJHBhcj1hcnJheSgpOyBmb3JlYWNoKCRybS0+Z2V0UGFyYW1ldGVycygpIGFzICRwKSAkcGFyW109JHAtPmdldE5hbWUoKS4oJHAtPmlzT3B0aW9uYWwoKT8nPyc6JycpOwogJG9bJ3BhcmFzYXMnXT1hcnJheSgndmFyZGFzJz0+J3BlcnNrYWljaXVvdGknLCdwYXJhbWV0cmFpJz0+JHBhciwnc3RhdGljJz0+JHJtLT5pc1N0YXRpYygpPzE6MCk7CgogJGlkcz1hcnJheSgxNDk5MCwxNDk5MywxNTAyMSwxNTAyNCwxNTA3NSwxNTExMywxNTExOSwxNTE3NSwxNTE4MSwxNTE4NCwxNTE4NywxNTE5MCwxNTE5MywxNTE5NiwxNTE5OSwxNTIxMSwxNTIxNCwxNTM4NSwxNTM4OCwxNTM5MSwxNTM5NCwxNTQwNiwxNTQwOSwxNTQ3NCwxNTQ4NCwxNTU0NywxNTU1MCwxNTU2NSwxNjk3MCwxNjk3MywxNzQzMCwxNzQzNCwxODY2NSwxODY2NywxODY2OSwxODY3MSwxODY3NCwxODY3NiwxODY3OSwxODcwNCwxODcwNywxODcxNSwxODcxNywxODcxOSk7CiAkb1sncHJpZXMnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdG1ldGEgbSBKT0lOIHskUH1wb3N0cyBwIE9OIHAuSUQ9bS5wb3N0X2lkCiAgIFdIRVJFIG0ubWV0YV9rZXk9J19wc19waWxudW1hc19rb2RhaScgQU5EIG0ubWV0YV92YWx1ZSBMSUtFICclfGFwcmFzeW1hc3wlJyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCciKTsKCiAkb2s9MDsgJGtsPWFycmF5KCk7CiBmb3JlYWNoKCRpZHMgYXMgJGlkKXsKICAgdHJ5eyBQZXRzaG9wX1BpbG51bWFzOjpwZXJza2FpY2l1b3RpKChpbnQpJGlkKTsgJG9rKys7IH0KICAgY2F0Y2goXFRocm93YWJsZSAkZSl7IGlmKGNvdW50KCRrbCk8NSkgJGtsW109JGlkLic6ICcuJGUtPmdldE1lc3NhZ2UoKTsgfQogfQogJG9bJ3BlcnNrYWljaXVvdGEnXT0kb2s7ICRvWydrbGFpZG9zJ109JGtsOwoKICRvWydwbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1wb3N0bWV0YSBtIEpPSU4geyRQfXBvc3RzIHAgT04gcC5JRD1tLnBvc3RfaWQKICAgV0hFUkUgbS5tZXRhX2tleT0nX3BzX3BpbG51bWFzX2tvZGFpJyBBTkQgbS5tZXRhX3ZhbHVlIExJS0UgJyV8YXByYXN5bWFzfCUnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyIpOwogZm9yZWFjaChhcnJheSgxNDk5MCwxNTExMywxODcxOSkgYXMgJGlkKXsKICAgJG9bJ3p5bW9zJ11bJGlkXT1hcnJheSgnYmFsYXMnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3BzX3BpbG51bWFzJyx0cnVlKSwKICAgICAna29kYWknPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3BzX3BpbG51bWFzX2tvZGFpJyx0cnVlKSwKICAgICAndHJ1a3N0YSc9PmdldF9wb3N0X21ldGEoJGlkLCdfcHNfcGlsbnVtYXNfdHJ1a3N0YScsdHJ1ZSkpOwogfQogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7';
const out={versija:'G894'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
try{
  const s=await snip('TEMP G894 pilnumo perskaiciavimas',B64);
  await new Promise(r=>setTimeout(r,8000));
  const t=await (await fetch(WP+'/?ps_g894=G894')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,600); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/g894.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g894 pilnumas');
