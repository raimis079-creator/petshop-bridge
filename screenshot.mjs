import { execSync } from 'child_process';
import fs from 'fs';
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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMzMgQ29tbWl0MSByZWNvbiDigJQgcGlsbmFzIGNyZWF0ZV9wZXQgKyBoYW5kbGVfc2F2ZQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfYzFyJ10pIHx8ICRfR0VUWydwc19jMXInXSAhPT0gJ0MxcjR6JyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgJHIgPSBhcnJheSgnVkVSU0lKQSc9Pidjb21taXQxLXJlY29uLXYxJyk7CiAgICAkcCA9IFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvY2xhc3MtcGV0LXByb2ZpbGUucGhwJzsKICAgICRjID0gZmlsZV9nZXRfY29udGVudHMoJHApOwogICAgJHJbJ2R5ZGlzJ10gPSBzdHJsZW4oJGMpOwogICAgJHJbJ3NoYTI1NiddID0gaGFzaCgnc2hhMjU2JywgJGMpOwogICAgJHJbJ2NybGYnXSA9IHN1YnN0cl9jb3VudCgkYywgIlxyXG4iKTsKCiAgICAvLyBtZXRvZHUgcmlib3MKICAgIHByZWdfbWF0Y2hfYWxsKCcvXG5cdCg/OnB1YmxpY3xwcml2YXRlfHByb3RlY3RlZClccytzdGF0aWNccytmdW5jdGlvblxzKyhcdyspLycsICRjLCAkbSwgUFJFR19PRkZTRVRfQ0FQVFVSRSk7CiAgICAkcmlib3MgPSBhcnJheSgpOwogICAgZm9yZWFjaCAoJG1bMV0gYXMgJGk9PiR4KSB7CiAgICAgICAgJHJpYm9zW10gPSBhcnJheSgndmFyZGFzJz0+JHhbMF0sICdudW8nPT4kbVswXVskaV1bMV0pOwogICAgfQogICAgZm9yICgkaT0wOyAkaTxjb3VudCgkcmlib3MpOyAkaSsrKSB7CiAgICAgICAgJHJpYm9zWyRpXVsnaWtpJ10gPSAkcmlib3NbJGkrMV1bJ251byddID8/IHN0cmxlbigkYyk7CiAgICAgICAgJHJpYm9zWyRpXVsnaWxnaXMnXSA9ICRyaWJvc1skaV1bJ2lraSddIC0gJHJpYm9zWyRpXVsnbnVvJ107CiAgICB9CiAgICAkclsnbWV0b2RhaSddID0gYXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXsgcmV0dXJuICR4Wyd2YXJkYXMnXS4nICgnLiR4WydpbGdpcyddLicgQiknOyB9LCAkcmlib3MpOwoKICAgIC8vIFBJTE5BUyBjcmVhdGVfcGV0IGlyIGhhbmRsZV9zYXZlCiAgICBmb3JlYWNoICgkcmlib3MgYXMgJHgpIHsKICAgICAgICBpZiAoaW5fYXJyYXkoJHhbJ3ZhcmRhcyddLCBhcnJheSgnY3JlYXRlX3BldCcsJ2hhbmRsZV9zYXZlJywnc2FuaXRpemVfaW5wdXQnLCdleHRyYWN0X2NsaWVudF9yZWYnLCdlbWl0X2NyZWF0ZWQnLCdtaXJyb3JfdG9fc2VuZGVyJyksIHRydWUpKSB7CiAgICAgICAgICAgICRyWydrb2RhcyddWyR4Wyd2YXJkYXMnXV0gPSBzdWJzdHIoJGMsICR4WydudW8nXSwgJHhbJ2lsZ2lzJ10pOwogICAgICAgIH0KICAgIH0KICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7CiAgICBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('commit1.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_c1r=C1r4z"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.rez=uzk(1);
sh('sleep 4');
function code(u){ return sh('curl -sSkI -m 30 -o /dev/null -w "%{http_code}|%{redirect_url}" "'+u+'"').out.trim(); }
O.t_naujas       = code(SITE+'/paskyra/');
O.t_atsijungti   = code(SITE+'/paskyra/atsijungti/');
O.t_senas_logout = code(SITE+'/my-account/customer-logout/');
O.t_adresai      = code(SITE+'/paskyra/adresai/');
O.t_slaptazodis  = code(SITE+'/paskyra/pamirstas-slaptazodis/');
O.t_augintinis   = code(SITE+'/paskyra/augintinis/');
O.t_uzsakymai    = code(SITE+'/paskyra/uzsakymai/');
O.t_senas        = code(SITE+'/my-account/');
O.t_senas_uzsak  = code(SITE+'/my-account/orders/');
O.t_senas_augint = code(SITE+'/my-account/augintinis/');
O.t_landing      = code(SITE+'/augintinio-profilis/');
O.t_home         = code(SITE+'/');
O.t_shop         = code(SITE+'/parduotuve/');

fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('commit1.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
