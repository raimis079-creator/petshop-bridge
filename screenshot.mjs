process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3I5NTEnXSk/JF9HRVRbJ3BzX3I5NTEnXTonJykhPT0nUjk1MScpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgzMDApOwogJG89YXJyYXkoJ3YnPT4nUjk1MScpOwogJHA9V1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sL3BldHNob3AteG1sLnBocCc7CiBpZighaXNfcmVhZGFibGUoJHApKXsgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgna2xhaWRhJz0+J25lcmEnKSk7IGV4aXQ7IH0KICRMPWZpbGUoJHApOyAkb1snZWlsdWNpdSddPWNvdW50KCRMKTsKIC8qIGFudHJhc3RlcyBrb21lbnRhcmFzIGFwaWUgc2tpcC1iZWZvcmUtY3JlYXRlICovCiAkb1snYW50cmFzdGUnXT1pbXBsb2RlKCcnLGFycmF5X3NsaWNlKCRMLDMwLDE0MCkpOwogLyogZnVua2Npam9zICovCiAkZj1hcnJheSgpOwogZm9yZWFjaCgkTCBhcyAkaT0+JHJvdyl7CiAgIGlmKHByZWdfbWF0Y2goJy9mdW5jdGlvblxzKyhcdyooYmxvY2t8ZXhjbHVkZWR8c2tpcHxsZWdhY3kpXHcqKVxzKlwoL2knLCRyb3csJG0pKSAkZltdPWFycmF5KCRpKzEsdHJpbSgkcm93KSwkbVsxXSk7CiB9CiAkb1snZnVua2Npam9zJ109JGY7CiAvKiBpc19leGNsdWRlZF9icmFuZCBpciBibG9ja192Zl9jcmVhdGUga3VuYWkgKi8KIGZvcmVhY2goJGYgYXMgJHgpewogICAkb1sna29kYXMnXVskeFsyXV09aW1wbG9kZSgnJyxhcnJheV9zbGljZSgkTCwkeFswXS0xLDYwKSk7CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'R951'};
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
  const s=await snip('TEMP R951',B64);
  await new Promise(r=>setTimeout(r,6000));
  const r=await fetch(WP+'/?ps_r951=R951');
  const buf=Buffer.from(await r.arrayBuffer());
  out.baitai=buf.length;
  const zlib=await import('zlib');
  out.put=await put('r951.json.gz', zlib.gzipSync(buf), 'r950');
  await off(s);
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('r951.json', Buffer.from(JSON.stringify(out)), 'r950 meta');
