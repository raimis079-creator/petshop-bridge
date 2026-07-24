import { execSync } from 'child_process';
import fs from 'fs';
const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3JkJ10pIHx8ICRfR0VUWydwc19yZCddIT09J1JkMjR4JykgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJG89YXJyYXkoKTsgJHBpZD0xNDI4MTsKICAkcD1nZXRfcG9zdCgkcGlkKTsgJGM9JHAtPnBvc3RfY29udGVudDsKICAkb1snbW9kaWZpZWQnXT0kcC0+cG9zdF9tb2RpZmllZDsKICAkb1snaWxnaXMnXT1tYl9zdHJsZW4oJGMpOwogICRwb3M9bWJfc3RycG9zKCRjLCdQYXJvcyBub3JtYScpOwogICRvWyd5cmFfcGFyb3Nfbm9ybWEnXT0oJHBvcyE9PWZhbHNlKTsKICAkb1snZnJhZyddPSAkcG9zIT09ZmFsc2UgPyBtYl9zdWJzdHIoJGMsbWF4KDAsJHBvcy03MDApLDE1MDApIDogbWJfc3Vic3RyKCRjLDAsNjAwKTsKICAvLyByZXZpemlqb3MKICAkcmV2cz13cF9nZXRfcG9zdF9yZXZpc2lvbnMoJHBpZCxhcnJheSgnbnVtYmVycG9zdHMnPT42KSk7CiAgJG9bJ3Jldml6aWpvcyddPWFycmF5KCk7CiAgZm9yZWFjaCgkcmV2cyBhcyAkcil7ICR1PWdldF91c2VyZGF0YSgkci0+cG9zdF9hdXRob3IpOyAkb1sncmV2aXppam9zJ11bXT0kci0+cG9zdF9kYXRlLicgfCAnLigkdT8kdS0+dXNlcl9sb2dpbjonPycpLicgfCAnLm1iX3N0cmxlbigkci0+cG9zdF9jb250ZW50KS4nIHNpbWIuJzsgfQogIC8vIGtpdG9zIFJlYWwgRG9nIHByZWtlcyDigJQgYXIgdmlzb3MgdHVyaSB0YSBwYXRpIGJsb2thCiAgJHJkPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHBvc3RfdGl0bGUscG9zdF9tb2RpZmllZCBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgcG9zdF90aXRsZSBMSUtFICdSZWFsIERvZyUnIixBUlJBWV9BKTsKICBmb3JlYWNoKCRyZCBhcyAkcil7ICRjYz1nZXRfcG9zdCgkclsnSUQnXSktPnBvc3RfY29udGVudDsKICAgICRvWydyZWFsZG9nJ11bXT1hcnJheSgkclsnSUQnXSxtYl9zdWJzdHIoJHJbJ3Bvc3RfdGl0bGUnXSwwLDQwKSwobWJfc3RycG9zKCRjYywnUGFyb3Mgbm9ybWEnKSE9PWZhbHNlPydZUkEnOidORVJBJyksKG1iX3N0cnBvcygkY2MsJ8WgYWx0aW5pcycpIT09ZmFsc2U/J3NhbHRpbmlzKyc6Jy0nKSwkclsncG9zdF9tb2RpZmllZCddKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'RD (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
execSync('sleep 3');
let r='';
try{ r=execSync('curl -sk "https://dev.avesa.lt/?ps_rd=Rd24x"',{maxBuffer:100*1024*1024,timeout:90000}).toString(); }catch(e){ r='ERR '+String(e).slice(0,200); }
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('rd.json', Buffer.from(r).toString('base64'));
console.log('done', r.length);
