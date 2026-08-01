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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMzAg4oCUIG5ld3NsZXR0ZXIgZWxlbWVudG8gc3VyYWRpbWFzICsgVENGIHByaWVpbmFtdW1hcwogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfbmw4J10pICkgcmV0dXJuOwogICAgJHYgPSAkX0dFVFsncHNfbmw4J107CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4nbmV3c2xldHRlci12MScpOwoKICAgIC8vIDEpIFZJU0kgdGhlbWVfbW9kcywga3VyaXVvc2UgeXJhICduZXdzbGV0dGVyJwogICAgJG1vZHMgPSBnZXRfdGhlbWVfbW9kcygpOwogICAgZm9yZWFjaCAoKGFycmF5KSRtb2RzIGFzICRrPT4kdmFsKSB7CiAgICAgICAgaWYgKGlzX2FycmF5KCR2YWwpICYmIGluX2FycmF5KCduZXdzbGV0dGVyJywgJHZhbCwgdHJ1ZSkpIHsKICAgICAgICAgICAgJHJbJ3Jhc3RhJ11bJGtdID0gaW1wbG9kZSgnLCcsICR2YWwpOwogICAgICAgIH0gZWxzZWlmIChpc19zdHJpbmcoJHZhbCkgJiYgc3RycG9zKCR2YWwsJ25ld3NsZXR0ZXInKSAhPT0gZmFsc2UpIHsKICAgICAgICAgICAgJHJbJ3Jhc3RhX3N0cmluZyddWyRrXSA9IHN1YnN0cigkdmFsLDAsMTIwKTsKICAgICAgICB9CiAgICB9CiAgICBpZiAoJHYgPT09ICdkcnknKSB7CiAgICAgICAgLy8gVENGIHByaWVpbmFtdW1hcwogICAgICAgICRyZXNwID0gd3BfcmVtb3RlX2dldChob21lX3VybCgnLycpLCBhcnJheSgndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZSwKICAgICAgICAgICAgJ2hlYWRlcnMnPT5hcnJheSgnQ2FjaGUtQ29udHJvbCc9Piduby1jYWNoZScpKSk7CiAgICAgICAgJGggPSBpc193cF9lcnJvcigkcmVzcCkgPyAnJyA6IHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyZXNwKTsKICAgICAgICAkaSA9IHN0cnBvcygkaCwgJ2NtcGx6LXRjZi13cmFwcGVyJyk7CiAgICAgICAgJHJbJ3RjZl93cmFwcGVyX3lyYSddID0gKCRpICE9PSBmYWxzZSk7CiAgICAgICAgaWYgKCRpICE9PSBmYWxzZSkgeyAkclsndGNmX2tvbnRla3N0YXMnXSA9IHByZWdfcmVwbGFjZSgnL1xzKy91JywnICcsIHN1YnN0cigkaCwgbWF4KDAsJGktNDAwKSwgNzAwKSk7IH0KICAgICAgICAkclsndmVuZG9yX2NvdW50X3BsYWNlaG9sZGVyJ10gPSBzdWJzdHJfY291bnQoJGgsICd7dmVuZG9yX2NvdW50fScpOwogICAgICAgIC8vIGFyIFRDRiBudW9yb2RhIHR1cmkgdGFiaW5kZXgvaGlkZGVuCiAgICAgICAgaWYgKHByZWdfbWF0Y2goJyM8YVtePl0qY21wbHotcmVhZC1tb3JlLXB1cnBvc2VzW14+XSo+IycsICRoLCAkbSkpIHsKICAgICAgICAgICAgJHJbJ3RjZl9udW9yb2RhJ10gPSAkbVswXTsKICAgICAgICAgICAgJHJbJ3RjZl9oaWRkZW5fYXRyaWJ1dGFzJ10gPSAoc3RycG9zKCRtWzBdLCdoaWRkZW4nKSE9PWZhbHNlIHx8IHN0cnBvcygkbVswXSwndGFiaW5kZXg9Ii0xIicpIT09ZmFsc2UpOwogICAgICAgIH0KICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0OwogICAgfQogICAgaWYgKCR2ID09PSAnYXBwbHknKSB7CiAgICAgICAgJHBha2Vpc3RhID0gYXJyYXkoKTsKICAgICAgICBmb3JlYWNoICgoYXJyYXkpJG1vZHMgYXMgJGs9PiR2YWwpIHsKICAgICAgICAgICAgaWYgKGlzX2FycmF5KCR2YWwpICYmIGluX2FycmF5KCduZXdzbGV0dGVyJywgJHZhbCwgdHJ1ZSkpIHsKICAgICAgICAgICAgICAgIHVwZGF0ZV9vcHRpb24oJ3BzX2Jha18nLiRrLidfMjAyNjA4MDEnLCAkdmFsLCBmYWxzZSk7ICAgLy8gQkFDS1VQCiAgICAgICAgICAgICAgICAkbmF1amFzID0gYXJyYXlfdmFsdWVzKGFycmF5X2RpZmYoJHZhbCwgYXJyYXkoJ25ld3NsZXR0ZXInKSkpOwogICAgICAgICAgICAgICAgc2V0X3RoZW1lX21vZCgkaywgJG5hdWphcyk7CiAgICAgICAgICAgICAgICAkcGFrZWlzdGFbJGtdID0gYXJyYXkoJ2J1dm8nPT5pbXBsb2RlKCcsJywkdmFsKSwgJ2RhYmFyJz0+aW1wbG9kZSgnLCcsJG5hdWphcykpOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgICAgICRyWydwYWtlaXN0YSddID0gJHBha2Vpc3RhOwogICAgICAgIHdwX2NhY2hlX2ZsdXNoKCk7CiAgICAgICAgJHJlc3AgPSB3cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvJyksIGFycmF5KCd0aW1lb3V0Jz0+MzAsJ3NzbHZlcmlmeSc9PmZhbHNlLAogICAgICAgICAgICAnaGVhZGVycyc9PmFycmF5KCdDYWNoZS1Db250cm9sJz0+J25vLWNhY2hlJykpKTsKICAgICAgICAkaCA9IGlzX3dwX2Vycm9yKCRyZXNwKSA/ICcnIDogd3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHJlc3ApOwogICAgICAgICRyWydwYXRpa3JhJ10gPSBhcnJheSgKICAgICAgICAgICAgJ1NpZ25fdXBfZm9yX05ld3NsZXR0ZXInID0+IHN1YnN0cl9jb3VudCgkaCwnU2lnbiB1cCBmb3IgTmV3c2xldHRlcicpLAogICAgICAgICAgICAnaGVhZGVyX25ld3NsZXR0ZXJfaXRlbScgPT4gc3Vic3RyX2NvdW50KCRoLCdoZWFkZXItbmV3c2xldHRlci1pdGVtJyksCiAgICAgICAgICAgICduZXdzbGV0dGVyX3NpZ251cF9tb2RhbCc9PiBzdWJzdHJfY291bnQoJGgsJ2hlYWRlci1uZXdzbGV0dGVyLXNpZ251cCcpLAogICAgICAgICAgICAnUHJpc2lqdW5ndGlfbGlrbycgICAgICAgPT4gc3Vic3RyX2NvdW50KCRoLCdQcmlzaWp1bmd0aScpLAogICAgICAgICAgICAna3JlcHNlbGlzX2xpa28nICAgICAgICAgPT4gc3Vic3RyX2NvdW50KCRoLCdoZWFkZXItY2FydCcpLAogICAgICAgICk7CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKICAgIH0KICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2Vycic9PjEpKTsgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('newsletter.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_nl8=dry"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.dry=uzk(1);
sh('sleep 3');
const a=sh('curl -sSk -m 40 "'+SITE+'/?ps_nl8=apply"');
try{ O.apply=JSON.parse(a.out); }catch(e){ O.apply_raw=a.out.slice(0,600); }
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
putB64('newsletter.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
