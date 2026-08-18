process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2c4OTEnXSk/JF9HRVRbJ3BzX2c4OTEnXTonJykgIT09ICdHODkxJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0c4OTEnKTsKICRmPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Ata2F0YWxvZ2FzLnBocCc7CiAkUz1maWxlX2dldF9jb250ZW50cygkZik7ICRMPWV4cGxvZGUoIlxuIiwkUyk7CgogLyogdGlrc2xpICJCZSBhcHJhc3ltbyIgYXBpYnJlenRpcyAqLwogJGhpdHM9YXJyYXkoKTsKIGZvcmVhY2goJEwgYXMgJGk9PiR4KXsKICAgaWYocHJlZ19tYXRjaCgnL0JlIGFwcmF8YmVfYXByYXxza29sb3N8ZHVvbWVudV9za29sb3N8YmVfYXByYXN5bW98U0tPTE9TL2l1JywkeCkpewogICAgICRjdHg9YXJyYXkoKTsKICAgICBmb3IoJGo9bWF4KDAsJGktNik7JGo8PW1pbihjb3VudCgkTCktMSwkaSs4KTskaisrKSAkY3R4W109KCRqKzEpLic6ICcudHJpbShzdWJzdHIoJExbJGpdLDAsMTYwKSk7CiAgICAgJGhpdHNbXT1hcnJheSgnbnInPT4kaSsxLCdjdHgnPT4kY3R4KTsKICAgfQogfQogLyogaW1hbSB0aWsgdHVvcywga3VyIG5lcmEga29tZW50YXJvIHByYWR6aW9qZSAqLwogJHN3PWFycmF5KCk7CiBmb3JlYWNoKCRoaXRzIGFzICRoKXsgJHBpcm1hPXRyaW0oc3Vic3RyKCRMWyRoWyduciddLTFdLDAsNCkpOyBpZigkcGlybWEhPT0nKicgJiYgc3RycG9zKCRwaXJtYSwnKicpIT09MCAmJiBzdHJwb3MoJHBpcm1hLCcvLycpIT09MCkgJHN3W109JGg7IH0KICRvWydrb2RvX3ZpZXRvcyddPWFycmF5X3NsaWNlKCRzdywwLDEwKTsKICRvWyd2aXNvX2hpdHMnXT1jb3VudCgkaGl0cyk7ICRvWyduZV9rb21lbnRhcnVvc2UnXT1jb3VudCgkc3cpOwoKIC8qIGtva2llIG1ldGEgbGF1a2FpIG5hdWRvamFtaSBzZWtjaWpvbXMgKi8KICRtZXRhPWFycmF5KCk7CiBpZihwcmVnX21hdGNoX2FsbCgiLycoX3BzX1thLXowLTlfXSspJy8iLCAkUywgJG0pKSAkbWV0YT1hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRtWzFdKSk7CiAkb1sncHNfbWV0YV9rb2RlJ109YXJyYXlfc2xpY2UoJG1ldGEsMCw0MCk7CgogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'G891'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
try{
  const s=await snip('TEMP G891 be aprasymo apibreztis',B64);
  await new Promise(r=>setTimeout(r,8000));
  const t=await (await fetch(WP+'/?ps_g891=G891')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/g891.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g891');
