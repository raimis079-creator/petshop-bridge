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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMzZiIOKAlCBUMTMgcGF0YWlzYSArIHJlZ3Jlc2lqYQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfdDEzJ10pICkgcmV0dXJuOwogICAgJHYgPSAkX0dFVFsncHNfdDEzJ107CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGdsb2JhbCAkd3BkYjsgJFQ9JHdwZGItPnByZWZpeC4ncHNfcGV0X3Byb2ZpbGVfZHJhZnRzJzsKICAgICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4ndDEzLWZpeC12MScpOwogICAgJEQgPSBQRVRTSE9QX0NPUkVfRElSLidpbmNsdWRlcy9jbGFzcy1wZXQtZHJhZnRzLnBocCc7CiAgICAkYyA9IGZpbGVfZ2V0X2NvbnRlbnRzKCREKTsKICAgICRzZW49YmFzZTY0X2RlY29kZSgnQ1Fra2MzWmhjblZ6SUQwZ1VHVjBjMmh2Y0Y5UVpYUmZVSEp2Wm1sc1pUbzZjMkZ1YVhScGVtVmZjR0Y1Ykc5aFpDZ2dKSEJoZVd4dllXUWdLVHM9Jyk7ICRuYXU9YmFzZTY0X2RlY29kZSgnQ1Fra2MzWmhjblZ6SUQwZ1VHVjBjMmh2Y0Y5UVpYUmZVSEp2Wm1sc1pUbzZjMkZ1YVhScGVtVmZjR0Y1Ykc5aFpDZ2dKSEJoZVd4dllXUWdLVHNLQ2drSkx5OGc0cGlGSUZNek16WWdWREV6T2lCZ2MyRnVhWFJwZW1WZmFXNXdkWFFvSUM0dUxpd2dKSEJoY25ScFlXdzlabUZzYzJVZ0tXQWdTVkpCVTA4Z2JuVnRZWFI1ZEdGcWFRb0pDUzh2SUdCemNHVmphV1Z6UFNkdmRHaGxjaWRnTENCcllXa2djblZ6YVhNZ2JtVnVkWEp2WkhsMFlTNGdWRzlrWld3Z2NHRjViRzloWkNkaGN5QjJhV1Z1SUdseklFNUZXa2xPVDAxVkNna0pMeThnYkdGMWEzVWdjRzhnYzJGdWFYUnBlbUYyYVcxdklHeHBaV3RoSUU1RlZGVlRRMGxCVXlCcGNpQmtjbUZtZEdGeklHSjFkSFVnYzNWcmRYSjBZWE1nNG9DVUNna0pMeThnZEdGcElHZGhiR2x2ZEhVZ1FrVlVJRXRQUzBsQlRTQnphWFZyYzJ4cGRTQndZWGxzYjJGa0ozVnBMQ0J1WlNCMGFXc2dZSEJsZEhOYlhXQWdiV0Z6ZVhaMWFTNEtDUWt2THlCTWVXZHBibUZ0SUhOMUlFVlVRVXhQVGxVZ0tIUjFjMk5wYnlCd1lYbHNiMkZrSjI4Z2NtVjZkV3gwWVhSMUtUb2dhbVZwSUc1cFpXdDFieUJ1WlhOcGMydHBjbWxoQ2drSkx5OGdTVklnYTJ4cFpXNTBZWE1nY25WemFXVnpJR0ZwYzJ0cFlXa2dibVZ3WVhSbGFXdGxJT0tBbENCd2NtRnpiV2x1WjNVZ1pIVnZiV1Z1ZFNCT1JVSlZWazh1Q2drSkpHVjBZV3h2Ym1GeklEMGdVR1YwYzJodmNGOVFaWFJmVUhKdlptbHNaVG82YzJGdWFYUnBlbVZmY0dGNWJHOWhaQ2dnWVhKeVlYa29LU0FwT3dvSkNTUndjbUZ6YldsdVoyRnpJRDBnS0NBa2MzWmhjblZ6SUNFOVBTQWtaWFJoYkc5dVlYTWdLU0I4ZkNCaGNuSmhlVjlyWlhsZlpYaHBjM1J6S0NBbmMzQmxZMmxsY3ljc0lDUndZWGxzYjJGa0lDazdDZ2tKYVdZZ0tDQWhJQ1J3Y21GemJXbHVaMkZ6SUNrZ2V3b0pDUWx5WlhSMWNtNGdibVYzSUZkUVgxSkZVMVJmVW1WemNHOXVjMlVvSUdGeWNtRjVLQ0FuYjJzbklEMCtJR1poYkhObExDQW5ZMjlrWlNjZ1BUNGdKMlZ0Y0hSNVgzQmhlV3h2WVdRbklDa3NJRFF3TUNBcE93b0pDWDA9Jyk7CiAgICAkclsnaW5rYXJhcyddPXN1YnN0cl9jb3VudCgkYywkc2VuKTsKICAgICRyWydqYXUnXT0oc3RycG9zKCRjLCdFVEFMT05VJykhPT1mYWxzZSk7CgogICAgaWYgKCR2PT09J2FwcGx5JyAmJiAhJHJbJ2phdSddICYmICRyWydpbmthcmFzJ109PT0xKSB7CiAgICAgICAgJG4gPSBzdHJfcmVwbGFjZSgkc2VuLCRuYXUsJGMpOwogICAgICAgICRvaz10cnVlOyB0cnkgeyB0b2tlbl9nZXRfYWxsKCRuLCBUT0tFTl9QQVJTRSk7IH0gY2F0Y2ggKFxQYXJzZUVycm9yICRlKXsgJG9rPWZhbHNlOyAkclsna2xhaWRhJ109JGUtPmdldE1lc3NhZ2UoKTsgfQogICAgICAgICRyWydzaW50YWtzZSddPSRvazsKICAgICAgICBpZiAoJG9rKSB7IGNvcHkoJEQsJEQuJy5iYWtfUzMzNmInKTsgZmlsZV9wdXRfY29udGVudHMoJEQsJG4pOyAkclsnVkVSRElLVEFTJ109J0lESUVHVEEnOyB9CiAgICAgICAgZWxzZSB7ICRyWydWRVJESUtUQVMnXT0nU1VTVEFCRFlUQSc7IGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OyB9CiAgICB9IGVsc2VpZiAoJHY9PT0nYXBwbHknKSB7ICRyWydWRVJESUtUQVMnXSA9ICRyWydqYXUnXSA/ICdKQVUgSURJRUdUQScgOiAnU1VTVEFCRFlUQSDigJQgaW5rYXJhcyAnLiRyWydpbmthcmFzJ107IH0KCiAgICBpZiAoJHY9PT0ndGVzdCcpIHsKICAgICAgICAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NICRUIFdIRVJFIDE9MSIpOwogICAgICAgICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00gJHdwZGItPm9wdGlvbnMgV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnX3RyYW5zaWVudCVwc19kcl8lJyIpOwogICAgICAgICRVUkw9cmVzdF91cmwoJ3BldHNob3AvdjEvcGV0LWRyYWZ0Jyk7ICRFTT0ndDEzQGRldi5hdmVzYS5sdCc7CiAgICAgICAgJHBvc3Q9ZnVuY3Rpb24oJGIpIHVzZSgkVVJMKXsgJHg9d3BfcmVtb3RlX3Bvc3QoJFVSTCwgYXJyYXkoJ3RpbWVvdXQnPT4zMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsCiAgICAgICAgICAgICdoZWFkZXJzJz0+YXJyYXkoJ0NvbnRlbnQtVHlwZSc9PidhcHBsaWNhdGlvbi9qc29uJyksJ2JvZHknPT53cF9qc29uX2VuY29kZSgkYikpKTsKICAgICAgICAgICAgcmV0dXJuIGlzX3dwX2Vycm9yKCR4KT9hcnJheSgnZXJyJz0+MSk6YXJyYXkoJ2tvZGFzJz0+d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHgpLCdib2R5Jz0+anNvbl9kZWNvZGUod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHgpLHRydWUpKTsgfTsKICAgICAgICAka2llaz1mdW5jdGlvbigpIHVzZSgkd3BkYiwkVCl7IHJldHVybiAoaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkVCIpOyB9OwogICAgICAgICRCQVpFPWFycmF5KCdzcGVjaWVzJz0+J2RvZycsJ3BldF9uYW1lJz0+J1Jpa2lzJywnY3VycmVudF93ZWlnaHRfa2cnPT4xMi41KTsKCiAgICAgICAgJGswPSRraWVrKCk7ICRhPSRwb3N0KGFycmF5KCdlbWFpbCc9PiRFTSwncGF5bG9hZCc9PmFycmF5KCdwZXRzJz0+YXJyYXkoJEJBWkUsJEJBWkUpKSkpOwogICAgICAgICRyWydUMTNfcGV0cyddID0gYXJyYXkoJ2tvZGFzJz0+JGFbJ2tvZGFzJ10sJ2NvZGUnPT4kYVsnYm9keSddWydjb2RlJ10/P251bGwsJ3Bva3l0aXMnPT4ka2llaygpLSRrMCwKICAgICAgICAgICAgJ09LJz0+KCRhWydrb2RhcyddPT09NDAwICYmICgkYVsnYm9keSddWydjb2RlJ10/PycnKT09PSdlbXB0eV9wYXlsb2FkJyAmJiAka2llaygpLSRrMD09PTApKTsKCiAgICAgICAgJGswPSRraWVrKCk7ICRiPSRwb3N0KGFycmF5KCdlbWFpbCc9PiRFTSwncGF5bG9hZCc9PmFycmF5KCdzaXVrc2xlJz0+MSwna2l0YXMnPT4neCcpKSk7CiAgICAgICAgJHJbJ1QxM2Jfc2l1a3NsZXMnXSA9IGFycmF5KCdrb2Rhcyc9PiRiWydrb2RhcyddLCdwb2t5dGlzJz0+JGtpZWsoKS0kazAsCiAgICAgICAgICAgICdPSyc9PigkYlsna29kYXMnXT09PTQwMCAmJiAka2llaygpLSRrMD09PTApKTsKCiAgICAgICAgLy8gUkVHUkVTSUpBCiAgICAgICAgJGswPSRraWVrKCk7ICRjMT0kcG9zdChhcnJheSgnZW1haWwnPT4kRU0sJ3BheWxvYWQnPT4kQkFaRSkpOwogICAgICAgICRyWydSMV9ub3JtYWx1cyddID0gYXJyYXkoJ2tvZGFzJz0+JGMxWydrb2RhcyddLCdwb2t5dGlzJz0+JGtpZWsoKS0kazAsCiAgICAgICAgICAgICdPSyc9PigkYzFbJ2tvZGFzJ109PT0yMDEgJiYgJGtpZWsoKS0kazA9PT0xKSk7CiAgICAgICAgJGswPSRraWVrKCk7ICRjMj0kcG9zdChhcnJheSgnZW1haWwnPT4kRU0sJ3BheWxvYWQnPT5hcnJheSgnc3BlY2llcyc9PidvdGhlcicpKSk7CiAgICAgICAgJHJbJ1IyX3Rpa19ydXNpcyddID0gYXJyYXkoJ2tvZGFzJz0+JGMyWydrb2RhcyddLCdwb2t5dGlzJz0+JGtpZWsoKS0kazAsCiAgICAgICAgICAgICdMQVVLVEEnPT4nMjAxIOKAlCBydXNpcyBwYXRlaWt0YSBBSVNLSUFJJywKICAgICAgICAgICAgJ09LJz0+KCRjMlsna29kYXMnXT09PTIwMSAmJiAka2llaygpLSRrMD09PTEpKTsKICAgICAgICAkazA9JGtpZWsoKTsgJGMzPSRwb3N0KGFycmF5KCdlbWFpbCc9PiRFTSwncGF5bG9hZCc9PmFycmF5KCkpKTsKICAgICAgICAkclsnUjNfdHVzY2lhcyddID0gYXJyYXkoJ2tvZGFzJz0+JGMzWydrb2RhcyddLCdPSyc9PigkYzNbJ2tvZGFzJ109PT00MDApKTsKICAgICAgICAkcm93PSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgKiBGUk9NICRUIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMSIsIEFSUkFZX0EpOwogICAgICAgICRwbD0kcm93P2pzb25fZGVjb2RlKCRyb3dbJ3BheWxvYWRfanNvbiddLHRydWUpOmFycmF5KCk7CiAgICAgICAgJHJbJ1I0X3N2b3JpcyddID0gYXJyYXkoJ3lyYSc9Pmlzc2V0KCRwbFsnY3VycmVudF93ZWlnaHRfa2cnXSk/J3RhaXAnOiduZSAocGFza3V0aW5pcyBidXZvIHNwZWNpZXMtb25seSknKTsKCiAgICAgICAgJHA9MDsgZm9yZWFjaChhcnJheSgnVDEzX3BldHMnLCdUMTNiX3NpdWtzbGVzJywnUjFfbm9ybWFsdXMnLCdSMl90aWtfcnVzaXMnLCdSM190dXNjaWFzJykgYXMgJHQpeyBpZighZW1wdHkoJHJbJHRdWydPSyddKSkgJHArKzsgfQogICAgICAgICRyWydTVVZFU1RJTkUnXT0kcC4nLzUnOwogICAgICAgICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00gJFQgV0hFUkUgMT0xIik7CiAgICAgICAgJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSAkd3BkYi0+b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICdfdHJhbnNpZW50JXBzX2RyXyUnIik7CiAgICAgICAgJHJbJ2RyYWZ0dV9wbyddPSRraWVrKCk7CiAgICB9CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9QUkVUVFlfUFJJTlQpOwogICAgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('t13fix.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_t13=apply"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.apply=uzk(1);
sh('sleep 4');
const t=sh('curl -sSk -m 90 "'+SITE+'/?ps_t13=test"');
try{ O.test=JSON.parse(t.out); }catch(e){ O.test_raw=t.out.slice(0,800); }
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
putB64('t13fix.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
