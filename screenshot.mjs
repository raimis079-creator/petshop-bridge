const USER=process.env.WP_USER.trim(),PASS=process.env.WP_APP_PASS.trim();
const AUTH='Basic '+Buffer.from(USER+':'+PASS).toString('base64');
const BASE='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const TOK=process.env.GH_TOKEN;
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const A='aWYoIWRlZmluZWQoJ0FCU1BBVEgnKSlyZXR1cm47CmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoKCRfR0VUWydwc192NjU4J10/PycnKSE9PSdWNjU4eCcpIHJldHVybjsKICBpZigoJF9HRVRbJ2snXT8/JycpIT09J3BzMjAyNicpIHJldHVybjsKICBpZighaGVhZGVyc19zZW50KCkpeyBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6YXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyB9CiAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidWNjU4Jyk7CiAgJGxrPSR3cGRiLT5wcmVmaXguJ3djX3Byb2R1Y3RfbWV0YV9sb29rdXAnOwoKICAvLyAxKSB0YXMgdmllbmFzIE5VTEwgbG9va3VwIGlyYXNhcwogICRvWydudWxsX2xvb2t1cCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGwucHJvZHVjdF9pZCwgcG8ucG9zdF90eXBlLCBwby5wb3N0X3N0YXR1cywgcG8ucG9zdF90aXRsZQogICAgIEZST00geyRsa30gbCBMRUZUIEpPSU4geyRwfXBvc3RzIHBvIE9OIHBvLklEPWwucHJvZHVjdF9pZAogICAgIFdIRVJFIGwudGF4X3N0YXR1cyBJUyBOVUxMIiwgQVJSQVlfQSk7CgogIC8vIDIpIGFyIGxpa28gbm9uZSBiZXQga3VyCiAgJG9bJ25vbmVfbGlrbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1wb3N0bWV0YQogICAgIFdIRVJFIG1ldGFfa2V5PSdfdGF4X3N0YXR1cycgQU5EIG1ldGFfdmFsdWU9J25vbmUnIik7CiAgJG9bJ25vbmVfbGlrb19sb29rdXAnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JGxrfSBXSEVSRSB0YXhfc3RhdHVzPSdub25lJyIpOwoKICAvLyAzKSBDUk9OOiBrYWRhIGtpdGFzIGltcG9ydGFzCiAgJGNyPV9nZXRfY3Jvbl9hcnJheSgpOyAkaW1wPWFycmF5KCk7CiAgaWYoaXNfYXJyYXkoJGNyKSkgZm9yZWFjaCgkY3IgYXMgJHRzPT4kaCl7IGZvcmVhY2goJGggYXMgJGhvb2s9PiR4KXsKICAgIGlmKHN0cmlwb3MoJGhvb2ssJ2ltcG9ydCcpIT09ZmFsc2UgfHwgc3RyaXBvcygkaG9vaywncG14aScpIT09ZmFsc2UgfHwgc3RyaXBvcygkaG9vaywneG1sJykhPT1mYWxzZSkKICAgICAgJGltcFtdPWFycmF5KCdob29rJz0+JGhvb2ssJ2thZGEnPT5kYXRlKCdZLW0tZCBIOmk6cycsJHRzKSk7CiAgfX0KICB1c29ydCgkaW1wLGZ1bmN0aW9uKCRhLCRiKXtyZXR1cm4gc3RyY21wKCRhWydrYWRhJ10sJGJbJ2thZGEnXSk7fSk7CiAgJG9bJ2FydGltaWF1c2lfaW1wb3J0YWknXT1hcnJheV9zbGljZSgkaW1wLDAsOCk7CiAgJG9bJ2RhYmFyJ109Y3VycmVudF90aW1lKCdteXNxbCcpOwoKICAvLyA0KSBwYXNrdXRpbmlhaSBpbXBvcnR1IHBhbGVpZGltYWkKICAkcGg9JHdwZGItPnByZWZpeC4ncG14aV9oaXN0b3J5JzsKICBpZigkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAneyRwaH0nIik9PT0kcGgpewogICAgJG9bJ3Bhc2t1dGluaWFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaW1wb3J0X2lkLGRhdGUsc3VtbWFyeSBGUk9NIHskcGh9IE9SREVSIEJZIGlkIERFU0MgTElNSVQgNiIsIEFSUkFZX0EpOwogIH0KCiAgLy8gNSkgS0VMSU9TIHByZWtlczoga2FpbmEga2xpZW50dWkgbmVwYWtpdG8/CiAgJG9bJ3ByZWtlcyddPWFycmF5KCk7CiAgZm9yZWFjaChhcnJheSgxMjQ1MiwxNDIyMiwxNDIxOCwxOTIxMCkgYXMgJHBpZCl7CiAgICAkcHI9d2NfZ2V0X3Byb2R1Y3QoJHBpZCk7IGlmKCEkcHIpIGNvbnRpbnVlOwogICAgJG9bJ3ByZWtlcyddW109YXJyYXkoJ2lkJz0+JHBpZCwncGF2Jz0+bWJfc3Vic3RyKGh0bWxfZW50aXR5X2RlY29kZShnZXRfdGhlX3RpdGxlKCRwaWQpKSwwLDM2KSwKICAgICAgJ3RheCc9PiRwci0+Z2V0X3RheF9zdGF0dXMoKSwncmVndWxhcic9PmdldF9wb3N0X21ldGEoJHBpZCwnX3JlZ3VsYXJfcHJpY2UnLHRydWUpLAogICAgICAna2xpZW50dWknPT53Y19nZXRfcHJpY2VfdG9fZGlzcGxheSgkcHIpLCdiZV9wdm0nPT5yb3VuZCh3Y19nZXRfcHJpY2VfZXhjbHVkaW5nX3RheCgkcHIpLDIpLAogICAgICAncHZtJz0+cm91bmQod2NfZ2V0X3ByaWNlX2luY2x1ZGluZ190YXgoJHByKS13Y19nZXRfcHJpY2VfZXhjbHVkaW5nX3RheCgkcHIpLDIpKTsKICB9CgogIC8vIDYpIGthdGFsb2dvIGtlc2FzIOKAlCBpc3RyaW5hbSwga2FkIG1hcnpvcyBwZXJzaXNrYWljaXVvdHUKICBkZWxldGVfdHJhbnNpZW50KCdwc19rYXRfZHVvbWVueXMnKTsKICAkb1sna2VzYXMnXT0naXN0cmludGFzJzsKCiAgZWNobyB3cF9qc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sIDYpOwo=';
async function putResult(n,o){
  const url='https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/'+n;
  let sha;const g=await fetch(url,{headers:{Authorization:'Bearer '+TOK}});
  if(g.status===200) sha=(await g.json()).sha;
  const b={message:'r '+n,content:Buffer.from(JSON.stringify(o,null,1)).toString('base64')}; if(sha)b.sha=sha;
  const r=await fetch(url,{method:'PUT',headers:{Authorization:'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(b)});
  console.log('putResult',n,r.status);
}
const out={version:'S658-V1',errors:[]};
let id=null;
try{
  const r=await fetch(BASE,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP PVM Patikra (S658)',code:Buffer.from(A,'base64').toString('utf8'),scope:'global',active:true,priority:11})});
  id=(await r.json()).id; out.snip=id;
  await new Promise(x=>setTimeout(x,3000));
  const rr=await fetch('https://dev.avesa.lt/?ps_v658=V658x&k=ps2026&cb='+Date.now(),{headers:{'User-Agent':'Mozilla/5.0'}});
  const t=await rr.text();
  try{out.rez=JSON.parse(t);}catch(e){out.raw=t.slice(0,3000);}
}catch(e){out.errors.push(String(e));}
if(id) await fetch(BASE+'/'+id,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
await putResult('s658_v1.json',out);
console.log('DONE');
