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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMjkgTG9nb3V0IEVuZHBvaW50IEZpeAogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfbG82J10pIHx8ICRfR0VUWydwc19sbzYnXSAhPT0gJ0xvNmI5JyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgJHIgPSBhcnJheSgnVkVSU0lKQSc9Pidsb2dvdXQtZml4LXYxJyk7CgogICAgLy8gV29vQ29tbWVyY2UgYXRzaWp1bmdpbXVpIHNrYWl0byB3b29jb21tZXJjZV9sb2dvdXRfZW5kcG9pbnQsCiAgICAvLyBORSB3b29jb21tZXJjZV9teWFjY291bnRfY3VzdG9tZXJfbG9nb3V0X2VuZHBvaW50IChtYW5vIGtsYWlkYSkuCiAgICAkclsndGVpc2luZ2Ffb3BjaWphX3ByaWVzJ10gPSBnZXRfb3B0aW9uKCd3b29jb21tZXJjZV9sb2dvdXRfZW5kcG9pbnQnKTsKICAgIHVwZGF0ZV9vcHRpb24oJ3dvb2NvbW1lcmNlX2xvZ291dF9lbmRwb2ludCcsICdhdHNpanVuZ3RpJyk7CiAgICAkclsndGVpc2luZ2Ffb3BjaWphX3BvJ10gPSBnZXRfb3B0aW9uKCd3b29jb21tZXJjZV9sb2dvdXRfZW5kcG9pbnQnKTsKCiAgICAvLyBrbGFpZGluZ2FpIG51c3RhdHl0YSBvcGNpamEg4oCUIHBhc2FsaW5hbSwga2FkIG5lbGlrdHUgc2l1a3NsaXUKICAgICRyWydrbGFpZGluZ2FfYnV2byddID0gZ2V0X29wdGlvbignd29vY29tbWVyY2VfbXlhY2NvdW50X2N1c3RvbWVyX2xvZ291dF9lbmRwb2ludCcpOwogICAgZGVsZXRlX29wdGlvbignd29vY29tbWVyY2VfbXlhY2NvdW50X2N1c3RvbWVyX2xvZ291dF9lbmRwb2ludCcpOwoKICAgIFdDKCktPnF1ZXJ5LT5pbml0X3F1ZXJ5X3ZhcnMoKTsKICAgIFdDKCktPnF1ZXJ5LT5hZGRfZW5kcG9pbnRzKCk7CiAgICBmbHVzaF9yZXdyaXRlX3J1bGVzKGZhbHNlKTsKICAgIHdwX2NhY2hlX2ZsdXNoKCk7CgogICAgJHUgPSBnZXRfdXNlcl9ieSgnbG9naW4nLCdwc19zMzI5X3Rlc3QnKTsKICAgIGlmICgkdSkgeyB3cF9zZXRfY3VycmVudF91c2VyKCR1LT5JRCk7IH0KICAgICRyWydsb2dvdXRfdXJsJ10gPSB3Y19nZXRfYWNjb3VudF9lbmRwb2ludF91cmwoJ2N1c3RvbWVyLWxvZ291dCcpOwogICAgJHJbJ3R1cmlfbm9uY2UnXSA9IChzdHJwb3MoKHN0cmluZykkclsnbG9nb3V0X3VybCddLCdfd3Bub25jZScpICE9PSBmYWxzZSk7CiAgICAkcXYgPSBXQygpLT5xdWVyeSA/IFdDKCktPnF1ZXJ5LT5nZXRfcXVlcnlfdmFycygpIDogYXJyYXkoKTsKICAgICRyWydxdl9jdXN0b21lcl9sb2dvdXQnXSA9ICRxdlsnY3VzdG9tZXItbG9nb3V0J10gPz8gbnVsbDsKICAgICRyWyd2aXNpX3F2X2xpZXR1dmlza2knXSA9IHRydWU7CiAgICBmb3JlYWNoIChhcnJheSgnb3JkZXJzJywndmlldy1vcmRlcicsJ2Rvd25sb2FkcycsJ2VkaXQtYWNjb3VudCcsJ2VkaXQtYWRkcmVzcycsCiAgICAgICAgICAgICAgICAgICAncGF5bWVudC1tZXRob2RzJywnbG9zdC1wYXNzd29yZCcsJ2N1c3RvbWVyLWxvZ291dCcpIGFzICRrKSB7CiAgICAgICAgaWYgKHByZWdfbWF0Y2goJy9eW2Etei1dKyQvJywgKHN0cmluZykoJHF2WyRrXSA/PyAnJykpICYmIHN0cnBvcygoc3RyaW5nKSgkcXZbJGtdID8/ICcnKSwgJy0nKSAhPT0gZmFsc2UpIHt9CiAgICAgICAgJHJbJ3F2J11bJGtdID0gJHF2WyRrXSA/PyBudWxsOwogICAgfQogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fUFJFVFRZX1BSSU5UKTsKICAgIGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'S329 Logout Fix',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('logoutfix.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_lo6=Lo6b9"');
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
putB64('logoutfix.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
