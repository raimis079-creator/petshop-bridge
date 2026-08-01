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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMjggRHVvbWVudSB2YXJ0YWkgKyBjbGllbnRfcmVmIGd5dmF2aW1vIGNpa2xhcyDigJQgVElLIFNLQUlUWU1BUwogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfZ3QyJ10pIHx8ICRfR0VUWydwc19ndDInXSAhPT0gJ0d0MnA5JyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZ2xvYmFsICR3cGRiOyAkUEVUUyA9ICR3cGRiLT5wcmVmaXguJ3BzX3BldHMnOwogICAgJHIgPSBhcnJheSgnVkVSU0lKQSc9PidnYXRlLXYxJyk7CgogICAgLy8gPT09PT0gMCkgRFVPTUVOVSBWSUVOVElTVU1PIFZBUlRBSSA9PT09PQogICAgJGcgPSBhcnJheSgpOwogICAgJGdbJ3BzX3BldHNfdmlzbyddID0gKGludCkgJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRQRVRTIik7CiAgICAkZ1snaWRfMzFfMzInXSA9ICR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHVzZXJfaWQsc3RhdHVzLHNvdXJjZV9kcmFmdF9pZCBGUk9NICRQRVRTIFdIRVJFIGlkIElOICgzMSwzMikiLCBBUlJBWV9BKTsKICAgICRhdGt1cnRvcyA9IGFycmF5KDIzLDI0LDQ1LDQ2LDQ3LDQ5LDUzLDU1KTsKICAgICRpbiA9IGltcGxvZGUoJywnLCAkYXRrdXJ0b3MpOwogICAgJGdbJ2xpa3VzaW9zXzgnXSA9ICR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHN0YXR1cyxzb3VyY2VfZHJhZnRfaWQgRlJPTSAkUEVUUyBXSEVSRSBpZCBJTiAoJGluKSBPUkRFUiBCWSBpZCIsIEFSUkFZX0EpOwogICAgJGdbJ0JMVEVTVCddID0gKGludCkgJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRQRVRTIFdIRVJFIHBldF9uYW1lIExJS0UgJ0JMVEVTVC0lJyIpOwogICAgJGdbJ3NvdXJjZV9kcmFmdF9pZF9uZV9udWxsJ10gPSAoaW50KSAkd3BkYi0+Z2V0X3ZhcigKICAgICAgICAiU0VMRUNUIENPVU5UKCopIEZST00gJFBFVFMgV0hFUkUgaWQgSU4gKDMxLDMyLCRpbikgQU5EIHNvdXJjZV9kcmFmdF9pZCBJUyBOT1QgTlVMTCIpOwogICAgJGdbJ1ZBUlRBSSddID0KICAgICAgICAoJGdbJ3BzX3BldHNfdmlzbyddID09PSA2NQogICAgICAgICAmJiBjb3VudCgkZ1snaWRfMzFfMzInXSkgPT09IDIKICAgICAgICAgJiYgY291bnQoJGdbJ2xpa3VzaW9zXzgnXSkgPT09IDgKICAgICAgICAgJiYgJGdbJ0JMVEVTVCddID09PSAwCiAgICAgICAgICYmICRnWydzb3VyY2VfZHJhZnRfaWRfbmVfbnVsbCddID09PSAwKSA/ICdQUkFFSk8nIDogJ05FUFJBRUpPJzsKICAgICRyWyd2YXJ0YWknXSA9ICRnOwoKICAgIC8vID09PT09IDEpIGNsaWVudF9yZWYgR1lWQVZJTU8gQ0lLTEFTID09PT09CiAgICAkYyA9IGFycmF5KCk7CiAgICAkYmFzZSA9IFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvJzsKICAgIGZvcmVhY2ggKGFycmF5KCdhc3NldHMvcGV0LWZvcm0uanMnLCdhc3NldHMvcGV0LXByb2ZpbGUuanMnLCdhc3NldHMvcHJvZHVjdC1jYWxjLmpzJywKICAgICAgICAgICAgICAgICAgICdhc3NldHMvY2FsYy1oYW5kb2ZmLmpzJywnaW5jbHVkZXMvY2xhc3MtcGV0LXByb2ZpbGUucGhwJykgYXMgJHJlbCkgewogICAgICAgICRwID0gJGJhc2UuJHJlbDsKICAgICAgICBpZiAoIWlzX3JlYWRhYmxlKCRwKSkgeyAkY1snZmFpbGFpJ11bJHJlbF09J05FUkEnOyBjb250aW51ZTsgfQogICAgICAgICRzcmMgPSBmaWxlX2dldF9jb250ZW50cygkcCk7CiAgICAgICAgJG4gPSBzdWJzdHJfY291bnQoJHNyYywnY2xpZW50X3JlZicpICsgc3Vic3RyX2NvdW50KCRzcmMsJ2NsaWVudFJlZicpOwogICAgICAgIGlmICghJG4pIGNvbnRpbnVlOwogICAgICAgICRjWydmYWlsYWknXVskcmVsXSA9ICRuOwogICAgICAgIC8vIGtpZWt2aWVuYSBlaWx1dGUgc3UgY2xpZW50X3JlZgogICAgICAgIGZvcmVhY2ggKGV4cGxvZGUoIlxuIiwkc3JjKSBhcyAkaT0+JGwpIHsKICAgICAgICAgICAgaWYgKHN0cnBvcygkbCwnY2xpZW50X3JlZicpIT09ZmFsc2UgfHwgc3RycG9zKCRsLCdjbGllbnRSZWYnKSE9PWZhbHNlKSB7CiAgICAgICAgICAgICAgICAkY1snZWlsdXRlcyddWyRyZWxdW10gPSAoJGkrMSkuJzogJy50cmltKHN1YnN0cigkbCwwLDE2MCkpOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgfQogICAgLy8gbG9jYWxTdG9yYWdlIHJha3RhaQogICAgJGpzID0gZmlsZV9nZXRfY29udGVudHMoJGJhc2UuJ2Fzc2V0cy9wZXQtZm9ybS5qcycpOwogICAgcHJlZ19tYXRjaF9hbGwoIi9sb2NhbFN0b3JhZ2VcLihnZXRJdGVtfHNldEl0ZW18cmVtb3ZlSXRlbSlcKFxzKlsnXCJdKFteJ1wiXSspWydcIl0vIiwgJGpzLCAkbSk7CiAgICBmb3JlYWNoICgkbVsyXSBhcyAkaz0+JHJha3RhcykgeyAkY1snbG9jYWxTdG9yYWdlJ11bXSA9ICRtWzFdWyRrXS4nIC0+ICcuJHJha3RhczsgfQogICAgJGNbJ2xvY2FsU3RvcmFnZSddID0gYXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkY1snbG9jYWxTdG9yYWdlJ10gPz8gYXJyYXkoKSkpOwoKICAgIC8vIGFyIHZhbG9tYXMgcG8gc2VrbWVzCiAgICAkY1snYXJfdmFsb21hcyddID0gYXJyYXkoCiAgICAgICAgJ3JlbW92ZUl0ZW1fa2FydGFpJyA9PiBzdWJzdHJfY291bnQoJGpzLCdyZW1vdmVJdGVtJyksCiAgICAgICAgJ3BvX3Bvc3RQcm9maWxlJyAgICA9PiAoc3RycG9zKCRqcywncmVtb3ZlSXRlbScpICE9PSBmYWxzZSksCiAgICApOwogICAgLy8gZHVvbWVueXMgREIKICAgICRjWydkYiddID0gYXJyYXkoCiAgICAgICAgJ3N1X2NsaWVudF9yZWYnID0+IChpbnQpICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkUEVUUyBXSEVSRSBjbGllbnRfcmVmIElTIE5PVCBOVUxMIEFORCBjbGllbnRfcmVmIDw+ICcnIiksCiAgICAgICAgJ2Rpc3RpbmN0JyAgICAgID0+IChpbnQpICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgY2xpZW50X3JlZikgRlJPTSAkUEVUUyBXSEVSRSBjbGllbnRfcmVmIElTIE5PVCBOVUxMIEFORCBjbGllbnRfcmVmIDw+ICcnIiksCiAgICAgICAgJ3Bhdnl6ZHppYWknICAgID0+ICR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHVzZXJfaWQsY2xpZW50X3JlZixwZXRfbmFtZSBGUk9NICRQRVRTIFdIRVJFIGNsaWVudF9yZWYgSVMgTk9UIE5VTEwgQU5EIGNsaWVudF9yZWYgPD4gJycgTElNSVQgNSIsIEFSUkFZX0EpLAogICAgKTsKICAgIC8vIGFyIHRhcyBwYXRzIHZhcnRvdG9qYXMgdHVyaSBrZWxpcyBhdWdpbnRpbml1cwogICAgJGNbJ2tlbGlfYXVnaW50aW5pYWknXSA9ICR3cGRiLT5nZXRfcmVzdWx0cygKICAgICAgICAiU0VMRUNUIHVzZXJfaWQsIENPVU5UKCopIGMgRlJPTSAkUEVUUyBXSEVSRSBzdGF0dXM9J2FjdGl2ZScgR1JPVVAgQlkgdXNlcl9pZCBIQVZJTkcgQ09VTlQoKik+MSBPUkRFUiBCWSBjIERFU0MgTElNSVQgNSIsIEFSUkFZX0EpOwogICAgJHJbJ2NsaWVudF9yZWYnXSA9ICRjOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsKICAgIGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('gate.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_gt2=Gt2p9"');
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
putB64('gate.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
