process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2c5MjEnXSk/JF9HRVRbJ3BzX2c5MjEnXTonJykgIT09ICdHOTIxJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0c5MjEnKTsKICRpZHM9YXJyYXkoMTQ5MjksMTQ5MzIsMTQ5MzUsMTQ5NDUsMTQ5ODQsMTQ5ODcsMTQ5OTAsMTQ5OTMsMTUwMjEsMTUwNDUsMTUwNDgsMTUwNjYsMTUwNjksMTUwNzUsMTUwODQsMTUwOTAsMTUxMDQsMTUxNzUsMTUxNzgsMTUxODEsMTUxODQsMTUxODcsMTUxOTAsMTUxOTMsMTUxOTYsMTUxOTksMTUyMDUsMTUyOTcsMTUzODUsMTUzODgsMTUzOTEsMTU0MDMsMTU0MDksMTU0MTcsMTU0MjUsMTU0MjksMTU0NzQsMTU0NzgsMTU0ODEsMTU0ODQsMTU0OTMsMTU0OTYsMTU1MDIsMTU1MDgsMTU1MTEsMTU1MTUsMTU1MTgsMTU1MjEsMTU1MjcsMTU1MzUsMTU1MzksMTU1NDcsMTU1NTAsMTU1NjUsMTU1NzMsMTU1NzYsMTU1NzksMTU2NDUsMTU3NTQsMTU3NzQsMTU3ODAsMTU3OTIsMTU4MTIsMTU5NzYsMTYxMzIsMTYxNjIsMTYxOTMsMTYyNzMsMTY4OTIsMTY4OTUsMTY5MTgsMTczMDUsMTczNzIsMTc0MjcsMTc0MzAsMTc1NTUsMTc4MDgsMTc4MTQsMTc5MTIsMTgzNDQsMTgzNDYsMTg2NjksMTg2NzEsMTg2NzQsMTg2ODIsMTg3MTUsMTg3MTcsMTg3MjIsMTkyNjIsMzQ5NjcpOyAkZWlsPWFycmF5KCk7CiBmb3JlYWNoKCRpZHMgYXMgJGlkKXsKICAgJGlkPShpbnQpJGlkOyAkcG9zdD1nZXRfcG9zdCgkaWQpOwogICBpZighJHBvc3QpIGNvbnRpbnVlOwogICAkZWlsW109YXJyYXkoJ2lkJz0+JGlkLCdwYXYnPT4kcG9zdC0+cG9zdF90aXRsZSwKICAgICAnc2t1Jz0+KHN0cmluZylnZXRfcG9zdF9tZXRhKCRpZCwnX3NrdScsdHJ1ZSksCiAgICAgJ3Rla3N0YXMnPT50cmltKHdwX3N0cmlwX2FsbF90YWdzKGh0bWxfZW50aXR5X2RlY29kZSgoc3RyaW5nKSRwb3N0LT5wb3N0X2NvbnRlbnQsRU5UX1FVT1RFU3xFTlRfSFRNTDUsJ1VURi04JykpKSwKICAgICAndHJ1bXAnPT50cmltKHdwX3N0cmlwX2FsbF90YWdzKGh0bWxfZW50aXR5X2RlY29kZSgoc3RyaW5nKSRwb3N0LT5wb3N0X2V4Y2VycHQsRU5UX1FVT1RFU3xFTlRfSFRNTDUsJ1VURi04JykpKSk7CiB9CiAkb1sna2llayddPWNvdW50KCRlaWwpOwogJG9bJ2I2NCddPWJhc2U2NF9lbmNvZGUoZ3plbmNvZGUod3BfanNvbl9lbmNvZGUoJGVpbCksNikpOwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'G921'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
try{
  const s=await snip('TEMP G921 pilni tekstai',B64);
  await new Promise(r=>setTimeout(r,8000));
  const t=await (await fetch(WP+'/?ps_g921=G921')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/g921.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g921');
