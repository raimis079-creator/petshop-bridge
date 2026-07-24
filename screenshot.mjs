import { execSync } from 'child_process';
import fs from 'fs';
const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3NtayddKSB8fCAkX0dFVFsncHNfc21rJ10hPT0nU20yNHgnKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoKTsKICAvLyAxNDUzNCBkZXRhbMSXCiAgJHRpZD0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgZmVlZGluZ190YWJsZV9pZCBGUk9NIHskcGZ9cHNfZmVlZGluZ19tYXAgV0hFUkUgcHJvZHVjdF9pZD0xNDUzNCBBTkQgaXNfYWN0aXZlPTEiKTsKICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCB3ZWlnaHRfZnJvbV9rZyB3ZixhbW91bnRfZnJvbV9nIGFmLGFtb3VudF90b19nIGF0Mixjb25kaXRpb25fcmF3IGNyIEZST00geyRwZn1wc19mZWVkaW5nX3Jvd3MgV0hFUkUgZmVlZGluZ190YWJsZV9pZD0lZCBPUkRFUiBCWSByb3dfb3JkZXIgTElNSVQgOCIsJHRpZCksQVJSQVlfQSk7CiAgJG9bJ2YxNDUzNCddPWFycmF5KCd0aWQnPT4kdGlkLCdyb3dzJz0+JHJvd3MpOwogIC8vIG1hc2luaXMgc21va2U6IHZpc29zIGF1dG9fcGFyc2VyIGxlbnRlbGVzIC0+IHBvIHZpZW5hIHByZWtlCiAgJHRhYnM9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdC5pZCx0LnNwZWNpZXMsdC5zY29wZSwoU0VMRUNUIG0ucHJvZHVjdF9pZCBGUk9NIHskcGZ9cHNfZmVlZGluZ19tYXAgbSBXSEVSRSBtLmZlZWRpbmdfdGFibGVfaWQ9dC5pZCBBTkQgbS5pc19hY3RpdmU9MSBMSU1JVCAxKSBwaWQgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfdGFibGVzIHQgV0hFUkUgdC52ZXJpZmllZF9ieT0nYXV0b19wYXJzZXJfczIyOCcgQU5EIHQuaXNfYWN0aXZlPTEiLEFSUkFZX0EpOwogICRjbnQ9YXJyYXkoKTsgJGJhZD1hcnJheSgpOwogIGZvcmVhY2goJHRhYnMgYXMgJHQpewogICAgJHBpZD0oaW50KSR0WydwaWQnXTsgaWYoISRwaWQpIGNvbnRpbnVlOwogICAgJHcgPSAkdFsnc3BlY2llcyddPT09J2NhdCcgPyA0IDogKCAkdFsnc2NvcGUnXT09PSdwdXBweScgPyA4IDogMTUgKTsKICAgICRhID0gYXJyYXkoJ3Byb2R1Y3RfaWQnPT4kcGlkLCd3ZWlnaHRfa2cnPT4kdywnc3BlY2llc19jb2RlJz0+JHRbJ3NwZWNpZXMnXSk7CiAgICBpZigkdFsnc2NvcGUnXT09PSdwdXBweScpICRhWydhZ2VfbW9udGhzJ109NTsKICAgICRyPVBldHNob3BfRmVlZGluZ19TZXJ2aWNlOjpjYWxjKCRhKTsKICAgICRzdD0kclsnc3RhdHVzJ107CiAgICAkY250WyRzdF09KCRjbnRbJHN0XT8/MCkrMTsKICAgIGlmKCRzdCE9PSdvaycgJiYgY291bnQoJGJhZCk8MTIpICRiYWRbXT1hcnJheSgkcGlkLCR0WydpZCddLCR0WydzY29wZSddLCRzdCxpbXBsb2RlKCcsJywoYXJyYXkpKCRyWydyZWFzb25fY29kZXMnXT8/YXJyYXkoKSkpLG1iX3N1YnN0cihodG1sX2VudGl0eV9kZWNvZGUoZ2V0X3RoZV90aXRsZSgkcGlkKSksMCwzMikpOwogIH0KICAkb1snc21va2UnXT0kY250OyAkb1snYmFkJ109JGJhZDsgJG9bJ3RhYnNfbiddPWNvdW50KCR0YWJzKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'SMK (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
execSync('sleep 3');
let r='';
try{ r=execSync('curl -sk "https://dev.avesa.lt/?ps_smk=Sm24x"',{maxBuffer:100*1024*1024,timeout:90000}).toString(); }catch(e){ r='ESMK '+String(e).slice(0,200); }
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('smk.json', Buffer.from(r).toString('base64'));
console.log('done', r.length);
