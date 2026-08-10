process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfa3VyJ10pIHx8ICgkX0dFVFsnayddID8/ICcnKSAhPT0gJ2tyM204eicpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7CiAgJG91dD1bJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKV07CiAgLy8ga29raWUgbWV0YSByYWt0YWkgc3VzaWplIHN1IGt1cmplcml1CiAgJG91dFsnbWV0YV9yYWt0YWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtZXRhX2tleSwgQ09VTlQoKikgYywKICAgIFNVTShDQVNFIFdIRU4gbWV0YV92YWx1ZSBJTiAoJ3llcycsJzEnLCd0YWlwJykgVEhFTiAxIEVMU0UgMCBFTkQpIHRlaWdpYW11CiAgICBGUk9NIHskd3BkYi0+cG9zdG1ldGF9CiAgICBXSEVSRSBtZXRhX2tleSBMSUtFICcla3VyamVyJScgT1IgbWV0YV9rZXkgTElLRSAnJWNvdXJpZXIlJyBPUiBtZXRhX2tleSBMSUtFICclcGFzdG9tYXQlJwogICAgICAgT1IgbWV0YV9rZXkgTElLRSAnJXRlcm1pbmFsJScgT1IgbWV0YV9rZXkgTElLRSAnJV9wc190aWslJwogICAgR1JPVVAgQlkgbWV0YV9rZXkgT1JERVIgQlkgYyBERVNDIExJTUlUIDEyIiwgQVJSQVlfQSk7CiAgLy8ga3VyIGtvZGUgbmF1ZG9qYW1hCiAgJG11PVtdOwogIGZvcmVhY2goZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpIGFzICRmKXsKICAgICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsKICAgIGZvcmVhY2goWydfcHNfdGlrX2t1cmplcml1JywnX3BldHNob3BfY291cmllcl9vbmx5JywnY291cmllcl9vbmx5JywndGlrX2t1cmplcml1J10gYXMgJHopewogICAgICBpZihzdHJwb3MoJGMsJHopIT09ZmFsc2UpewogICAgICAgICRsaW5lcz1leHBsb2RlKCJcbiIsJGMpOyAKICAgICAgICBmb3JlYWNoKCRsaW5lcyBhcyAkaT0+JEwpeyBpZihzdHJwb3MoJEwsJHopIT09ZmFsc2UpeyAkbXVbYmFzZW5hbWUoJGYpXVtdPSgkaSsxKS4nOiAnLnRyaW0obWJfc3Vic3RyKCRMLDAsMTEwKSk7IH0gfQogICAgICB9CiAgICB9CiAgfQogICRvdXRbJ211X2ZhaWxhaSddPWFycmF5X21hcChmdW5jdGlvbigkeCl7IHJldHVybiBhcnJheV9zbGljZSgkeCwwLDUpOyB9LCRtdSk7CiAgLy8gc25pcHBldGFpCiAgJG91dFsnc25pcHBldGFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cwogICAgV0hFUkUgKGNvZGUgTElLRSAnJWNvdXJpZXJfb25seSUnIE9SIGNvZGUgTElLRSAnJXRpa19rdXJqZXJpdSUnIE9SIGNvZGUgTElLRSAnJXBpY2t1cF9tZXRob2QlJykgTElNSVQgOCIsIEFSUkFZX0EpOwogIC8vIHNlcmltbyBsZW50ZWxlczogYXIgeXJhIGZ1bmtjaWphIHBhdGlrcmludGkKICAkb3V0WydzZXJpbW9fZnVua2Npam9zJ109W107CiAgZm9yZWFjaChbJ3BldHNob3BfZmNfZ2V0X3RhYmxlJywnUGV0c2hvcF9GZWVkaW5nJywncHNfZmVlZGluZ19yb3dzJ10gYXMgJGYpewogICAgJG91dFsnc2VyaW1vX2Z1bmtjaWpvcyddWyRmXT0oZnVuY3Rpb25fZXhpc3RzKCRmKXx8Y2xhc3NfZXhpc3RzKCRmKSk/J3lyYSc6J25lJzsKICB9CiAgJG91dFsncHNfZmVlZGluZ19sZW50ZWxlJ109JHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJ3skd3BkYi0+cHJlZml4fXBzX2ZlZWRpbmdfcm93cyciKT8neXJhJzonbmUnOwogIHdwX3NlbmRfanNvbigkb3V0KTsKfSk7Cg==','base64').toString();
async function putResult(path, obj){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:'kurj', content:Buffer.from(JSON.stringify(obj,null,2)).toString('base64')};
  if(sha) body.sha=sha;
  await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
}
async function main(){
  const out={};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await r.json();
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active && /^TEMP/i.test(s.name||''))){
    await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${t.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  }
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP kurj', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  if(!s.id){ out.klaida='nesukurtas'; await putResult('analize/kurj.json',out); return; }
  await new Promise(x=>setTimeout(x,2500));
  const resp=await fetch(`${WP}/?ps_kur=1&k=kr3m8z`,{headers:{Authorization:AUTH}});
  try{ out.rez=JSON.parse(await resp.text()); }catch(e){ out.raw='nejson'; }
  await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await putResult('analize/kurj.json', out);
}
main().catch(async e=>{ await putResult('analize/kurj.json',{klaida:String(e)}); });
