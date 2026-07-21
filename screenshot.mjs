const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfanJlY29uJ10pfHwkX0dFVFsncHNfanJlY29uJ10hPT0nUzJLdzhOeCcpe3JldHVybjt9CglAc2V0X3RpbWVfbGltaXQoNjApOwoJJHBvc3RzPWFycmF5KCk7CgkkcT1uZXcgV1BfUXVlcnkoYXJyYXkoJ3Bvc3RfdHlwZSc9Pidwcm9kdWN0JywncG9zdHNfcGVyX3BhZ2UnPT4xNTAsJ3Bvc3Rfc3RhdHVzJz0+J3B1Ymxpc2gnLCd0YXhfcXVlcnknPT5hcnJheShhcnJheSgndGF4b25vbXknPT4ncHJvZHVjdF9icmFuZCcsJ2ZpZWxkJz0+J3NsdWcnLCd0ZXJtcyc9Pidqb3NlcmEnKSkpKTsKCSRwb3N0cz0kcS0+cG9zdHM7CglpZihlbXB0eSgkcG9zdHMpKXsKCQkkcTI9bmV3IFdQX1F1ZXJ5KGFycmF5KCdwb3N0X3R5cGUnPT4ncHJvZHVjdCcsJ3Bvc3RzX3Blcl9wYWdlJz0+MTUwLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywncyc9PidKb3NlcmEnKSk7CgkJJHBvc3RzPSRxMi0+cG9zdHM7Cgl9CgkkY2FuZHM9YXJyYXkoKTsKCWZvcmVhY2goJHBvc3RzIGFzICRwKXsKCQkkYz0kcC0+cG9zdF9jb250ZW50OwoJCSRoYXM9KHN0cmlwb3MoJGMsJzx0YWJsZScpIT09ZmFsc2UpJiYoc3RyaXBvcygkYywna2cnKSE9PWZhbHNlfHxzdHJpcG9zKCRjLCdzdm9yJykhPT1mYWxzZXx8c3RyaXBvcygkYywnZ3JhbScpIT09ZmFsc2UpOwoJCSRjYW5kc1tdPWFycmF5KCdpZCc9PiRwLT5JRCwndGl0bGUnPT4kcC0+cG9zdF90aXRsZSwnaGFzX3RhYmxlJz0+JGhhcywnbGVuJz0+c3RybGVuKCRjKSk7Cgl9CgkkY2hvc2VuPW51bGw7Cglmb3JlYWNoKCRjYW5kcyBhcyAkY2MpeyBpZigkY2NbJ2hhc190YWJsZSddKXskY2hvc2VuPSRjY1snaWQnXTticmVhazt9IH0KCSRjb250ZW50PSRjaG9zZW4/Z2V0X3Bvc3RfZmllbGQoJ3Bvc3RfY29udGVudCcsJGNob3Nlbik6Jyc7CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOwoJZWNobyBqc29uX2VuY29kZShhcnJheSgnYnJhbmRfaGl0Jz0+Y291bnQoJHBvc3RzKSwnY2FuZGlkYXRlcyc9PiRjYW5kcywnY2hvc2VuJz0+JGNob3NlbiwnY29udGVudCc9PiRjb250ZW50KSk7CglleGl0Owp9KTsK';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){const b=Buffer.from(JSON.stringify(body)).toString('base64');
  return execSync('echo '+b+'|base64 -d|curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" -d @- "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024}).toString();}
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'JRECON (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
o.d=(function(){const r=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/?ps_jrecon=S2Kw8Nx"',{maxBuffer:20*1024*1024}).toString();const i=r.indexOf('{');try{return JSON.parse(r.slice(i));}catch(e){return {raw:r.slice(0,300)};}})();
if(sid) wj('POST','code-snippets/v1/snippets/'+sid,{active:false});
console.log('PUT:',pr('jrecon.json',o));
