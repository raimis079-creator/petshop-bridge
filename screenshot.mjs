process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfZGlhZzMnXSkgfHwgKCRfR0VUWydrJ10gPz8gJycpICE9PSAnZHE3bTN6JykgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsKICAkb3V0PWFycmF5KCdWRVJTSUpBJz0+J0RJQUczJyk7CiAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIHBvc3RfaWQgRlJPTSB7JHdwZGItPnBvc3RtZXRhfQogICAgV0hFUkUgbWV0YV9rZXk9J19wc19waWxudW1hc19rb2RhaScgQU5EIG1ldGFfdmFsdWUgTElLRSAnJXxzdWRldGlzfCUnIExJTUlUIDgiKTsKICBmb3JlYWNoKCRpZHMgYXMgJHBpZCl7CiAgICAvKiBSQVcgdHVyaW55cyB0aWVzaWFpIGlzIERCIOKAlCBiZSBkaXNwbGF5IGtvbnRla3N0byAqLwogICAgJGM9JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwb3N0X2NvbnRlbnQgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBJRD0lZCIsJHBpZCkpOwogICAgJHN3ID0gZnVuY3Rpb25fZXhpc3RzKCdwc2RwX2NsZWFuJykgPyBwc2RwX2NsZWFuKCRjKSA6ICRjOwogICAgJGRhbHlzID0gZnVuY3Rpb25fZXhpc3RzKCdwc2RwX3NwbGl0JykgPyBwc2RwX3NwbGl0KCRzdykgOiBudWxsOwogICAgJHNlaz1hcnJheSgpOwogICAgaWYoaXNfYXJyYXkoJGRhbHlzKSl7CiAgICAgIGZvcmVhY2goJGRhbHlzIGFzICRkKXsKICAgICAgICBpZighaXNfYXJyYXkoJGQpfHwhaXNzZXQoJGRbMF0pKSBjb250aW51ZTsKICAgICAgICAkc2VrW109dHJpbSgoc3RyaW5nKSRkWzBdKS4nICgnLihpc3NldCgkZFsxXSk/bWJfc3RybGVuKHRyaW0od3Bfc3RyaXBfYWxsX3RhZ3MoKHN0cmluZykkZFsxXSkpKTowKS4nKSc7CiAgICAgIH0KICAgIH0KICAgICRwbGFpbj13cF9zdHJpcF9hbGxfdGFncygkYyk7CiAgICAkb3V0WydwcmVrZXMnXVtdPWFycmF5KAogICAgICAnaWQnPT4oaW50KSRwaWQsJ3Bhdic9Pm1iX3N1YnN0cihnZXRfdGhlX3RpdGxlKCRwaWQpLDAsMzQpLAogICAgICAnaWxnaXMnPT5tYl9zdHJsZW4oJHBsYWluKSwKICAgICAgJ3lyYV9zdWRldGlzX3Rla3N0ZSc9Pihib29sKXByZWdfbWF0Y2goJy9zdWRbZcSXXXQvaXUnLCRwbGFpbiksCiAgICAgICd5cmFfYW5hbGl0X3Rla3N0ZSc9Pihib29sKXByZWdfbWF0Y2goJy9hbmFsaXRpbi9pdScsJHBsYWluKSwKICAgICAgJ3lyYV9zZXJpbV90ZWtzdGUnPT4oYm9vbClwcmVnX21hdGNoKCcvW3PFoV1bZcSXXXJpbS9pdScsJHBsYWluKSwKICAgICAgJ3Nla2Npam9zJz0+JHNlaywKICAgICAgJ2hfdGFnYWknPT4oYm9vbClwcmVnX21hdGNoKCcvPGhbMS02XS9pJywkYyksCiAgICAgICdzdHJvbmcnPT4oYm9vbClwcmVnX21hdGNoKCcvPHN0cm9uZ3w8Yj4vaScsJGMpLAogICAgICAnZnJhZ21lbnRhcyc9Pm1iX3N1YnN0cigkcGxhaW4sMCwxNTApKTsKICB9CiAgd3Bfc2VuZF9qc29uKCRvdXQpOwp9KTsK','base64').toString();
async function jsonSafe(r){ const t=await r.text();
  const a=t.indexOf('['), o=t.indexOf('{');
  const i=(a>=0&&(a<o||o<0))?a:o; if(i<0) return null;
  try{ return JSON.parse(t.slice(i)); }catch(e){ return null; } }
async function putRaw(path,b64,msg){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:msg||'d2', content:b64}; if(sha) body.sha=sha;
  await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
}
const pause=ms=>new Promise(x=>setTimeout(x,ms));
async function main(){
  const out={};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await jsonSafe(r);
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active&&/^TEMP/i.test(s.name||''))){
    await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${t.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  }
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP d3', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await jsonSafe(r)||{};
  await pause(2500);
  const resp=await fetch(`${WP}/?ps_diag3=1&k=dq7m3z`,{headers:{Authorization:AUTH}});
  out.rez=await jsonSafe(resp);
  if(s.id) await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await putRaw('analize/diag3.json', Buffer.from(JSON.stringify(out,null,2)).toString('base64'),'d2');
}
main().catch(e=>{});
