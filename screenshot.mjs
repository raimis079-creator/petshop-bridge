const USER=process.env.WP_USER.trim(),PASS=process.env.WP_APP_PASS.trim();
const AUTH='Basic '+Buffer.from(USER+':'+PASS).toString('base64');
const BASE='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const TOK=process.env.GH_TOKEN;
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const A='aWYoIWRlZmluZWQoJ0FCU1BBVEgnKSlyZXR1cm47CmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoKCRfR0VUWydwc19wNzEzJ10/PycnKSE9PSdQNzEzeCcpIHJldHVybjsKICBpZigoJF9HRVRbJ2snXT8/JycpIT09J3BzMjAyNicpIHJldHVybjsKICBpZighaGVhZGVyc19zZW50KCkpeyBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6YXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyB9CiAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkdD0kd3BkYi0+cHJlZml4Lidwc19hdl96dXJuYWxhcyc7ICRvPWFycmF5KCd2Jz0+J1A3MTMnKTsKICAvLyBwYXNrdXRpbmVzIG1hc2luZXMgb3BlcmFjaWpvcwogICRvWydvcGVyYWNpam9zJ109JHdwZGItPmdldF9yZXN1bHRzKAogICAgIlNFTEVDVCBvcGVyYWNpamEsIENPVU5UKCopIGlyYXN1LCBNSU4oc3VrdXJ0YSkgbGFpa2FzLAogICAgICAgU1VNKGF0c2F1a3RhKSBhdHNhdWt0dSwgR1JPVVBfQ09OQ0FUKERJU1RJTkNUIHRhcG8pIHRhcG8KICAgICBGUk9NIHskdH0gV0hFUkUgb3BlcmFjaWphIExJS0UgJ01TJScgT1Igb3BlcmFjaWphIExJS0UgJ1pCJScKICAgICBHUk9VUCBCWSBvcGVyYWNpamEgT1JERVIgQlkgTUlOKHN1a3VydGEpIERFU0MgTElNSVQgNiIsIEFSUkFZX0EpOwogIC8vIGtvbmtyZWNpdSBwcmVraXUgYnVzZW5hCiAgZm9yZWFjaChhcnJheSgxMzU5NywzMzk0MCwxMzYxOCwxMzYyOCwxMzY3OSwxMzY4NSwxMzEwNSwxMzcwMCwxMzE0OCwxMzE1MSwxNDc2OCkgYXMgJHBpZCl7CiAgICAkc3Q9Z2V0X3Bvc3Rfc3RhdHVzKCRwaWQpOwogICAgaWYoJHN0KSAkb1sncHJla2VzJ11bJHBpZF09YXJyYXkoJ2J1c2VuYSc9PiRzdCwncGF2Jz0+bWJfc3Vic3RyKGh0bWxfZW50aXR5X2RlY29kZShnZXRfdGhlX3RpdGxlKCRwaWQpKSwwLDQwKSk7CiAgfQogIC8vIFpCIHNlbm9zIHByZWtlcyDigJQgYXIgdmlzb3MgdmlzIGRhciBkcmFmdAogICRvWyd6Yl9zZW5vc19wdWJsaXNoJ109KGludCkkd3BkYi0+Z2V0X3ZhcigKICAgICJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cG9zdHMgcG8KICAgICBJTk5FUiBKT0lOIHskcH1wb3N0bWV0YSBzbSBPTiBzbS5wb3N0X2lkPXBvLklEIEFORCBzbS5tZXRhX2tleT0nX3BzX3NhbmRlbGlzJyBBTkQgc20ubWV0YV92YWx1ZT0nemInCiAgICAgV0hFUkUgcG8ucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG8ucG9zdF9zdGF0dXM9J3B1Ymxpc2gnCiAgICAgICBBTkQgKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIHBvc3RfaWQ9cG8uSUQgQU5EIG1ldGFfa2V5PSdfemJfbGFzdF9zeW5jJykgPCBEQVRFX1NVQihOT1coKSwgSU5URVJWQUwgMjQgSE9VUikiKTsKICAkb1sna3J1dm9zJ109JHdwZGItPmdldF9yZXN1bHRzKAogICAgIlNFTEVDVCBwb3N0X3N0YXR1cywgQ09VTlQoKikgYyBGUk9NIHskcH1wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEdST1VQIEJZIHBvc3Rfc3RhdHVzIiwgQVJSQVlfQSk7CiAgZWNobyB3cF9qc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sIDYpOwo=';
async function putResult(n,o){
  const url='https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/'+n;
  let sha;const g=await fetch(url,{headers:{Authorization:'Bearer '+TOK}});
  if(g.status===200) sha=(await g.json()).sha;
  const b={message:'r '+n,content:Buffer.from(JSON.stringify(o,null,1)).toString('base64')}; if(sha)b.sha=sha;
  const r=await fetch(url,{method:'PUT',headers:{Authorization:'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(b)});
  console.log('putResult',n,r.status);
}
const out={version:'S713-V1',errors:[]};
let id=null;
try{
  const r=await fetch(BASE,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP Masinio Rezultato Patikra (S713)',code:Buffer.from(A,'base64').toString('utf8'),scope:'global',active:true,priority:11})});
  id=(await r.json()).id; out.snip=id;
  await new Promise(x=>setTimeout(x,3000));
  const rr=await fetch('https://dev.avesa.lt/?ps_p713=P713x&k=ps2026&cb='+Date.now(),{headers:{'User-Agent':'Mozilla/5.0'}});
  const t=await rr.text();
  try{out.rez=JSON.parse(t);}catch(e){out.raw=t.slice(0,3000);}
}catch(e){out.errors.push(String(e));}
if(id) await fetch(BASE+'/'+id,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
await putResult('s713_v1.json',out);
console.log('DONE');
