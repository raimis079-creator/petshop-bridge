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
const php=Buffer.from('PD9waHAKLyoqCiAqIFVJIExvY2FsaXphdGlvbiBSdW50aW1lIEF1ZGl0IOKAlCBsaWt1c2lvIHBhc3RvIHBhaWVza2EKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX2ZkNiddKSB8fCAkX0dFVFsncHNfZmQ2J10gIT09ICdGZDZuOCcgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGdsb2JhbCAkd3BkYjsgJHIgPSBhcnJheSgnVkVSU0lKQSc9PidmaW5kLWVtYWlsLXYxJyk7CgogICAgLy8gMSkga3VyIEhUTUwnZQogICAgJHJlc3AgPSB3cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvJyksIGFycmF5KCd0aW1lb3V0Jz0+MzAsJ3NzbHZlcmlmeSc9PmZhbHNlLAogICAgICAgICdoZWFkZXJzJz0+YXJyYXkoJ0NhY2hlLUNvbnRyb2wnPT4nbm8tY2FjaGUnKSkpOwogICAgJGggPSBpc193cF9lcnJvcigkcmVzcCkgPyAnJyA6IHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyZXNwKTsKICAgICRwb3ogPSAwOyAkclsna29udGVrc3RhaSddID0gYXJyYXkoKTsKICAgIHdoaWxlICgoJGkgPSBzdHJwb3MoJGgsICd0ZXJyYUBwZXRzaG9wLmx0JywgJHBveikpICE9PSBmYWxzZSkgewogICAgICAgICRyWydrb250ZWtzdGFpJ11bXSA9IHN1YnN0cigkaCwgbWF4KDAsJGktMzIwKSwgNDgwKTsKICAgICAgICAkcG96ID0gJGkgKyAxNjsKICAgIH0KICAgIC8vIGZhY2Vib29rLmNvbSBiZW5kcmFzCiAgICAkaiA9IHN0cnBvcygkaCwgJ2hyZWY9Imh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbSInKTsKICAgICRyWydmYl9rb250ZWtzdGFzJ10gPSAkaiE9PWZhbHNlID8gc3Vic3RyKCRoLCBtYXgoMCwkai0zMDApLCA1MDApIDogJ25lcmFzdGEnOwoKICAgIC8vIDIpIHZpc3Vvc2Ugd2lkZ2V0J3Vvc2UKICAgIGZvcmVhY2ggKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lLCBvcHRpb25fdmFsdWUgRlJPTSAkd3BkYi0+b3B0aW9ucwogICAgICAgICAgICAgIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJ3dpZGdldF8lJyBBTkQgb3B0aW9uX3ZhbHVlIExJS0UgJyV0ZXJyYUBwZXRzaG9wLmx0JSciKSBhcyAkbykgewogICAgICAgICRyWyd3aWRnZXR1b3NlJ11bXSA9ICRvLT5vcHRpb25fbmFtZTsKICAgIH0KICAgIC8vIDMpIHRoZW1lX21vZHMKICAgICR0bSA9IGdldF90aGVtZV9tb2RzKCk7CiAgICBmb3JlYWNoICgoYXJyYXkpJHRtIGFzICRrPT4kdikgewogICAgICAgIGlmIChpc19zdHJpbmcoJHYpICYmIHN0cnBvcygkdiwndGVycmFAcGV0c2hvcC5sdCcpICE9PSBmYWxzZSkgeyAkclsndGhlbWVfbW9kcyddWyRrXSA9ICR2OyB9CiAgICB9CiAgICAvLyA0KSBwdWJsaXNoIGlyYXN1b3NlCiAgICAkclsnaXJhc3Vvc2UnXSA9ICR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELCBwb3N0X3RpdGxlLCBwb3N0X3R5cGUgRlJPTSAkd3BkYi0+cG9zdHMKICAgICAgICBXSEVSRSBwb3N0X2NvbnRlbnQgTElLRSAnJXRlcnJhQHBldHNob3AubHQlJyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIExJTUlUIDEwIiwgQVJSQVlfQSk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOwogICAgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('findemail.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_fd6=Fd6n8"');
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
putB64('findemail.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
