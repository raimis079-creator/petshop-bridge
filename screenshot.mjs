import { execSync } from 'child_process';
import fs from 'fs';
const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3NjaCddKSB8fCAkX0dFVFsncHNfc2NoJ10hPT0nU2MyNHgnKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoKTsKICAkb1sndGFibGVzX2NvbHMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNIT1cgQ09MVU1OUyBGUk9NIHskcGZ9cHNfZmVlZGluZ190YWJsZXMiLEFSUkFZX0EpOwogICRvWydyb3dzX2NvbHMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNIT1cgQ09MVU1OUyBGUk9NIHskcGZ9cHNfZmVlZGluZ19yb3dzIixBUlJBWV9BKTsKICAkb1snbWFwX2NvbHMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNIT1cgQ09MVU1OUyBGUk9NIHskcGZ9cHNfZmVlZGluZ19tYXAiLEFSUkFZX0EpOwogIC8vIHBhdnl6ZHlzOiBQcmlucy10aXBvIChha3R5dnVtbyBhc2lzKSBpciBwYXByYXN0YXMKICAkdDE9JHdwZGItPmdldF9yb3coIlNFTEVDVCAqIEZST00geyRwZn1wc19mZWVkaW5nX3RhYmxlcyBXSEVSRSBpc19hY3RpdmU9MSBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDEiLEFSUkFZX0EpOwogICRvWyd0YmxfcHZ6J109JHQxOwogIGlmKCR0MSkgJG9bJ3Jvd3NfcHZ6J109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgKiBGUk9NIHskcGZ9cHNfZmVlZGluZ19yb3dzIFdIRVJFIGZlZWRpbmdfdGFibGVfaWQ9JWQgT1JERVIgQlkgaWQgTElNSVQgNCIsJHQxWydpZCddKSxBUlJBWV9BKTsKICAvLyBsZW50ZWxlIHN1IGFrdHl2dW1vIGFzaW1pCiAgJHRhPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgZmVlZGluZ190YWJsZV9pZCBGUk9NIHskcGZ9cHNfZmVlZGluZ19yb3dzIFdIRVJFIGNvbmRpdGlvbnMgTElLRSAnJWFrdHl2JScgT1IgY29uZGl0aW9uX3JhdyBMSUtFICclYWt0eXYlJyBMSU1JVCAxIik7CiAgaWYoJHRhKXsgJG9bJ2FrdF90YmwnXT0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUICogRlJPTSB7JHBmfXBzX2ZlZWRpbmdfdGFibGVzIFdIRVJFIGlkPSVkIiwkdGEpLEFSUkFZX0EpOwogICAgJG9bJ2FrdF9yb3dzJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgKiBGUk9NIHskcGZ9cHNfZmVlZGluZ19yb3dzIFdIRVJFIGZlZWRpbmdfdGFibGVfaWQ9JWQgT1JERVIgQlkgaWQgTElNSVQgNSIsJHRhKSxBUlJBWV9BKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'SCH (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
execSync('sleep 3');
let r='';
try{ r=execSync('curl -sk "https://dev.avesa.lt/?ps_sch=Sc24x"',{maxBuffer:100*1024*1024,timeout:90000}).toString(); }catch(e){ r='ERR '+String(e).slice(0,200); }
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('sch.json', Buffer.from(r).toString('base64'));
console.log('done', r.length);
