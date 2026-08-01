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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMzAgTWVuaXUgVVJMIHBhdGlrcmEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX2N0MiddKSB8fCAkX0dFVFsncHNfY3QyJ10gIT09ICdDdDJmNScgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4nY2F0LWNoZWNrLXYxJyk7CiAgICAvLyBwYWdyaW5kaW5pbyBtZW5pdSBwdW5rdGFpCiAgICBmb3JlYWNoICh3cF9nZXRfbmF2X21lbnVzKCkgYXMgJG0pIHsKICAgICAgICAkaXRlbXMgPSB3cF9nZXRfbmF2X21lbnVfaXRlbXMoJG0tPnRlcm1faWQpID86IGFycmF5KCk7CiAgICAgICAgZm9yZWFjaCAoJGl0ZW1zIGFzICRpdCkgewogICAgICAgICAgICBpZiAoKGludCkkaXQtPm1lbnVfaXRlbV9wYXJlbnQgIT09IDApIGNvbnRpbnVlOyAgIC8vIHRpayB2aXJzdXRpbmlzIGx5Z2lzCiAgICAgICAgICAgICRyWydtZW5pdSddWyRtLT5uYW1lXVtdID0gYXJyYXkoJ3RpdGxlJz0+JGl0LT50aXRsZSwgJ3VybCc9PiRpdC0+dXJsKTsKICAgICAgICB9CiAgICB9CiAgICAvLyBhciBlZ3ppc3R1b2phIHBhZ3JpbmRpbmVzIGthdGVnb3Jpam9zCiAgICBmb3JlYWNoIChhcnJheSgnc3VuaW1zJywna2F0ZW1zJywnZ3JhdXppa2FtcycsJ3BhdWtzY2lhbXMnLCd6dXZpbXMnKSBhcyAkc2x1ZykgewogICAgICAgICR0ID0gZ2V0X3Rlcm1fYnkoJ3NsdWcnLCAkc2x1ZywgJ3Byb2R1Y3RfY2F0Jyk7CiAgICAgICAgJHAgPSBnZXRfcGFnZV9ieV9wYXRoKCRzbHVnKTsKICAgICAgICAkclsndGlrcmluYW0nXVskc2x1Z10gPSBhcnJheSgKICAgICAgICAgICAgJ3Byb2R1Y3RfY2F0JyA9PiAkdCA/IGdldF90ZXJtX2xpbmsoJHQpIDogJ05FUkEnLAogICAgICAgICAgICAncGFnZScgICAgICAgID0+ICRwID8gYXJyYXkoJ2lkJz0+JHAtPklELCdzdGF0dXMnPT4kcC0+cG9zdF9zdGF0dXMsJ3VybCc9PmdldF9wZXJtYWxpbmsoJHAtPklEKSkgOiAnTkVSQScsCiAgICAgICAgKTsKICAgIH0KICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7CiAgICBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'S330 Meniu Patikra',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('catcheck.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_ct2=Ct2f5"');
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
putB64('catcheck.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
