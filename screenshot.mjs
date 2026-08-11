process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfcHViJ10pIHx8ICgkX0dFVFsnayddID8/ICcnKSAhPT0gJ2FrNXI3cScpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7CiAgJG91dD1hcnJheSgnVkVSU0lKQSc9PidQVUIxJyk7CgogIC8qIDEuIEFyIHBvc3RfZGF0ZSBza2lyaWFzaSBudW8gcG9zdF9tb2RpZmllZCBwdWJsaWt1b3RvbXMgcHJla2VtcyAqLwogICRvdXRbJ3ByZWtpdV9wdWJsaXNoJ109KGludCkkd3BkYi0+Z2V0X3ZhcigKICAgICJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCciKTsKICAkb3V0WydwcmVraXVfZHJhZnQnXT0oaW50KSR3cGRiLT5nZXRfdmFyKAogICAgIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzPSdkcmFmdCciKTsKCiAgLyogcG9zdF9kYXRlIHBhc2lza2lyc3R5bWFzIOKAlCBhciB2aXNvcyB2aWVub3MgZGllbm9zIChpbXBvcnRvIHBvenltaXMpICovCiAgJG91dFsncG9zdF9kYXRlX3BhZ2FsX2RpZW5hJ109JHdwZGItPmdldF9yZXN1bHRzKAogICAgIlNFTEVDVCBEQVRFKHBvc3RfZGF0ZSkgZCwgQ09VTlQoKikgYyBGUk9NIHskd3BkYi0+cG9zdHN9CiAgICAgIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJwogICAgICBHUk9VUCBCWSBEQVRFKHBvc3RfZGF0ZSkgT1JERVIgQlkgYyBERVNDIExJTUlUIDgiLCBBUlJBWV9BKTsKCiAgLyogMi4gQXIgeXJhIGphdSBrb2tzIG5vcnMgcHVibGlrYXZpbW8gbWV0YSAqLwogICRyYWt0YWk9JHdwZGItPmdldF9jb2woCiAgICAiU0VMRUNUIERJU1RJTkNUIG1ldGFfa2V5IEZST00geyR3cGRiLT5wb3N0bWV0YX0KICAgICAgV0hFUkUgbWV0YV9rZXkgTElLRSAnJXB1YmxpayUnIE9SIG1ldGFfa2V5IExJS0UgJyVfcHNfcHViJScKICAgICAgICAgT1IgbWV0YV9rZXkgTElLRSAnJWZpcnN0X3B1YiUnIE9SIG1ldGFfa2V5IExJS0UgJyVfcHNfc3VrdXJ0YSUnIExJTUlUIDIwIik7CiAgJG91dFsnZXNhbWlfcmFrdGFpJ109JHJha3RhaTsKCiAgLyogMy4gQXIgV1Agc2F1Z28gcmV2aXppamFzIC8gdHJhbnNpdGlvbiBpc3RvcmlqYSAqLwogICRvdXRbJ3Jldml6aWpvcyddPShpbnQpJHdwZGItPmdldF92YXIoCiAgICAiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF90eXBlPSdyZXZpc2lvbiciKTsKCiAgLyogNC4gUGF2eXpkemlhaTogQVYgcHJla2VzIHN1IGxpa3VjaXUgKi8KICAkb3V0WydwdnonXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoCiAgICAiU0VMRUNUIHAuSUQsIExFRlQocC5wb3N0X3RpdGxlLDM4KSBwYXYsIHAucG9zdF9zdGF0dXMsIHAucG9zdF9kYXRlLCBwLnBvc3RfbW9kaWZpZWQsCiAgICAgICAgICAgIERBVEVESUZGKENVUkRBVEUoKSwgREFURShwLnBvc3RfZGF0ZSkpIG51b19zdWt1cmltbywKICAgICAgICAgICAgREFURURJRkYoQ1VSREFURSgpLCBEQVRFKHAucG9zdF9tb2RpZmllZCkpIG51b19wYWtlaXRpbW8KICAgICAgIEZST00geyR3cGRiLT5wb3N0c30gcAogICAgICAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBtIE9OIG0ucG9zdF9pZD1wLklEIEFORCBtLm1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIEFORCBtLm1ldGFfdmFsdWU9J0FWJwogICAgICBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnCiAgICAgIE9SREVSIEJZIHAucG9zdF9kYXRlIERFU0MgTElNSVQgNiIsIEFSUkFZX0EpOwoKICAvKiA1LiBQYXJkYXZpbXUgbWV0YSByYWt0YWkg4oCUIGtva2llIHlyYSAqLwogICRvdXRbJ3BhcmRhdmltdV9yYWt0YWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoCiAgICAiU0VMRUNUIG1ldGFfa2V5LCBDT1VOVCgqKSBjIEZST00geyR3cGRiLT5wb3N0bWV0YX0KICAgICAgV0hFUkUgbWV0YV9rZXkgTElLRSAnX3BzX3NhbGVzJScgT1IgbWV0YV9rZXkgTElLRSAnJV9wc19sYXN0X3NhbGUlJyBPUiBtZXRhX2tleT0nX3BzX2RpZW51X2F0c2FyZ2FpJwogICAgICBHUk9VUCBCWSBtZXRhX2tleSIsIEFSUkFZX0EpOwoKICAvKiA2LiBBciBQZXRzaG9wX1BhcmRhdmltYWkgdHVyaSBwYXNrdXRpbmlvIHBhcmRhdmltbyBkYXRhICovCiAgJG91dFsncGFyZGF2aW11X2tsYXNlJ109Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX1BhcmRhdmltYWknKTsKICBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfUGFyZGF2aW1haScpKXsgJG91dFsncGFyZGF2aW11X21ldG9kYWknXT1nZXRfY2xhc3NfbWV0aG9kcygnUGV0c2hvcF9QYXJkYXZpbWFpJyk7IH0KCiAgLyogNy4gQXIgV0MgdXpzYWt5bXVvc2UgeXJhIGlzdG9yaWpvcywgaXMga3VyaW9zIGdhbGltYSBza2FpY2l1b3RpICovCiAgJG91dFsnd2NfdXpzYWt5bXUnXT0oaW50KSR3cGRiLT5nZXRfdmFyKAogICAgIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZT0nc2hvcF9vcmRlciciKTsKICAkaHBvcz0kd3BkYi0+cHJlZml4Lid3Y19vcmRlcnMnOwogICRvdXRbJ2hwb3NfbGVudGVsZSddPSAkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAneyRocG9zfSciKT09PSRocG9zOwogIGlmKCRvdXRbJ2hwb3NfbGVudGVsZSddKXsKICAgICRvdXRbJ2hwb3NfdXpzYWt5bXUnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JGhwb3N9Iik7CiAgfQogIHdwX3NlbmRfanNvbigkb3V0KTsKfSk7Cg==','base64').toString();
async function jsonSafe(r){ const t=await r.text();
  const a=t.indexOf('['), o=t.indexOf('{');
  const i=(a>=0&&(a<o||o<0))?a:o; if(i<0) return null;
  try{ return JSON.parse(t.slice(i)); }catch(e){ return null; } }
async function putRaw(path,b64,msg){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:msg||'pub1', content:b64}; if(sha) body.sha=sha;
  await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
}
const putJson=(p,o)=>putRaw(p, Buffer.from(JSON.stringify(o,null,2)).toString('base64'),'pub1');
const pause=ms=>new Promise(x=>setTimeout(x,ms));
async function main(){
  const out={};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await jsonSafe(r);
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active&&/^TEMP/i.test(s.name||''))){
    await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${t.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  }
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP pub1', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await jsonSafe(r)||{};
  await pause(2500);
  const resp=await fetch(`${WP}/?ps_pub=1&k=ak5r7q`,{headers:{Authorization:AUTH}});
  out.rez=await jsonSafe(resp);
  if(s.id) await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await putJson('analize/pub1.json', out);
}
main().catch(async e=>{ await putJson('analize/pub1.json',{klaida:String(e).slice(0,300)}); });
