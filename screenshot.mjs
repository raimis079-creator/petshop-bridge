const USER=process.env.WP_USER.trim(),PASS=process.env.WP_APP_PASS.trim();
const AUTH='Basic '+Buffer.from(USER+':'+PASS).toString('base64');
const BASE='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const TOK=process.env.GH_TOKEN;
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const A='aWYoIWRlZmluZWQoJ0FCU1BBVEgnKSlyZXR1cm47CmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoKCRfR0VUWydwc19pbWc2NjcnXT8/JycpIT09J0k2Njd4JykgcmV0dXJuOwogIGlmKCgkX0dFVFsnayddPz8nJykhPT0ncHMyMDI2JykgcmV0dXJuOwogIGlmKCFoZWFkZXJzX3NlbnQoKSl7IG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTphcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IH0KICBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7CiAgJGlkcz1hcnJheV9tYXAoJ2ludHZhbCcsZXhwbG9kZSgnLCcsJF9HRVRbJ2lkcyddPz8nJykpOwogICRpZHM9YXJyYXlfZmlsdGVyKCRpZHMpOwogICRvPWFycmF5KCd2Jz0+J0k2NjcnLCduJz0+Y291bnQoJGlkcyksJ2ltZyc9PmFycmF5KCksJ2thdCc9PmFycmF5KCkpOwogIGZvcmVhY2goJGlkcyBhcyAkcGlkKXsKICAgICR0PShpbnQpZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfdGh1bWJuYWlsX2lkJyx0cnVlKTsKICAgICRvWydpbWcnXVskcGlkXSA9ICR0ID8gKHdwX2dldF9hdHRhY2htZW50X2ltYWdlX3VybCgkdCwndGh1bWJuYWlsJykgPzogJycpIDogJyc7CiAgICAkaz13cF9nZXRfcG9zdF90ZXJtcygkcGlkLCdwcm9kdWN0X2NhdCcsYXJyYXkoJ2ZpZWxkcyc9PiduYW1lcycpKTsKICAgICRvWydrYXQnXVskcGlkXSA9IGlzX3dwX2Vycm9yKCRrKT8nJzppbXBsb2RlKCcsICcsYXJyYXlfc2xpY2UoJGssMCwyKSk7CiAgICAkb1sndXJsJ11bJHBpZF0gPSBnZXRfcGVybWFsaW5rKCRwaWQpOwogIH0KICBlY2hvIHdwX2pzb25fZW5jb2RlKCRvLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9LCA2KTsK';
async function putResult(n,o){
  const url='https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/'+n;
  let sha;const g=await fetch(url,{headers:{Authorization:'Bearer '+TOK}});
  if(g.status===200) sha=(await g.json()).sha;
  const b={message:'r '+n,content:Buffer.from(JSON.stringify(o,null,1)).toString('base64')}; if(sha)b.sha=sha;
  const r=await fetch(url,{method:'PUT',headers:{Authorization:'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(b)});
  console.log('putResult',n,r.status);
}
const out={version:'S667-V1',errors:[]};
let id=null;
try{
  const r=await fetch(BASE,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP Nuotrauku URL (S667)',code:Buffer.from(A,'base64').toString('utf8'),scope:'global',active:true,priority:11})});
  id=(await r.json()).id; out.snip=id;
  await new Promise(x=>setTimeout(x,3000));
  const rr=await fetch('https://dev.avesa.lt/?ps_img667=I667x&ids=19899,19893,19890,19887,19884,19881,19863,19878,19866,19875,19872,19869,19846,19843,19840,19837,19834,19831,19828,19824,19821,19818,19815,19812,19809,19806,19803,19800,19797,19849,19794,19790,19149,19086,19039,18508,18346,18344,18131,18128,17099,16292,16125,16085,16081,16064,16057,16061,34222,34223,34218,34219,34221,34220,34216,34215,34209,34208,34211,34212,34210,34214,34213,34239,34240,34241,34233,34234,34235,34236,34237,34238,34231,34229,34230,34245,34243,34244,34191,34192,34190,34194,34195,34193,15841,15838,15835,15829,15824,15821,15827,15818,15810,15808,15806,15802,15798&k=ps2026&cb='+Date.now(),{headers:{'User-Agent':'Mozilla/5.0'}});
  const t=await rr.text();
  try{out.rez=JSON.parse(t);}catch(e){out.raw=t.slice(0,3000);}
}catch(e){out.errors.push(String(e));}
if(id) await fetch(BASE+'/'+id,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
await putResult('s667_v1.json',out);
console.log('DONE');
