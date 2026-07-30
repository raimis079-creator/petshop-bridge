import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={}; let sid=null;
// pirma deaktyvuoti visus senus TEMP Consent Verify snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP Consent Verify/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgQ29uc2VudCBQb2xpY3kgVmVyaWZ5IHYxCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19jdCddKSB8fCAkX0dFVFsncHNfY3QnXSAhPT0gJ0N0OGgnICkgcmV0dXJuOwogICAgZ2xvYmFsICR3cGRiOyAkcj1hcnJheSgpOwogICAgJFNUPVBldHNob3BfRW1haWxfU3VwcHJlc3Npb246OnRhYmxlKCk7CiAgICAkRT0nY29uc2VudC1jaGVja0BleGFtcGxlLmNvbSc7CiAgICAkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIkRFTEVURSBGUk9NICRTVCBXSEVSRSBlbWFpbD0lcyIsJEUpKTsKCiAgICAkclsnYXBpX2V4aXN0cyddPWZ1bmN0aW9uX2V4aXN0cygncHNfc2V0X21hcmtldGluZ19jb25zZW50Jyk/MTowOwoKICAgIC8vIDEpIGJlIGNvbnNlbnQKICAgICRyWydzdGVwMV9ub19jb25zZW50J109YXJyYXkoCiAgICAgICdjb25zZW50Jz0+ZnVuY3Rpb25fZXhpc3RzKCdwc19nZXRfbWFya2V0aW5nX2NvbnNlbnQnKT8ocHNfZ2V0X21hcmtldGluZ19jb25zZW50KCRFKT8xOjApOiduL2EnLAogICAgICAncG9saWN5JyA9PlBldHNob3BfQ29udGFjdF9Qb2xpY3k6OmNvbXB1dGUoJEUpPyd0cnVlJzonZmFsc2UnLAogICAgKTsKCiAgICAvLyAyKSBTVVRFSUtJQU0gY29uc2VudAogICAgaWYgKGZ1bmN0aW9uX2V4aXN0cygncHNfc2V0X21hcmtldGluZ19jb25zZW50JykpIHsKICAgICAgICBwc19zZXRfbWFya2V0aW5nX2NvbnNlbnQoJEUsIHRydWUsICd0ZXN0X3ZlcmlmeScsIDApOwogICAgfQogICAgJHJbJ3N0ZXAyX2NvbnNlbnRfZ3JhbnRlZCddPWFycmF5KAogICAgICAnY29uc2VudCc9PmZ1bmN0aW9uX2V4aXN0cygncHNfZ2V0X21hcmtldGluZ19jb25zZW50Jyk/KHBzX2dldF9tYXJrZXRpbmdfY29uc2VudCgkRSk/MTowKTonbi9hJywKICAgICAgJ3BvbGljeScgPT5QZXRzaG9wX0NvbnRhY3RfUG9saWN5Ojpjb21wdXRlKCRFKT8ndHJ1ZSc6J2ZhbHNlJywKICAgICAgJ21hcmtldGFibGUnPT5QZXRzaG9wX0NvbnRhY3RfUG9saWN5Ojppc19tYXJrZXRhYmxlKCRFKT8xOjAsCiAgICApOwoKICAgIC8vIDMpIHRyYW5zYWtjaW5pcy9zZXJ2aWNlIGxhaXNrYXMgTkVUVVJJIGtlaXN0aSByZWlrc21lcwogICAgZG9fYWN0aW9uKCdwZXRzaG9wX2NvbnRhY3RfdXNlZCcsJEUsJ29yZGVyX3BhaWQnKTsKICAgICRyWydzdGVwM19hZnRlcl90cmFuc2FjdGlvbmFsJ109YXJyYXkoCiAgICAgICdwb2xpY3knPT5QZXRzaG9wX0NvbnRhY3RfUG9saWN5Ojpjb21wdXRlKCRFKT8ndHJ1ZSc6J2ZhbHNlJywKICAgICk7CgogICAgLy8gNCkgbWFya2V0aW5nIHVuc3Vic2NyaWJlIC0+IHRydWUsIGJldCB0cmFuc2FrY2luaWFpIGxlaWR6aWFtaQogICAgUGV0c2hvcF9FbWFpbF9TdXBwcmVzc2lvbjo6c3VwcHJlc3MoJEUsJ21hcmtldGluZycsJ3Vuc3Vic2NyaWJlJywndGVzdCcpOwogICAgJHJbJ3N0ZXA0X3Vuc3ViJ109YXJyYXkoCiAgICAgICdwb2xpY3knPT5QZXRzaG9wX0NvbnRhY3RfUG9saWN5Ojpjb21wdXRlKCRFKT8ndHJ1ZSc6J2ZhbHNlJywKICAgICAgJ21hcmtldGFibGUnPT5QZXRzaG9wX0NvbnRhY3RfUG9saWN5Ojppc19tYXJrZXRhYmxlKCRFKT8xOjAsCiAgICAgICdlbGlnX3RyYW5zYWN0aW9uYWwnPT5QZXRzaG9wX0VtYWlsX0Rpc3BhdGNoOjpjaGVja19lbGlnaWJpbGl0eSgndHJhbnNhY3Rpb25hbCcsJEUsJ29yZGVyX3BhaWQnKVsnYWxsb3dlZCddLAogICAgICAnZWxpZ19zZXJ2aWNlJz0+UGV0c2hvcF9FbWFpbF9EaXNwYXRjaDo6Y2hlY2tfZWxpZ2liaWxpdHkoJ3NlcnZpY2UnLCRFLCdwb3N0X3B1cmNoYXNlXzJkJylbJ2FsbG93ZWQnXSwKICAgICAgJ2VsaWdfbWFya2V0aW5nJz0+UGV0c2hvcF9FbWFpbF9EaXNwYXRjaDo6Y2hlY2tfZWxpZ2liaWxpdHkoJ21hcmtldGluZycsJEUsJ3dpbl9iYWNrXzYwJyksCiAgICApOwoKICAgIC8vIDUpIGNvbnNlbnQgZ3JhemludGFzICsgc3VwcHJlc3Npb24gbnVpbXRhcyAtPiBmYWxzZQogICAgUGV0c2hvcF9FbWFpbF9TdXBwcmVzc2lvbjo6cmVsZWFzZSgkRSwnbWFya2V0aW5nJyk7CiAgICAkclsnc3RlcDVfcmVsZWFzZWQnXT1hcnJheSgKICAgICAgJ3BvbGljeSc9PlBldHNob3BfQ29udGFjdF9Qb2xpY3k6OmNvbXB1dGUoJEUpPyd0cnVlJzonZmFsc2UnLAogICAgICAnbWFya2V0YWJsZSc9PlBldHNob3BfQ29udGFjdF9Qb2xpY3k6OmlzX21hcmtldGFibGUoJEUpPzE6MCwKICAgICk7CgogICAgLy8gdmFsb20KICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00gJFNUIFdIRVJFIGVtYWlsPSVzIiwkRSkpOwogICAgaWYgKGZ1bmN0aW9uX2V4aXN0cygncHNfc2V0X21hcmtldGluZ19jb25zZW50JykpIHBzX3NldF9tYXJrZXRpbmdfY29uc2VudCgkRSxmYWxzZSwndGVzdF9jbGVhbnVwJywwKTsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Consent Verify Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_ct=Ct8h"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_ct=Ct8h"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('ct.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
