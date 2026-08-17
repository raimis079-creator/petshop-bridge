process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3N2J10pPyRfR0VUWydwc19zdiddOicnKSE9PSdOU1JDJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidOU1JDJywndHMnPT5kYXRlKCdZLW0tZCBIOmk6cycpKTsKICRkaXI9V1BNVV9QTFVHSU5fRElSOyAkcmV6PWFycmF5KCk7CiBmb3JlYWNoIChnbG9iKCRkaXIuJy8qLnBocCcpIGFzICRmKSB7CiAgICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgJEw9ZXhwbG9kZSgiXG4iLCRzKTsKICAgZm9yZWFjaCAoJEwgYXMgJGk9PiRsbikgewogICAgIGlmIChwcmVnX21hdGNoKCIvX3BzX3NhbmRlbGlzLyIsJGxuKSAmJiBwcmVnX21hdGNoKCIvdXBkYXRlX3Bvc3RfbWV0YXwnQVYnfCdWRid8J1pCJ3xzdHJ0b3VwcGVyLyIsJGxuKSkgewogICAgICAgJHJleltdPWFycmF5KGJhc2VuYW1lKCRmKSwkaSsxLHRyaW0oc3Vic3RyKCRsbiwwLDE5MCkpKTsKICAgICB9CiAgIH0KIH0KICRvWydyYXN5dGEnXT0kcmV6OwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'NSRC'};
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
  const s=await snip('TEMP NSRC',B64);
  await new Promise(r=>setTimeout(r,6000));
  const t=await (await fetch(WP+'/?ps_sv=NSRC')).text();
  try{ out.rez=JSON.parse(t); }catch(e){ out.raw=t.slice(0,1500); }
  await off(s);
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('nsrc.json', Buffer.from(JSON.stringify(out)), 'nsrc');
console.log('ok');
