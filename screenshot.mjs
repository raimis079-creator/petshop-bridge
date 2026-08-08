const USER=process.env.WP_USER.trim(),PASS=process.env.WP_APP_PASS.trim();
const AUTH='Basic '+Buffer.from(USER+':'+PASS).toString('base64');
const BASE='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const TOK=process.env.GH_TOKEN;
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const A='aWYoIWRlZmluZWQoJ0FCU1BBVEgnKSlyZXR1cm47CmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoKCRfR0VUWydwc19kNzAyJ10/PycnKSE9PSdENzAyeCcpIHJldHVybjsKICBpZigoJF9HRVRbJ2snXT8/JycpIT09J3BzMjAyNicpIHJldHVybjsKICBpZighaGVhZGVyc19zZW50KCkpeyBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6YXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyB9CiAgZ2xvYmFsICR3cGRiOyAkbGs9JHdwZGItPnByZWZpeC4nd2NfcHJvZHVjdF9tZXRhX2xvb2t1cCc7ICRwaWQ9MTQ5Mjk7CiAgJG89YXJyYXkoJ3YnPT4nRDcwMicpOwogICRsZ2V0PWZ1bmN0aW9uKCkgdXNlICgkd3BkYiwkbGssJHBpZCl7IHJldHVybiAkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIG1pbl9wcmljZSBGUk9NIHskbGt9IFdIRVJFIHByb2R1Y3RfaWQ9eyRwaWR9Iik7IH07CgogIHVwZGF0ZV9wb3N0X21ldGEoJHBpZCwnX3JlZ3VsYXJfcHJpY2UnLCc0LjQ0Jyk7CiAgdXBkYXRlX3Bvc3RfbWV0YSgkcGlkLCdfcHJpY2UnLCc0LjQ0Jyk7CiAgJG9bJzFfcG9fbWV0YSddPWFycmF5KCdtZXRhJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfcmVndWxhcl9wcmljZScsdHJ1ZSksJ2xvb2t1cCc9PiRsZ2V0KCkpOwoKICAvLyBBKSB1cGRhdGVfbG9va3VwX3RhYmxlIHBlciBXQ19EYXRhX1N0b3JlCiAgY2xlYW5fcG9zdF9jYWNoZSgkcGlkKTsgd3BfY2FjaGVfZGVsZXRlKCRwaWQsJ3Bvc3RfbWV0YScpOwogIGlmKGZ1bmN0aW9uX2V4aXN0cygnd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cycpKSB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCRwaWQpOwogIHRyeXsKICAgICRkcz1XQ19EYXRhX1N0b3JlOjpsb2FkKCdwcm9kdWN0Jyk7CiAgICAkb1snZHNfaW5zdGFuY2UnXT1tZXRob2RfZXhpc3RzKCRkcywnZ2V0X2N1cnJlbnRfY2xhc3NfbmFtZScpPyRkcy0+Z2V0X2N1cnJlbnRfY2xhc3NfbmFtZSgpOic/JzsKICAgICRvWydpc19jYWxsYWJsZSddPWlzX2NhbGxhYmxlKGFycmF5KCRkcywndXBkYXRlX2xvb2t1cF90YWJsZScpKTsKICAgICRkcy0+dXBkYXRlX2xvb2t1cF90YWJsZSgkcGlkLCd3Y19wcm9kdWN0X21ldGFfbG9va3VwJyk7CiAgICAkb1snMl9wb191cGRhdGVfbG9va3VwX3RhYmxlJ109JGxnZXQoKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0Ffa2xhaWRhJ109JGUtPmdldE1lc3NhZ2UoKTsgfQoKICAvLyBCKSB0aWVzaW9naWFpIHBlciBXQ19Qcm9kdWN0X0RhdGFfU3RvcmVfQ1BUCiAgdHJ5ewogICAgaWYoY2xhc3NfZXhpc3RzKCdXQ19Qcm9kdWN0X0RhdGFfU3RvcmVfQ1BUJykpewogICAgICAkY3B0PW5ldyBXQ19Qcm9kdWN0X0RhdGFfU3RvcmVfQ1BUKCk7CiAgICAgICRjcHQtPnVwZGF0ZV9sb29rdXBfdGFibGUoJHBpZCwnd2NfcHJvZHVjdF9tZXRhX2xvb2t1cCcpOwogICAgICAkb1snM19wb19DUFQnXT0kbGdldCgpOwogICAgfSBlbHNlICRvWyczX3BvX0NQVCddPSdrbGFzZXMgbmVyYSc7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydCX2tsYWlkYSddPSRlLT5nZXRNZXNzYWdlKCk7IH0KCiAgLy8gQykgcGVyIHByb2R1a3RvIHNhdmUoKQogIHRyeXsKICAgIGNsZWFuX3Bvc3RfY2FjaGUoJHBpZCk7IHdwX2NhY2hlX2RlbGV0ZSgkcGlkLCdwb3N0X21ldGEnKTsKICAgICRwcj13Y19nZXRfcHJvZHVjdCgkcGlkKTsKICAgICRvWydwcl9yZWd1bGFyX3ByaWVzX3NhdmUnXT0kcHI/JHByLT5nZXRfcmVndWxhcl9wcmljZSgpOm51bGw7CiAgICBpZigkcHIpeyAkcHItPnNhdmUoKTsgJG9bJzRfcG9fc2F2ZSddPSRsZ2V0KCk7IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0Nfa2xhaWRhJ109JGUtPmdldE1lc3NhZ2UoKTsgfQoKICAvLyBHUkFaSU5BTQogIHVwZGF0ZV9wb3N0X21ldGEoJHBpZCwnX3JlZ3VsYXJfcHJpY2UnLCc1LjY5Jyk7CiAgdXBkYXRlX3Bvc3RfbWV0YSgkcGlkLCdfcHJpY2UnLCc1LjY5Jyk7CiAgY2xlYW5fcG9zdF9jYWNoZSgkcGlkKTsgd3BfY2FjaGVfZGVsZXRlKCRwaWQsJ3Bvc3RfbWV0YScpOwogIGlmKGZ1bmN0aW9uX2V4aXN0cygnd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cycpKSB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCRwaWQpOwogICRwcjI9d2NfZ2V0X3Byb2R1Y3QoJHBpZCk7IGlmKCRwcjIpICRwcjItPnNhdmUoKTsKICAkb1snNV9nYWx1dGluaXMnXT1hcnJheSgnbWV0YSc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3JlZ3VsYXJfcHJpY2UnLHRydWUpLCdsb29rdXAnPT4kbGdldCgpKTsKCiAgZWNobyB3cF9qc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sIDYpOwo=';
async function putResult(n,o){
  const url='https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/'+n;
  let sha;const g=await fetch(url,{headers:{Authorization:'Bearer '+TOK}});
  if(g.status===200) sha=(await g.json()).sha;
  const b={message:'r '+n,content:Buffer.from(JSON.stringify(o,null,1)).toString('base64')}; if(sha)b.sha=sha;
  const r=await fetch(url,{method:'PUT',headers:{Authorization:'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(b)});
  console.log('putResult',n,r.status);
}
const out={version:'S702-V1',errors:[]};
let id=null;
try{
  const r=await fetch(BASE,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP Lookup Metodu Testas (S702)',code:Buffer.from(A,'base64').toString('utf8'),scope:'global',active:true,priority:11})});
  id=(await r.json()).id; out.snip=id;
  await new Promise(x=>setTimeout(x,3000));
  const rr=await fetch('https://dev.avesa.lt/?ps_d702=D702x&k=ps2026&cb='+Date.now(),{headers:{'User-Agent':'Mozilla/5.0'}});
  const t=await rr.text();
  try{out.rez=JSON.parse(t);}catch(e){out.raw=t.slice(0,3000);}
}catch(e){out.errors.push(String(e));}
if(id) await fetch(BASE+'/'+id,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
await putResult('s702_v1.json',out);
console.log('DONE');
