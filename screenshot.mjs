process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfcGFiMiddKSB8fCAoJF9HRVRbJ2snXSA/PyAnJykgIT09ICdwYjl4M2snKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOwogICRvdXQ9WydsYWlrYXMnPT5jdXJyZW50X3RpbWUoJ215c3FsJyldOwogICRvdXRbJ21vZHVsaWFpJ109W107CiAgZm9yZWFjaChbJ1BldHNob3BfS2F0YWxvZ2FzJywnUGV0c2hvcF9JdnlraWFpJywnUGV0c2hvcF9QYXJkYXZpbWFpJywnUGV0c2hvcF9QaWxudW1hcycsCiAgICAgICAgICAgJ1BldHNob3BfUnlzaWFpJywnUGV0c2hvcF9Tb3VyY2VzJywnUGV0c2hvcF9QYXJ0aWpvcycsJ1BldHNob3BfR2F2aW1hcycsJ1BldHNob3BfUGFyc2VyaXMnXSBhcyAkYyl7CiAgICAkb3V0Wydtb2R1bGlhaSddW3N0cl9yZXBsYWNlKCdQZXRzaG9wXycsJycsJGMpXT1jbGFzc19leGlzdHMoJGMpP2NvbnN0YW50KCRjLic6OlZFUlNJSkEnKTonbsSXcmEnOwogIH0KICBmb3JlYWNoKFsncGFfYmVfZ3J1ZHUnLCdwYV9tb25vcHJvdGVpbicsJ3BhX2JhbHR5bXVfc2FsdGluaXMnLCdwYV9hbXppdXMnLCdwYV9zcGVjaWFsaV9taXR5YmEnLCdwYV9neXZ1bm9fcnVzaXMnLCdwYV9wYWt1b3Rlc19keWRpcyddIGFzICR0KXsKICAgICRvdXRbJ2F0cmlidXRhaSddWyR0XT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgdHIub2JqZWN0X2lkKSBGUk9NIHskd3BkYi0+dGVybV9yZWxhdGlvbnNoaXBzfSB0cgogICAgICBJTk5FUiBKT0lOIHskd3BkYi0+dGVybV90YXhvbm9teX0gdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIEFORCB0dC50YXhvbm9teT0nJHQnCiAgICAgIElOTkVSIEpPSU4geyR3cGRiLT5wb3N0c30gcCBPTiBwLklEPXRyLm9iamVjdF9pZCBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCciKTsKICB9CiAgZm9yZWFjaChbJ2F2JywndmYnLCd6YiddIGFzICRzKXsKICAgICRpZHM9JHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwb3N0X2lkIEZST00geyR3cGRiLT5wb3N0bWV0YX0gV0hFUkUgbWV0YV9rZXk9J19wc19zYW5kZWxpcycgQU5EIG1ldGFfdmFsdWU9JXMiLCRzKSk7CiAgICBpZighJGlkcykgY29udGludWU7CiAgICAkaW49aW1wbG9kZSgnLCcsYXJyYXlfbWFwKCdpbnR2YWwnLCRpZHMpKTsKICAgICRvdXRbJ3BhZ2FsX3NhbmRlbGknXVskc109WwogICAgICAndmlzbyc9PmNvdW50KCRpZHMpLAogICAgICAnYmVfZ3J1ZHUnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgdHIub2JqZWN0X2lkKSBGUk9NIHskd3BkYi0+dGVybV9yZWxhdGlvbnNoaXBzfSB0ciBJTk5FUiBKT0lOIHskd3BkYi0+dGVybV90YXhvbm9teX0gdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIEFORCB0dC50YXhvbm9teT0ncGFfYmVfZ3J1ZHUnIFdIRVJFIHRyLm9iamVjdF9pZCBJTiAoJGluKSIpLAogICAgICAnYmFsdHltYXMnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgdHIub2JqZWN0X2lkKSBGUk9NIHskd3BkYi0+dGVybV9yZWxhdGlvbnNoaXBzfSB0ciBJTk5FUiBKT0lOIHskd3BkYi0+dGVybV90YXhvbm9teX0gdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIEFORCB0dC50YXhvbm9teT0ncGFfYmFsdHltdV9zYWx0aW5pcycgV0hFUkUgdHIub2JqZWN0X2lkIElOICgkaW4pIiksCiAgICBdOwogIH0KICAkej1nZXRfb3B0aW9uKCdwc19wYXJzZXJpb196dXJuYWxhcycsW10pOwogICRvdXRbJ3BhcnNlcmlvX3p1cm5hbGUnXT1jb3VudCgoYXJyYXkpJHopOwogICRvdXRbJ3BhcnRpanUnXT1jbGFzc19leGlzdHMoJ1BldHNob3BfUGFydGlqb3MnKT9QZXRzaG9wX1BhcnRpam9zOjpzdGF0aXN0aWthKCk6J27El3JhJzsKICAkb3V0WydpdnlraXUnXT1jbGFzc19leGlzdHMoJ1BldHNob3BfSXZ5a2lhaScpP1BldHNob3BfSXZ5a2lhaTo6c3RhdGlzdGlrYSgpWydpc192aXNvJ106J27El3JhJzsKICAkb3V0Wydha3R5dnVzX3RlbXAnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lIEZST00geyR3cGRiLT5wcmVmaXh9c25pcHBldHMgV0hFUkUgYWN0aXZlPTEgQU5EIG5hbWUgTElLRSAnVEVNUCUnIiwgQVJSQVlfQSk7CiAgJG91dFsndXpzYWt5bXUnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnByZWZpeH13Y19vcmRlcnMiKTsKICAkY3I9Z2V0X29wdGlvbignY3JvbicpOyAkYz1bXTsKICBmb3JlYWNoKChhcnJheSkkY3IgYXMgJHRzPT4kaCl7IGlmKCFpc19hcnJheSgkaCkpIGNvbnRpbnVlOyBmb3JlYWNoKCRoIGFzICRrPT4keCl7IGlmKHN0cnBvcygkaywncHNfJyk9PT0wKSAkY1ska109ZGF0ZSgnbS1kIEg6aScsJHRzKTsgfSB9CiAga3NvcnQoJGMpOyAkb3V0Wydjcm9uJ109JGM7CiAgd3Bfc2VuZF9qc29uKCRvdXQpOwp9KTsK','base64').toString();
async function putResult(path, obj){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:'pab2', content:Buffer.from(JSON.stringify(obj,null,2)).toString('base64')};
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
    body:JSON.stringify({name:'TEMP pab2', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  if(!s.id){ out.klaida='nesukurtas'; await putResult('analize/pab2.json',out); return; }
  await new Promise(x=>setTimeout(x,2500));
  const resp=await fetch(`${WP}/?ps_pab2=1&k=pb9x3k`,{headers:{Authorization:AUTH}});
  try{ out.rez=JSON.parse(await resp.text()); }catch(e){ out.raw='nejson'; }
  await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  const h=await fetch(`${WP}/`,{headers:{Authorization:AUTH}}); out.svetaine=h.status;
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const l2=await r.json();
  out.liko_temp=(Array.isArray(l2)?l2:[]).filter(x=>x.active&&/^TEMP/i.test(x.name||'')).map(x=>x.id);
  await putResult('analize/pab2.json', out);
}
main().catch(async e=>{ await putResult('analize/pab2.json',{klaida:String(e)}); });
