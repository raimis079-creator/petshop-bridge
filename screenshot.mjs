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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzNDAgcmVjb24g4oCUIGRyYWZ0dSBjbGVhbnVwIGNyb24KICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX2NyNyddKSB8fCAkX0dFVFsncHNfY3I3J10gIT09ICdDcjdoNScgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGdsb2JhbCAkd3BkYjsgJFQ9JHdwZGItPnByZWZpeC4ncHNfcGV0X3Byb2ZpbGVfZHJhZnRzJzsKICAgICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4nY3Jvbi1yZWNvbi12MScpOwoKICAgICRwID0gUEVUU0hPUF9DT1JFX0RJUi4naW5jbHVkZXMvY2xhc3MtcGV0LWRyYWZ0cy5waHAnOwogICAgJGMgPSBmaWxlX2dldF9jb250ZW50cygkcCk7CiAgICAkclsnZmFpbGFzJ10gPSBhcnJheSgnZHlkaXMnPT5zdHJsZW4oJGMpLCdzaGEyNTYnPT5oYXNoKCdzaGEyNTYnLCRjKSk7CiAgICAvLyBtZXRvZGFpCiAgICBwcmVnX21hdGNoX2FsbCgnLyhwdWJsaWN8cHJpdmF0ZXxwcm90ZWN0ZWQpXHMrc3RhdGljXHMrZnVuY3Rpb25ccysoXHcrKS8nLCAkYywgJG0pOwogICAgJHJbJ21ldG9kYWknXSA9ICRtWzJdOwogICAgLy8gY2xlYW51cAogICAgZm9yZWFjaCAoYXJyYXkoJ2NsZWFudXBfZXhwaXJlZCcsJ2NsZWFudXAnLCdDTEFJTV9TVEFMRV9TRUNPTkRTJywnVFRMX0RBWVMnLCdpbml0JykgYXMgJHopIHsKICAgICAgICAkclsnenltb3MnXVskel0gPSBzdWJzdHJfY291bnQoJGMsICR6KTsKICAgIH0KICAgICRpID0gc3RycG9zKCRjLCAnZnVuY3Rpb24gY2xlYW51cF9leHBpcmVkJyk7CiAgICAkclsnY2xlYW51cF9rb2RhcyddID0gJGkhPT1mYWxzZSA/IHN1YnN0cigkYywgbWF4KDAsJGktNTAwKSwgMTgwMCkgOiAnTkVSQSc7CiAgICAkaiA9IHN0cnBvcygkYywgJ3B1YmxpYyBzdGF0aWMgZnVuY3Rpb24gaW5pdCcpOwogICAgJHJbJ2luaXRfa29kYXMnXSA9ICRqIT09ZmFsc2UgPyBzdWJzdHIoJGMsICRqLCA3MDApIDogJ05FUkEnOwogICAgLy8ga29uc3RhbnRvcwogICAgcHJlZ19tYXRjaF9hbGwoJy9jb25zdFxzKyhcdyspXHMqPVxzKihbXjtdKyk7LycsICRjLCAkY20pOwogICAgZm9yZWFjaCAoJGNtWzFdIGFzICRrPT4kdikgeyAkclsna29uc3RhbnRvcyddWyR2XSA9IHRyaW0oJGNtWzJdWyRrXSk7IH0KCiAgICAvLyBhciBjcm9uIHJlZ2lzdHJ1b3RhcwogICAgJHJbJ2Nyb24nXSA9IGFycmF5KCk7CiAgICBmb3JlYWNoICgoYXJyYXkpX2dldF9jcm9uX2FycmF5KCkgYXMgJHRzPT4kaG9va3MpIHsKICAgICAgICBmb3JlYWNoICgkaG9va3MgYXMgJGg9PiR2KSB7CiAgICAgICAgICAgIGlmIChzdHJwb3MoJGgsJ3BldHNob3AnKSE9PWZhbHNlIHx8IHN0cnBvcygkaCwnZHJhZnQnKSE9PWZhbHNlKSB7CiAgICAgICAgICAgICAgICAkclsnY3JvbiddWyRoXSA9IGdtZGF0ZSgnWS1tLWQgSDppJywgJHRzKTsKICAgICAgICAgICAgfQogICAgICAgIH0KICAgIH0KICAgICRyWyd2aXNpX3BldHNob3BfY3JvbiddID0gYXJyYXkoKTsKICAgIGZvcmVhY2ggKChhcnJheSlfZ2V0X2Nyb25fYXJyYXkoKSBhcyAkdHM9PiRob29rcykgewogICAgICAgIGZvcmVhY2ggKCRob29rcyBhcyAkaD0+JHYpIHsgaWYgKHN0cnBvcygkaCwncGV0c2hvcCcpPT09MCB8fCBzdHJwb3MoJGgsJ3BzXycpPT09MCkgeyAkclsndmlzaV9wZXRzaG9wX2Nyb24nXVskaF09Z21kYXRlKCdZLW0tZCBIOmknLCR0cyk7IH0gfQogICAgfQogICAgLy8gZGVha3R5dmF2aW1vIGthYmxpdWthcyBwZXRzaG9wLWNvcmUucGhwCiAgICAkbWMgPSBmaWxlX2dldF9jb250ZW50cyhQRVRTSE9QX0NPUkVfRElSLidwZXRzaG9wLWNvcmUucGhwJyk7CiAgICAkclsnZGVhY3RpdmF0aW9uJ10gPSAoc3RycG9zKCRtYywncmVnaXN0ZXJfZGVhY3RpdmF0aW9uX2hvb2snKSE9PWZhbHNlKTsKICAgIHByZWdfbWF0Y2hfYWxsKCcvXi4qKHJlZ2lzdGVyX2FjdGl2YXRpb25faG9va3xyZWdpc3Rlcl9kZWFjdGl2YXRpb25faG9va3x3cF9zY2hlZHVsZV9ldmVudHx3cF9jbGVhcl9zY2hlZHVsZWRfaG9vaykuKiQvbScsICRtYywgJGRtKTsKICAgICRyWydib290c3RyYXBfY3JvbiddID0gJGRtWzBdOwoKICAgIC8vIGxlbnRlbGVzIGJ1c2VuYQogICAgJHJbJ2RyYWZ0dV9idXNlbm9zJ10gPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzdGF0dXMsIENPVU5UKCopIGMgRlJPTSAkVCBHUk9VUCBCWSBzdGF0dXMiLCBBUlJBWV9BKTsKICAgICRyWydkcmFmdHVfdmlzbyddID0gKGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJFQiKTsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7CiAgICBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('cronrecon.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_cr7=Cr7h5"');
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
putB64('cronrecon.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
