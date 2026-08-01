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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMjkgQWNjb3VudCBIVE1MIENoZWNrCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19obTQnXSkgfHwgJF9HRVRbJ3BzX2htNCddICE9PSAnSG00ejgnICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICAkciA9IGFycmF5KCdWRVJTSUpBJz0+J2h0bWwtY2hlY2stdjEnKTsKCiAgICAvLyBNZW5pdSBwdW5rdGFpIGlyIGp1IFRJS1JJIFVSTCdhaSDigJQgaXMgV29vQ29tbWVyY2UsIGthaXAgbWF0byB2YXJ0b3RvamFzCiAgICAkdSA9IGdldF91c2VyX2J5KCdsb2dpbicsJ3BzX3MzMjlfdGVzdCcpOwogICAgaWYgKCR1KSB7IHdwX3NldF9jdXJyZW50X3VzZXIoJHUtPklEKTsgfQogICAgJGl0ZW1zID0gd2NfZ2V0X2FjY291bnRfbWVudV9pdGVtcygpOwogICAgZm9yZWFjaCAoJGl0ZW1zIGFzICRrZXkgPT4gJGxhYmVsKSB7CiAgICAgICAgJHJbJ21lbml1J11bXSA9IGFycmF5KAogICAgICAgICAgICAncmFrdGFzJyA9PiAka2V5LAogICAgICAgICAgICAndXpyYXNhcyc9PiAkbGFiZWwsCiAgICAgICAgICAgICd1cmwnICAgID0+IHdjX2dldF9hY2NvdW50X2VuZHBvaW50X3VybCgka2V5KSwKICAgICAgICApOwogICAgfQogICAgLy8gYXRzaWp1bmdpbW8gbm9uY2UKICAgICRsbyA9IHdjX2dldF9hY2NvdW50X2VuZHBvaW50X3VybCgnY3VzdG9tZXItbG9nb3V0Jyk7CiAgICAkclsnbG9nb3V0X3VybCddID0gJGxvOwogICAgJHJbJ2xvZ291dF90dXJpX25vbmNlJ10gPSAoc3RycG9zKCRsbywnX3dwbm9uY2UnKSAhPT0gZmFsc2UpOwoKICAgIC8vIGFyIG3Fq3PFsyBlbmRwb2ludCdhcyByZWdpc3RydW90YXMgcXVlcnkgdmFycwogICAgJHF2ID0gV0MoKS0+cXVlcnkgPyBXQygpLT5xdWVyeS0+Z2V0X3F1ZXJ5X3ZhcnMoKSA6IGFycmF5KCk7CiAgICAkclsncXVlcnlfdmFycyddID0gJHF2OwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fUFJFVFRZX1BSSU5UKTsKICAgIGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'S329 Account HTML Check',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('htmlcheck.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_hm4=Hm4z8"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.rez=uzk(1);
sh('sleep 4');
function code(u){ return sh('curl -sSkI -m 30 -o /dev/null -w "%{http_code}|%{redirect_url}" "'+u+'"').out.trim(); }
O.t_naujas       = code(SITE+'/paskyra/');
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
putB64('htmlcheck.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
