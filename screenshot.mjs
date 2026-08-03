import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r346',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run348-v1'}; let sid=null;
// TEMP valymas
try{
  const ls=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"');
  const arr=JSON.parse(ls.out); const off=[];
  for(const s0 of arr){ if(s0.name && s0.name.indexOf('TEMP')===0 && s0.active){
    fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
    sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+s0.id+'"');
    off.push(s0.id+':'+s0.name); } }
  O.deaktyvuota_TEMP=off;
}catch(e){ O.valymo_klaida=String(e).slice(0,200); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzM0OCByZWNvbiDigJQgcGV0LWZvcm0uanMgZmVlZGluZy1wZXQtd2VpZ2h0IGtvbnRla3N0YXMgKyBtdSBmaXggcGFydW9zYQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfcjM0OCddKSB8fCAkX0dFVFsncHNfcjM0OCddICE9PSAnUjM0OG03JyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgJHIgPSBhcnJheSgnVkVSU0lKQSc9PidzMzQ4LXJlY29uLXYxJyk7CiAgICAkZmFpbGFpID0gYXJyYXkoCiAgICAgICAgJ3BldF9mb3JtJyAgICA9PiBhcnJheShXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2Fzc2V0cy9wZXQtZm9ybS5qcycsIDEzMzAsIDE0MzApLAogICAgICAgICdjYWxjX2hhbmQnICAgPT4gYXJyYXkoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9hc3NldHMvY2FsYy1oYW5kb2ZmLmpzJywgNjAsIDEyMCksCiAgICAgICAgJ3BldF9wcm9maWxlJyA9PiBhcnJheShXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2Fzc2V0cy9wZXQtcHJvZmlsZS5qcycsIDI4NTAsIDI5MDApLAogICAgKTsKICAgIGZvcmVhY2ggKCRmYWlsYWkgYXMgJGsgPT4gJGNmZykgewogICAgICAgIGxpc3QoJHAsJG51bywkaWtpKSA9ICRjZmc7CiAgICAgICAgJGMgPSBAZmlsZV9nZXRfY29udGVudHMoJHApOwogICAgICAgIGlmICgkYz09PWZhbHNlKXsgJHJbJGtdPSdORVJBU1RBJzsgY29udGludWU7IH0KICAgICAgICAkbHMgPSBleHBsb2RlKCJcbiIsJGMpOwogICAgICAgICRyWyRrLidfbWV0YSddID0gYXJyYXkoJ2R5ZGlzJz0+c3RybGVuKCRjKSwnc2hhMjU2Jz0+c3Vic3RyKGhhc2goJ3NoYTI1NicsJGMpLDAsMTYpLCdlaWx1Y2l1Jz0+Y291bnQoJGxzKSk7CiAgICAgICAgJG91dCA9IGFycmF5KCk7CiAgICAgICAgZm9yICgkaT0kbnVvLTE7ICRpPCRpa2kgJiYgJGk8Y291bnQoJGxzKTsgJGkrKykgJG91dFtdID0gKCRpKzEpLic6ICcucnRyaW0oJGxzWyRpXSk7CiAgICAgICAgJHJbJGtdID0gJG91dDsKICAgIH0KICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFU3xKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S348 recon',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 5');
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_r348=R348m7"');
  try{ O.rez=JSON.parse(x.out); }catch(e){ O.raw=x.out.slice(0,1500); }
  fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');
}
putB64('r348.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done sid='+sid);
