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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzNDQgcmVjb24g4oCUIF93ZWlnaHRfa2cgdnMgY3VycmVudF93ZWlnaHRfa2cKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX3dyMyddKSB8fCAkX0dFVFsncHNfd3IzJ10gIT09ICdXcjNqNycgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4nd2VpZ2h0LXJlY29uLXYxJyk7CiAgICAkZGlycyA9IGFycmF5KCdjb3JlJz0+UEVUU0hPUF9DT1JFX0RJUiwgJ2NoaWxkJz0+Z2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCkpOwogICAgZm9yZWFjaCAoJGRpcnMgYXMgJGs9PiRkKSB7CiAgICAgICAgaWYgKCFpc19kaXIoJGQpKSBjb250aW51ZTsKICAgICAgICAkaXQgPSBuZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGQsIFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yOjpTS0lQX0RPVFMpKTsKICAgICAgICBmb3JlYWNoICgkaXQgYXMgJGYpIHsKICAgICAgICAgICAgaWYgKCEkZi0+aXNGaWxlKCkpIGNvbnRpbnVlOwogICAgICAgICAgICAkZSA9IHN0cnRvbG93ZXIoJGYtPmdldEV4dGVuc2lvbigpKTsKICAgICAgICAgICAgaWYgKCFpbl9hcnJheSgkZSwgYXJyYXkoJ3BocCcsJ2pzJyksIHRydWUpKSBjb250aW51ZTsKICAgICAgICAgICAgaWYgKHN0cnBvcygkZi0+Z2V0UGF0aG5hbWUoKSwnLmJhaycpICE9PSBmYWxzZSB8fCBzdHJwb3MoJGYtPmdldFBhdGhuYW1lKCksJ3F1YXJhbnRpbmUnKSAhPT0gZmFsc2UpIGNvbnRpbnVlOwogICAgICAgICAgICAkYyA9IEBmaWxlX2dldF9jb250ZW50cygkZi0+Z2V0UGF0aG5hbWUoKSk7CiAgICAgICAgICAgIGlmICgkYz09PWZhbHNlKSBjb250aW51ZTsKICAgICAgICAgICAgJHJlbCA9ICRrLicvJy5zdHJfcmVwbGFjZSgkZC4nLycsJycsJGYtPmdldFBhdGhuYW1lKCkpOwogICAgICAgICAgICBmb3JlYWNoIChleHBsb2RlKCJcbiIsJGMpIGFzICRuPT4kbCkgewogICAgICAgICAgICAgICAgaWYgKHN0cnBvcygkbCwnX3dlaWdodF9rZycpID09PSBmYWxzZSkgY29udGludWU7CiAgICAgICAgICAgICAgICAkZWlsID0gKCRuKzEpLic6ICcudHJpbShzdWJzdHIoJGwsMCwxNTApKTsKICAgICAgICAgICAgICAgIC8vIGF0c2tpcmlhbTogY3VycmVudF93ZWlnaHRfa2cgYXIgZ3J5bmFzIF93ZWlnaHRfa2cKICAgICAgICAgICAgICAgICR0dXJpX2N1cnJlbnQgPSAoc3RycG9zKCRsLCdjdXJyZW50X3dlaWdodF9rZycpICE9PSBmYWxzZSk7CiAgICAgICAgICAgICAgICAkZ3J5bmFzID0gcHJlZ19tYXRjaCgnLyg/PCFjdXJyZW50KV93ZWlnaHRfa2cvJywgJGwpOwogICAgICAgICAgICAgICAgaWYgKCRncnluYXMgJiYgISR0dXJpX2N1cnJlbnQpIHsgJHJbJ2dyeW5hc193ZWlnaHRfa2cnXVskcmVsXVtdID0gJGVpbDsgfQogICAgICAgICAgICAgICAgZWxzZWlmICgkdHVyaV9jdXJyZW50KSB7ICRyWydjdXJyZW50X3dlaWdodF9rZyddWyRyZWxdW10gPSAkZWlsOyB9CiAgICAgICAgICAgICAgICBlbHNlIHsgJHJbJ2tpdGEnXVskcmVsXVtdID0gJGVpbDsgfQogICAgICAgICAgICB9CiAgICAgICAgfQogICAgfQogICAgLy8gc3J2UGF5bG9hZCDigJQga3VyIGZvcm11b2phbWFzIC9wZXQtZHJhZnQgcGF5bG9hZAogICAgJGpzID0gZmlsZV9nZXRfY29udGVudHMoUEVUU0hPUF9DT1JFX0RJUi4nYXNzZXRzL3BldC1mb3JtLmpzJyk7CiAgICAkaSA9IHN0cnBvcygkanMsJ2Z1bmN0aW9uIHNydlBheWxvYWQnKTsKICAgICRyWydzcnZQYXlsb2FkJ10gPSAkaSE9PWZhbHNlID8gc3Vic3RyKCRqcywkaSw3MDApIDogJ25lcmFzdGEnOwogICAgLy8ga3VyIHN2b3JpbyBsYXVrYXMga3VyaWFtYXMgYW5rZXRvamUKICAgIGZvcmVhY2ggKGV4cGxvZGUoIlxuIiwkanMpIGFzICRuPT4kbCkgewogICAgICAgIGlmIChwcmVnX21hdGNoKCcvaW5wdXRtb2RlfHB2elwuIDEyLDV8U3ZvcmlzL3UnLCRsKSkgeyAkclsnc3ZvcmlvX1VJJ11bXSA9ICgkbisxKS4nOiAnLnRyaW0oc3Vic3RyKCRsLDAsMTUwKSk7IH0KICAgIH0KICAgIC8vIGFyIGtpdGFzIGVuZHBvaW50YXMgcHJpaW1hIF93ZWlnaHRfa2cKICAgICRyWydSRVNUX3N1X3dlaWdodCddID0gYXJyYXkoKTsKICAgIGZvcmVhY2ggKGdsb2IoUEVUU0hPUF9DT1JFX0RJUi4naW5jbHVkZXMvKi5waHAnKSBhcyAkZikgewogICAgICAgICRjID0gZmlsZV9nZXRfY29udGVudHMoJGYpOwogICAgICAgIGlmIChwcmVnX21hdGNoKCcvKD88IWN1cnJlbnQpX3dlaWdodF9rZy8nLCRjKSAmJiBzdHJwb3MoJGMsJ3JlZ2lzdGVyX3Jlc3Rfcm91dGUnKSE9PWZhbHNlKSB7CiAgICAgICAgICAgICRyWydSRVNUX3N1X3dlaWdodCddW10gPSBiYXNlbmFtZSgkZik7CiAgICAgICAgfQogICAgfQogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsKICAgIGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('weightrecon.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_wr3=Wr3j7"');
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
putB64('weightrecon.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
