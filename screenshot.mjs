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
const php=Buffer.from('PD9waHAKLyoqCiAqIFVJIExvY2FsaXphdGlvbiBSdW50aW1lIEF1ZGl0IOKAlCBOZXh0L1ByZXZpb3VzIEZST05ULUVORC4gVElLIFNLQUlUWU1BUy4KICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX254OSddKSB8fCAkX0dFVFsncHNfbng5J10gIT09ICdOeDliNCcgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4nbmV4dHByZXYtZnJvbnQtdjEnKTsKCiAgICAvLyBwcmVrZSBzdSBhdHNpbGllcGltYWlzICsga2F0ZWdvcmlqYSBzdSBwdXNsYXBpYXZpbXUKICAgICRwdXNsID0gYXJyYXkoCiAgICAgICAgJ3BhZ3JpbmRpbmlzJyA9PiBob21lX3VybCgnLycpLAogICAgICAgICdwYXJkdW90dXZlJyAgPT4gaG9tZV91cmwoJy9wYXJkdW90dXZlLycpLAogICAgICAgICdwYXJkdW90dXZlX3AyJz0+IGhvbWVfdXJsKCcvcGFyZHVvdHV2ZS9wYWdlLzIvJyksCiAgICAgICAgJ2thdGVnb3JpamEnICA9PiBob21lX3VybCgnL2thdGVnb3JpamEvc3VuaW1zLycpLAogICAgICAgICdwcmVrZScgICAgICAgPT4gZ2V0X3Blcm1hbGluaygzNDc4NiksCiAgICAgICAgJ2Fua2V0YScgICAgICA9PiBob21lX3VybCgnL2F1Z2ludGluaW8tcHJvZmlsaXMvJyksCiAgICApOwogICAgZm9yZWFjaCAoJHB1c2wgYXMgJHZhcmRhcz0+JHVybCkgewogICAgICAgICRyZXNwID0gd3BfcmVtb3RlX2dldCgkdXJsLCBhcnJheSgndGltZW91dCc9PjM1LCdzc2x2ZXJpZnknPT5mYWxzZSwKICAgICAgICAgICAgJ2hlYWRlcnMnPT5hcnJheSgnQ2FjaGUtQ29udHJvbCc9Piduby1jYWNoZScpKSk7CiAgICAgICAgaWYgKGlzX3dwX2Vycm9yKCRyZXNwKSkgeyAkclskdmFyZGFzXT0nRVJSJzsgY29udGludWU7IH0KICAgICAgICAkaCA9IHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyZXNwKTsKICAgICAgICAkZCA9IGFycmF5KCdrb2Rhcyc9PndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyZXNwKSk7CgogICAgICAgIC8vIEEpIHB1c2xhcGlhdmltYXMKICAgICAgICBwcmVnX21hdGNoX2FsbCgnIzxhW14+XSphcmlhLWxhYmVsPSIoTmV4dHxQcmV2aW91cykiW14+XSpjbGFzcz0iW14iXSpwYWdlLW51bWJlclteIl0qIltePl0qPiMnLCAkaCwgJG0xKTsKICAgICAgICAkZFsncHVzbGFwaWF2aW1hcyddID0gY291bnQoJG0xWzBdKTsKICAgICAgICAkZFsncHZ6X3B1c2xhcGlhdmltYXMnXSA9IGFycmF5X3NsaWNlKCRtMVswXSwgMCwgMik7CgogICAgICAgIC8vIEIpIHJlbGF5IGthcnVzZWxlCiAgICAgICAgJGRbJ3JlbGF5X215Z3R1a3UnXSA9IHN1YnN0cl9jb3VudCgkaCwgJ3V4LXJlbGF5X19uYXYtYnV0dG9uJyk7CiAgICAgICAgcHJlZ19tYXRjaF9hbGwoJyM8YnV0dG9uW14+XSp1eC1yZWxheV9fbmF2LWJ1dHRvbltePl0qPiMnLCAkaCwgJG0yKTsKICAgICAgICAkZFsncHZ6X3JlbGF5J10gPSBhcnJheV9zbGljZSgkbTJbMF0sIDAsIDIpOwogICAgICAgICRkWydyZWxheV9rb250ZWluZXJpdSddID0gc3Vic3RyX2NvdW50KCRoLCAndXgtcmVsYXknKTsKCiAgICAgICAgLy8gQykgYmV0IGtva2llIGtpdGkgYXJpYS1sYWJlbCBOZXh0L1ByZXZpb3VzCiAgICAgICAgcHJlZ19tYXRjaF9hbGwoJyM8W14+XSphcmlhLWxhYmVsPSIoTmV4dHxQcmV2aW91cykiW14+XSo+IycsICRoLCAkbTMpOwogICAgICAgICRkWyd2aXNvX2FyaWEnXSA9IGNvdW50KCRtM1swXSk7CiAgICAgICAgJGRbJ3Zpc2lfcHZ6J10gPSBhcnJheV9zbGljZSgkbTNbMF0sIDAsIDQpOwogICAgICAgICRyWyR2YXJkYXNdID0gJGQ7CiAgICB9CiAgICAvLyBhciByZWxheSBzaG9ydGNvZGUvYmxva2FzIG5hdWRvamFtYXMgdHVyaW55amUKICAgIGdsb2JhbCAkd3BkYjsKICAgICRyWydyZWxheV90dXJpbnlqZSddID0gKGludCkgJHdwZGItPmdldF92YXIoCiAgICAgICAgIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR3cGRiLT5wb3N0cyBXSEVSRSBwb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIHBvc3RfY29udGVudCBMSUtFICcldXhfcmVsYXklJyIpOwogICAgJHJbJ3JlbGF5X3Nob3J0Y29kZSddID0gc2hvcnRjb2RlX2V4aXN0cygndXhfcmVsYXknKSA/ICdyZWdpc3RydW90YXMnIDogJ25lcmVnaXN0cnVvdGFzJzsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7CiAgICBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('nextprev2.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_nx9=Nx9b4"');
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
putB64('nextprev2.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
