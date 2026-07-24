import { execSync } from 'child_process';
import fs from 'fs';
const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2QyJ10pIHx8ICRfR0VUWydwc19kMiddIT09J0QyMjR4JykgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCk7CiAgJHJlcG89bmV3IFBldHNob3BfRmVlZGluZ19SZXBvc2l0b3J5KCk7CiAgZm9yZWFjaChhcnJheSgxNDUzNCwxNDUwNCkgYXMgJHBpZCl7CiAgICAkcnQ9JHJlcG8tPmdldF9mb3JfcHJvZHVjdCgkcGlkKTsKICAgICRycj1hcnJheSgnc3VwcG9ydCc9PiRydFsnc3VwcG9ydCddPz9udWxsLCdheGVzJz0+JHJ0WydheGlzX3BvbGljeSddPz9udWxsLCduJz0+aXNzZXQoJHJ0Wydyb3dzJ10pP2NvdW50KCRydFsncm93cyddKTowKTsKICAgIGlmKGlzc2V0KCRydFsncm93cyddWzBdKSl7ICRyclsncm93MF9rZXlzJ109YXJyYXlfa2V5cygkcnRbJ3Jvd3MnXVswXSk7ICRyclsncm93MF9jb25kJ109JHJ0Wydyb3dzJ11bMF1bJ2NvbmRpdGlvbnMnXT8/bnVsbDsgJHJyWydyb3cwX3JhdyddPSRydFsncm93cyddWzBdWydjb25kaXRpb25fcmF3J10/P251bGw7IH0KICAgICRvWyRwaWRdPSRycjsKICB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'D2 (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
execSync('sleep 3');
let r='';
try{ r=execSync('curl -sk "https://dev.avesa.lt/?ps_d2=D224x"',{maxBuffer:100*1024*1024,timeout:90000}).toString(); }catch(e){ r='ED2 '+String(e).slice(0,200); }
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('d2.json', Buffer.from(r).toString('base64'));
console.log('done', r.length);
