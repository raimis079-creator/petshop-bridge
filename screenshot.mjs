process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKLyogVEVNUCBEMCBSZWNvbiAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19kMHJlYyddKSB8fCAoJF9HRVRbJ2snXSA/PyAnJykgIT09ICdkMHI3MjZ4JykgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsKICAkb3V0PVsnVkVSU0lKQSc9PidEMCBSRUNPTicsJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKV07CiAgLy8gMS4ga2F0YWxvZ28gZmFpbGFzCiAgJGY9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rYXRhbG9nYXMucGhwJzsKICAkb3V0WydrYXRfeXJhJ109ZmlsZV9leGlzdHMoJGYpOyAkb3V0WydrYXRfZHlkaXMnXT0kb3V0WydrYXRfeXJhJ10/ZmlsZXNpemUoJGYpOjA7CiAgaWYoJG91dFsna2F0X3lyYSddKSAkb3V0WydrYXRfYjY0J109YmFzZTY0X2VuY29kZShmaWxlX2dldF9jb250ZW50cygkZikpOwogIC8vIDIuIGxlbnRlbMSXcwogICRvdXRbJ3BzX2xlbnRlbGVzJ109JHdwZGItPmdldF9jb2woIlNIT1cgVEFCTEVTIExJS0UgJ3skcH1wc1xfJSciKTsKICAkb3V0Wydsb29rdXBfeXJhJ109JHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJ3skcH13Y19vcmRlcl9wcm9kdWN0X2xvb2t1cCciKTsKICAkb3V0Wydsb29rdXBfZWlsdWNpdSddPSRvdXRbJ2xvb2t1cF95cmEnXT8oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9d2Nfb3JkZXJfcHJvZHVjdF9sb29rdXAiKTpudWxsOwogICRvdXRbJ29yZGVyc19sZW50ZWxlcyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIFRBQkxFUyBMSUtFICd7JHB9d2Nfb3JkZXJzJSciKTsKICAvLyAzLiDFvnVybmFsYWkgb3B0aW9ucwogICRvdXRbJ3BzX29wdGlvbnMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcHRpb25fbmFtZSwgTEVOR1RIKG9wdGlvbl92YWx1ZSkgbGVuIEZST00geyRwfW9wdGlvbnMgV0hFUkUgb3B0aW9uX25hbWUgTElLRSAncHNcXyUnIE9SREVSIEJZIG9wdGlvbl9uYW1lIiwgQVJSQVlfQSk7CiAgLy8gNC4gcmlua2luaWFpIChNaXgmTWF0Y2gpIOKAlCBrYWlwIHNhdWdvbWkgdmFpa2FpCiAgJG1ubT0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIHAuSUQgRlJPTSB7JHB9cG9zdHMgcCBJTk5FUiBKT0lOIHskcH10ZXJtX3JlbGF0aW9uc2hpcHMgdHIgT04gdHIub2JqZWN0X2lkPXAuSUQgSU5ORVIgSk9JTiB7JHB9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQgSU5ORVIgSk9JTiB7JHB9dGVybXMgdCBPTiB0LnRlcm1faWQ9dHQudGVybV9pZCBBTkQgdHQudGF4b25vbXk9J3Byb2R1Y3RfdHlwZScgQU5EIHQuc2x1ZyBMSUtFICclbWl4JScgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIExJTUlUIDMiKTsKICAkb3V0Wydtbm1fcHZ6X2lkJ109JG1ubTsKICBpZigkbW5tKXsgJG91dFsnbW5tX21ldGEnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBtZXRhX2tleSwgTEVGVChtZXRhX3ZhbHVlLDIwMCkgdiBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPSVkIEFORCAobWV0YV9rZXkgTElLRSAnJSVtbm0lJScgT1IgbWV0YV9rZXkgTElLRSAnJSVjaGlsZCUlJyBPUiBtZXRhX2tleSBMSUtFICclJWNvbnRlbnQlJScpIiwkbW5tWzBdKSwgQVJSQVlfQSk7IH0KICAvLyA1LiBGQlQgc2F1Z29qaW1hcwogICRvdXRbJ2ZidF9tZXRhX3Jha3RhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG1ldGFfa2V5LCBDT1VOVCgqKSBjIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5IExJS0UgJyVmYnQlJyBHUk9VUCBCWSBtZXRhX2tleSBMSU1JVCAxMCIsIEFSUkFZX0EpOwogIC8vIDYuIERQIHNrZWxiaW1haQogICRvdXRbJ2RwX21ldGEnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtZXRhX2tleSwgQ09VTlQoKikgYyBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleSBMSUtFICclX2RwXyUnIE9SIG1ldGFfa2V5IExJS0UgJ19wc19kcCUnIEdST1VQIEJZIG1ldGFfa2V5IExJTUlUIDEyIiwgQVJSQVlfQSk7CiAgLy8gNy4gcGFrdW90xJdzIGR5ZMW+aW8gdGVybWFpIOKCrC9rZyBwYXJzZSd1aQogICRvdXRbJ3Bha190ZXJtaW5haSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHQubmFtZSwgQ09VTlQodHIub2JqZWN0X2lkKSBjIEZST00geyRwfXRlcm1zIHQgSU5ORVIgSk9JTiB7JHB9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX2lkPXQudGVybV9pZCBBTkQgdHQudGF4b25vbXk9J3BhX3Bha3VvdGVzX2R5ZGlzJyBMRUZUIEpPSU4geyRwfXRlcm1fcmVsYXRpb25zaGlwcyB0ciBPTiB0ci50ZXJtX3RheG9ub215X2lkPXR0LnRlcm1fdGF4b25vbXlfaWQgR1JPVVAgQlkgdC50ZXJtX2lkIE9SREVSIEJZIGMgREVTQyBMSU1JVCAyNSIsIEFSUkFZX0EpOwogIC8vIDguIGNyb24nYWkKICAkY3I9Z2V0X29wdGlvbignY3JvbicpOyAkcHNfY3Jvbj1bXTsKICBmb3JlYWNoKChhcnJheSkkY3IgYXMgJHRzPT4kaG9va3MpeyBpZighaXNfYXJyYXkoJGhvb2tzKSkgY29udGludWU7IGZvcmVhY2goJGhvb2tzIGFzICRoPT4keCl7IGlmKHN0cnBvcygkaCwncHNfJyk9PT0wfHxzdHJwb3MoJGgsJ3BldHNob3AnKT09PTApICRwc19jcm9uWyRoXT1kYXRlKCdZLW0tZCBIOmknLCR0cyk7IH0gfQogICRvdXRbJ3BzX2Nyb24nXT0kcHNfY3JvbjsKICAvLyA5LiBkZXNrIGZhaWxhcyAoxb51cm5hbMWzIHBhdnl6ZMW+aXVpKQogICRvdXRbJ211X2ZhaWxhaSddPWFycmF5X21hcCgnYmFzZW5hbWUnLCBnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJykpOwogIHdwX3NlbmRfanNvbigkb3V0KTsKfSk7Cg==','base64').toString();
async function putResult(path, obj){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:`d0 recon ${new Date().toISOString()}`, content:Buffer.from(JSON.stringify(obj)).toString('base64')};
  if(sha) body.sha=sha;
  const r2=await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
  console.log('put',r2.status);
}
async function main(){
  const out={steps:[]};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await r.json();
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active && /^TEMP/i.test(s.name||''))){
    await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${t.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
    out.steps.push(`deakt #${t.id}`);
  }
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP D0 Recon (read-only)', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const snip=await r.json();
  out.steps.push(`sukurtas #${snip.id} st=${r.status}`);
  if(!snip.id){ out.klaida='nesukurtas'; await putResult('analize/d0_recon.json',out); return; }
  await new Promise(s=>setTimeout(s,2000));
  const resp=await fetch(`${WP}/?ps_d0rec=1&k=d0r726x`,{headers:{Authorization:AUTH}});
  const text=await resp.text();
  out.http=resp.status;
  try{ out.rezultatas=JSON.parse(text); }catch(e){ out.raw=text.slice(0,2000); }
  const d=await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${snip.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  out.steps.push(`deakt #${snip.id} st=${d.status}`);
  await putResult('analize/d0_recon.json', out);
}
main().catch(async e=>{ await putResult('analize/d0_recon.json',{klaida:String(e)}); });
