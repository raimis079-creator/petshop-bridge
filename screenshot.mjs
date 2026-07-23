import { execSync } from 'child_process';
import fs from 'fs';
const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2V4cmVjJ10pIHx8ICRfR0VUWydwc19leHJlYyddIT09J0V4MjN4JykgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJG89YXJyYXkoKTsKICAkcGlkPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgSUQgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIHBvc3RfdGl0bGUgTElLRSAnRXhjbHVzaW9uJU1vbm9wcm90ZWluJXN0ZXJpbGl6dW90b21zJXR1bnUlMSw1JScgTElNSVQgMSIpOwogICRvWydwaWQnXT0oaW50KSRwaWQ7CiAgaWYoJHBpZCAmJiBjbGFzc19leGlzdHMoJ1BldHNob3BfRmVlZGluZ19SZXBvc2l0b3J5JykpewogICAgJHJlcG89bmV3IFBldHNob3BfRmVlZGluZ19SZXBvc2l0b3J5KCk7CiAgICAkcnQ9JHJlcG8tPmdldF9mb3JfcHJvZHVjdCgoaW50KSRwaWQpOwogICAgJG9bJ3N1cHBvcnQnXT0kcnRbJ3N1cHBvcnQnXT8/bnVsbDsgJG9bJ3N0YXR1cyddPSRydFsnc3RhdHVzJ10/P251bGw7CiAgICAkb1snYXhpc19wb2xpY3knXT0kcnRbJ2F4aXNfcG9saWN5J10/P251bGw7ICRvWyd3ZWlnaHRfYmFzaXMnXT0kcnRbJ3dlaWdodF9iYXNpcyddPz9udWxsOwogICAgJG9bJ3Jvd3NfbiddPWlzc2V0KCRydFsncm93cyddKT9jb3VudCgkcnRbJ3Jvd3MnXSk6MDsKICAgICRvWydyb3dzJ109YXJyYXlfc2xpY2UoYXJyYXlfbWFwKGZ1bmN0aW9uKCRyKXtyZXR1cm4gYXJyYXlfaW50ZXJzZWN0X2tleSgoYXJyYXkpJHIsYXJyYXlfZmxpcChhcnJheSgnd2VpZ2h0X2Zyb21fa2cnLCd3ZWlnaHRfdG9fa2cnLCdhbW91bnRfZnJvbV9nJywnYW1vdW50X3RvX2cnLCdjb25kaXRpb25fZGltZW5zaW9ucycsJ2NvbmRpdGlvbl9yYXcnLCdjZWxsX3R5cGUnKSkpO30sICRydFsncm93cyddPz9hcnJheSgpKSwwLDYpOwogICAgJHRpZD0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGZlZWRpbmdfdGFibGVfaWQgRlJPTSB7JHdwZGItPnByZWZpeH1wc19mZWVkaW5nX21hcCBXSEVSRSBwcm9kdWN0X2lkPSVkIEFORCBpc19hY3RpdmU9MSIsJHBpZCkpOwogICAgJG9bJ3RhYmxlX2lkJ109KGludCkkdGlkOwogICAgaWYoJHRpZCl7ICRvWyd0YmxfbWV0YSddPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgKiBGUk9NIHskd3BkYi0+cHJlZml4fXBzX2ZlZWRpbmdfdGFibGVzIFdIRVJFIGlkPSVkIiwkdGlkKSxBUlJBWV9BKTsgfQogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024,timeout:70000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50*1024*1024}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50*1024*1024}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2');}return 'fail';}
const mk=wj('POST','code-snippets/v1/snippets',{name:'EXREC (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
execSync('sleep 3');
let r='';
try{ r=execSync('curl -sk "https://dev.avesa.lt/?ps_exrec=Ex23x"',{maxBuffer:100*1024*1024,timeout:90000}).toString(); }catch(e){ r='ERR '+String(e).slice(0,200); }
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('exrec.json', Buffer.from(r).toString('base64'));
console.log('done', r.length);
