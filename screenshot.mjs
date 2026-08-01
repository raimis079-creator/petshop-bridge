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
const php=Buffer.from('PD9waHAKLyoqCiAqIFVJIExvY2FsaXphdGlvbiBSdW50aW1lIEF1ZGl0IOKAlCBzb2NpYWxpbml1IG51b3JvZHUgcmVjb24KICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX3NvOCddKSB8fCAkX0dFVFsncHNfc284J10gIT09ICdTbzhtMicgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4nc29jaWFsLXJlY29uLXYxJyk7CgogICAgLy8gVklTSSBGbGF0c29tZSBmb2xsb3dfKiB0aGVtZV9tb2RzCiAgICAkbW9kcyA9IGdldF90aGVtZV9tb2RzKCk7CiAgICBmb3JlYWNoICgkbW9kcyBhcyAkayA9PiAkdikgewogICAgICAgIGlmIChzdHJwb3MoJGssICdmb2xsb3dfJykgPT09IDApIHsgJHJbJ2ZvbGxvdyddWyRrXSA9ICR2OyB9CiAgICB9CiAgICAvLyB2ZXJ0aW5pbWFzOiBhciByZWlrc21lIHRpa3JhCiAgICBmb3JlYWNoICgoJHJbJ2ZvbGxvdyddID8/IGFycmF5KCkpIGFzICRrID0+ICR2KSB7CiAgICAgICAgJHMgPSB0cmltKChzdHJpbmcpJHYpOwogICAgICAgICRibG9naSA9IGFycmF5KCcnLCAnaHR0cDovL3VybCcsICdodHRwczovL3VybCcsICd1cmwnLCAneW91ckBlbWFpbCcsICcjJyk7CiAgICAgICAgaWYgKGluX2FycmF5KCRzLCAkYmxvZ2ksIHRydWUpKSB7ICR2ZXJkaWt0YXMgPSAnUExBQ0VIT0xERVIgLyBUVVNDSUEnOyB9CiAgICAgICAgZWxzZWlmIChzdHJwb3MoJHMsICdAJykgIT09IGZhbHNlICYmIHN0cnBvcygkcywgJ2h0dHAnKSAhPT0gMCkgeyAkdmVyZGlrdGFzID0gJ0VMLiBQQVNUQVMnOyB9CiAgICAgICAgZWxzZWlmIChwcmVnX21hdGNoKCcjXmh0dHBzPzovL1thLXowLTkuLV0rXC5bYS16XXsyLH0jaScsICRzKSkgeyAkdmVyZGlrdGFzID0gJ1RJS1JBUyBVUkwnOyB9CiAgICAgICAgZWxzZSB7ICR2ZXJkaWt0YXMgPSAnTkVBSVNLVSc7IH0KICAgICAgICAkclsndmVydGluaW1hcyddWyRrXSA9IGFycmF5KCdyZWlrc21lJz0+JHMsICd2ZXJkaWt0YXMnPT4kdmVyZGlrdGFzKTsKICAgIH0KICAgIC8vIGthIG1hdG8gdmFydG90b2phcyBwb3Jhc3RlamUKICAgICRyZXNwID0gd3BfcmVtb3RlX2dldChob21lX3VybCgnLycpLCBhcnJheSgndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZSwKICAgICAgICAnaGVhZGVycyc9PmFycmF5KCdDYWNoZS1Db250cm9sJz0+J25vLWNhY2hlJykpKTsKICAgICRoID0gaXNfd3BfZXJyb3IoJHJlc3ApID8gJycgOiB3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcmVzcCk7CiAgICBmb3JlYWNoIChhcnJheSgnZmFjZWJvb2snLCdpbnN0YWdyYW0nLCd0d2l0dGVyJywneC5jb20nLCdtYWlsdG8nKSBhcyAkdCkgewogICAgICAgICRyWydwb3Jhc3RlamUnXVskdF0gPSBzdWJzdHJfY291bnQoc3RydG9sb3dlcigkaCksICR0KTsKICAgIH0KICAgIHByZWdfbWF0Y2hfYWxsKCcjPGFbXj5dK2NsYXNzPSJbXiJdKmljb25bXiJdKiJbXj5dKj4jaScsICRoLCAkaWspOwogICAgJHJbJ2lrb251X251b3JvZG9zJ10gPSBhcnJheV9zbGljZSgkaWtbMF0sIDAsIDEyKTsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7CiAgICBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('social.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_so8=So8m2"');
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
putB64('social.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
