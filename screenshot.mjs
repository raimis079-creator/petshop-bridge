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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMjgg4oCUIGthaXAgdmFydG90b2phcyBzdSBhdWdpbnRpbml1IHByaWRlZGEgYW50cmEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX2FkMyddKSB8fCAkX0dFVFsncHNfYWQzJ10gIT09ICdBZDNrOCcgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4nYWRkLXNlY29uZC12MScpOwogICAgJHUgPSBnZXRfdXNlcl9ieSgnbG9naW4nLCdwc190d29fdGVzdCcpOwogICAgaWYgKCEkdSkgeyBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdlcnInPT4nbmVyYScpKTsgZXhpdDsgfQogICAgJGNrID0gd3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHUtPklELCB0aW1lKCkrMzAwLCAnbG9nZ2VkX2luJyk7CgogICAgZm9yZWFjaCAoYXJyYXkoJ3Byb2ZpbGlzJz0+J2h0dHBzOi8vZGV2LmF2ZXNhLmx0L3Bhc2t5cmEvYXVnaW50aW5pcy8nLAogICAgICAgICAgICAgICAgICAgJ2NyZWF0ZSc9PidodHRwczovL2Rldi5hdmVzYS5sdC9wYXNreXJhL2F1Z2ludGluaXMvP2FjdGlvbj1jcmVhdGUnKSBhcyAkdmFyZGFzPT4kdXJsKSB7CiAgICAgICAgJHJlc3AgPSB3cF9yZW1vdGVfZ2V0KCR1cmwsIGFycmF5KCd0aW1lb3V0Jz0+MzUsJ3NzbHZlcmlmeSc9PmZhbHNlLAogICAgICAgICAgICAnaGVhZGVycyc9PmFycmF5KCdDb29raWUnPT5MT0dHRURfSU5fQ09PS0lFLic9Jy4kY2ssJ0NhY2hlLUNvbnRyb2wnPT4nbm8tY2FjaGUnKSkpOwogICAgICAgICRoID0gaXNfd3BfZXJyb3IoJHJlc3ApID8gJycgOiB3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcmVzcCk7CiAgICAgICAgJGQgPSBhcnJheSgna29kYXMnPT53cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcmVzcCksICdpbGdpcyc9PnN0cmxlbigkaCkpOwogICAgICAgIC8vIHZpc2kgbXlndHVrYWkgaXIgbnVvcm9kb3Mgc3UgdGVrc3R1CiAgICAgICAgcHJlZ19tYXRjaF9hbGwoJyM8KD86YnV0dG9ufGEpW14+XSo+KC4qPyk8Lyg/OmJ1dHRvbnxhKT4jcycsICRoLCAkbSk7CiAgICAgICAgJHRla3N0YWkgPSBhcnJheSgpOwogICAgICAgIGZvcmVhY2ggKCRtWzFdIGFzICR0KSB7CiAgICAgICAgICAgICR0ID0gdHJpbShwcmVnX3JlcGxhY2UoJy9ccysvdScsJyAnLCB3cF9zdHJpcF9hbGxfdGFncygkdCkpKTsKICAgICAgICAgICAgaWYgKCR0ICE9PSAnJyAmJiBtYl9zdHJsZW4oJHQpIDwgNjApIHsgJHRla3N0YWlbXSA9ICR0OyB9CiAgICAgICAgfQogICAgICAgICRkWydteWd0dWthaSddID0gYXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkdGVrc3RhaSkpOwogICAgICAgIC8vIGFyIGFua2V0YSB5cmEgRE9NJ2UKICAgICAgICAkZFsnYW5rZXRhX2RvbWUnXSA9IGFycmF5KAogICAgICAgICAgICAncHNwZXRfZm9ybV9ob3N0JyA9PiAoc3RycG9zKCRoLCdwc3BldC1mb3JtLWhvc3QnKSAhPT0gZmFsc2UpLAogICAgICAgICAgICAncnVzaWVzX3BseXRlbGVzJyA9PiBzdWJzdHJfY291bnQoJGgsJ0thcyBqxatzxbMgYXVnaW50aW5pcycpLAogICAgICAgICAgICAnUFNfUEVUX0ZPUk1fT1BFTic9PiAoc3RycG9zKCRoLCdQU19QRVRfRk9STV9PUEVOJykgIT09IGZhbHNlKSwKICAgICAgICApOwogICAgICAgICRyWyR2YXJkYXNdID0gJGQ7CiAgICB9CiAgICAvLyBpc19vbmJvYXJkaW5nIGxvZ2lrYQogICAgJGMgPSBmaWxlX2dldF9jb250ZW50cyhXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2luY2x1ZGVzL2NsYXNzLXBldC11aS5waHAnKTsKICAgICRpID0gc3RycG9zKCRjLCAnZnVuY3Rpb24gaXNfb25ib2FyZGluZycpOwogICAgJHJbJ2lzX29uYm9hcmRpbmcnXSA9ICRpIT09ZmFsc2UgPyBzdWJzdHIoJGMsJGksNzAwKSA6ICduZXJhc3RhJzsKICAgIC8vIHBldC1wcm9maWxlLmpzOiBwcmlkZWppbW8gbXlndHVrYXMKICAgICRqcyA9IGZpbGVfZ2V0X2NvbnRlbnRzKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvYXNzZXRzL3BldC1wcm9maWxlLmpzJyk7CiAgICBmb3JlYWNoIChleHBsb2RlKCJcbiIsJGpzKSBhcyAkbj0+JGwpIHsKICAgICAgICBpZiAocHJlZ19tYXRjaCgnL1ByaWTEl3RpfHByaWTEl3RpfG5hdWphcyBhdWdpbnRpbnxOYXVqYXMgYXVnaW50aW58YWRkUGV0fGFjdGlvbj1jcmVhdGUvdScsJGwpKSB7CiAgICAgICAgICAgICRyWydqc19wcmlkZWppbWFzJ11bXSA9ICgkbisxKS4nOiAnLnRyaW0oc3Vic3RyKCRsLDAsMTUwKSk7CiAgICAgICAgfQogICAgfQogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsKICAgIGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('addsecond.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_ad3=Ad3k8"');
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
putB64('addsecond.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
