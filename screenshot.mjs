import { execSync } from 'child_process';
import fs from 'fs';
const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3JlY29uOSddKSB8fCAkX0dFVFsncHNfcmVjb245J10hPT0nUmM5eFRtcCcpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7CiAgJG89YXJyYXkoKTsKICAkb1snY29scyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0hPVyBDT0xVTU5TIEZST00geyR3cGRiLT5wcmVmaXh9cHNfcGV0cyIsIEFSUkFZX0EpOwogICRvWydwZXRzX3NhbXBsZSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JHdwZGItPnByZWZpeH1wc19wZXRzIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMyIsIEFSUkFZX0EpOwogICRkaXJzPWFycmF5KFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUnLCBXUE1VX1BMVUdJTl9ESVIpOwogICRvWydmaWxlcyddPWFycmF5KCk7ICRvWydjb250ZW50J109YXJyYXkoKTsKICBmb3JlYWNoKCRkaXJzIGFzICRkKXsKICAgIGlmKCFpc19kaXIoJGQpKSBjb250aW51ZTsKICAgICRpdD1uZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGQsIEZpbGVzeXN0ZW1JdGVyYXRvcjo6U0tJUF9ET1RTKSk7CiAgICBmb3JlYWNoKCRpdCBhcyAkZil7CiAgICAgICRwPSRmLT5nZXRQYXRobmFtZSgpOyAkcmVsPXN0cl9yZXBsYWNlKGRpcm5hbWUoJGQpLicvJywnJywkcCk7ICRzej0kZi0+Z2V0U2l6ZSgpOwogICAgICAkb1snZmlsZXMnXVtdPSRyZWwuJyAoJy4kc3ouJyknOwogICAgICBpZihwcmVnX21hdGNoKCcvKHBldHxtOHxhdWdpbnRpbikvaScsJHJlbCkgJiYgJHN6PDI1MDAwMCAmJiBwcmVnX21hdGNoKCcvXC4ocGhwfGpzfGNzcykkLycsJHJlbCkpewogICAgICAgICRvWydjb250ZW50J11bJHJlbF09YmFzZTY0X2VuY29kZShmaWxlX2dldF9jb250ZW50cygkcCkpOwogICAgICB9CiAgICB9CiAgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7CiAgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'RECON9 (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
execSync('sleep 3');
let r='';
try{ r=execSync('curl -sk "https://dev.avesa.lt/?ps_recon9=Rc9xTmp"',{maxBuffer:100*1024*1024,timeout:90000}).toString(); }catch(e){ r='ERR '+String(e).slice(0,200); }
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('recon9.json', Buffer.from(r).toString('base64'));
console.log('done', r.length);
