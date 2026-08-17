process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3Y5MTEnXSk/JF9HRVRbJ3BzX3Y5MTEnXTonJykhPT0nVjkxMScpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nVjkxMScsJ3RzJz0+ZGF0ZSgnSDppOnMnKSk7CiAkb1snb3B0aW9uc192aXNvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfW9wdGlvbnMiKTsKICRvWydvcHRpb25zX3RyYW5zaWVudCddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJ1xfdHJhbnNpZW50XF8lJyBPUiBvcHRpb25fbmFtZSBMSUtFICdcX3NpdGVcX3RyYW5zaWVudFxfJSciKTsKICRvWydvcHRpb25zX2JlX3RyYW5zaWVudCddPSRvWydvcHRpb25zX3Zpc28nXS0kb1snb3B0aW9uc190cmFuc2llbnQnXTsKIC8vIGtyaXRpbmlhaSByYWt0YWkgdmlldG9qZT8KIGZvcmVhY2goYXJyYXkoJ3NpdGV1cmwnLCdob21lJywnYWN0aXZlX3BsdWdpbnMnLCd3b29jb21tZXJjZV9jdXJyZW5jeScsJ3RlbXBsYXRlJywnc3R5bGVzaGVldCcpIGFzICRrKQogICAkb1sncmFrdGFzXycuJGtdPSAoZ2V0X29wdGlvbigkaykhPT1mYWxzZSkgPyAnWVJBJyA6ICdORVJBJzsKICRvWydha3R5dnVzX3BsdWdpbmFpJ109Y291bnQoKGFycmF5KWdldF9vcHRpb24oJ2FjdGl2ZV9wbHVnaW5zJykpOwogLy8gc25pcHBldHM6IGtpZWsgVEVNUAogJG9bJ3NuaXBfdmlzbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1zbmlwcGV0cyIpOwogJG9bJ3NuaXBfdGVtcF9ha3R5dnVzJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXNuaXBwZXRzIFdIRVJFIGFjdGl2ZT0xIEFORCBuYW1lIExJS0UgJ1RFTVAlJyIpOwogLy8gcHJla2l1IGlyIHV6c2FreW11IGtvbnRyb2xlCiAkb1sncHVibGlzaF9wcmVrZXMnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIik7CiAkb1snanVvZHJhc2NpYWknXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J2RyYWZ0JyIpOwogJG9bJ3V6c2FreW1haSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH13Y19vcmRlcnMiKTsKICRvWyd2YXJ0b3RvamFpJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXVzZXJzIik7CiAkb1sncHNfcGV0cyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1wc19wZXRzIik7CiAkb1snZmVlZGluZ19yb3dzJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBzX2ZlZWRpbmdfcm93cyIpOwogJG9bJ2R5ZGlzX21iJ109KGZsb2F0KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgUk9VTkQoU1VNKGRhdGFfbGVuZ3RoK2luZGV4X2xlbmd0aCkvMTAyNC8xMDI0LDEpIEZST00gaW5mb3JtYXRpb25fc2NoZW1hLnRhYmxlcyBXSEVSRSB0YWJsZV9zY2hlbWE9REFUQUJBU0UoKSIpOwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'V911'};
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
  const s=await snip('TEMP V911',B64);
  await new Promise(r=>setTimeout(r,6000));
  const r=await fetch(WP+'/?ps_v911=V911');
  const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,500); }
  await off(s);
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('v911.json', Buffer.from(JSON.stringify(out)), 'v911');
