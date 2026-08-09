process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfcGFiJ10pIHx8ICgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BhYjN6OScpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7CiAgJG91dD1bJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKV07CiAgJG91dFsnbW9kdWxpYWknXT1bCiAgICAna2F0YWxvZ2FzJz0+Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX0thdGFsb2dhcycpP1BldHNob3BfS2F0YWxvZ2FzOjpWRVJTSUpBOiduZXJhJywKICAgICdpdnlraWFpJz0+Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX0l2eWtpYWknKT9QZXRzaG9wX0l2eWtpYWk6OlZFUlNJSkE6J25lcmEnLAogICAgJ3BhcmRhdmltYWknPT5jbGFzc19leGlzdHMoJ1BldHNob3BfUGFyZGF2aW1haScpP1BldHNob3BfUGFyZGF2aW1haTo6VkVSU0lKQTonbmVyYScsCiAgICAncGlsbnVtYXMnPT5jbGFzc19leGlzdHMoJ1BldHNob3BfUGlsbnVtYXMnKT9QZXRzaG9wX1BpbG51bWFzOjpWRVJTSUpBOiduZXJhJywKICAgICdyeXNpYWknPT5jbGFzc19leGlzdHMoJ1BldHNob3BfUnlzaWFpJyk/UGV0c2hvcF9SeXNpYWk6OlZFUlNJSkE6J25lcmEnLAogICAgJ3NvdXJjZXMnPT5jbGFzc19leGlzdHMoJ1BldHNob3BfU291cmNlcycpP1BldHNob3BfU291cmNlczo6VkVSU0lKQTonbmVyYScsCiAgXTsKICAkb3V0WydpdnlraXVfbGVudGVsZWplJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wcmVmaXh9cHNfaXZ5a2lhaSIpOwogICRvdXRbJ3N1X3BhcmRhdmltdV9tZXRhJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wb3N0bWV0YX0gV0hFUkUgbWV0YV9rZXk9J19wc19zYWxlc191cGRhdGVkJyIpOwogICRvdXRbJ3N1X3BpbG51bXUnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBtZXRhX2tleT0nX3BzX3BpbG51bWFzJyIpOwogICRvdXRbJ3NhbmRlbGlzX3V6cGlsZHl0YXMnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBtZXRhX2tleT0nX3BzX3NhbmRlbGlzJyBBTkQgbWV0YV92YWx1ZTw+JyciKTsKICAkY3I9Z2V0X29wdGlvbignY3JvbicpOyAkYz1bXTsKICBmb3JlYWNoKChhcnJheSkkY3IgYXMgJHRzPT4kaCl7IGlmKCFpc19hcnJheSgkaCkpIGNvbnRpbnVlOyBmb3JlYWNoKCRoIGFzICRrPT4keCl7IGlmKHN0cnBvcygkaywncHNfJyk9PT0wfHxzdHJwb3MoJGssJ3BldHNob3AnKT09PTApICRjWyRrXT1kYXRlKCdtLWQgSDppJywkdHMpOyB9IH0KICBrc29ydCgkYyk7ICRvdXRbJ2Nyb24nXT0kYzsKICAkb3V0Wydha3R5dnVzX3RlbXAnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lIEZST00geyR3cGRiLT5wcmVmaXh9c25pcHBldHMgV0hFUkUgYWN0aXZlPTEgQU5EIG5hbWUgTElLRSAnVEVNUCUnIiwgQVJSQVlfQSk7CiAgJG91dFsnYWt0eXZ1c19zbmlwcGV0YWknXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBXSEVSRSBhY3RpdmU9MSIpOwogICRvdXRbJ2tvcGlqb3MnXT1bXTsKICBmb3JlYWNoKFsncHNfa2F0YWxvZ2FzX3YyOF9iYWsnLCdwc19rYXRhbG9nYXNfdjI5X2JhaycsJ3BzX2thdGFsb2dhc192MzJfYmFrJywncHNfa2F0YWxvZ2FzX3YzM19iYWsnLCdwc19rYXRhbG9nYXNfdjM0X2JhayddIGFzICRvKXsKICAgICR2PWdldF9vcHRpb24oJG8pOyBpZigkdikgJG91dFsna29waWpvcyddWyRvXT1zdHJsZW4oYmFzZTY0X2RlY29kZSgkdikpLicgQic7CiAgfQogIHdwX3NlbmRfanNvbigkb3V0KTsKfSk7Cg==','base64').toString();
async function putResult(path, obj){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:`pabaiga`, content:Buffer.from(JSON.stringify(obj,null,2)).toString('base64')};
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
    body:JSON.stringify({name:'TEMP pabaiga', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  if(!s.id){ out.klaida='nesukurtas'; await putResult('analize/pabaiga.json',out); return; }
  await new Promise(x=>setTimeout(x,2500));
  const resp=await fetch(`${WP}/?ps_pab=1&k=pab3z9`,{headers:{Authorization:AUTH}});
  try{ out.rez=JSON.parse(await resp.text()); }catch(e){ out.raw='nejson'; }
  await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  const h=await fetch(`${WP}/`,{headers:{Authorization:AUTH}}); out.svetaine=h.status;
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const l2=await r.json();
  out.likę_temp=(Array.isArray(l2)?l2:[]).filter(x=>x.active&&/^TEMP/i.test(x.name||'')).map(x=>x.id);
  await putResult('analize/pabaiga.json', out);
}
main().catch(async e=>{ await putResult('analize/pabaiga.json',{klaida:String(e)}); });
