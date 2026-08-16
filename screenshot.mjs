process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3AwJ10pID8gJF9HRVRbJ3BzX3AwJ10gOiAnJykgIT09ICdSRUMxJykgcmV0dXJuOwogJG89YXJyYXkoJ3YnPT4nUDBQLVJFQycpOwogJGs9QGZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtbTgtZm9vZC5waHAnKTsKIGlmICgkaykgewogICAvKiBjYW5kaWRhdGVzIGZ1bmtjaWpvcyBrdW5hcyAqLwogICBpZiAocHJlZ19tYXRjaCgnL2Z1bmN0aW9uXHMrY2FuZGlkYXRlc1xzKlwoW14pXSpcKVxzKlx7LycsJGssJG0sUFJFR19PRkZTRVRfQ0FQVFVSRSkpIHsKICAgICAkc3Q9JG1bMF1bMV07ICRvWydjYW5kaWRhdGVzX2t1bmFzJ109c3Vic3RyKCRrLCRzdCwzNTAwKTsKICAgfQogICBpZiAocHJlZ19tYXRjaF9hbGwoJy9jb25zdFxzKyhcdypWRVJcdyp8XHcqVkVSU0lPTlx3Kilccyo9XHMqKFteO10rKTsvaScsJGssJHZtLFBSRUdfU0VUX09SREVSKSkgewogICAgIGZvcmVhY2goJHZtIGFzICR2KXsgJG9bJ3ZlcnNpam9zJ11bXT0kdlsxXS4nPScudHJpbSgkdlsyXSk7IH0KICAgfQogfQogLyogcmVmaWxsIGluZnJhc3RydWt0dXJhICovCiAkb1sncmVmaWxsJ109YXJyYXkoKTsKIGZvcmVhY2ggKGFycmF5KFdQTVVfUExVR0lOX0RJUiwgV1BfQ09OVEVOVF9ESVIuJy9wbHVnaW5zL3BldHNob3AtY29yZS9pbmNsdWRlcycsIFdQX0NPTlRFTlRfRElSLicvcGx1Z2lucy9wZXRzaG9wLWVzcC9pbmNsdWRlcycpIGFzICRkaXIpIHsKICAgZm9yZWFjaCAoKGFycmF5KUBzY2FuZGlyKCRkaXIpIGFzICRmKSB7CiAgICAgaWYgKHN1YnN0cigkZiwtNCkhPT0nLnBocCcpIGNvbnRpbnVlOwogICAgICRraz1AZmlsZV9nZXRfY29udGVudHMoJGRpci4nLycuJGYpOyBpZighJGtrKSBjb250aW51ZTsKICAgICBpZiAoc3RyaXBvcygka2ssJ3JlZmlsbCcpPT09ZmFsc2UpIGNvbnRpbnVlOwogICAgICRpbmY9YXJyYXkoKTsKICAgICBpZiAocHJlZ19tYXRjaF9hbGwoIi9kb19hY3Rpb25cKFxzKicoW14nXSpyZWZpbGxbXiddKiknL2kiLCRraywkZG0pKSAkaW5mWydkb19hY3Rpb25zJ109YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkZG1bMV0pKTsKICAgICBpZiAocHJlZ19tYXRjaF9hbGwoJy9mdW5jdGlvblxzKyhcdypyZWZpbGxcdyopXHMqXCgvaScsJGtrLCRmbSkpICRpbmZbJ2ZuJ109YXJyYXlfc2xpY2UoYXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkZm1bMV0pKSwwLDEwKTsKICAgICBpZiAoc3RycG9zKCRraywncHNfcmVtaW5kZXJzJykhPT1mYWxzZSkgJGluZlsncHNfcmVtaW5kZXJzJ109MTsKICAgICBpZiAoc3RycG9zKCRraywncmVmaWxsX2R1ZScpIT09ZmFsc2UpICRpbmZbJ3JlZmlsbF9kdWVfdGVrc3RlJ109MTsKICAgICBpZiAoc3RycG9zKCRraywncmVtaW5kZXJfc2VudCcpIT09ZmFsc2UgfHwgc3RycG9zKCRraywncmVmaWxsX3JlbWluZGVyJykhPT1mYWxzZSkgJGluZlsncmVtaW5kZXJfc2VudF90ZWtzdGUnXT0xOwogICAgICRvWydyZWZpbGwnXVtiYXNlbmFtZSgkZGlyKS4nLycuJGZdPSRpbmY7CiAgIH0KIH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'P0P-1'};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p0p.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:'p0p rec recon',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p0p.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
try{
  // 1. isjungiam visus likusius TEMP snippetus
  const lst=await api('/wp-json/code-snippets/v1/snippets');
  let arr=[]; try{arr=JSON.parse(lst.t);}catch(e){}
  out.temp_isjungta=[];
  for(const s of arr){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); out.temp_isjungta.push(s.id); } }
  // 2. recon snippetas
  const code=Buffer.from(B64,'base64').toString('utf8');
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP P0P REC',code,scope:'global',active:true,priority:5})});
  let id=null; try{id=JSON.parse(cr.t).id;}catch(e){ out.snip_err=cr.t.slice(0,200); }
  out.snip_id=id;
  await new Promise(r=>setTimeout(r,6000));
  try{ const r=await fetch(WP+'/?ps_p0=REC1'); const tx=await r.text(); out.rez=JSON.parse(tx); }catch(e){ out.e=String(e).slice(0,300); }
  if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})});
}catch(e){ out.bendra=String(e).slice(0,300); }
await irasyk();
console.log('ok');
