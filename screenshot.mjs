import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3doeSddKSB8fCAkX0dFVFsncHNfd2h5J10hPT0nV2h5eCcpIHJldHVybjsKICB3aGlsZShvYl9nZXRfbGV2ZWwoKSkgb2JfZW5kX2NsZWFuKCk7CiAgZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoKTsKICAkTT0kcGYuJ3BzX2ZlZWRpbmdfbWFwJzsgJFQ9JHBmLidwc19mZWVkaW5nX3RhYmxlcyc7ICRSPSRwZi4ncHNfZmVlZGluZ19yb3dzJzsKICBmb3JlYWNoKGFycmF5KDE2NTI1LDE2MjY1LDE4NjE3KSBhcyAkcGlkKXsKICAgICRyZWM9YXJyYXkoJ3BpZCc9PiRwaWQpOwogICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKAogICAgICAiU0VMRUNUIHQuaWQgdGlkLHQuc3BlY2llcyx0LnNjb3BlLHQuc2hhcGUsdC5sb29rdXBfbWV0aG9kLHQucm93X2RpbWVuc2lvbix0LnN0YXR1cywKICAgICAgICAgICAgICB0LmlzX2FjdGl2ZSx0LmNhbm9uaWNhbF90YWJsZV9oYXNoIElTIE5PVCBOVUxMIEFTIGNoYXNoLCB0LmJfcGF0aF9zdGF0dXMsCiAgICAgICAgICAgICAgbS5pc19hY3RpdmUgQVMgbWFwX2FjdGl2ZQogICAgICAgRlJPTSAkTSBtIEpPSU4gJFQgdCBPTiB0LmlkPW0uZmVlZGluZ190YWJsZV9pZCBXSEVSRSBtLnByb2R1Y3RfaWQ9JWQiLCRwaWQpLEFSUkFZX0EpOwogICAgJHJlY1snbGVudGVsZXMnXT0kcm93czsKICAgIGlmKCRyb3dzKXsKICAgICAgJHRpZD0oaW50KSRyb3dzWzBdWyd0aWQnXTsKICAgICAgJHJyPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgKICAgICAgICAiU0VMRUNUIHJvd19vcmRlcix3ZWlnaHRfZnJvbV9rZyB3Zix3ZWlnaHRfdG9fa2cgd3QsYW1vdW50X2Zyb21fZyBhZixhbW91bnRfdG9fZyBhdDIsCiAgICAgICAgICAgICAgICBjZWxsX3R5cGUsY29uZGl0aW9uX2RpbWVuc2lvbnMgY2QsY29uZGl0aW9uX3JhdyBjcgogICAgICAgICBGUk9NICRSIFdIRVJFIGZlZWRpbmdfdGFibGVfaWQ9JWQgT1JERVIgQlkgcm93X29yZGVyIExJTUlUIDEwIiwkdGlkKSxBUlJBWV9BKTsKICAgICAgJHJlY1snZWlsdXRlcyddPSRycjsKICAgICAgJHJlY1snZWlsdWNpdV92aXNvJ109KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00gJFIgV0hFUkUgZmVlZGluZ190YWJsZV9pZD0lZCIsJHRpZCkpOwogICAgICAkcmVjWydjZWxsX3R5cGVfa2lla2lhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgKICAgICAgICAiU0VMRUNUIGNlbGxfdHlwZSxDT1VOVCgqKSBjIEZST00gJFIgV0hFUkUgZmVlZGluZ190YWJsZV9pZD0lZCBHUk9VUCBCWSBjZWxsX3R5cGUiLCR0aWQpLEFSUkFZX0EpOwogICAgICAkcmVjWydkaW1lbnNpam9zJ109JHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoCiAgICAgICAgIlNFTEVDVCBESVNUSU5DVCBjb25kaXRpb25fZGltZW5zaW9ucyBGUk9NICRSIFdIRVJFIGZlZWRpbmdfdGFibGVfaWQ9JWQiLCR0aWQpKTsKICAgIH0KICAgICRwPXdjX2dldF9wcm9kdWN0KCRwaWQpOwogICAgJHNwPSRyb3dzPyRyb3dzWzBdWydzcGVjaWVzJ106J2RvZyc7CiAgICAkbWlkPTQuNTsKICAgICRyPVBldHNob3BfRmVlZGluZ19TZXJ2aWNlOjpjYWxjKGFycmF5KCdwcm9kdWN0X2lkJz0+JHBpZCwnd2VpZ2h0X2tnJz0+JG1pZCwnc3BlY2llc19jb2RlJz0+JHNwKSk7CiAgICAkcmVjWydjYWxjJ109YXJyYXkoJ2tnJz0+JG1pZCwnc3QnPT4kclsnc3RhdHVzJ10sJ3JjJz0+JHJbJ3JlYXNvbl9jb2RlcyddLCdtc2cnPT5tYl9zdWJzdHIoKHN0cmluZykoJHJbJ21lc3NhZ2VfbHQnXT8/JycpLDAsOTApKTsKICAgICRvWyd0eXJpbWFzJ11bXT0kcmVjOwogIH0KICAvLyBraWVrIElTIFZJU08gbGVudGVsaXUgdHVyaSBuZS0ndmFsdWUnIGNlbGxfdHlwZQogICRvWydjZWxsX3R5cGVfZ2xvYmFsaWFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgY2VsbF90eXBlLENPVU5UKCopIGMgRlJPTSAkUiBHUk9VUCBCWSBjZWxsX3R5cGUiLEFSUkFZX0EpOwogICRvWydsZW50ZWxpdV9zdV9yZWRpcmVjdCddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVChESVNUSU5DVCBmZWVkaW5nX3RhYmxlX2lkKSBGUk9NICRSIFdIRVJFIGNlbGxfdHlwZTw+J3ZhbHVlJyIpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk --max-time 150 '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50e6,timeout:170000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const o={}; let sid=null;
try{
  const php = Buffer.from(PHPB64,'base64').toString('utf8');
  let mk=null;
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'WHY '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 5');
  const r=execSync('curl -sk --max-time 90 "https://dev.avesa.lt/?ps_why=Whyx"',{maxBuffer:20e6,timeout:110000}).toString();
  const i=r.indexOf('{'),k=r.lastIndexOf('}');
  if(i>=0&&k>i){ try{ o.result=JSON.parse(r.slice(i,k+1)); }catch(e){ o.rawslice=r.slice(i,i+400); } }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('why.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
