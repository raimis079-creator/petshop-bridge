process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKLyogVEVNUCBaQkRJQUcgdjQgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfemJkaWFnNCddKSB8fCAoJF9HRVRbJ2snXSA/PyAnJykgIT09ICd6YmQ0bTJ0JykgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsKICAkdD0kd3BkYi0+cHJlZml4Lidwc19zb3VyY2VzJzsKICAkb3V0ID0gWydWRVJTSUpBJz0+J1pCRElBRyB2NCcsJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKV07CgogIC8vIEEuIHpiIHJlZ2lzdHJvIGVpbHVjaXUgY3JlYXRlZF9hdCAvIHVwZGF0ZWRfYXQgcGFzaXNraXJzdHltYXMKICAkb3V0WydBX3piX2NyZWF0ZWQnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBEQVRFKGNyZWF0ZWRfYXQpIGQsIENPVU5UKCopIGMgRlJPTSAkdCBXSEVSRSBzb3VyY2U9J3piJyBHUk9VUCBCWSBEQVRFKGNyZWF0ZWRfYXQpIE9SREVSIEJZIGQgREVTQyBMSU1JVCAxMiIsIEFSUkFZX0EpOwogICRvdXRbJ0FfemJfdXBkYXRlZCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERBVEUodXBkYXRlZF9hdCkgZCwgQ09VTlQoKikgYyBGUk9NICR0IFdIRVJFIHNvdXJjZT0nemInIEdST1VQIEJZIERBVEUodXBkYXRlZF9hdCkgT1JERVIgQlkgZCBERVNDIExJTUlUIDgiLCBBUlJBWV9BKTsKICAkb3V0WydBX3piX2FjdGl2ZSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlzX2FjdGl2ZSwgQ09VTlQoKikgYyBGUk9NICR0IFdIRVJFIHNvdXJjZT0nemInIEdST1VQIEJZIGlzX2FjdGl2ZSIsIEFSUkFZX0EpOwoKICAvLyBCLiBtaXNzIGdydXBlIChiZSBfcHNfc2FuZGVsaXMsIHpiIHJlZ2lzdHJlKSDigJQganUgcmVnaXN0cm8gZWlsdWNpdSBjcmVhdGVkX2F0CiAgJG1pc3NJZHMgPSAkd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIHAuSUQgRlJPTSB7JHdwZGItPnBvc3RzfSBwIEpPSU4gJHQgcyBPTiBzLnByb2R1Y3RfaWQ9cC5JRCBBTkQgcy5zb3VyY2U9J3piJyBBTkQgcy5pc19hY3RpdmU9MSBMRUZUIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gbSBPTiBtLnBvc3RfaWQ9cC5JRCBBTkQgbS5tZXRhX2tleT0nX3BzX3NhbmRlbGlzJyBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXMgSU4gKCdwdWJsaXNoJywnZHJhZnQnKSBBTkQgKG0ubWV0YV9pZCBJUyBOVUxMIE9SIG0ubWV0YV92YWx1ZT0nJykiKTsKICAkb3V0WydCX21pc3NfbiddPWNvdW50KCRtaXNzSWRzKTsKICBpZigkbWlzc0lkcyl7CiAgICAkaW49aW1wbG9kZSgnLCcsYXJyYXlfbWFwKCdpbnR2YWwnLCRtaXNzSWRzKSk7CiAgICAkb3V0WydCX21pc3NfcmVnX2NyZWF0ZWQnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBEQVRFKGNyZWF0ZWRfYXQpIGQsIENPVU5UKCopIGMgRlJPTSAkdCBXSEVSRSBzb3VyY2U9J3piJyBBTkQgcHJvZHVjdF9pZCBJTiAoJGluKSBHUk9VUCBCWSBEQVRFKGNyZWF0ZWRfYXQpIE9SREVSIEJZIGQgREVTQyBMSU1JVCAxMiIsIEFSUkFZX0EpOwogICAgLy8gcG14aV9wb3N0cyBzYXNhamEKICAgICRvdXRbJ0JfbWlzc19wbXhpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaW1wb3J0X2lkLCBDT1VOVChESVNUSU5DVCBwb3N0X2lkKSBjIEZST00geyR3cGRiLT5wcmVmaXh9cG14aV9wb3N0cyBXSEVSRSBwb3N0X2lkIElOICgkaW4pIEdST1VQIEJZIGltcG9ydF9pZCIsIEFSUkFZX0EpOwogICAgJG91dFsnQl9taXNzX2JlX3BteGknXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RzfSBwIFdIRVJFIHAuSUQgSU4gKCRpbikgQU5EIE5PVCBFWElTVFMgKFNFTEVDVCAxIEZST00geyR3cGRiLT5wcmVmaXh9cG14aV9wb3N0cyB4IFdIRVJFIHgucG9zdF9pZD1wLklEKSIpOwogIH0KICAvLyBDLiB6Yl9vayBncnVwZSDigJQgcG14aSBzYXNhamEgcGFseWdpbmltdWkKICAkemJJZHMgPSAkd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIHBvc3RfaWQgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBtZXRhX2tleT0nX3BzX3NhbmRlbGlzJyBBTkQgbWV0YV92YWx1ZT0nemInIik7CiAgaWYoJHpiSWRzKXsKICAgICRpbjI9aW1wbG9kZSgnLCcsYXJyYXlfbWFwKCdpbnR2YWwnLCR6YklkcykpOwogICAgJG91dFsnQ196Ym9rX3BteGknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpbXBvcnRfaWQsIENPVU5UKERJU1RJTkNUIHBvc3RfaWQpIGMgRlJPTSB7JHdwZGItPnByZWZpeH1wbXhpX3Bvc3RzIFdIRVJFIHBvc3RfaWQgSU4gKCRpbjIpIEdST1VQIEJZIGltcG9ydF9pZCIsIEFSUkFZX0EpOwogICAgJG91dFsnQ196Ym9rX3JlZ19jcmVhdGVkJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgREFURShjcmVhdGVkX2F0KSBkLCBDT1VOVCgqKSBjIEZST00gJHQgV0hFUkUgc291cmNlPSd6YicgQU5EIHByb2R1Y3RfaWQgSU4gKCRpbjIpIEdST1VQIEJZIERBVEUoY3JlYXRlZF9hdCkgT1JERVIgQlkgZCBERVNDIExJTUlUIDgiLCBBUlJBWV9BKTsKICB9CiAgLy8gRC4ga2llayBtaXNzIGdydXBlcyByZWdpc3RybyBlaWx1Y2l1IHN1a3VydGEgbnVvIHZha2FyIDIxOjAwCiAgaWYoJG1pc3NJZHMpewogICAgJG91dFsnRF9taXNzX3JlZ19uYXVqaV9udW9fdmFrYXInXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkdCBXSEVSRSBzb3VyY2U9J3piJyBBTkQgcHJvZHVjdF9pZCBJTiAoJGluKSBBTkQgY3JlYXRlZF9hdD49JzIwMjYtMDgtMDkgMDA6MDA6MDAnIik7CiAgfQogIHdwX3NlbmRfanNvbigkb3V0KTsKfSk7Cg==','base64').toString();
async function putResult(path, obj){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:`zbdiag4 ${new Date().toISOString()}`, content:Buffer.from(JSON.stringify(obj,null,2)).toString('base64')};
  if(sha) body.sha=sha;
  await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
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
    body:JSON.stringify({name:'TEMP ZBDIAG v4 (read-only)', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const snip=await r.json();
  out.steps.push(`sukurtas #${snip.id} st=${r.status}`);
  if(!snip.id){ out.klaida='nesukurtas'; await putResult('analize/zbdiag4.json',out); return; }
  await new Promise(s=>setTimeout(s,2000));
  const resp=await fetch(`${WP}/?ps_zbdiag4=1&k=zbd4m2t`,{headers:{Authorization:AUTH}});
  const text=await resp.text();
  out.http=resp.status;
  try{ out.rezultatas=JSON.parse(text); }catch(e){ out.raw=text.slice(0,2000); }
  const d=await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${snip.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  out.steps.push(`deakt #${snip.id} st=${d.status}`);
  await putResult('analize/zbdiag4.json', out);
}
main().catch(async e=>{ await putResult('analize/zbdiag4.json',{klaida:String(e)}); });
