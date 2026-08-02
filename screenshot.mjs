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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMzkgcmVjb24g4oCUIHBldC1mb3JtLmpzOiA1IGtsYXVzaW1haQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfanM4J10pIHx8ICRfR0VUWydwc19qczgnXSAhPT0gJ0pzOHc0JyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgJHIgPSBhcnJheSgnVkVSU0lKQSc9Pidqcy1yZWNvbi12MScpOwogICAgJHAgPSBQRVRTSE9QX0NPUkVfRElSLidhc3NldHMvcGV0LWZvcm0uanMnOwogICAgJGpzID0gZmlsZV9nZXRfY29udGVudHMoJHApOwogICAgJHJbJ2R5ZGlzJ10gPSBzdHJsZW4oJGpzKTsKICAgICRyWydlaWx1Y2l1J10gPSBzdWJzdHJfY291bnQoJGpzLCAiXG4iKTsKICAgICRlaWwgPSBleHBsb2RlKCJcbiIsICRqcyk7CgogICAgLy8gMSkgc2F2ZURyYWZ0IGt2aWV0aW1haSArIGRlYm91bmNlCiAgICBmb3JlYWNoICgkZWlsIGFzICRuPT4kbCkgewogICAgICAgIGlmIChzdHJwb3MoJGwsJ3NhdmVEcmFmdCcpIT09ZmFsc2UgfHwgc3RycG9zKCRsLCdjbGVhckRyYWZ0JykhPT1mYWxzZQogICAgICAgICAgICB8fCBzdHJwb3MoJGwsJ2xvYWREcmFmdCcpIT09ZmFsc2UpIHsKICAgICAgICAgICAgJHJbJ3ExX2RyYWZ0X2t2aWV0aW1haSddW10gPSAoJG4rMSkuJzogJy50cmltKHN1YnN0cigkbCwwLDE0MCkpOwogICAgICAgIH0KICAgICAgICBpZiAocHJlZ19tYXRjaCgnL2RlYm91bmNlfHNldFRpbWVvdXR8Y2xlYXJUaW1lb3V0LycsICRsKSkgewogICAgICAgICAgICAkclsncTFfZGVib3VuY2UnXVtdID0gKCRuKzEpLic6ICcudHJpbShzdWJzdHIoJGwsMCwxMjApKTsKICAgICAgICB9CiAgICB9CiAgICAvLyAyKSBtYWdpYy1sb2dpbi9yZXF1ZXN0CiAgICBmb3JlYWNoICgkZWlsIGFzICRuPT4kbCkgewogICAgICAgIGlmIChzdHJwb3MoJGwsJ21hZ2ljLWxvZ2luJykhPT1mYWxzZSB8fCBzdHJwb3MoJGwsJ3JlcXVlc3RNYWdpY0xpbmsnKSE9PWZhbHNlKSB7CiAgICAgICAgICAgICRyWydxMl9tYWdpYyddW10gPSAoJG4rMSkuJzogJy50cmltKHN1YnN0cigkbCwwLDE1MCkpOwogICAgICAgIH0KICAgIH0KICAgICRpID0gc3RycG9zKCRqcywgJ2Z1bmN0aW9uIHJlcXVlc3RNYWdpY0xpbmsnKTsKICAgICRyWydxMl9mdW5rY2lqYSddID0gJGkhPT1mYWxzZSA/IHN1YnN0cigkanMsICRpLCAyMjAwKSA6ICduZXJhc3RhJzsKCiAgICAvLyAzKSBsb2FkaW5nIC8gZXJyb3IgLyBzdWNjZXNzIGJ1c2Vub3MKICAgIGZvcmVhY2ggKCRlaWwgYXMgJG49PiRsKSB7CiAgICAgICAgaWYgKHByZWdfbWF0Y2goJy8oZGlzYWJsZWR8bG9hZGluZ3xpc0J1c3l8YnVzeXxwZW5kaW5nfHNwaW5uZXJ8a2xhaWRhfGVycm9yfHN1Y2Nlc3MpL2knLCAkbCkKICAgICAgICAgICAgJiYgc3RycG9zKCRsLCcvLycpIT09MCkgewogICAgICAgICAgICAkclsncTNfYnVzZW5vcyddW10gPSAoJG4rMSkuJzogJy50cmltKHN1YnN0cigkbCwwLDEzMCkpOwogICAgICAgIH0KICAgIH0KICAgIC8vIDQpIGxvY2FsU3RvcmFnZSB2YWx5bWFzCiAgICBmb3JlYWNoICgkZWlsIGFzICRuPT4kbCkgewogICAgICAgIGlmIChzdHJwb3MoJGwsJ2xvY2FsU3RvcmFnZScpIT09ZmFsc2UpIHsKICAgICAgICAgICAgJHJbJ3E0X2xvY2Fsc3RvcmFnZSddW10gPSAoJG4rMSkuJzogJy50cmltKHN1YnN0cigkbCwwLDE0MCkpOwogICAgICAgIH0KICAgIH0KICAgICRqID0gc3RycG9zKCRqcywgJ2Z1bmN0aW9uIGNsZWFyRHJhZnQnKTsKICAgICRyWydxNF9jbGVhckRyYWZ0J10gPSAkaiE9PWZhbHNlID8gc3Vic3RyKCRqcywgJGosIDUwMCkgOiAnbmVyYXN0YSc7CgogICAgLy8gNSkgZHZpZ3VibyBzdWJtaXQgYXBzYXVnYQogICAgZm9yZWFjaCAoJGVpbCBhcyAkbj0+JGwpIHsKICAgICAgICBpZiAocHJlZ19tYXRjaCgnL2FkZEV2ZW50TGlzdGVuZXJccypcKFxzKltcJyJdY2xpY2t8b25jbGlja3xcLm9uY2xpY2t8c3VibWl0UHJvZmlsZXxidG5cLmRpc2FibGVkLycsICRsKSkgewogICAgICAgICAgICAkclsncTVfc3VibWl0J11bXSA9ICgkbisxKS4nOiAnLnRyaW0oc3Vic3RyKCRsLDAsMTQwKSk7CiAgICAgICAgfQogICAgfQogICAgJGsgPSBzdHJwb3MoJGpzLCAnZnVuY3Rpb24gc3VibWl0UHJvZmlsZScpOwogICAgJHJbJ3E1X3N1Ym1pdFByb2ZpbGUnXSA9ICRrIT09ZmFsc2UgPyBzdWJzdHIoJGpzLCAkaywgMTYwMCkgOiAnbmVyYXN0YSc7CgogICAgLy8gZnVua2NpanUgc2FyYXNhcwogICAgcHJlZ19tYXRjaF9hbGwoJy9mdW5jdGlvblxzKyhcdyspXHMqXCgvJywgJGpzLCAkZm0pOwogICAgJHJbJ2Z1bmtjaWpvcyddID0gYXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkZm1bMV0pKTsKICAgIC8vIGZldGNoIGt2aWV0aW1haQogICAgcHJlZ19tYXRjaF9hbGwoJyNmZXRjaFwoXHMqKFteLFwpXXswLDgwfSkjJywgJGpzLCAkZmYpOwogICAgJHJbJ2ZldGNoX3RhaWtpbmlhaSddID0gYXJyYXlfc2xpY2UoYXJyYXlfdW5pcXVlKCRmZlsxXSksIDAsIDE1KTsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7CiAgICBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('jsrecon.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_js8=Js8w4"');
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
putB64('jsrecon.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
