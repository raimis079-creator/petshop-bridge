process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const D64=''; const V64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3AwJ10pID8gJF9HRVRbJ3BzX3AwJ10gOiAnJykgIT09ICdESUFHJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkYWw9JFAuJ3BzX2JyYW5kX2FsaWFzJzsgJG89YXJyYXkoJ3YnPT4nRElBRycpOwogJG9bJ3Zpc28nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkYWwiKTsKICRvWydidXNlbm9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgYnVzZW5hLENPVU5UKCopIG4gRlJPTSAkYWwgR1JPVVAgQlkgYnVzZW5hIixBUlJBWV9BKTsKICRvWyduYXVqYXVzaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGFsaWFzLGNhbm9uaWNhbF9pZCxidXNlbmEsc3VrdXJ0YSxhdG5hdWppbnRhIEZST00gJGFsIE9SREVSIEJZIGlkIERFU0MgTElNSVQgNiIsQVJSQVlfQSk7CiAkb1snenonXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBhbGlhcyxidXNlbmEgRlJPTSAkYWwgV0hFUkUgYWxpYXMgTElLRSAnenolJyIsQVJSQVlfQSk7CiAkb1snYmVfY2Fub25pY2FsJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJGFsIFdIRVJFIGJ1c2VuYT0nYXV0bycgQU5EIChjYW5vbmljYWxfaWQ9JycgT1IgY2Fub25pY2FsX2lkIElTIE5VTEwpIik7CiAkb1sndGVybWludSddPShpbnQpd3BfY291bnRfdGVybXMoYXJyYXkoJ3RheG9ub215Jz0+J3Byb2R1Y3RfYnJhbmQnLCdoaWRlX2VtcHR5Jz0+ZmFsc2UpKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'P0Z-1'};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p1k.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:'p0z ivykiai deploy+verify',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p1k.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
  const s2=await snip('TEMP P0Z VERIFY9',V64);
  await new Promise(r=>setTimeout(r,7000));
  try{ out.verify=JSON.parse(await (await fetch(WP+'/?ps_p0=DIAG')).text()); }catch(e){ out.e2=String(e).slice(0,300); }
  await off(s2);
}catch(e){ out.bendra=String(e).slice(0,300); }
await irasyk();
console.log('ok');
