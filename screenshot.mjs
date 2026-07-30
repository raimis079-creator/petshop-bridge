import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={}; let sid=null;
// pirma deaktyvuoti visus senus TEMP Adapter Send Test snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP Adapter Send Test/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgQWRhcHRlciBTZW5kIFRlc3QgdjEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX3RzJ10pIHx8ICRfR0VUWydwc190cyddICE9PSAnVHM1dycgKSByZXR1cm47CiAgICAkcj1hcnJheSgpOwogICAgaWYgKCAhIGNsYXNzX2V4aXN0cygnUGV0c2hvcF9TZW5kZXJfQWRhcHRlcicpICkgeyAkclsnZXJyJ109J2tsYXNlIG5lcmFzdGEnOyB9CiAgICBlbHNlIHsKICAgICAgICAkbWsgPSBnZXRfb3B0aW9uKCdwZXRzaG9wX2VzcF9zZW5kZXJfbWsnKTsKICAgICAgICAkdGsgPSBnZXRfb3B0aW9uKCdwZXRzaG9wX2VzcF9zZW5kZXJfdGsnKTsKICAgICAgICAvLyB0b2tlbmFpIHNhdWdvbWkgYmFzZTY0CiAgICAgICAgJG1rX2QgPSBiYXNlNjRfZGVjb2RlKCRtaywgdHJ1ZSk7IGlmICgkbWtfZCAmJiBzdWJzdHIoJG1rX2QsMCwyKT09PSdleScpICRtayA9ICRta19kOwogICAgICAgICR0a19kID0gYmFzZTY0X2RlY29kZSgkdGssIHRydWUpOyBpZiAoJHRrX2QgJiYgc3Vic3RyKCR0a19kLDAsMik9PT0nZXknKSAkdGsgPSAkdGtfZDsKICAgICAgICAkYSA9IG5ldyBQZXRzaG9wX1NlbmRlcl9BZGFwdGVyKCRtaywgJHRrKTsKICAgICAgICAkclsnaXNfY29uZmlndXJlZCddID0gbWV0aG9kX2V4aXN0cygkYSwnaXNfY29uZmlndXJlZCcpID8gKCRhLT5pc19jb25maWd1cmVkKCk/MTowKSA6ICduL2EnOwoKICAgICAgICAvLyAxKSBEQUJBUlRJTklTIGFkYXB0ZXJpbyBrZWxpYXMKICAgICAgICAkcmVzID0gJGEtPnNlbmRfdHJhbnNhY3Rpb25hbF9lbWFpbCgKICAgICAgICAgICAgJ3JhaW11bmRhc0BneXZ1bmFpLmx0JywKICAgICAgICAgICAgJ1tURVNUXSBQZXRzaG9wIGRpc3BhdGNoIGdyYW5kaW5lcyBwYXRpa3JhJywKICAgICAgICAgICAgJzxwPlRlY2huaW5pcyB0ZXN0YXMuIEpva2lvIHZlaWtzbW8gbmVyZWlraWEuPC9wPicsCiAgICAgICAgICAgIGFycmF5KCd0b19uYW1lJz0+J1JhaW1pcycpCiAgICAgICAgKTsKICAgICAgICAkclsnYWRhcHRlcl9zZW5kJ10gPSAkcmVzOwoKICAgICAgICAvLyAyKSBUSUVTSU9HSU5JUyBrdmlldGltYXMgc3UgJ3RvJyBrYWlwIE9CSkVLVFUgKGhpcG90ZXplKQogICAgICAgICRib2R5ID0gYXJyYXkoCiAgICAgICAgICAgICdmcm9tJyAgICA9PiBhcnJheSgnZW1haWwnPT4ndGVycmFAcGV0c2hvcC5sdCcsJ25hbWUnPT4nUGV0c2hvcC5sdCcpLAogICAgICAgICAgICAndG8nICAgICAgPT4gYXJyYXkoJ2VtYWlsJz0+J3JhaW11bmRhc0BneXZ1bmFpLmx0JywnbmFtZSc9PidSYWltaXMnKSwKICAgICAgICAgICAgJ3N1YmplY3QnID0+ICdbVEVTVF0gdG89c3RydWN0IHZhcmlhbnRhcycsCiAgICAgICAgICAgICdodG1sJyAgICA9PiAnPHA+VGVjaG5pbmlzIHRlc3RhcyAoc3RydWN0KS48L3A+JywKICAgICAgICApOwogICAgICAgICRyZXNwID0gd3BfcmVtb3RlX3Bvc3QoJ2h0dHBzOi8vYXBpLnNlbmRlci5uZXQvdjIvbWVzc2FnZS9zZW5kJywgYXJyYXkoCiAgICAgICAgICAgICd0aW1lb3V0Jz0+MjAsCiAgICAgICAgICAgICdoZWFkZXJzJz0+YXJyYXkoJ0F1dGhvcml6YXRpb24nPT4nQmVhcmVyICcuJHRrLCdDb250ZW50LVR5cGUnPT4nYXBwbGljYXRpb24vanNvbicsJ0FjY2VwdCc9PidhcHBsaWNhdGlvbi9qc29uJyksCiAgICAgICAgICAgICdib2R5Jz0+d3BfanNvbl9lbmNvZGUoJGJvZHkpLAogICAgICAgICkpOwogICAgICAgICRyWydzdHJ1Y3RfdmFyaWFudCddID0gaXNfd3BfZXJyb3IoJHJlc3ApCiAgICAgICAgICAgID8gYXJyYXkoJ2Vycic9PiRyZXNwLT5nZXRfZXJyb3JfbWVzc2FnZSgpKQogICAgICAgICAgICA6IGFycmF5KCdjb2RlJz0+d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHJlc3ApLCdib2R5Jz0+bWJfc3Vic3RyKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyZXNwKSwwLDMwMCkpOwogICAgfQogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Adapter Send Test Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_ts=Ts5w"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_ts=Ts5w"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('tst.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
