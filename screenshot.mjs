const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfbGRyJ10pfHwkX0dFVFsncHNfbGRyJ10hPT0nUzJLdzhOeCcpe3JldHVybjt9CglAc2V0X3RpbWVfbGltaXQoNTApOyAkbz1hcnJheSgpOwoJJG1haW49QGZpbGVfZ2V0X2NvbnRlbnRzKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvcGV0c2hvcC1jb3JlLnBocCcpOwoJJG9bJ21haW5fc2l6ZSddPXN0cmxlbigkbWFpbik7CgkvLyBrYWlwIGtyYXVuYW1pIGluY2x1ZGVzOiBncmVwIHJlcXVpcmUvZ2xvYi9jbGFzcy1mZWVkaW5nCgkkY3R4PWZ1bmN0aW9uKCRoLCRuZWVkbGUsJGI9MTIwLCRhPTI2MCl7ICRvdXQ9YXJyYXkoKTsgJG9mZj0wOyBmb3IoJGk9MDskaTw4OyRpKyspeyAkcD1zdHJwb3MoJGgsJG5lZWRsZSwkb2ZmKTsgaWYoJHA9PT1mYWxzZSlicmVhazsgJG91dFtdPXN1YnN0cigkaCxtYXgoMCwkcC0kYiksJGIrJGEpOyAkb2ZmPSRwK3N0cmxlbigkbmVlZGxlKTsgfSByZXR1cm4gJG91dDsgfTsKCSRvWydnbG9iJ109JGN0eCgkbWFpbiwnZ2xvYicpOwoJJG9bJ3JlcXVpcmUnXT0kY3R4KCRtYWluLCdyZXF1aXJlJyk7Cgkkb1snaW5jbHVkZV9oaXRzJ109JGN0eCgkbWFpbiwnaW5jbHVkZXMvJyk7Cgkkb1snZmVlZGluZ19sb2FkJ109JGN0eCgkbWFpbiwnY2xhc3MtZmVlZGluZycpOwoJJG9bJ2NvbmRpdGlvbl9leGlzdHMnXT1maWxlX2V4aXN0cyhXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2luY2x1ZGVzL2NsYXNzLWNvbmRpdGlvbi1tYXBwZXIucGhwJyk7Cgkkb1snY29uZF9tYXBwZXJfY2xhc3MnXT1jbGFzc19leGlzdHMoJ1BldHNob3BfQ29uZGl0aW9uX01hcHBlcicpOwoJZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wbody.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wbody.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024,timeout:70000}).toString();}
function pr(n,ob){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(JSON.stringify(ob)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2'); }return 'fail';}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'LDR (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){o.mkerr=String(mk).slice(0,200);}
o.d=(function(){try{const r=execSync('curl -sk --max-time 45 '+AUTH+' "https://dev.avesa.lt/?ps_ldr=S2Kw8Nx"',{maxBuffer:10*1024*1024,timeout:50000}).toString();const i=r.indexOf('{');return i>=0?JSON.parse(r.slice(i)):{raw:r.slice(0,400)};}catch(e){return{err:String(e).slice(0,200)};}})();
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
console.log('PUT:',pr('ldr.json',o));
