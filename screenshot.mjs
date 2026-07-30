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
// pirma deaktyvuoti visus senus TEMP S316 Cleanup snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP S316 Cleanup/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzMxNiBDbGVhbnVwIHYxCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19jMTYnXSkgfHwgJF9HRVRbJ3BzX2MxNiddICE9PSAnQzE2eCcgKSByZXR1cm47CiAgICBnbG9iYWwgJHdwZGI7ICRyPWFycmF5KCk7CiAgICAkVD0kd3BkYi0+cHJlZml4Lidwc19jYXJ0cyc7CiAgICAkaWRzPWFycmF5KCdjXzQ2YmIyYTJhNWQ5MycsJ2NfMDIwZDg3NjE3YjZiJyk7CiAgICAvLyBwaWxuaSBjYXJ0X2lkICh0cnVtcGludGkgcm9keW1lKQogICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgY2FydF9pZCxzZXNzaW9uX2tleSxlbWFpbCBGUk9NICRUIiwgQVJSQVlfQSk7CiAgICAkclsnYmVmb3JlJ109JHJvd3M7CiAgICAkZGVsPTA7ICRzZXNzPWFycmF5KCk7CiAgICBmb3JlYWNoICgkcm93cyBhcyAkeCkgewogICAgICAgICRtYXRjaD1mYWxzZTsKICAgICAgICBmb3JlYWNoICgkaWRzIGFzICRwKSBpZiAoc3RycG9zKCR4WydjYXJ0X2lkJ10sJHApPT09MCkgJG1hdGNoPXRydWU7CiAgICAgICAgaWYgKCR4WydlbWFpbCddPT09J2d1ZXN0LWNhcnQtdGVzdEBleGFtcGxlLmNvbScpICRtYXRjaD10cnVlOwogICAgICAgIGlmICgkbWF0Y2gpIHsKICAgICAgICAgICAgaWYgKCR4WydzZXNzaW9uX2tleSddKSAkc2Vzc1tdPSR4WydzZXNzaW9uX2tleSddOwogICAgICAgICAgICAkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIkRFTEVURSBGUk9NICRUIFdIRVJFIGNhcnRfaWQ9JXMiLCR4WydjYXJ0X2lkJ10pKTsKICAgICAgICAgICAgJGRlbCsrOwogICAgICAgIH0KICAgIH0KICAgICRyWydjYXJ0c19kZWxldGVkJ109JGRlbDsKICAgIC8vIFdvbyBzZXNpam9zCiAgICAkc3Q9JHdwZGItPnByZWZpeC4nd29vY29tbWVyY2Vfc2Vzc2lvbnMnOwogICAgJHNkZWw9MDsKICAgIGZvcmVhY2ggKGFycmF5X3VuaXF1ZSgkc2VzcykgYXMgJHNrKSB7CiAgICAgICAgJHNkZWwgKz0gKGludCkkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIkRFTEVURSBGUk9NICRzdCBXSEVSRSBzZXNzaW9uX2tleT0lcyIsJHNrKSk7CiAgICB9CiAgICAkclsnc2Vzc2lvbnNfZGVsZXRlZCddPSRzZGVsOwogICAgJHJbJ3Nlc3Npb25fa2V5cyddPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJHNlc3MpKTsKICAgIC8vIHN1cHByZXNzaW9uIC8gY29uc2VudCBsaWt1Y2lhaQogICAgJHN1cD0kd3BkYi0+cHJlZml4Lidwc19lbWFpbF9zdXBwcmVzc2lvbic7CiAgICAkclsnc3VwcF9kZWxldGVkJ109KGludCkkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIkRFTEVURSBGUk9NICRzdXAgV0hFUkUgZW1haWw9JXMiLCdndWVzdC1jYXJ0LXRlc3RAZXhhbXBsZS5jb20nKSk7CiAgICAvLyBvdXRib3ggdGVzdGluaWFpCiAgICAkZWo9JHdwZGItPnByZWZpeC4ncHNfZW1haWxfam9icyc7CiAgICAkclsnam9ic190ZXN0J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsam9iX2tleSxmbG93LHN0YXR1cyBGUk9NICRlaiBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDUiLCBBUlJBWV9BKTsKICAgICRyWydhZnRlciddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGNhcnRfaWQsZW1haWwsc3RhdHVzIEZST00gJFQiLCBBUlJBWV9BKTsKICAgICRyWydjYXJ0c19sZWZ0J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJFQiKTsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S316 Cleanup Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_c16=C16x"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_c16=C16x"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('cl16.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
