process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2c4OTYnXSk/JF9HRVRbJ3BzX2c4OTYnXTonJykgIT09ICdHODk2JykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidHODk2Jyk7CgogLyogcGlsbnVtbyBmYWlsZToga2FpcCB0aWtyaW5hbWFzICdhcHJhc3ltYXMnICovCiAkUz1maWxlX2dldF9jb250ZW50cyhXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXBpbG51bWFzLnBocCcpOyAkTD1leHBsb2RlKCJcbiIsJFMpOwogJGg9YXJyYXkoKTsKIGZvcmVhY2goJEwgYXMgJGk9PiR4KXsKICAgaWYoc3RycG9zKCR4LCdwc2RwX3NwbGl0JykhPT1mYWxzZSB8fCBwcmVnX21hdGNoKCIvJ2FwcmFzeW1hcydccyo9Pi8iLCR4KSB8fCBzdHJwb3MoJHgsJ3Nla2NpaicpIT09ZmFsc2UpewogICAgICRjdHg9YXJyYXkoKTsgZm9yKCRqPW1heCgwLCRpLTUpOyRqPD1taW4oY291bnQoJEwpLTEsJGkrMTApOyRqKyspICRjdHhbXT0oJGorMSkuJzogJy50cmltKHN1YnN0cigkTFskal0sMCwxNDApKTsKICAgICAkaFtdPWFycmF5KCducic9PiRpKzEsJ2N0eCc9PiRjdHgpOwogICB9CiB9CiAkb1sncGlsbnVtb192aWV0b3MnXT1hcnJheV9zbGljZSgkaCwtNik7CgogLyogYXIgZnVua2NpamEgZWd6aXN0dW9qYSBpciBrYSBncmF6aW5hIG11c3UgdGVrc3RhbXMgKi8KICRvWydwc2RwX3NwbGl0X3lyYSddPWZ1bmN0aW9uX2V4aXN0cygncHNkcF9zcGxpdCcpPzE6MDsKIGlmKGZ1bmN0aW9uX2V4aXN0cygncHNkcF9zcGxpdCcpKXsKICAgJHJmPW5ldyBSZWZsZWN0aW9uRnVuY3Rpb24oJ3BzZHBfc3BsaXQnKTsKICAgJG9bJ3BzZHBfcGFyYXNhcyddPWFycmF5KCdwYXJhbWV0cmFpJz0+YXJyYXlfbWFwKGZ1bmN0aW9uKCRwKXtyZXR1cm4gJHAtPmdldE5hbWUoKTt9LCRyZi0+Z2V0UGFyYW1ldGVycygpKSwKICAgICAnZmFpbGFzJz0+c3RyX3JlcGxhY2UoQUJTUEFUSCwnJywkcmYtPmdldEZpbGVOYW1lKCkpLCdlaWx1dGUnPT4kcmYtPmdldFN0YXJ0TGluZSgpKTsKICAgZm9yZWFjaChhcnJheSgxNDk5MCwxNTExMywxODcxOSkgYXMgJGlkKXsKICAgICAkYz1nZXRfcG9zdF9maWVsZCgncG9zdF9jb250ZW50JywkaWQpOwogICAgICRyPXBzZHBfc3BsaXQoJGMpOwogICAgICRvWydza2FpZHltYXMnXVskaWRdPWFycmF5KCdpbGdpcyc9Pm1iX3N0cmxlbigkYyksCiAgICAgICAncmFrdGFpJz0+aXNfYXJyYXkoJHIpP2FycmF5X2tleXMoJHIpOmdldHR5cGUoJHIpLAogICAgICAgJ2FwcmFzeW1vX2lsZ2lzJz0+aXNfYXJyYXkoJHIpJiZpc3NldCgkclsnYXByYXN5bWFzJ10pP21iX3N0cmxlbihpc19zdHJpbmcoJHJbJ2FwcmFzeW1hcyddKT8kclsnYXByYXN5bWFzJ106anNvbl9lbmNvZGUoJHJbJ2FwcmFzeW1hcyddKSk6bnVsbCwKICAgICAgICdwaWxuYXMnPT5pc19hcnJheSgkcik/YXJyYXlfbWFwKGZ1bmN0aW9uKCR2KXtyZXR1cm4gaXNfc3RyaW5nKCR2KT9tYl9zdWJzdHIoJHYsMCw2MCk6Z2V0dHlwZSgkdik7fSwkcik6bnVsbCk7CiAgIH0KIH0KICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'G896'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
try{
  const s=await snip('TEMP G896 psdp_split',B64);
  await new Promise(r=>setTimeout(r,8000));
  const t=await (await fetch(WP+'/?ps_g896=G896')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/g896.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g896');
