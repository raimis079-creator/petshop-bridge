process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP_VER=Buffer.from('PD9waHAKLyogVEVNUCBTNzIwIFBhdGlrcmEgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczcyMHZlciddKSB8fCAoJF9HRVRbJ2snXSA/PyAnJykgIT09ICd2cjcyMHBzJykgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJHQ9JHdwZGItPnByZWZpeC4ncHNfc291cmNlcyc7CiAgJG91dD1bJ1ZFUlNJSkEnPT4nUzcyMCBQQVRJS1JBJywnbGFpa2FzJz0+Y3VycmVudF90aW1lKCdteXNxbCcpXTsKICAkb3V0WydzYW5kZWxpb19yZWlrc21lcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG1ldGFfdmFsdWUgdiwgQ09VTlQoKikgYyBGUk9NIHskcH1wb3N0bWV0YSBtIElOTkVSIEpPSU4geyRwfXBvc3RzIHBvIE9OIHBvLklEPW0ucG9zdF9pZCBBTkQgcG8ucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG8ucG9zdF9zdGF0dXMgSU4gKCdwdWJsaXNoJywnZHJhZnQnKSBXSEVSRSBtLm1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIEdST1VQIEJZIG1ldGFfdmFsdWUgT1JERVIgQlkgYyBERVNDIiwgQVJSQVlfQSk7CiAgJG91dFsnbGlrb19iZV9sYXVrbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVChESVNUSU5DVCBwby5JRCkgRlJPTSB7JHB9cG9zdHMgcG8gSU5ORVIgSk9JTiAkdCBzIE9OIHMucHJvZHVjdF9pZD1wby5JRCBBTkQgcy5pc19hY3RpdmU9MSBMRUZUIEpPSU4geyRwfXBvc3RtZXRhIG0gT04gbS5wb3N0X2lkPXBvLklEIEFORCBtLm1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIFdIRVJFIHBvLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvLnBvc3Rfc3RhdHVzIElOICgncHVibGlzaCcsJ2RyYWZ0JykgQU5EIChtLm1ldGFfaWQgSVMgTlVMTCBPUiBtLm1ldGFfdmFsdWU9JycpIik7CiAgJG91dFsnZHVibGlrYXRhaV9tZXRhJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gKFNFTEVDVCBwb3N0X2lkIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIEdST1VQIEJZIHBvc3RfaWQgSEFWSU5HIENPVU5UKCopPjEpIHgiKTsKICAkej0oYXJyYXkpZ2V0X29wdGlvbigncHNfc2FuZGVsaW9fdXpwaWxkeW1haScsYXJyYXkoKSk7CiAgJG91dFsnenVybmFsb19pcmFzdSddPWNvdW50KCR6KTsKICAkb3V0Wyd6dXJuYWxvX3B2eiddPWFycmF5X3NsaWNlKCR6LDAsMyk7CiAgJG91dFsnenVybmFsb19wYXNrdXRpbmlzJ109JHo/ZW5kKCR6KTpudWxsOwogIC8vIGtvbnRyb2zElzogYXIgcmVnaXN0cm8gaXNfYWN0aXZlIG5lcGFzaWtlaXTElwogICRvdXRbJ3JlZ2lzdHJhcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHNvdXJjZSxpc19hY3RpdmUsQ09VTlQoKikgYyBGUk9NICR0IEdST1VQIEJZIHNvdXJjZSxpc19hY3RpdmUgT1JERVIgQlkgc291cmNlIiwgQVJSQVlfQSk7CiAgLy8gcHJla2nFsyBixatzZW7FsyBrb250cm9sxJcKICAkb3V0WydwcmVraXVfYnVzZW5vcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHBvc3Rfc3RhdHVzIHN0LCBDT1VOVCgqKSBjIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgR1JPVVAgQlkgcG9zdF9zdGF0dXMiLCBBUlJBWV9BKTsKICAvLyAzIHBhdnl6ZMW+aWFpIHN1IHJlc29sdmUKICBmb3JlYWNoIChbMTQwNjIsMTQwNzIsMTQwNjRdIGFzICRwaWQpewogICAgJHI9WydzYW5kZWxpcyc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3BzX3NhbmRlbGlzJyx0cnVlKSwnc3QnPT5nZXRfcG9zdF9zdGF0dXMoJHBpZCksCiAgICAgICAgJ2thaW5hJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfcHJpY2UnLHRydWUpLCdzdG9jayc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3N0b2NrJyx0cnVlKSwKICAgICAgICAnemJfcXR5Jz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfemJfcXR5Jyx0cnVlKSwndGF4Jz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfdGF4X3N0YXR1cycsdHJ1ZSldOwogICAgaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0Z1bGZpbGxtZW50X1NvdXJjZScpKSAkclsncmVzb2x2ZSddPVBldHNob3BfRnVsZmlsbG1lbnRfU291cmNlOjpyZXNvbHZlKCRwaWQpOwogICAgJG91dFsncHZ6XycuJHBpZF09JHI7CiAgfQogICRvdXRbJ2tsYXNlX3ZlcnNpamEnXT1jbGFzc19leGlzdHMoJ1BldHNob3BfU291cmNlcycpP1BldHNob3BfU291cmNlczo6VkVSU0lKQTonTkVSQSc7CiAgd3Bfc2VuZF9qc29uKCRvdXQpOwp9KTsK','base64').toString();
async function putResult(path, obj){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:`s720 ${new Date().toISOString()}`, content:Buffer.from(JSON.stringify(obj,null,2)).toString('base64')};
  if(sha) body.sha=sha;
  await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
}
async function main(){
  const out={steps:[]};
  // 1) APPLY
  let resp=await fetch(`${WP}/?ps_src=sandelisapply&patvirtinu=taip&k=ps2026`,{headers:{Authorization:AUTH}});
  let text=await resp.text();
  out.apply_http=resp.status;
  try{ out.apply=JSON.parse(text); }catch(e){ out.apply_raw=text.slice(0,2500); }
  // 2) pakartotinis dry — ar liko kandidatų
  await new Promise(s=>setTimeout(s,1500));
  resp=await fetch(`${WP}/?ps_src=sandelisdry&k=ps2026`,{headers:{Authorization:AUTH}});
  text=await resp.text();
  try{ out.dry_po=JSON.parse(text); }catch(e){ out.dry_po_raw=text.slice(0,1500); }
  // 3) nepriklausoma patikra per TEMP snippet
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await r.json();
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active && /^TEMP/i.test(s.name||''))){
    await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${t.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
    out.steps.push(`deakt senas TEMP #${t.id}`);
  }
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP S720 Patikra (read-only)', code:PHP_VER.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  out.steps.push(`patikros TEMP #${s.id} st=${r.status}`);
  if(s.id){
    await new Promise(x=>setTimeout(x,2000));
    resp=await fetch(`${WP}/?ps_s720ver=1&k=vr720ps`,{headers:{Authorization:AUTH}});
    text=await resp.text();
    out.ver_http=resp.status;
    try{ out.patikra=JSON.parse(text); }catch(e){ out.ver_raw=text.slice(0,2000); }
    const d=await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
    out.steps.push(`deakt patikros TEMP #${s.id} st=${d.status}`);
  }
  // 4) parduotuves sveikata
  resp=await fetch(`${WP}/`,{headers:{Authorization:AUTH}});
  out.svetaine_http=resp.status;
  // 5) galutinis TEMP auditas
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const l2=await r.json();
  out.aktyvus_temp=(Array.isArray(l2)?l2:[]).filter(x=>x.active && /^TEMP/i.test(x.name||'')).map(x=>`#${x.id} ${x.name}`);
  out.aktyvus_sources=(Array.isArray(l2)?l2:[]).filter(x=>x.active && /Sources|Stock Service/i.test(x.name||'')).map(x=>`#${x.id} ${x.name}`);
  await putResult('analize/s720.json', out);
}
main().catch(async e=>{ await putResult('analize/s720.json',{klaida:String(e)}); });
