process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfdmFsJ10pIHx8ICgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3ZsMms3ZCcpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7CiAgJG91dD1bJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKV07CiAgJHRpZD0oaW50KWdldF9vcHRpb24oJ3BzX3Rlc3RfcHJvZHVjdF9pZCcpOwoKICAvLyAxLiBUZXN0aW5pYWkgdXpzYWt5bWFpIOKAlCBwZXIgSFBPUyBBUEkKICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgaWQgRlJPTSB7JHdwZGItPnByZWZpeH13Y19vcmRlcnMgV0hFUkUgYmlsbGluZ19lbWFpbD0ndGVzdGFzQHBldHNob3AubHQnIik7CiAgJG91dFsncmFzdGlfdXpzYWt5bWFpJ109JGlkczsKICBmb3JlYWNoKCRpZHMgYXMgJG9pZCl7CiAgICAkbz13Y19nZXRfb3JkZXIoJG9pZCk7CiAgICBpZigkbyl7ICRvLT5kZWxldGUodHJ1ZSk7IH0KICB9CiAgJG91dFsnbGlrb19wb190cnluaW1vJ109JHdwZGItPmdldF9jb2woIlNFTEVDVCBpZCBGUk9NIHskd3BkYi0+cHJlZml4fXdjX29yZGVycyBXSEVSRSBiaWxsaW5nX2VtYWlsPSd0ZXN0YXNAcGV0c2hvcC5sdCciKTsKCiAgLy8gMi4gUGFydGlqdSBpciBsaWt1Y2lvIGlzbHlnaW5pbWFzIHRlc3RpbmVpIHByZWtlaQogICRwcmllcz1QZXRzaG9wX1BhcnRpam9zOjpzdXRhcGltb19wYXRpa3JhKCR0aWQpOwogICRvdXRbJ1BSSUVTJ109JHByaWVzOwogIGlmKCEkcHJpZXNbJ3N1dGFtcGEnXSl7CiAgICAvLyBUZWlzaW5nYXMgc2FsdGluaXMgY2lhIOKAlCBQQVJUSUpPUzogam9zIHR1cmkgdGlrc2xpdSBpcmFzdSBpc3RvcmlqYS4KICAgIC8vIExpa3V0aXMgYnV2byBwYWtlaXN0YXMgdGVzdHUsIGt1cmllIHBhcnRpanUgbmVsaWV0xJcuCiAgICAkcHJvZD13Y19nZXRfcHJvZHVjdCgkdGlkKTsKICAgIGlmKCRwcm9kKXsgJHByb2QtPnNldF9tYW5hZ2Vfc3RvY2sodHJ1ZSk7ICRwcm9kLT5zZXRfc3RvY2tfcXVhbnRpdHkoJHByaWVzWydwYXJ0aWpvc2UnXSk7ICRwcm9kLT5zYXZlKCk7IH0KICAgIGVsc2UgeyB1cGRhdGVfcG9zdF9tZXRhKCR0aWQsUGV0c2hvcF9QYXJ0aWpvczo6YXZfbGF1a2FzKCR0aWQpLCRwcmllc1sncGFydGlqb3NlJ10pOyB9CiAgfQogIGNsZWFuX3Bvc3RfY2FjaGUoJHRpZCk7IHdwX2NhY2hlX2RlbGV0ZSgkdGlkLCdwb3N0X21ldGEnKTsKICAkb3V0WydQTyddPVBldHNob3BfUGFydGlqb3M6OnN1dGFwaW1vX3BhdGlrcmEoJHRpZCk7CiAgJG91dFsnc2F2aWthaW5hJ109UGV0c2hvcF9QYXJ0aWpvczo6c3ZlcnRpbmVfc2F2aWthaW5hKCR0aWQpOwoKICAvLyAzLiBLb250cm9sZTogYXIgc3V0YXBpbWFzIHZpc29zZSBBViBwcmVrZXNlIHN1IHBhcnRpam9taXMKICAkc3VfcGFydD0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIERJU1RJTkNUIHByb2R1Y3RfaWQgRlJPTSAiLlBldHNob3BfUGFydGlqb3M6OmxlbnRlbGUoKSk7CiAgJG5lc3V0YW1wYT1bXTsKICBmb3JlYWNoKCRzdV9wYXJ0IGFzICRwKXsKICAgICRjPVBldHNob3BfUGFydGlqb3M6OnN1dGFwaW1vX3BhdGlrcmEoKGludCkkcCk7CiAgICBpZighJGNbJ3N1dGFtcGEnXSkgJG5lc3V0YW1wYVtdPVsncGlkJz0+KGludCkkcCwnYXYnPT4kY1snYXYnXSwncGFydGlqb3NlJz0+JGNbJ3BhcnRpam9zZSddXTsKICB9CiAgJG91dFsndmlzb3Nfc3VfcGFydGlqb21pcyddPWNvdW50KCRzdV9wYXJ0KTsKICAkb3V0WyduZXN1dGFtcGEnXT0kbmVzdXRhbXBhOwoKICAvLyA0LiBCZW5kcmFzIF9zdG9jayB2cyBfdmZfcXR5CiAgJG91dFsnc3RvY2tfdnNfdmZxdHknXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBtMQogICAgSU5ORVIgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBtMiBPTiBtMi5wb3N0X2lkPW0xLnBvc3RfaWQgQU5EIG0yLm1ldGFfa2V5PSdfdmZfcXR5JwogICAgV0hFUkUgbTEubWV0YV9rZXk9J19zdG9jaycgQU5EIG0xLm1ldGFfdmFsdWUrMCA8PiBtMi5tZXRhX3ZhbHVlKzAiKTsKICAkb3V0Wyd1enNha3ltdV92aXNvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wcmVmaXh9d2Nfb3JkZXJzIik7CiAgd3Bfc2VuZF9qc29uKCRvdXQpOwp9KTsK','base64').toString();
async function putResult(path, obj){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:'valymas', content:Buffer.from(JSON.stringify(obj,null,2)).toString('base64')};
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
    body:JSON.stringify({name:'TEMP valymas', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  if(!s.id){ out.klaida='nesukurtas'; await putResult('analize/valymas.json',out); return; }
  await new Promise(x=>setTimeout(x,2500));
  const resp=await fetch(`${WP}/?ps_val=1&k=vl2k7d`,{headers:{Authorization:AUTH}});
  try{ out.rez=JSON.parse(await resp.text()); }catch(e){ out.raw='nejson'; }
  await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  const h=await fetch(`${WP}/`,{headers:{Authorization:AUTH}}); out.svetaine=h.status;
  await putResult('analize/valymas.json', out);
}
main().catch(async e=>{ await putResult('analize/valymas.json',{klaida:String(e)}); });
