process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2c4OTInXSk/JF9HRVRbJ3BzX2c4OTInXTonJykgIT09ICdHODkyJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0c4OTInKTsKICRTPWZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Ata2F0YWxvZ2FzLnBocCcpOyAkTD1leHBsb2RlKCJcbiIsJFMpOwoKIC8qIGt1ciBza2FpY2l1b2phbWFzIHBpbG51bWFzICovCiAkZm49YXJyYXkoKTsKIGZvcmVhY2goJEwgYXMgJGk9PiR4KXsKICAgaWYocHJlZ19tYXRjaCgnL2Z1bmN0aW9uXHMrW2EtejAtOV9dKnBpbG51bVthLXowLTlfXSpccypcKC9pJywkeCkKICAgICAgfHwgcHJlZ19tYXRjaCgnL19wc19waWxudW1hc19rb2RhaS8nLCR4KQogICAgICB8fCBwcmVnX21hdGNoKCcvZnVuY3Rpb25ccytbYS16MC05X10qKHBlcnNrYWljaXVvfHNrYWljaXVvKVthLXowLTlfXSpccypcKC9pJywkeCkpewogICAgICRjdHg9YXJyYXkoKTsKICAgICBmb3IoJGo9bWF4KDAsJGktMik7JGo8PW1pbihjb3VudCgkTCktMSwkaSsxMik7JGorKykgJGN0eFtdPSgkaisxKS4nOiAnLnRyaW0oc3Vic3RyKCRMWyRqXSwwLDE1MCkpOwogICAgICRmbltdPWFycmF5KCducic9PiRpKzEsJ2N0eCc9PiRjdHgpOwogICB9CiB9CiAkb1sndmlldG9zJ109YXJyYXlfc2xpY2UoJGZuLDAsOCk7ICRvWyd2aXNvJ109Y291bnQoJGZuKTsKCiAvKiBrbGFzZXMgaXIgdmllc2kgbWV0b2RhaSAqLwogJGtsPWFycmF5KCk7CiBpZihwcmVnX21hdGNoX2FsbCgnL2NsYXNzXHMrKFtBLVphLXowLTlfXSspLycsJFMsJG0pKSAka2w9JG1bMV07CiAkb1sna2xhc2VzJ109JGtsOwogZm9yZWFjaCgka2wgYXMgJGMpewogICBpZihjbGFzc19leGlzdHMoJGMpKXsKICAgICAkcj1uZXcgUmVmbGVjdGlvbkNsYXNzKCRjKTsKICAgICAkbWV0PWFycmF5KCk7CiAgICAgZm9yZWFjaCgkci0+Z2V0TWV0aG9kcygpIGFzICRtbSl7IGlmKHN0cmlwb3MoJG1tLT5uYW1lLCdwaWxudW0nKSE9PWZhbHNlIHx8IHN0cmlwb3MoJG1tLT5uYW1lLCdza2FpYycpIT09ZmFsc2UpICRtZXRbXT0kbW0tPm5hbWUuJygnLiRtbS0+Z2V0TnVtYmVyT2ZQYXJhbWV0ZXJzKCkuJyknOyB9CiAgICAgaWYoJG1ldCkgJG9bJ21ldG9kYWknXVskY109JG1ldDsKICAgfQogfQogLyogZGFiYXJ0aW5lIGJ1c2VuYSBtYW5vIDQ0IHByZWtpdSAqLwogZm9yZWFjaChhcnJheSgxNDk5MCwxNTExMywxODcxOSkgYXMgJGlkKXsKICAgJG9bJ3p5bW9zJ11bJGlkXT1hcnJheSgncGlsbnVtYXMnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3BzX3BpbG51bWFzJyx0cnVlKSwKICAgICAna29kYWknPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3BzX3BpbG51bWFzX2tvZGFpJyx0cnVlKSwKICAgICAndHJ1a3N0YSc9PmdldF9wb3N0X21ldGEoJGlkLCdfcHNfcGlsbnVtYXNfdHJ1a3N0YScsdHJ1ZSkpOwogfQogJG9bJ3N1X2FwcmFzeW1vX3Nrb2xhJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBvc3RtZXRhIG0gSk9JTiB7JFB9cG9zdHMgcCBPTiBwLklEPW0ucG9zdF9pZAogICBXSEVSRSBtLm1ldGFfa2V5PSdfcHNfcGlsbnVtYXNfa29kYWknIEFORCBtLm1ldGFfdmFsdWUgTElLRSAnJXxhcHJhc3ltYXN8JScgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIik7CgogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'G892'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
try{
  const s=await snip('TEMP G892 pilnumas',B64);
  await new Promise(r=>setTimeout(r,8000));
  const t=await (await fetch(WP+'/?ps_g892=G892')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/g892.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g892');
