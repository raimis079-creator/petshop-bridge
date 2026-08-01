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
const php=Buffer.from('PD9waHAKLyoqCiAqIFVJIExvY2FsaXphdGlvbiBSdW50aW1lIEF1ZGl0IOKAlCBwYWdyaW5kaW5pbyBDVEEgbXlndHVrYXMKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX2N0YSddKSApIHJldHVybjsKICAgICR2ID0gJF9HRVRbJ3BzX2N0YSddOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBnbG9iYWwgJHdwZGI7ICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4nY3RhLWZpeC12MScpOwogICAgJHBpZCA9IDM0NTQzOwogICAgJHAgPSBnZXRfcG9zdCgkcGlkKTsKICAgIGlmICghJHApIHsgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgnZXJyJz0+J25lcmEnKSk7IGV4aXQ7IH0KICAgICRjID0gJHAtPnBvc3RfY29udGVudDsKICAgICRzZW5hID0gJzxhIGhyZWY9Im1haWx0bzp0ZXJyYUBwZXRzaG9wLmx0IiBjbGFzcz0icGgtZTUtYnRuLXMiPlBhcmHFoXl0aTwvYT4nOwogICAgJG5hdWphID0gJzxhIGhyZWY9Ii9rb250YWt0YWkvIiBjbGFzcz0icGgtZTUtYnRuLXMiPlBhcmHFoXl0aTwvYT4nOwogICAgJHJbJ3Jhc3RhJ10gPSBzdWJzdHJfY291bnQoJGMsICRzZW5hKTsKICAgICRyWydtYWlsdG9fdmlzbyddID0gc3Vic3RyX2NvdW50KCRjLCAnbWFpbHRvOnRlcnJhQHBldHNob3AubHQnKTsKCiAgICBpZiAoJHYgPT09ICdkcnknKSB7IGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OyB9CiAgICBpZiAoJHYgPT09ICdhcHBseScpIHsKICAgICAgICBpZiAoJHJbJ3Jhc3RhJ10gIT09IDEpIHsgJHJbJ1ZFUkRJS1RBUyddPSdTVVNUQUJEWVRBIOKAlCByYXN0YSAnLiRyWydyYXN0YSddLicsIHR1cmkgYnV0aSAxJzsgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7IH0KICAgICAgICB1cGRhdGVfb3B0aW9uKCdwc19ob21lX2N0YV9iYWtfMjAyNjA4MDEnLCAkYywgZmFsc2UpOwogICAgICAgICRuYXVqYXMgPSBzdHJfcmVwbGFjZSgkc2VuYSwgJG5hdWphLCAkYyk7CiAgICAgICAgJHdwZGItPnVwZGF0ZSgkd3BkYi0+cG9zdHMsIGFycmF5KCdwb3N0X2NvbnRlbnQnPT4kbmF1amFzKSwgYXJyYXkoJ0lEJz0+JHBpZCkpOwogICAgICAgIGNsZWFuX3Bvc3RfY2FjaGUoJHBpZCk7CiAgICAgICAgJHJbJ2lsZ2lzJ10gPSBhcnJheShzdHJsZW4oJGMpLCBzdHJsZW4oJG5hdWphcykpOwoKICAgICAgICAkcmVzcCA9IHdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8nKSwgYXJyYXkoJ3RpbWVvdXQnPT4zMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsCiAgICAgICAgICAgICdoZWFkZXJzJz0+YXJyYXkoJ0NhY2hlLUNvbnRyb2wnPT4nbm8tY2FjaGUnKSkpOwogICAgICAgICRoID0gaXNfd3BfZXJyb3IoJHJlc3ApID8gJycgOiB3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcmVzcCk7CiAgICAgICAgJHJbJ3BhdGlrcmEnXSA9IGFycmF5KAogICAgICAgICAgICAndGVycmFfcGFzdGFzJyAgICAgID0+IHN1YnN0cl9jb3VudCgkaCwndGVycmFAcGV0c2hvcC5sdCcpLAogICAgICAgICAgICAna29udGFrdHVfbnVvcm9kb3MnID0+IHN1YnN0cl9jb3VudCgkaCwnL2tvbnRha3RhaS8nKSwKICAgICAgICAgICAgJ1BhcmFzeXRpX215Z3R1a2FzJyA9PiBzdWJzdHJfY291bnQoJGgsJz5QYXJhxaF5dGk8JyksCiAgICAgICAgICAgICdQYXJhc3l0aV9tdW1zJyAgICAgPT4gc3Vic3RyX2NvdW50KCRoLCc+UGFyYcWheXRpIG11bXM8JyksCiAgICAgICAgICAgICd0ZWxlZm9uYXMnICAgICAgICAgPT4gc3Vic3RyX2NvdW50KCRoLCc4Nzc4NycpLAogICAgICAgICAgICAnaHR0cF91cmwnICAgICAgICAgID0+IHN1YnN0cl9jb3VudCgkaCwnaHJlZj0iaHR0cDovL3VybCInKSwKICAgICAgICAgICAgJ3lvdXJfZW1haWwnICAgICAgICA9PiBzdWJzdHJfY291bnQoJGgsJ3lvdXJAZW1haWwnKSwKICAgICAgICApOwogICAgICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFU3xKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7CiAgICB9CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdlcnInPT4nbmV6aW5vbWFzJykpOyBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('ctafix.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_cta=dry"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.dry=uzk(1);
sh('sleep 3');
const a=sh('curl -sSk -m 40 "'+SITE+'/?ps_cta=apply"');
try{ O.apply=JSON.parse(a.out); }catch(e){ O.apply_raw=a.out.slice(0,700); }
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
putB64('ctafix.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
