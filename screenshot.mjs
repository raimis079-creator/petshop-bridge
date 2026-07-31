import { execSync } from 'child_process';
import fs from 'fs';
import { chromium } from 'playwright';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={}; let sid=null;
// ★ Senu TEMP snippet'u valymas — kitaip senas atsako i ta pati rakta.
try{
  const ls=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"');
  const arr=JSON.parse(ls.out); const off=[];
  for(const s0 of arr){ if(s0.name && s0.name.indexOf('TEMP')===0 && s0.active){
    fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
    sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+s0.id+'"');
    off.push(s0.id+':'+s0.name); } }
  O.deaktyvuota_TEMP=off;
}catch(e){ O.valymo_klaida=String(e).slice(0,200); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgQ2xlYW51cCB2MQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfY2w3J10pIHx8ICRfR0VUWydwc19jbDcnXSAhPT0gJ0NsN3oxJyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZ2xvYmFsICR3cGRiOwogICAgJHIgPSBhcnJheSgnVkVSU0lKQSc9PidjbGVhbi12MS0yMDI2LTA3LTMxJyk7CgogICAgLy8gLS0tIDEpIFRlc3RpbmlzIHZhcnRvdG9qYXMgcHNfbThfZTJlIC0tLQogICAgJHUgPSBnZXRfdXNlcl9ieSgnbG9naW4nLCdwc19tOF9lMmUnKTsKICAgIGlmICgkdSkgewogICAgICAgICR1aWQgPSAoaW50KSR1LT5JRDsKICAgICAgICAkclsndXNlcl9yYWRvJ10gPSAkdWlkOwogICAgICAgIC8vIGpvIGF1Z2ludGluaWFpIChqZWkgYW5rZXRhIHNwxJdqbyBrYSBub3JzIHN1a3VydGkpCiAgICAgICAgJHJbJ3BldHNfaXN0cmludGEnXSA9ICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgKICAgICAgICAgICAgIkRFTEVURSBGUk9NIHskd3BkYi0+cHJlZml4fXBzX3BldHMgV0hFUkUgdXNlcl9pZD0lZCIsICR1aWQpKTsKICAgICAgICByZXF1aXJlX29uY2UgQUJTUEFUSC4nd3AtYWRtaW4vaW5jbHVkZXMvdXNlci5waHAnOwogICAgICAgICRyWyd1c2VyX2lzdHJpbnRhcyddID0gd3BfZGVsZXRlX3VzZXIoJHVpZCkgPyB0cnVlIDogZmFsc2U7CiAgICB9IGVsc2UgeyAkclsndXNlcl9yYWRvJ10gPSAnbmVyYXN0YXMnOyB9CiAgICAkclsndXNlcl9wbyddID0gZ2V0X3VzZXJfYnkoJ2xvZ2luJywncHNfbThfZTJlJykgPyAnVklTIERBUiBZUkEnIDogJ2lzdHJpbnRhcyc7CgogICAgLy8gLS0tIDIpIFV6c2FreW1vIDM0NzIwIF9wc19jb21wbGV0ZWRfYXQgYXRzdGF0eW1hcyAtLS0KICAgIC8vIFByYWRpbmUgYnVrbGU6IG1ldG9zIE5FQlVWTyAocmVjb24gcm9kZSBzdGFtcD1Ob25lKSAtPiB0cmluYW0uCiAgICAkbyA9IHdjX2dldF9vcmRlcigzNDcyMCk7CiAgICBpZiAoJG8pIHsKICAgICAgICAkclsnc3RhbXBfcHJpZXMnXSA9ICRvLT5nZXRfbWV0YSgnX3BzX2NvbXBsZXRlZF9hdCcsIHRydWUpOwogICAgICAgICRvLT5kZWxldGVfbWV0YV9kYXRhKCdfcHNfY29tcGxldGVkX2F0Jyk7CiAgICAgICAgJG8tPnNhdmUoKTsKICAgICAgICAkbzIgPSB3Y19nZXRfb3JkZXIoMzQ3MjApOwogICAgICAgICRyWydzdGFtcF9wbyddID0gJG8yLT5nZXRfbWV0YSgnX3BzX2NvbXBsZXRlZF9hdCcsIHRydWUpOwogICAgICAgICRyWydzdGF0dXNhcyddID0gJG8yLT5nZXRfc3RhdHVzKCk7CiAgICB9CgogICAgLy8gLS0tIDMpIFRFTVAgc25pcHBldCd1IGludmVudG9yaXVzICh0cnluaW1hcyB0aWsgcmFua2EgV1AgYWRtaW4pIC0tLQogICAgJHQgPSAkd3BkYi0+cHJlZml4LidzbmlwcGV0cyc7CiAgICAkclsndGVtcF9zbmlwcGV0YWknXSA9ICR3cGRiLT5nZXRfcmVzdWx0cygKICAgICAgICAiU0VMRUNUIGlkLCBuYW1lLCBhY3RpdmUgRlJPTSAkdCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBPUkRFUiBCWSBpZCIsIEFSUkFZX0EpOwogICAgJHJbJ3RlbXBfYWt0eXZ1c19saWtvJ10gPSAoaW50KSAkd3BkYi0+Z2V0X3ZhcigKICAgICAgICAiU0VMRUNUIENPVU5UKCopIEZST00gJHQgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0xIik7CgogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fUFJFVFRZX1BSSU5UKTsKICAgIGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Cleanup v1',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('m8_e2e.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
const a=sh('curl -sSk -m 60 "'+SITE+'/?ps_cl7=Cl7z1"');
let A=null; try{A=JSON.parse(a.out);}catch(e){O.auth_raw=a.out.slice(0,800);}
O.clean = A;

fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('m8_e2e.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
