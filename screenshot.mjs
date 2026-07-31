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
// pirma deaktyvuoti visus senus TEMP ValidItems snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP ValidItems/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgVmFsaWQgSXRlbXMgRGVidWcgdjEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX3ZwJ10pIHx8ICRfR0VUWydwc192cCddICE9PSAnVnAxZCcgKSByZXR1cm47CiAgICAkcj1hcnJheSgpOwogICAgZm9yZWFjaCAoYXJyYXkoMzQ1MTIsIDE4NTI3LCAxOTEzNykgYXMgJHBpZCkgewogICAgICAgICRwPXdjX2dldF9wcm9kdWN0KCRwaWQpOwogICAgICAgICRyWyRwaWRdPWFycmF5KAogICAgICAgICAgJ2V4aXN0cyc9PiRwPzE6MCwKICAgICAgICAgICd0eXBlJz0+JHA/JHAtPmdldF90eXBlKCk6bnVsbCwKICAgICAgICAgICdwb3N0X3N0YXR1cyc9PmdldF9wb3N0X3N0YXR1cygkcGlkKSwKICAgICAgICAgICdpc19wdXJjaGFzYWJsZSc9PiRwPygkcC0+aXNfcHVyY2hhc2FibGUoKT8xOjApOm51bGwsCiAgICAgICAgICAnaXNfaW5fc3RvY2snPT4kcD8oJHAtPmlzX2luX3N0b2NrKCk/MTowKTpudWxsLAogICAgICAgICAgJ3ByaWNlJz0+JHA/JHAtPmdldF9wcmljZSgpOm51bGwsCiAgICAgICAgICAncHJpY2VfZW1wdHknPT4kcD8oJHAtPmdldF9wcmljZSgpPT09Jyc/MTowKTpudWxsLAogICAgICAgICAgJ2NhdGFsb2dfdmlzaWJpbGl0eSc9PiRwPyRwLT5nZXRfY2F0YWxvZ192aXNpYmlsaXR5KCk6bnVsbCwKICAgICAgICAgICdzdG9ja19zdGF0dXMnPT4kcD8kcC0+Z2V0X3N0b2NrX3N0YXR1cygpOm51bGwsCiAgICAgICAgKTsKICAgIH0KICAgIC8vIGFyIHdjX2dldF9wcmljZV90b19kaXNwbGF5IHZlaWtpYSBiZSBrcmVwc2VsaW8KICAgICRwPXdjX2dldF9wcm9kdWN0KDM0NTEyKTsKICAgIGlmICgkcCkgeyAkclsncHJpY2VfdG9fZGlzcGxheSddPXdjX2dldF9wcmljZV90b19kaXNwbGF5KCRwKTsgfQogICAgLy8ga2llayBpcyB2aXNvIHB1cmNoYXNhYmxlCiAgICAkcT1uZXcgV1BfUXVlcnkoYXJyYXkoJ3Bvc3RfdHlwZSc9Pidwcm9kdWN0JywncG9zdF9zdGF0dXMnPT4ncHVibGlzaCcsJ3Bvc3RzX3Blcl9wYWdlJz0+NSwnZmllbGRzJz0+J2lkcycsJ25vX2ZvdW5kX3Jvd3MnPT50cnVlKSk7CiAgICAkc2FtcD1hcnJheSgpOwogICAgZm9yZWFjaCAoJHEtPnBvc3RzIGFzICR4KXsgJHBwPXdjX2dldF9wcm9kdWN0KCR4KTsgaWYoISRwcCljb250aW51ZTsKICAgICAgJHNhbXBbXT1hcnJheSgnaWQnPT4keCwndHlwZSc9PiRwcC0+Z2V0X3R5cGUoKSwncHVyY2gnPT4kcHAtPmlzX3B1cmNoYXNhYmxlKCk/MTowLCdzdG9jayc9PiRwcC0+aXNfaW5fc3RvY2soKT8xOjAsJ3ByaWNlJz0+JHBwLT5nZXRfcHJpY2UoKSk7IH0KICAgICRyWydzYW1wbGUnXT0kc2FtcDsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP ValidItems Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_vp=Vp1d"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_vp=Vp1d"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('vp.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
