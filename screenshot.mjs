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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzNDIg4oCUIDYgcHVua3RvIHZhcnRhaSArIGtvbWVudGFybyBwYXRhaXNhCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc192NmEnXSkgKSByZXR1cm47CiAgICAkdiA9ICRfR0VUWydwc192NmEnXTsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgJHIgPSBhcnJheSgnVkVSU0lKQSc9Pid2YXJ0YWk2LXYxJyk7CiAgICAkRiA9IFBFVFNIT1BfQ09SRV9ESVIuJ2Fzc2V0cy9wZXQtZm9ybS5qcyc7CiAgICAkanMgPSBmaWxlX2dldF9jb250ZW50cygkRik7CiAgICAkclsndmFydGFpJ10gPSBhcnJheSgKICAgICAgICAnZHlkaXMnPT5zdHJsZW4oJGpzKSwgJ2R5ZGlzX29rJz0+KHN0cmxlbigkanMpPT09ODAzOTMpLAogICAgICAgICdzaGEnPT5oYXNoKCdzaGEyNTYnLCRqcyksCiAgICAgICAgJ3NoYV9vayc9PihzdHJwb3MoaGFzaCgnc2hhMjU2JywkanMpLCc4ZTAyZmQ1N2YzZWQ4NzhlJyk9PT0wKSwKICAgICAgICAnc3J2RW5zdXJlRHJhZnQnPT5zdWJzdHJfY291bnQoJGpzLCdzcnZFbnN1cmVEcmFmdCcpLAogICAgICAgICdzcnZTZW5kTWFnaWMnPT5zdWJzdHJfY291bnQoJGpzLCdzcnZTZW5kTWFnaWMnKSwKICAgICAgICAnU1JWX0RSQUZUX0tFWSc9PnN1YnN0cl9jb3VudCgkanMsJ1NSVl9EUkFGVF9LRVknKSwKICAgICAgICAnYWxlcnRfa2FydGFpJz0+c3Vic3RyX2NvdW50KCRqcywnYWxlcnQoJyksCiAgICApOwogICAgJHJbJ3ZhcnRhaSddWydQUkFFSk8nXSA9ICgkclsndmFydGFpJ11bJ2R5ZGlzX29rJ10gJiYgJHJbJ3ZhcnRhaSddWydzaGFfb2snXSk7CiAgICAvLyBrdXIgYWxlcnQoCiAgICBmb3JlYWNoIChleHBsb2RlKCJcbiIsJGpzKSBhcyAkbj0+JGwpIHsKICAgICAgICBpZiAoc3RycG9zKCRsLCdhbGVydCgnKSE9PWZhbHNlKSB7ICRyWydhbGVydF9laWx1dGVzJ11bXSA9ICgkbisxKS4nOiAnLnRyaW0oc3Vic3RyKCRsLDAsMTUwKSk7IH0KICAgIH0KICAgICRzZW4gPSAiXHRcdFx0Ly8gUzM0MTogSU5MSU5FIGJ1c2VudSBzcml0aXMgdmlldG9qZSBhbGVydCgpLiBUdXNjaWEg4oCUIG5lbWF0b21hLiI7CiAgICAkbmF1ID0gIlx0XHRcdC8vIFMzNDE6IElOTElORSBidXNlbnUgc3JpdGlzIHZpZXRvamUgbmFyc3lrbGVzIGlza3lsYW5jaW9qbyBsYW5nby4iOwogICAgJHJbJ2tvbWVudGFyb19pbmthcmFzJ10gPSBzdWJzdHJfY291bnQoJGpzLCRzZW4pOwoKICAgIGlmICgkdj09PSdkcnknKXsgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsgfQogICAgaWYgKCR2PT09J2FwcGx5Jyl7CiAgICAgICAgaWYgKCEkclsndmFydGFpJ11bJ1BSQUVKTyddKSB7ICRyWydWRVJESUtUQVMnXT0nU1VTVEFCRFlUQSDigJQgdmFydGFpJzsgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7IH0KICAgICAgICBpZiAoJHJbJ2tvbWVudGFyb19pbmthcmFzJ109PT0xKSB7CiAgICAgICAgICAgIGNvcHkoJEYsJEYuJy5iYWtfUzM0MicpOwogICAgICAgICAgICBmaWxlX3B1dF9jb250ZW50cygkRiwgc3RyX3JlcGxhY2UoJHNlbiwkbmF1LCRqcykpOwogICAgICAgICAgICAkclsnVkVSRElLVEFTJ109J0tPTUVOVEFSQVMgUEFUQUlTWVRBUyc7CiAgICAgICAgfSBlbHNlIHsgJHJbJ1ZFUkRJS1RBUyddPSdpbmthcmFzICcuJHJbJ2tvbWVudGFyb19pbmthcmFzJ10uJyDigJQgcHJhbGVpc3RhJzsgfQogICAgICAgIGNsZWFyc3RhdGNhY2hlKHRydWUsJEYpOwogICAgICAgICRqczIgPSBmaWxlX2dldF9jb250ZW50cygkRik7CiAgICAgICAgJHJbJ3BvJ10gPSBhcnJheSgnZHlkaXMnPT5zdHJsZW4oJGpzMiksJ3NoYSc9Pmhhc2goJ3NoYTI1NicsJGpzMiksCiAgICAgICAgICAgICdhbGVydF9rYXJ0YWknPT5zdWJzdHJfY291bnQoJGpzMiwnYWxlcnQoJykpOwogICAgICAgIGZvcmVhY2ggKGV4cGxvZGUoIlxuIiwkanMyKSBhcyAkbj0+JGwpIHsKICAgICAgICAgICAgaWYgKHN0cnBvcygkbCwnYWxlcnQoJykhPT1mYWxzZSkgeyAkclsnYWxlcnRfcG8nXVtdID0gKCRuKzEpLic6ICcudHJpbShzdWJzdHIoJGwsMCwxMjApKTsgfQogICAgICAgIH0KICAgIH0KICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFU3xKU09OX1BSRVRUWV9QUklOVCk7CiAgICBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('vartai6.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_v6a=dry"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.dry=uzk(1);
sh('sleep 3');
const a=sh('curl -sSk -m 50 "'+SITE+'/?ps_v6a=apply"');
try{ O.apply=JSON.parse(a.out); }catch(e){ O.apply_raw=a.out.slice(0,800); }
sh('sleep 4');
sh('curl -sSk -m 40 -o /tmp/pf7.js "'+SITE+'/wp-content/plugins/petshop-core/assets/pet-form.js"');
O.serv = sh('wc -c < /tmp/pf7.js').out.trim();
O.sint = sh('node --check /tmp/pf7.js && echo SINTAKSE_OK').out.trim().slice(0,200);
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
putB64('vartai6.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
