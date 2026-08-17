process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2Y5MjYnXSk/JF9HRVRbJ3BzX2Y5MjYnXTonJykhPT0nSU5GTycpIHJldHVybjsKICRvPWFycmF5KCd2Jz0+J0Y5MjYnKTsKIGZvcmVhY2goYXJyYXkoMzQ5MzIsMzQ5MzMsMzQ5MzQsMzQ5MzUsMzQ5MzYsMzQ5MzcpIGFzICRwaWQpewogICAkcD13Y19nZXRfcHJvZHVjdCgkcGlkKTsKICAgJG9bJ3AnXVskcGlkXT1hcnJheSgKICAgICAncGF2Jz0+JHA/bWJfc3Vic3RyKCRwLT5nZXRfbmFtZSgpLDAsNDApOic/JywKICAgICAndGlwYXMnPT4kcD8kcC0+Z2V0X3R5cGUoKTonPycsCiAgICAgJ21hdG9tdW1hcyc9PiRwPyRwLT5nZXRfY2F0YWxvZ192aXNpYmlsaXR5KCk6Jz8nLAogICAgICdudW9yb2RhJz0+Z2V0X3Blcm1hbGluaygkcGlkKSwKICAgICAnYnVzZW5hJz0+Z2V0X3Bvc3Rfc3RhdHVzKCRwaWQpLAogICAgICdwZXJrYW1hJz0+JHA/JHAtPmlzX3B1cmNoYXNhYmxlKCk6bnVsbCwKICAgICAneXJhX3NhbmRlbHlqZSc9PiRwPyRwLT5pc19pbl9zdG9jaygpOm51bGwsCiAgICk7CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'F926'};
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
  const s=await snip('TEMP F926',B64);
  await new Promise(r=>setTimeout(r,6000));
  const t=await (await fetch(WP+'/?ps_f926=INFO')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,500); }
  await off(s);
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('f926.json', Buffer.from(JSON.stringify(out)), 'f926 nuorodos');
