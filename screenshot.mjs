process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2Y5MjcnXSk/JF9HRVRbJ3BzX2Y5MjcnXTonJykhPT0nQ0hLJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDMwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0Y5MjcnLCdkYWJhcic9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSwndXRjJz0+Z21kYXRlKCdZLW0tZCBIOmk6cycpKTsKICRpZHM9JzM0OTMyLDM0OTMzLDM0OTM0LDM0OTM1LDM0OTM2LDM0OTM3LDM0OTM4JzsKICRvWydzZXNpb3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRCxwb3N0X3N0YXR1cyxwb3N0X21vZGlmaWVkLHBvc3RfbW9kaWZpZWRfZ210LHBvc3RfZGF0ZSBGUk9NIHskUH1wb3N0cyBXSEVSRSBJRCBJTiAoJGlkcykiLCBBUlJBWV9BKTsKIC8qIGtpZWsgcHJla2l1IHBha2Vpc3RhIHBlciBwYXN0YXJhc2lhcyAyIHZhbCAqLwogJG9bJ2tlaXN0YV8yaCddPSR3cGRiLT5nZXRfcmVzdWx0cygiCiAgIFNFTEVDVCBJRCxwb3N0X3RpdGxlLHBvc3Rfc3RhdHVzLHBvc3RfbW9kaWZpZWQgRlJPTSB7JFB9cG9zdHMKICAgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9tb2RpZmllZCA+IERBVEVfU1VCKE5PVygpLCBJTlRFUlZBTCAyIEhPVVIpCiAgIE9SREVSIEJZIHBvc3RfbW9kaWZpZWQgREVTQyBMSU1JVCAzMCIsIEFSUkFZX0EpOwogJG9bJ2tlaXN0YV8yaF9uJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3RfbW9kaWZpZWQgPiBEQVRFX1NVQihOT1coKSwgSU5URVJWQUwgMiBIT1VSKSIpOwogLyogaXZ5a2l1IHp1cm5hbGFzICovCiAkdD0kUC4ncHNfaXZ5a2lhaSc7CiBpZigkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAnJHQnIik9PT0kdCl7CiAgICRvWydpdnlraXVfc3R1bHBlbGlhaSddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSBgJHRgIik7CiAgICRvWydpdnlraWFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIGAkdGAgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxNSIsIEFSUkFZX0EpOwogfQogLyogQVYgenVybmFsYXMgKi8KICR6PSRQLidwc19hdl96dXJuYWxhcyc7CiBpZigkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAnJHonIik9PT0keikKICAgJG9bJ2F2X3p1cm5hbGFzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIGAkemAgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxMCIsIEFSUkFZX0EpOwogLyogYXIgdmVpa2lhIGltcG9ydGFzIGRhYmFyICovCiAkb1snYWN0aW9uX3NjaGVkdWxlcl9ydW5uaW5nJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaG9vayxzdGF0dXMsc2NoZWR1bGVkX2RhdGVfZ210IEZST00geyRQfWFjdGlvbnNjaGVkdWxlcl9hY3Rpb25zIFdIRVJFIHN0YXR1cyBJTignaW4tcHJvZ3Jlc3MnLCdwZW5kaW5nJykgT1JERVIgQlkgc2NoZWR1bGVkX2RhdGVfZ210IERFU0MgTElNSVQgOCIsIEFSUkFZX0EpOwogLyoga2FzIHByaXNpanVuZ2VzICovCiAkb1snc2VzaWpvcyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH13b29jb21tZXJjZV9zZXNzaW9ucyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'F927'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
  const s=await snip('TEMP F927',B64);
  await new Promise(r=>setTimeout(r,6000));
  const t=await (await fetch(WP+'/?ps_f927=CHK')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,500); }
  await off(s);
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('f927.json', Buffer.from(JSON.stringify(out)), 'f927 kas pakeite');
