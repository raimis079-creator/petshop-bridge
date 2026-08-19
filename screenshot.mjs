process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDA5NyddKSA/ICRfR0VUWydwc19oMDk3J10gOiAnJykgIT09ICdEUlknKSByZXR1cm47CiBAc2V0X3RpbWVfbGltaXQoMjQwKTsKIGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsKICRvID0gYXJyYXkoJ3YnPT4nSDA5NycsICdyZXppbWFzJz0+J0RSWS1SVU4g4oCUIE5JRUtBUyBORUtFSUNJQU1BJyk7CgogJGVpbCA9ICR3cGRiLT5nZXRfcmVzdWx0cygKICAgIlNFTEVDVCBJRCwgcG9zdF90aXRsZSwgcG9zdF9zdGF0dXMsIHBvc3RfdHlwZSBGUk9NIHskUH1wb3N0cwogICAgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXMgSU4gKCdwdWJsaXNoJywnZHJhZnQnKQogICAgICBBTkQgcG9zdF90aXRsZSBSRUdFWFAgJyZbYS16QS1aXSs7fCYjWzAtOV0rOycKICAgIE9SREVSIEJZIHBvc3Rfc3RhdHVzIERFU0MsIElEIiwgQVJSQVlfQSk7CgogJHNhciA9IGFycmF5KCk7ICRzayA9IGFycmF5KCdwdWJsaXNoJz0+MCwnZHJhZnQnPT4wLCduZXNpa2VpY2lhJz0+MCwna2VpY2lhc2knPT4wKTsKICRlc3liZXMgPSBhcnJheSgpOwogZm9yZWFjaCgkZWlsIGFzICRyKXsKICAgJHByaWVzID0gJHJbJ3Bvc3RfdGl0bGUnXTsKICAgJHBvID0gJHByaWVzOwogICBmb3IoJGk9MDskaTw0OyRpKyspeyAkbiA9IGh0bWxfZW50aXR5X2RlY29kZSgkcG8sIEVOVF9RVU9URVN8RU5UX0hUTUw1LCAnVVRGLTgnKTsgaWYoJG49PT0kcG8pIGJyZWFrOyAkcG89JG47IH0KICAgaWYocHJlZ19tYXRjaF9hbGwoJy8mW2EtekEtWl0rO3wmI1swLTldKzsvJywgJHByaWVzLCAkbSkpIGZvcmVhY2goJG1bMF0gYXMgJGUpICRlc3liZXNbJGVdID0gKGlzc2V0KCRlc3liZXNbJGVdKT8kZXN5YmVzWyRlXTowKSsxOwogICBpZigkcG8gPT09ICRwcmllcyl7ICRza1snbmVzaWtlaWNpYSddKys7IGNvbnRpbnVlOyB9CiAgICRza1sna2VpY2lhc2knXSsrOyAkc2tbJHJbJ3Bvc3Rfc3RhdHVzJ11dKys7CiAgICRzYXJbXSA9IGFycmF5KCdpZCc9PihpbnQpJHJbJ0lEJ10sICdidXNlbmEnPT4kclsncG9zdF9zdGF0dXMnXSwgJ3ByaWVzJz0+JHByaWVzLCAncG8nPT4kcG8pOwogfQogJG9bJ3NrYWljaWFpJ10gPSAkc2s7CiAkb1snZXN5Yml1X2Rhem5pcyddID0gJGVzeWJlczsKICRvWydlaWx1dGVzJ10gPSAkc2FyOwoKIC8qIGtvbnRla3N0byBwYXRpa3JhIOKAlCBrdXIgZGFyIHRvcyBwYWNpb3MgZXN5YmVzICovCiAkb1sna2l0dXInXSA9IGFycmF5KAogICdleGNlcnB0JyAgPT4gKGludCkgJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIHBvc3RfZXhjZXJwdCBSRUdFWFAgJyZbYS16QS1aXSs7fCYjWzAtOV0rOyciKSwKICAnY29udGVudCcgID0+IChpbnQpICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwb3N0X2NvbnRlbnQgUkVHRVhQICcmYW1wOyciKSwKICAndGVybWluYWknID0+IChpbnQpICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9dGVybXMgV0hFUkUgbmFtZSBSRUdFWFAgJyZbYS16QS1aXSs7fCYjWzAtOV0rOyciKSwKICk7CgogLyogaXMga3VyIHRvcyBwcmVrZXMgYXRrZWxpYXZvIOKAlCBrYWQgcmFzdHVtZSBzYWx0aW5pICovCiAkb1snc2FsdGluaWFpJ10gPSBhcnJheSgpOwogZm9yZWFjaCgkc2FyIGFzICRyKXsKICAgJHMgPSAkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD0lZCBBTkQgbWV0YV9rZXk9J19wc19zYW5kZWxpcycgTElNSVQgMSIsICRyWydpZCddKSk7CiAgICRrID0gJHMgPyAkcyA6ICduZXppbm9tYXMnOwogICAkb1snc2FsdGluaWFpJ11bJGtdID0gKGlzc2V0KCRvWydzYWx0aW5pYWknXVska10pID8gJG9bJ3NhbHRpbmlhaSddWyRrXSA6IDApICsgMTsKIH0KCiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'H097'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ try{const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()};}catch(e){return {s:0,t:String(e).slice(0,200)};} }
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); } }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H097 pavadinimu DRY-RUN',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rr=await fetch(WP+'/?ps_h097=DRY'); const tt=await rr.text();
  try{ out.D=JSON.parse(tt); }catch(e){ out.D={ZALIAS:tt.slice(0,600)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h097.json', Buffer.from(JSON.stringify(out,null,1)), 'h097 pavadinimu dry-run');
