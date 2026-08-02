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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMzJjIOKAlCBGNCBwYWllc2tvcyBHQUxVVElORSBwYXRpa3JhICsgRUFOIHRlaXNpbmdhcyBza2FpY2l1cwogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfYTNjJ10pIHx8ICRfR0VUWydwc19hM2MnXSAhPT0gJ0EzYzl2JyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZ2xvYmFsICR3cGRiOyAkciA9IGFycmF5KCdWRVJTSUpBJz0+J2F1ZGl0My12MScpOwoKICAgIC8vID09PT09IEVBTjogYmV0IGt1cmlzIGlzIGR2aWVqdSByYWt0dSA9PT09PQogICAgJHJbJ2VhbiddID0gYXJyYXkoCiAgICAgICAgJ3B1Ymxpc2hfdmlzbycgPT4gKGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHdwZGItPnBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyIpLAogICAgICAgICdzdV9lYW4nID0+IChpbnQpJHdwZGItPmdldF92YXIoCiAgICAgICAgICAgICJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgcC5JRCkgRlJPTSAkd3BkYi0+cG9zdHMgcAogICAgICAgICAgICAgICBKT0lOICR3cGRiLT5wb3N0bWV0YSBtIE9OIG0ucG9zdF9pZD1wLklECiAgICAgICAgICAgICAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJwogICAgICAgICAgICAgICAgQU5EIG0ubWV0YV9rZXkgSU4gKCdfZ2xvYmFsX3VuaXF1ZV9pZCcsJ19lYW4nKSBBTkQgbS5tZXRhX3ZhbHVlPD4nJyIpLAogICAgKTsKICAgICRyWydlYW4nXVsnYmVfZWFuJ10gPSAkclsnZWFuJ11bJ3B1Ymxpc2hfdmlzbyddIC0gJHJbJ2VhbiddWydzdV9lYW4nXTsKCiAgICAvLyA9PT09PSBQQUlFU0tBOiBXUF9RdWVyeSwgbmUgSFRNTCBza2FpdGlrbGlzID09PT09CiAgICAvLyAoYSkgcGF2YWRpbmltbyB6b2RpcyDigJQgdHVyaSByYXN0aQogICAgJHBhdiA9ICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgcG9zdF90aXRsZSBGUk9NICR3cGRiLT5wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIHBvc3RfdGl0bGUgTElLRSAnJUpvc2VyYSUnIExJTUlUIDEiKTsKICAgIGlmICghJHBhdikgJHBhdiA9ICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgcG9zdF90aXRsZSBGUk9NICR3cGRiLT5wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCcgTElNSVQgMSIpOwogICAgJHpvZGlzID0gdHJpbShleHBsb2RlKCcgJywgJHBhdilbMF0pOwogICAgLy8gKGIpIFNLVSBpciBFQU4gcHVibGlzaCBwcmVrZXMKICAgICRyb3cgPSAkd3BkYi0+Z2V0X3JvdygiU0VMRUNUIHAuSUQsIHAucG9zdF90aXRsZSwKICAgICAgICAgICAgIChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NICR3cGRiLT5wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPXAuSUQgQU5EIG1ldGFfa2V5PSdfc2t1JyBMSU1JVCAxKSBza3UsCiAgICAgICAgICAgICAoU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSAkd3BkYi0+cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD1wLklEIEFORCBtZXRhX2tleSBJTiAoJ19nbG9iYWxfdW5pcXVlX2lkJywnX2VhbicpIEFORCBtZXRhX3ZhbHVlPD4nJyBMSU1JVCAxKSBlYW4KICAgICAgICAgICBGUk9NICR3cGRiLT5wb3N0cyBwCiAgICAgICAgICBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnCiAgICAgICAgICAgIEFORCBFWElTVFMgKFNFTEVDVCAxIEZST00gJHdwZGItPnBvc3RtZXRhIFdIRVJFIHBvc3RfaWQ9cC5JRCBBTkQgbWV0YV9rZXk9J19za3UnIEFORCBtZXRhX3ZhbHVlPD4nJykKICAgICAgICAgICAgQU5EIEVYSVNUUyAoU0VMRUNUIDEgRlJPTSAkd3BkYi0+cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD1wLklEIEFORCBtZXRhX2tleSBJTiAoJ19nbG9iYWxfdW5pcXVlX2lkJywnX2VhbicpIEFORCBtZXRhX3ZhbHVlPD4nJykKICAgICAgICAgIExJTUlUIDEiKTsKICAgICRyWyd0ZXN0aW5lX3ByZWtlJ10gPSAkcm93OwoKICAgIGZvcmVhY2ggKGFycmF5KCdwYXZhZGluaW1hcyc9PiR6b2RpcywgJ3NrdSc9Pigkcm93LT5za3UgPz8gbnVsbCksICdlYW4nPT4oJHJvdy0+ZWFuID8/IG51bGwpKSBhcyAkdGlwYXM9PiRxKSB7CiAgICAgICAgaWYgKCEkcSkgeyAkclsncGFpZXNrYSddWyR0aXBhc109J25lcmEnOyBjb250aW51ZTsgfQogICAgICAgICRxciA9IG5ldyBXUF9RdWVyeShhcnJheSgncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdzJz0+JHEsJ3Bvc3Rfc3RhdHVzJz0+J3B1Ymxpc2gnLCdwb3N0c19wZXJfcGFnZSc9PjMsJ2ZpZWxkcyc9PidpZHMnKSk7CiAgICAgICAgJHJbJ3BhaWVza2EnXVskdGlwYXNdID0gYXJyYXkoJ3V6a2xhdXNhJz0+JHEsICdyYWRvJz0+KGludCkkcXItPmZvdW5kX3Bvc3RzLCAnaWRzJz0+JHFyLT5wb3N0cyk7CiAgICAgICAgd3BfcmVzZXRfcG9zdGRhdGEoKTsKICAgIH0KICAgICRyWydWRVJESUtUQVNfRjQnXSA9IGFycmF5KAogICAgICAgICdwYXZhZGluaW1vX3BhaWVza2EnID0+ICgkclsncGFpZXNrYSddWydwYXZhZGluaW1hcyddWydyYWRvJ10gPz8gMCkgPiAwID8gJ1ZFSUtJQScgOiAnTkVWRUlLSUEnLAogICAgICAgICdza3VfcGFpZXNrYScgICAgICAgID0+ICgkclsncGFpZXNrYSddWydza3UnXVsncmFkbyddID8/IDApID4gMCA/ICdWRUlLSUEnIDogJ05FVkVJS0lBJywKICAgICAgICAnZWFuX3BhaWVza2EnICAgICAgICA9PiAoJHJbJ3BhaWVza2EnXVsnZWFuJ11bJ3JhZG8nXSA/PyAwKSA+IDAgPyAnVkVJS0lBJyA6ICdORVZFSUtJQScsCiAgICApOwoKICAgIC8vID09PT09IGJhY2t1cCBlZ3ppc3RhdmltYXMgKERvRCA4KSA9PT09PQogICAgJHJbJ2JhY2t1cCddID0gYXJyYXkoCiAgICAgICAgJ3BsdWdpbmFpJz0+YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcigoYXJyYXkpZ2V0X29wdGlvbignYWN0aXZlX3BsdWdpbnMnKSwgZnVuY3Rpb24oJHApewogICAgICAgICAgICByZXR1cm4gc3RyaXBvcygkcCwnYmFja3VwJykhPT1mYWxzZSB8fCBzdHJpcG9zKCRwLCdkdXBsaWNhdG9yJykhPT1mYWxzZSB8fCBzdHJpcG9zKCRwLCd1cGRyYWZ0JykhPT1mYWxzZTsgfSkpLAogICAgICAgICdkYl9iYWNrdXBfbGVudGVsZXMnPT5jb3VudCgoYXJyYXkpJHdwZGItPmdldF9jb2woIlNIT1cgVEFCTEVTIExJS0UgJ3skd3BkYi0+cHJlZml4fSViYWslJyIpKSwKICAgICk7CiAgICAvLyA9PT09PSBudW90cmF1a3UgdHJ1a3VtYXMg4oCUIGt1cmlvcyBwcmVrZXMgPT09PT0KICAgICRyWydiZV9udW90cmF1a29zX3B2eiddID0gJHdwZGItPmdldF9yZXN1bHRzKAogICAgICAgICJTRUxFQ1QgcC5JRCwgcC5wb3N0X3RpdGxlLCBwLnBvc3Rfc3RhdHVzIEZST00gJHdwZGItPnBvc3RzIHAKICAgICAgICAgICBMRUZUIEpPSU4gJHdwZGItPnBvc3RtZXRhIG0gT04gbS5wb3N0X2lkPXAuSUQgQU5EIG0ubWV0YV9rZXk9J190aHVtYm5haWxfaWQnCiAgICAgICAgICBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBtLm1ldGFfdmFsdWUgSVMgTlVMTCBMSU1JVCA2IiwgQVJSQVlfQSk7CiAgICAvLyA9PT09PSBiZSBrYWlub3MgPT09PT0KICAgICRyWydiZV9rYWlub3NfcHZ6J10gPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoCiAgICAgICAgIlNFTEVDVCBwLklELCBwLnBvc3RfdGl0bGUgRlJPTSAkd3BkYi0+cG9zdHMgcAogICAgICAgICAgIExFRlQgSk9JTiAkd3BkYi0+cG9zdG1ldGEgbSBPTiBtLnBvc3RfaWQ9cC5JRCBBTkQgbS5tZXRhX2tleT0nX3ByaWNlJwogICAgICAgICAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgKG0ubWV0YV92YWx1ZSBJUyBOVUxMIE9SIG0ubWV0YV92YWx1ZT0nJykgTElNSVQgNiIsIEFSUkFZX0EpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsKICAgIGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('tzaudit3.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_a3c=A3c9v"');
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
putB64('tzaudit3.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
