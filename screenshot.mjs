process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const D64=''; const V64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3AwJ10pID8gJF9HRVRbJ3BzX3AwJ10gOiAnJykgIT09ICdBUlBUJykgcmV0dXJuOwogJG89YXJyYXkoJ3YnPT4nQURNUkVQJyk7CiAkaz1AZmlsZV9nZXRfY29udGVudHMoV1BfQ09OVEVOVF9ESVIuJy9wbHVnaW5zL3BldHNob3AtY29yZS9pbmNsdWRlcy9jbGFzcy1hZG1pbi1yZXBvcnRzLnBocCcpOwogJG9bJ0InXT1zdHJsZW4oJGspOwogLyogcmVuZGVyKCkga3VuYXMg4oCUIHRlbiB2aXNvcyB0cnlzIHNla2Npam9zICovCiBpZiAocHJlZ19tYXRjaCgnL2Z1bmN0aW9uXHMrcmVuZGVyXHMqXChbXildKlwpXHMqXHsvJywkaywkbSxQUkVHX09GRlNFVF9DQVBUVVJFKSkgewogICAkb1sncmVuZGVyJ109c3Vic3RyKCRrLCRtWzBdWzFdLDkwMDApOwogfQogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'P0Z-1'};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p1m.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:'p0z ivykiai deploy+verify',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p1m.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
  const s2=await snip('TEMP P0Z VERIFY9',V64);
  await new Promise(r=>setTimeout(r,7000));
  try{ out.verify=JSON.parse(await (await fetch(WP+'/?ps_p0=ARPT')).text()); }catch(e){ out.e2=String(e).slice(0,300); }
  await off(s2);
}catch(e){ out.bendra=String(e).slice(0,300); }
await irasyk();
console.log('ok');
