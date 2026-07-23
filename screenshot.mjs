import { execSync } from 'child_process';
import fs from 'fs';
const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3NkaWFnJ10pIHx8ICRfR0VUWydwc19zZGlhZyddIT09J1NkMjN4JykgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjskcGY9JHdwZGItPnByZWZpeDsgJG5vdz1jdXJyZW50X3RpbWUoJ215c3FsJyk7ICRvPWFycmF5KCk7CiAgLy8gYWRtaW4gYXVnaW50aW5pcyBzdSBqYXV0cnVtYWlzCiAgJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHBmfXBzX3BldHMgV0hFUkUgcGV0X25hbWU9J0UyRSBTdWdEJyIpOwogICR3cGRiLT5pbnNlcnQoJHBmLidwc19wZXRzJyxhcnJheSgndXNlcl9pZCc9PjEsJ3BldF9uYW1lJz0+J0UyRSBTdWdEJywnc3BlY2llcyc9Pidkb2cnLCdzZW5zaXRpdml0aWVzJz0+J2NoaWNrZW4sZ3JhaW5zJywnc3RhdHVzJz0+J2FjdGl2ZScsJ2NyZWF0ZWRfYXQnPT4kbm93LCd1cGRhdGVkX2F0Jz0+JG5vdykpOwogICRwaWQ9KGludCkkd3BkYi0+aW5zZXJ0X2lkOyAkb1sncGV0J109JHBpZDsKICAvLyBzdWJjYXRzIHBvIGRvZyByb290CiAgJGtpZHM9Z2V0X3Rlcm1zKGFycmF5KCd0YXhvbm9teSc9Pidwcm9kdWN0X2NhdCcsJ3BhcmVudCc9PjcxLCdoaWRlX2VtcHR5Jz0+ZmFsc2UpKTsKICAkb1sna2lkcyddPWFycmF5X21hcChmdW5jdGlvbigkdCl7cmV0dXJuICR0LT50ZXJtX2lkLic6Jy4kdC0+bmFtZTt9LCBpc19hcnJheSgka2lkcyk/JGtpZHM6YXJyYXkoKSk7CiAgaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX004X0Zvb2QnKSl7CiAgICAkcmVmPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX004X0Zvb2QnLCdzdWdnZXN0X3Rlcm1zJyk7ICRyZWYtPnNldEFjY2Vzc2libGUodHJ1ZSk7CiAgICAkb1snc3VnX3Rlcm1zJ109JHJlZi0+aW52b2tlKG51bGwsNzEpOwogICAgJHJlcT1uZXcgV1BfUkVTVF9SZXF1ZXN0KCdHRVQnLCcvcGV0c2hvcC92MS9wZXQtc3VnZ2VzdGlvbnMvJy4kcGlkKTsgJHJlcS0+c2V0X3BhcmFtKCdpZCcsJHBpZCk7CiAgICB3cF9zZXRfY3VycmVudF91c2VyKDEpOwogICAgJHJlcz1QZXRzaG9wX004X0Zvb2Q6OnN1Z2dlc3Rpb25zKCRyZXEpOwogICAgJGQ9JHJlcyBpbnN0YW5jZW9mIFdQX1JFU1RfUmVzcG9uc2UgPyAkcmVzLT5nZXRfZGF0YSgpIDogKGlzX3dwX2Vycm9yKCRyZXMpP2FycmF5KCdlcnInPT4kcmVzLT5nZXRfZXJyb3JfbWVzc2FnZSgpKTokcmVzKTsKICAgICRvWyduJ109aXNzZXQoJGRbJ3Jlc3VsdHMnXSk/Y291bnQoJGRbJ3Jlc3VsdHMnXSk6bnVsbDsKICAgICRvWyd0aXRsZXMnXT1pc3NldCgkZFsncmVzdWx0cyddKT9hcnJheV9tYXAoZnVuY3Rpb24oJHIpe3JldHVybiBtYl9zdWJzdHIoJHJbJ25hbWUnXSwwLDQ1KTt9LCAkZFsncmVzdWx0cyddKTooJGRbJ2VyciddPz9udWxsKTsKICB9IGVsc2UgeyAkb1snbm90ZSddPSdubyBjbGFzcyc7IH0KICAkd3BkYi0+ZGVsZXRlKCRwZi4ncHNfcGV0cycsYXJyYXkoJ2lkJz0+JHBpZCkpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'SDIAG (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
execSync('sleep 3');
let r='';
try{ r=execSync('curl -sk "https://dev.avesa.lt/?ps_sdiag=Sd23x"',{maxBuffer:100*1024*1024,timeout:90000}).toString(); }catch(e){ r='ERR '+String(e).slice(0,200); }
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('sdiag.json', Buffer.from(r).toString('base64'));
console.log('done', r.length);
