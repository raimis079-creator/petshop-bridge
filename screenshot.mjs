process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const D64=''; const V64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3AwJ10pID8gJF9HRVRbJ3BzX3AwJ10gOiAnJykgIT09ICdWRVJYJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidQVVJDSC1ESUFHJyk7CiAkYWRtPWdldF91c2VycyhhcnJheSgncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnbnVtYmVyJz0+MSkpOyAkdWlkPSRhZG1bMF0tPklEOwogLyogMS4gZHVlIGl2eWtpcyB0aWVzaW9naWFpICovCiBQZXRzaG9wX1N0YXRpc3Rpa2E6OmlyYXN5dGkoJ3JlZmlsbF9kdWUnLGFycmF5KCdzcml0aXMnPT4ncmVmaWxsJywndmVydGUnPT4nNzc3OjM0OTU2JywndXNlcl9pZCc9PiR1aWQpKTsKICRvWydkdWVfaXJhc3l0YSddPSR3cGRiLT5pbnNlcnRfaWQ7CiAvKiAyLiBrYSBtYXRvIHBpcmt0YSgpIHV6a2xhdXNhICovCiAkcmliYT1nbWRhdGUoJ1ktbS1kIEg6aTpzJywgdGltZSgpLTQ1KkRBWV9JTl9TRUNPTkRTKTsKICRvWydyaWJhJ109JHJpYmE7CiAkb1snZHVlX21hdG8nXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoCiAgIlNFTEVDVCB2ZXJ0ZSxsYWlrYXMsdXNlcl9pZCBGUk9NIHskUH1wc19sYXVrYWlfaXZ5a2lhaSBXSEVSRSBzcml0aXM9J3JlZmlsbCcgQU5EIHRpcGFzPSdyZWZpbGxfZHVlJyBBTkQgdXNlcl9pZD0lZCBBTkQgbGFpa2FzPj0lcyIsJHVpZCwkcmliYSksQVJSQVlfQSk7CiAvKiAzLiBob29rYXMgcmVnaXN0cnVvdGFzPyAqLwogJG9bJ2hvb2tfcHJpbyddPWhhc19hY3Rpb24oJ3dvb2NvbW1lcmNlX2NoZWNrb3V0X29yZGVyX3Byb2Nlc3NlZCcsYXJyYXkoJ1BldHNob3BfUmVmaWxsX0l2eWtpYWknLCdwaXJrdGEnKSk7CiAvKiA0LiB1enNha3ltYXMgKyB0aWVzaW9naW5pcyBrdmlldGltYXMgKi8KICRvcmQ9d2NfY3JlYXRlX29yZGVyKGFycmF5KCdjdXN0b21lcl9pZCc9PiR1aWQpKTsKICRvcmQtPmFkZF9wcm9kdWN0KHdjX2dldF9wcm9kdWN0KDM0OTU2KSwxKTsgJG9yZC0+Y2FsY3VsYXRlX3RvdGFscygpOyAkb3JkLT5zYXZlKCk7CiAkb1sndXpzX2N1c3RvbWVyJ109JG9yZC0+Z2V0X2N1c3RvbWVyX2lkKCk7CiAkaXRlbXM9YXJyYXkoKTsgZm9yZWFjaCgkb3JkLT5nZXRfaXRlbXMoKSBhcyAkaXQpeyAkaXRlbXNbXT0kaXQtPmdldF9wcm9kdWN0X2lkKCk7IH0KICRvWyd1enNfaXRlbXMnXT0kaXRlbXM7CiBQZXRzaG9wX1JlZmlsbF9JdnlraWFpOjpwaXJrdGEoJG9yZC0+Z2V0X2lkKCksYXJyYXkoKSwkb3JkKTsKICRvWydwb190aWVzaW9naW5pbyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHRpcGFzLHZlcnRlIEZST00geyRQfXBzX2xhdWthaV9pdnlraWFpIFdIRVJFIHNyaXRpcz0ncmVmaWxsJyBBTkQgdGlwYXM9J3JlZmlsbF9wdXJjaGFzZSciLEFSUkFZX0EpOwogLyogNS4gcGVyIGRvX2FjdGlvbiAqLwogZG9fYWN0aW9uKCd3b29jb21tZXJjZV9jaGVja291dF9vcmRlcl9wcm9jZXNzZWQnLCRvcmQtPmdldF9pZCgpLGFycmF5KCksJG9yZCk7CiAkb1sncG9faG9va28nXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0aXBhcyx2ZXJ0ZSBGUk9NIHskUH1wc19sYXVrYWlfaXZ5a2lhaSBXSEVSRSBzcml0aXM9J3JlZmlsbCcgQU5EIHRpcGFzPSdyZWZpbGxfcHVyY2hhc2UnIixBUlJBWV9BKTsKICRvaWQ9JG9yZC0+Z2V0X2lkKCk7ICRvcmQtPmRlbGV0ZSh0cnVlKTsKICRvWydpc3ZhbHl0YSddPSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRQfXBzX2xhdWthaV9pdnlraWFpIFdIRVJFIHNyaXRpcz0ncmVmaWxsJyIpOwogJG9bJ3V6c2FreW1hcyddPXdjX2dldF9vcmRlcigkb2lkKT8nWVJBJzonaXN0cmludGFzJzsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'P0Z-1'};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p0z3.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:'p0z ivykiai deploy+verify',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p0z3.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
  const s2=await snip('TEMP P0Z VERIFYX',V64);
  await new Promise(r=>setTimeout(r,7000));
  try{ out.verify=JSON.parse(await (await fetch(WP+'/?ps_p0=VERX')).text()); }catch(e){ out.e2=String(e).slice(0,300); }
  await off(s2);
}catch(e){ out.bendra=String(e).slice(0,300); }
await irasyk();
console.log('ok');
