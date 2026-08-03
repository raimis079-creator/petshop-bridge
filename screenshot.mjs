import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s354',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run356-v1'}; let sid=null;
const PHP=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzM1NiBEdXAgUmVjb24gMyB2MQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfczM1NiddKSB8fCAkX0dFVFsncHNfczM1NiddICE9PSAnSzM1NnI0JyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgJHI9YXJyYXkoJ1ZFUlNJSkEnPT4nczM1Ni12MScpOwogICAgJHJvb3Q9V1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZSc7CiAgICAvLyAxKSBjbGFzcy1tYWdpYy1sb2dpbi5waHAgY2xhaW0gZGFsaXMgKGFwaWUgMzgwLTU2MCkgKyBNRVRBIGtvbnN0YW50b3MgYXBsaW5rYQogICAgJGM9ZmlsZV9nZXRfY29udGVudHMoJHJvb3QuJy9pbmNsdWRlcy9jbGFzcy1tYWdpYy1sb2dpbi5waHAnKTsKICAgICRsPWV4cGxvZGUoIlxuIiwkYyk7CiAgICAkclsnbWxfbWV0YSddPWFycmF5KCdCJz0+c3RybGVuKCRjKSwnc2hhJz0+c3Vic3RyKGhhc2goJ3NoYTI1NicsJGMpLDAsMTYpLCdlaWwnPT5jb3VudCgkbCkpOwogICAgJG91dD1hcnJheSgpOyBmb3JlYWNoKCRsIGFzICRpPT4kbG4peyRuPSRpKzE7IGlmKCgkbj49NzAmJiRuPD0xMTUpfHwoJG4+PTQwMCYmJG48PTU2MCkpICRvdXRbXT0kbi4nOiAnLnJ0cmltKHN1YnN0cigkbG4sMCwxNzgpKTt9CiAgICAkclsnbWwnXT0kb3V0OwogICAgLy8gMikgcGV0LXByb2ZpbGUuanM6IHNlbmRUcmFuc2ZlckNob2ljZSArIGluaXQvcGV0X2NsYWltIGFwZG9yb2ppbWFzICgxLTEzMCkgCiAgICAkYzI9ZmlsZV9nZXRfY29udGVudHMoJHJvb3QuJy9hc3NldHMvcGV0LXByb2ZpbGUuanMnKTsKICAgICRsMj1leHBsb2RlKCJcbiIsJGMyKTsKICAgICRvdXQyPWFycmF5KCk7ICR6eW09YXJyYXkoJ3NlbmRUcmFuc2ZlckNob2ljZScsJ2Z1bmN0aW9uIGluaXQnLCdwZXRfY2xhaW0nLCdEUkFGVF9LRVknLCdsb2FkUGV0cygnKTsKICAgICRoaXRzPWFycmF5KCk7CiAgICBmb3JlYWNoKCRsMiBhcyAkaT0+JGxuKXsgZm9yZWFjaCgkenltIGFzICR6KXsgaWYoc3RycG9zKCRsbiwkeikhPT1mYWxzZSl7JGhpdHNbXT0kaTticmVhazt9IH0gfQogICAgJHNlZW49YXJyYXkoKTsKICAgIGZvcmVhY2goJGhpdHMgYXMgJGgpeyBmb3IoJGk9bWF4KDAsJGgtMik7JGk8PW1pbihjb3VudCgkbDIpLTEsJGgrMjgpOyRpKyspeyBpZihpc3NldCgkc2VlblskaV0pKWNvbnRpbnVlOyRzZWVuWyRpXT0xOyRvdXQyW109KCRpKzEpLic6ICcucnRyaW0oc3Vic3RyKCRsMlskaV0sMCwxNzApKTsgfSB9CiAgICAkclsncHJvanMyJ109YXJyYXlfc2xpY2UoJG91dDIsMCwzMDApOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8').replace(/^<\?php\s*/,'');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S356 Dup Recon3 v1',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const r=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(r.out); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 4');
const g=sh('curl -sSk --max-time 90 "'+SITE+'/?ps_s356=K356r4&z='+Math.random()+'"');
try{O.rez=JSON.parse(g.out);}catch(e){O.raw=g.out.slice(0,800);}
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putResult('s356.json', JSON.stringify(O,null,1));
console.log('OK');
