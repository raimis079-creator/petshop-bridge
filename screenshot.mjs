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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMzAg4oCUIGt1ciB0aWtzbGlhaSBneXZlbmEgbmV3c2xldHRlciBpciBUQ0YgdGVrc3RhaQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfbGM0J10pIHx8ICRfR0VUWydwc19sYzQnXSAhPT0gJ0xjNHY3JyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgJHIgPSBhcnJheSgnVkVSU0lKQSc9Pidsb2NhdGUtdjEnKTsKICAgICRyZXNwID0gd3BfcmVtb3RlX2dldChob21lX3VybCgnLycpLCBhcnJheSgndGltZW91dCc9PjM1LCdzc2x2ZXJpZnknPT5mYWxzZSwKICAgICAgICAnaGVhZGVycyc9PmFycmF5KCdDYWNoZS1Db250cm9sJz0+J25vLWNhY2hlJykpKTsKICAgICRoID0gaXNfd3BfZXJyb3IoJHJlc3ApID8gJycgOiB3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcmVzcCk7CgogICAgZm9yZWFjaCAoYXJyYXkoJ1NpZ24gdXAgZm9yIE5ld3NsZXR0ZXInLCdSZWFkIG1vcmUgYWJvdXQgVENGIHB1cnBvc2VzJywnbmV3c2xldHRlcicpIGFzICR0KSB7CiAgICAgICAgJHBvej0wOyAkc2FyPWFycmF5KCk7CiAgICAgICAgd2hpbGUgKCgkaSA9IHN0cnBvcygkaCwgJHQsICRwb3opKSAhPT0gZmFsc2UgJiYgY291bnQoJHNhcikgPCA0KSB7CiAgICAgICAgICAgICRzYXJbXSA9IHByZWdfcmVwbGFjZSgnL1xzKy91JywnICcsIHN1YnN0cigkaCwgbWF4KDAsJGktMzUwKSwgNTYwKSk7CiAgICAgICAgICAgICRwb3ogPSAkaSArIHN0cmxlbigkdCk7CiAgICAgICAgfQogICAgICAgICRyWydrb250ZWtzdGFpJ11bJHRdID0gJHNhcjsKICAgIH0KICAgIC8vIGFyIG1hdG9tYSB2YXJ0b3RvanVpIChiZSBzY3JpcHQvc3R5bGUpCiAgICAkaDIgPSBwcmVnX3JlcGxhY2UoJyM8c2NyaXB0W14+XSo+Lio/PC9zY3JpcHQ+I2lzJywnICcsJGgpOwogICAgJGgyID0gcHJlZ19yZXBsYWNlKCcjPHN0eWxlW14+XSo+Lio/PC9zdHlsZT4jaXMnLCcgJywkaDIpOwogICAgJHRla3N0YXMgPSB3cF9zdHJpcF9hbGxfdGFncygkaDIpOwogICAgJHJbJ21hdG9tYW1lX3Rla3N0ZSddID0gYXJyYXkoCiAgICAgICAgJ1NpZ25fdXAnID0+IHN1YnN0cl9jb3VudCgkdGVrc3RhcywnU2lnbiB1cCBmb3IgTmV3c2xldHRlcicpLAogICAgICAgICdUQ0YnICAgICA9PiBzdWJzdHJfY291bnQoJHRla3N0YXMsJ1JlYWQgbW9yZSBhYm91dCBUQ0YgcHVycG9zZXMnKSwKICAgICk7CiAgICAvLyBDb21wbGlhbnogYmFuZXJpbyBudXN0YXR5bWFpCiAgICAkY20gPSBnZXRfb3B0aW9uKCdjb21wbGlhbnpfb3B0aW9uc19zZXR0aW5ncycpOwogICAgJHJbJ2NtcGx6X3lyYSddID0gaXNfYXJyYXkoJGNtKSA/IGNvdW50KCRjbSkgOiAnbmVyYSc7CiAgICBpZiAoaXNfYXJyYXkoJGNtKSkgewogICAgICAgIGZvcmVhY2ggKCRjbSBhcyAkaz0+JHYpIHsKICAgICAgICAgICAgaWYgKHN0cmlwb3MoJGssJ3RjZicpIT09ZmFsc2UgfHwgc3RyaXBvcygoc3RyaW5nKSR2LCdUQ0YnKSE9PWZhbHNlKSB7ICRyWydjbXBsel90Y2YnXVska109aXNfc2NhbGFyKCR2KT9zdWJzdHIoKHN0cmluZykkdiwwLDgwKTpnZXR0eXBlKCR2KTsgfQogICAgICAgIH0KICAgIH0KICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7CiAgICBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('locate.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_lc4=Lc4v7"');
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
putB64('locate.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
