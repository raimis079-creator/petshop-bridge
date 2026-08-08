const USER=process.env.WP_USER.trim(),PASS=process.env.WP_APP_PASS.trim();
const AUTH='Basic '+Buffer.from(USER+':'+PASS).toString('base64');
const BASE='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const TOK=process.env.GH_TOKEN;
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const A='aWYoIWRlZmluZWQoJ0FCU1BBVEgnKSlyZXR1cm47CmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoKCRfR0VUWydwc19iNzE0J10/PycnKSE9PSdCNzE0eCcpIHJldHVybjsKICBpZigoJF9HRVRbJ2snXT8/JycpIT09J3BzMjAyNicpIHJldHVybjsKICBpZighaGVhZGVyc19zZW50KCkpeyBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6YXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyB9CiAgQHNldF90aW1lX2xpbWl0KDIyMCk7CiAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkdD0kd3BkYi0+cHJlZml4Lidwc19zb3VyY2VzJzsgJG89YXJyYXkoJ3YnPT4nQjcxNCcpOwoKICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgcG9zdF9pZCBGUk9NIHskcH1wb3N0bWV0YSBwbQogICAgIElOTkVSIEpPSU4geyRwfXBvc3RzIHBvIE9OIHBvLklEPXBtLnBvc3RfaWQgQU5EIHBvLnBvc3RfdHlwZT0ncHJvZHVjdCcKICAgICBXSEVSRSBwbS5tZXRhX2tleT0nX3BzX2JlX3NhbHRpbmlvJyBBTkQgcG0ubWV0YV92YWx1ZT0nMSciKTsKICAkb1sncGF6eW1ldHUnXT1jb3VudCgkaWRzKTsKCiAgZm9yZWFjaCgkaWRzIGFzICRwaWQpewogICAgJHBpZD0oaW50KSRwaWQ7CiAgICAkc2FuZD1nZXRfcG9zdF9tZXRhKCRwaWQsJ19wc19zYW5kZWxpcycsdHJ1ZSk7CiAgICAkcmVnPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHNvdXJjZSxpc19hY3RpdmUsc3VwcGxpZXJfc2t1IEZST00geyR0fSBXSEVSRSBwcm9kdWN0X2lkPSVkIiwkcGlkKSxBUlJBWV9BKTsKICAgICRtZXRhPWNsYXNzX2V4aXN0cygnUGV0c2hvcF9Tb3VyY2VzJyk/UGV0c2hvcF9Tb3VyY2VzOjpzdXNrYWljaXVvdGkoJHBpZCk6YXJyYXkoKTsKICAgICRtcz1hcnJheSgpOyBmb3JlYWNoKCRtZXRhIGFzICR4KSAkbXNbXT0keFsnc291cmNlJ107CiAgICAkb1sncHJla2VzJ11bXT1hcnJheSgKICAgICAgJ2lkJz0+JHBpZCwnYnVzZW5hJz0+Z2V0X3Bvc3Rfc3RhdHVzKCRwaWQpLAogICAgICAncGF2Jz0+bWJfc3Vic3RyKGh0bWxfZW50aXR5X2RlY29kZShnZXRfdGhlX3RpdGxlKCRwaWQpKSwwLDQwKSwKICAgICAgJ3NhbmRlbGlzJz0+JHNhbmQsCiAgICAgICdyZWdpc3RyZSc9PmFycmF5X21hcChmdW5jdGlvbigkcil7IHJldHVybiAkclsnc291cmNlJ10uJygnLiRyWydpc19hY3RpdmUnXS4nKSc7IH0sJHJlZyksCiAgICAgICdtZXRhX3NhbHRpbmlhaSc9PiRtcywKICAgICAgJ3piX3NrdSc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3piX3N1cHBsaWVyX3NrdScsdHJ1ZSksCiAgICAgICd6Yl9xdHknPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ196Yl9xdHknLHRydWUpLAogICAgICAnemJfc3luYyc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3piX2xhc3Rfc3luYycsdHJ1ZSksCiAgICAgICd2Zl9za3UnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ192Zl9zdXBwbGllcl9za3UnLHRydWUpLAogICAgICAnb3duJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfb3duX3N0b2NrX3F0eScsdHJ1ZSksCiAgICAgICdzdG9jayc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3N0b2NrJyx0cnVlKSwKICAgICk7CiAgfQogIC8vIGthIGdyYXppbmEgUGV0c2hvcF9Tb3VyY2VzOjpsYXVrYWkgemIKICBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfU291cmNlcycpKXsKICAgICRvWydsYXVrYWlfemInXT1QZXRzaG9wX1NvdXJjZXM6OmxhdWthaSgnemInKTsKICAgICRvWydsYXVrYWlfdmYnXT1QZXRzaG9wX1NvdXJjZXM6OmxhdWthaSgndmYnKTsKICB9CiAgZWNobyB3cF9qc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sIDYpOwo=';
async function putResult(n,o){
  const url='https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/'+n;
  let sha;const g=await fetch(url,{headers:{Authorization:'Bearer '+TOK}});
  if(g.status===200) sha=(await g.json()).sha;
  const b={message:'r '+n,content:Buffer.from(JSON.stringify(o,null,1)).toString('base64')}; if(sha)b.sha=sha;
  const r=await fetch(url,{method:'PUT',headers:{Authorization:'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(b)});
  console.log('putResult',n,r.status);
}
const out={version:'S714-V1',errors:[]};
let id=null;
try{
  const r=await fetch(BASE,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP Be Saltinio Tyrimas (S714)',code:Buffer.from(A,'base64').toString('utf8'),scope:'global',active:true,priority:11})});
  id=(await r.json()).id; out.snip=id;
  await new Promise(x=>setTimeout(x,3000));
  const rr=await fetch('https://dev.avesa.lt/?ps_b714=B714x&k=ps2026&cb='+Date.now(),{headers:{'User-Agent':'Mozilla/5.0'}});
  const t=await rr.text();
  try{out.rez=JSON.parse(t);}catch(e){out.raw=t.slice(0,3000);}
}catch(e){out.errors.push(String(e));}
if(id) await fetch(BASE+'/'+id,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
await putResult('s714_v1.json',out);
console.log('DONE');
