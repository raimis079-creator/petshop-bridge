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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMjkgQWNjb3VudCBIVE1MIER1bXAKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX2RtOCddKSB8fCAkX0dFVFsncHNfZG04J10gIT09ICdEbThrNCcgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4nZHVtcC12MScpOwoKICAgICR1ID0gZ2V0X3VzZXJfYnkoJ2xvZ2luJywncHNfczMyOV90ZXN0Jyk7CiAgICBpZiAoISR1KSB7IGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2Vycic9PiduZXJhIHZhcnRvdG9qbycpKTsgZXhpdDsgfQogICAgJGNvb2tpZSA9IHdwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1LT5JRCwgdGltZSgpKzMwMCwgJ2xvZ2dlZF9pbicpOwogICAgJG5hbWUgICA9IExPR0dFRF9JTl9DT09LSUU7CiAgICAkdXJsICAgID0gd2NfZ2V0X3BhZ2VfcGVybWFsaW5rKCdteWFjY291bnQnKTsKCiAgICAkcmVzcCA9IHdwX3JlbW90ZV9nZXQoJHVybCwgYXJyYXkoCiAgICAgICAgJ3RpbWVvdXQnID0+IDMwLCAnc3NsdmVyaWZ5JyA9PiBmYWxzZSwKICAgICAgICAnaGVhZGVycycgPT4gYXJyYXkoJ0Nvb2tpZScgPT4gJG5hbWUuJz0nLiRjb29raWUpLAogICAgKSk7CiAgICBpZiAoaXNfd3BfZXJyb3IoJHJlc3ApKSB7ICRyWydlcnInXSA9ICRyZXNwLT5nZXRfZXJyb3JfbWVzc2FnZSgpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRyKTsgZXhpdDsgfQogICAgJGh0bWwgPSB3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcmVzcCk7CiAgICAkclsna29kYXMnXSA9IHdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyZXNwKTsKICAgICRyWydpbGdpcyddID0gc3RybGVuKCRodG1sKTsKCiAgICAvLyBrbyBpZXNrb20KICAgIGZvcmVhY2ggKGFycmF5KAogICAgICAgICdNeUFjY291bnQtbmF2aWdhdGlvbicgICA9PiAnd29vY29tbWVyY2UtTXlBY2NvdW50LW5hdmlnYXRpb24nLAogICAgICAgICdNeUFjY291bnQtY29udGVudCcgICAgICA9PiAnd29vY29tbWVyY2UtTXlBY2NvdW50LWNvbnRlbnQnLAogICAgICAgICdhY2NvdW50LXVzZXInICAgICAgICAgICA9PiAnYWNjb3VudC11c2VyJywKICAgICAgICAnZmxhdHNvbWVfbmF2JyAgICAgICAgICAgPT4gJ25hdi12ZXJ0aWNhbCcsCiAgICAgICAgJ2F2YXRhcmFzJyAgICAgICAgICAgICAgID0+ICdhdmF0YXInLAogICAgICAgICdVenNha3ltYWlfbnVvcm9kYScgICAgICA9PiAncGFza3lyYS91enNha3ltYWknLAogICAgICAgICdBdWdpbnRpbmlzX251b3JvZGEnICAgICA9PiAncGFza3lyYS9hdWdpbnRpbmlzJywKICAgICAgICAnQXRzaWp1bmd0aV9udW9yb2RhJyAgICAgPT4gJ3Bhc2t5cmEvYXRzaWp1bmd0aScsCiAgICAgICAgJ1N2ZWlraScgICAgICAgICAgICAgICAgID0+ICdTdmVpa2ksJywKICAgICAgICAna29ydGVsZV9VenNha3ltYWknICAgICAgPT4gJz5Vxb5zYWt5bWFpPCcsCiAgICApIGFzICRrPT4kbmVlZGxlKSB7CiAgICAgICAgJHJbJ3R1cmknXVska10gPSBzdWJzdHJfY291bnQoJGh0bWwsICRuZWVkbGUpOwogICAgfQogICAgLy8gYWNjb3VudCBzcml0aWVzIGZyYWdtZW50YXMKICAgICRpID0gc3RycG9zKCRodG1sLCAnd29vY29tbWVyY2UtTXlBY2NvdW50Jyk7CiAgICBpZiAoJGkgPT09IGZhbHNlKSB7ICRpID0gc3RycG9zKCRodG1sLCAnYWNjb3VudC1jb250YWluZXInKTsgfQogICAgaWYgKCRpID09PSBmYWxzZSkgeyAkaSA9IHN0cnBvcygkaHRtbCwgJ1N2ZWlraSwnKTsgfQogICAgJHJbJ2ZyYWdtZW50YXMnXSA9ICRpICE9PSBmYWxzZSA/IHN1YnN0cigkaHRtbCwgbWF4KDAsJGktMTUwMCksIDMwMDApIDogJ25lcmFzdGFzIGlua2FyYXMnOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsKICAgIGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'S329 Account HTML Dump',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('htmldump.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_dm8=Dm8k4"');
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
putB64('htmldump.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
