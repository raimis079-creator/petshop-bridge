const USER=process.env.WP_USER.trim(),PASS=process.env.WP_APP_PASS.trim();
const AUTH='Basic '+Buffer.from(USER+':'+PASS).toString('base64');
const BASE='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const TOK=process.env.GH_TOKEN;
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const A='aWYoIWRlZmluZWQoJ0FCU1BBVEgnKSlyZXR1cm47CmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoKCRfR0VUWydwc19hNjgwJ10/PycnKSE9PSdBNjgweCcpIHJldHVybjsKICBpZigoJF9HRVRbJ2snXT8/JycpIT09J3BzMjAyNicpIHJldHVybjsKICBpZighaGVhZGVyc19zZW50KCkpeyBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6YXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyB9CiAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidBNjgwJyk7CiAgLy8gc25pcHBldGFzIDUxMiDigJQgYWtvcmRlb25hcwogICRzdD0kd3BkYi0+cHJlZml4LidzbmlwcGV0cyc7CiAgJHM9JHdwZGItPmdldF9yb3coIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSxjb2RlIEZST00geyRzdH0gV0hFUkUgaWQ9NTEyIiwgQVJSQVlfQSk7CiAgaWYoJHMpICRvWydzbmlwNTEyJ109YXJyYXkoJ25hbWUnPT4kc1snbmFtZSddLCdhY3RpdmUnPT4kc1snYWN0aXZlJ10sJ2tvZGFzJz0+bWJfc3Vic3RyKCRzWydjb2RlJ10sMCw0MDAwKSk7CiAgLy8ga2l0aSBzbmlwcGV0YWkgYXBpZSBhcHJhc3ltdXMKICAkb1sna2l0aSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlIEZST00geyRzdH0gV0hFUkUgYWN0aXZlPTEgQU5EIChjb2RlIExJS0UgJyVhY2NvcmRpb24lJyBPUiBjb2RlIExJS0UgJyVha29yZGVvbiUnIE9SIG5hbWUgTElLRSAnJWFwcmFzJScgT1IgbmFtZSBMSUtFICclZGVzY3JpJScpIiwgQVJSQVlfQSk7CiAgLy8gVE9QIG1ldGEgcmFrdGFpIHByZWtlbXMgKGthZCBtYXR5dHVtZSwga2FzIHJlYWxpYWkgbmF1ZG9qYW1hKQogICRvWyd0b3BfbWV0YSddPSR3cGRiLT5nZXRfcmVzdWx0cygKICAgICJTRUxFQ1QgcG0ubWV0YV9rZXksIENPVU5UKCopIGMgRlJPTSB7JHB9cG9zdG1ldGEgcG0KICAgICBJTk5FUiBKT0lOIHskcH1wb3N0cyBwbyBPTiBwby5JRD1wbS5wb3N0X2lkIEFORCBwby5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwby5wb3N0X3N0YXR1cz0ncHVibGlzaCcKICAgICBXSEVSRSBwbS5tZXRhX3ZhbHVlPD4nJyBBTkQgcG0ubWV0YV9rZXkgTk9UIExJS0UgJ1xcXyUnCiAgICAgR1JPVVAgQlkgcG0ubWV0YV9rZXkgT1JERVIgQlkgYyBERVNDIExJTUlUIDMwIiwgQVJSQVlfQSk7CiAgZWNobyB3cF9qc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sIDYpOwo=';
async function putResult(n,o){
  const url='https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/'+n;
  let sha;const g=await fetch(url,{headers:{Authorization:'Bearer '+TOK}});
  if(g.status===200) sha=(await g.json()).sha;
  const b={message:'r '+n,content:Buffer.from(JSON.stringify(o,null,1)).toString('base64')}; if(sha)b.sha=sha;
  const r=await fetch(url,{method:'PUT',headers:{Authorization:'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(b)});
  console.log('putResult',n,r.status);
}
const out={version:'S680-V1',errors:[]};
let id=null;
try{
  const r=await fetch(BASE,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP Akordeono Recon (S680)',code:Buffer.from(A,'base64').toString('utf8'),scope:'global',active:true,priority:11})});
  id=(await r.json()).id; out.snip=id;
  await new Promise(x=>setTimeout(x,3000));
  const rr=await fetch('https://dev.avesa.lt/?ps_a680=A680x&k=ps2026&cb='+Date.now(),{headers:{'User-Agent':'Mozilla/5.0'}});
  const t=await rr.text();
  try{out.rez=JSON.parse(t);}catch(e){out.raw=t.slice(0,3000);}
}catch(e){out.errors.push(String(e));}
if(id) await fetch(BASE+'/'+id,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
await putResult('s680_v1.json',out);
console.log('DONE');
