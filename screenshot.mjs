const USER=process.env.WP_USER.trim(),PASS=process.env.WP_APP_PASS.trim();
const AUTH='Basic '+Buffer.from(USER+':'+PASS).toString('base64');
const BASE='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const TOK=process.env.GH_TOKEN;
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const A='aWYoIWRlZmluZWQoJ0FCU1BBVEgnKSlyZXR1cm47CmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoKCRfR0VUWydwc19kNzAxJ10/PycnKSE9PSdENzAxeCcpIHJldHVybjsKICBpZigoJF9HRVRbJ2snXT8/JycpIT09J3BzMjAyNicpIHJldHVybjsKICAkcmV6PSgkX0dFVFsncmV6J10/PycnKTsKICBpZigkcmV6PT09J3NrYWl0eXRpJyl7CiAgICBpZighaGVhZGVyc19zZW50KCkpeyBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6YXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyB9CiAgICBnbG9iYWwgJHdwZGI7ICRsaz0kd3BkYi0+cHJlZml4Lid3Y19wcm9kdWN0X21ldGFfbG9va3VwJzsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoCiAgICAgICd6eW1lJz0+Z2V0X29wdGlvbigncHNfZDcwMV96eW1lJyksCiAgICAgICdtZXRhJz0+Z2V0X3Bvc3RfbWV0YSgxNDkyOSwnX3JlZ3VsYXJfcHJpY2UnLHRydWUpLAogICAgICAnbG9va3VwJz0+JHdwZGItPmdldF92YXIoIlNFTEVDVCBtaW5fcHJpY2UgRlJPTSB7JGxrfSBXSEVSRSBwcm9kdWN0X2lkPTE0OTI5IiksCiAgICApLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKICB9CiAgLy8genltZWppbWFzIHBlciBzaHV0ZG93biDigJQgYXIgamlzIGFwc2tyaXRhaSB2eWtkb21hcyBzdSBleGl0CiAgYWRkX2FjdGlvbignc2h1dGRvd24nLCBmdW5jdGlvbigpewogICAgdXBkYXRlX29wdGlvbigncHNfZDcwMV96eW1lJywgJ3NodXRkb3duIGl2eWtvICcuY3VycmVudF90aW1lKCdteXNxbCcpLCBmYWxzZSk7CiAgfSwgMCk7CiAgZGVsZXRlX29wdGlvbigncHNfZDcwMV96eW1lJyk7CiAgdXBkYXRlX3Bvc3RfbWV0YSgxNDkyOSwnX3JlZ3VsYXJfcHJpY2UnLCc2LjY2Jyk7CiAgdXBkYXRlX3Bvc3RfbWV0YSgxNDkyOSwnX3ByaWNlJywnNi42NicpOwogIGlmKCFoZWFkZXJzX3NlbnQoKSl7IG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTphcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IH0KICBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdyYXN5dGEnPT4nNi42NicsJ2xhdWtpYW0nPT4nc2h1dGRvd24nKSk7CiAgZXhpdDsKfSwgNik7Cg==';
async function putResult(n,o){
  const url='https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/'+n;
  let sha;const g=await fetch(url,{headers:{Authorization:'Bearer '+TOK}});
  if(g.status===200) sha=(await g.json()).sha;
  const b={message:'r '+n,content:Buffer.from(JSON.stringify(o,null,1)).toString('base64')}; if(sha)b.sha=sha;
  const r=await fetch(url,{method:'PUT',headers:{Authorization:'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(b)});
  console.log('putResult',n,r.status);
}
const out={version:'S701-V1',errors:[]};
try{
  const r=await fetch(BASE,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP Shutdown Diagnostika (S701)',code:Buffer.from(A,'base64').toString('utf8'),scope:'global',active:true,priority:11})});
  const id=(await r.json()).id;
  await new Promise(x=>setTimeout(x,3500));
  out.rasymas=await (await fetch('https://dev.avesa.lt/?ps_d701=D701x&k=ps2026&cb='+Date.now(),{headers:{'User-Agent':'Mozilla/5.0'}})).text();
  await new Promise(x=>setTimeout(x,2500));
  out.patikra=JSON.parse(await (await fetch('https://dev.avesa.lt/?ps_d701=D701x&k=ps2026&rez=skaityti&cb='+Date.now(),{headers:{'User-Agent':'Mozilla/5.0'}})).text());
  // grazinam
  await fetch(BASE+'/'+id,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
}catch(e){out.errors.push(String(e));}
await putResult('s701_v1.json',out);
console.log('DONE');
