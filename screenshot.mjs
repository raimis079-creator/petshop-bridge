import { execSync } from 'child_process';
import fs from 'fs';
const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX21wMyddKSB8fCAkX0dFVFsncHNfbXAzJ10hPT0nTXIyM3gnKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgpOyAkeD1qc29uX2RlY29kZSgnIlx1MDBkNyInKTsKICAvLyAxKSBWSVNJIHBhX3Bha3VvdGVzX2R5ZGlzIHRlcm1pbmFpIChpZCwgdmFyZGFzLCBraWVrIHByZWtpdSkKICAkdGVybXM9Z2V0X3Rlcm1zKGFycmF5KCd0YXhvbm9teSc9PidwYV9wYWt1b3Rlc19keWRpcycsJ2hpZGVfZW1wdHknPT5mYWxzZSkpOwogICRhbGw9YXJyYXkoKTsKICBmb3JlYWNoKCR0ZXJtcyBhcyAkdCl7ICRhbGxbXT0kdC0+dGVybV9pZC4nfCcuJHQtPm5hbWUuJ3wnLiR0LT5jb3VudDsgfQogICRvWyd0ZXJtaW5haSddPSRhbGw7CiAgLy8gMikgTXVsdGlwYWNrL2JvbnVzIHRlcm1pbmFpIGlyIGp1IHByZWtlcyDigJQgYXIgcGF2YWRpbmltYXMgYXRpdGlua2EKICAkYmFkPWFycmF5KCk7CiAgZm9yZWFjaCgkdGVybXMgYXMgJHQpewogICAgJG11bHQgPSBwcmVnX21hdGNoKCcvKD86eHxYfFwqfCcuJHguJykvdScsJHQtPm5hbWUpIHx8IHN0cnBvcygkdC0+bmFtZSwnKycpIT09ZmFsc2U7CiAgICBpZighJG11bHQpIGNvbnRpbnVlOwogICAgJHRnPTA7CiAgICBpZihwcmVnX21hdGNoKCcvKFswLTldezEsMn0pXHMqKD86eHxYfFwqfCcuJHguJylccyooWzAtOV0rKD86Wy4sXVswLTldKyk/KVxzKihrZ3xnKS91JywkdC0+bmFtZSwkbW0pKSAkdGc9KGludCkkbW1bMV0qZmxvYXR2YWwoc3RyX3JlcGxhY2UoJywnLCcuJywkbW1bMl0pKSoobWJfc3RydG9sb3dlcigkbW1bM10pPT09J2tnJz8xMDAwOjEpOwogICAgZWxzZWlmKHByZWdfbWF0Y2goJy8oWzAtOV0rKD86Wy4sXVswLTldKyk/KVxzKlwrXHMqKFswLTldKyg/OlsuLF1bMC05XSspPylccyooa2d8ZykvdScsJHQtPm5hbWUsJG1tKSkgJHRnPShmbG9hdHZhbChzdHJfcmVwbGFjZSgnLCcsJy4nLCRtbVsxXSkpK2Zsb2F0dmFsKHN0cl9yZXBsYWNlKCcsJywnLicsJG1tWzJdKSkpKihtYl9zdHJ0b2xvd2VyKCRtbVszXSk9PT0na2cnPzEwMDA6MSk7CiAgICAkaWRzPWdldF9vYmplY3RzX2luX3Rlcm0oJHQtPnRlcm1faWQsJ3BhX3Bha3VvdGVzX2R5ZGlzJyk7CiAgICBmb3JlYWNoKChhcnJheSkkaWRzIGFzICRwaWQpewogICAgICAkcD1nZXRfcG9zdCgkcGlkKTsgaWYoISRwfHwkcC0+cG9zdF9zdGF0dXMhPT0ncHVibGlzaCcpIGNvbnRpbnVlOwogICAgICAkYmFkW109YXJyYXkoJ3Rlcm0nPT4kdC0+bmFtZSwndGVybV9nJz0+JHRnLCdpZCc9PihpbnQpJHBpZCwndCc9Pm1iX3N1YnN0cigkcC0+cG9zdF90aXRsZSwwLDU4KSk7CiAgICB9CiAgfQogICRvWydtdWx0aXBhY2tfcHJla2VzJ109JGJhZDsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'MP3 (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
execSync('sleep 3');
let r='';
try{ r=execSync('curl -sk "https://dev.avesa.lt/?ps_mp3=Mr23x"',{maxBuffer:100*1024*1024,timeout:90000}).toString(); }catch(e){ r='ERR '+String(e).slice(0,200); }
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('mp3.json', Buffer.from(r).toString('base64'));
console.log('done', r.length);
