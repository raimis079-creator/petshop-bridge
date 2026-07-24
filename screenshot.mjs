import { execSync } from 'child_process';
import fs from 'fs';
const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3JlYzEnXSkgfHwgJF9HRVRbJ3BzX3JlYzEnXSE9PSdSYzI0eCcpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCk7CiAgJGlkcz1hcnJheSgxNDM2NywxNjg1NCwxNDcxNSwxNDI4MSk7CiAgZm9yZWFjaCgkaWRzIGFzICRwaWQpewogICAgJHA9Z2V0X3Bvc3QoJHBpZCk7IGlmKCEkcCkgY29udGludWU7CiAgICAkYz0kcC0+cG9zdF9jb250ZW50OwogICAgJGk9MDsgJHBvcz1mYWxzZTsKICAgIGZvcmVhY2goYXJyYXkoJ8WgxJdyaW1vJywnxaDEllJJTU8nLCfFocSXcmltbycsJ01haXRpbmltbycsJ1Bhcm9zIG5vcm0nKSBhcyAkayl7ICR4PW1iX3N0cmlwb3MoJGMsJGspOyBpZigkeCE9PWZhbHNlICYmICgkcG9zPT09ZmFsc2UgfHwgJHg8JHBvcykpICRwb3M9JHg7IH0KICAgICRvWyRwaWRdPWFycmF5KCd0aXRsZSc9Pm1iX3N1YnN0cigkcC0+cG9zdF90aXRsZSwwLDQ1KSwKICAgICAgJ2ZyYWcnPT4gJHBvcyE9PWZhbHNlID8gbWJfc3Vic3RyKCRjLCRwb3MsMTQwMCkgOiAnKG5lcmFzdGEgcmFrdG8pJyk7CiAgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'REC1 (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
execSync('sleep 3');
let r='';
try{ r=execSync('curl -sk "https://dev.avesa.lt/?ps_rec1=Rc24x"',{maxBuffer:100*1024*1024,timeout:90000}).toString(); }catch(e){ r='ERR '+String(e).slice(0,200); }
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('rec1.json', Buffer.from(r).toString('base64'));
console.log('done', r.length);
