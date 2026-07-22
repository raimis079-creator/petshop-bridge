const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfcmQnXSl8fCRfR0VUWydwc19yZCddIT09J1MyS3c4TngnKXtyZXR1cm47fQoJQHNldF90aW1lX2xpbWl0KDYwKTsgJG89YXJyYXkoKTsKCSRpbmM9V1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9pbmNsdWRlcyc7ICRhcz1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2Fzc2V0cyc7CgkkdWk9QGZpbGVfZ2V0X2NvbnRlbnRzKCRpbmMuJy9jbGFzcy1wZXQtdWkucGhwJyk7CgkkcGY9QGZpbGVfZ2V0X2NvbnRlbnRzKCRpbmMuJy9jbGFzcy1wZXQtcHJvZmlsZS5waHAnKTsKCSRqZj1AZmlsZV9nZXRfY29udGVudHMoJGFzLicvcGV0LWZvcm0uanMnKTsKCSRvWydzaXplcyddPWFycmF5KCdwZXQtdWknPT5zdHJsZW4oJHVpKSwncGV0LXByb2ZpbGUnPT5zdHJsZW4oJHBmKSwncGV0LWZvcm0uanMnPT5zdHJsZW4oJGpmKSk7CgkvLyBoZWxwZXI6IGdyxIXFvmludGkgwrFOIGFwbGluayBuZWVkbGUKCSRjdHg9ZnVuY3Rpb24oJGgsJG5lZWRsZSwkYmVmb3JlPTQwMCwkYWZ0ZXI9OTAwKXsgJG91dD1hcnJheSgpOyAkb2ZmPTA7IGZvcigkaT0wOyRpPDQ7JGkrKyl7ICRwPXN0cnBvcygkaCwkbmVlZGxlLCRvZmYpOyBpZigkcD09PWZhbHNlKWJyZWFrOyAkb3V0W109c3Vic3RyKCRoLG1heCgwLCRwLSRiZWZvcmUpLCRiZWZvcmUrJGFmdGVyKTsgJG9mZj0kcCtzdHJsZW4oJG5lZWRsZSk7IH0gcmV0dXJuICRvdXQ7IH07Cgkkb1sndWlfc3VrdXJ0aSddPSRjdHgoJHVpLCdTdWt1cnRpIHByb2ZpbCcpOwoJJG9bJ3VpX2VucXVldWUnXT0kY3R4KCR1aSwncGV0LWZvcm0nLDMwMCw1MDApOwoJJG9bJ3VpX2VucXVldWUyJ109JGN0eCgkdWksJ3dwX2VucXVldWVfc2NyaXB0JywxNTAsMzUwKTsKCSRvWyd1aV9wc3BldGZvcm0nXT0kY3R4KCR1aSwnUFNQZXRGb3JtJywyMDAsMzAwKTsKCSRvWyd1aV9hY3Rpb24nXT0kY3R4KCR1aSwiYWN0aW9uIiwxMjAsMjAwKTsKCS8vIHBldC1mb3JtLmpzIOKAlCBtb3VudC9pbml0Cgkkb1snanNfaW5pdCddPSRjdHgoJGpmLCdQU1BldEZvcm1Jbml0JywzMDAsNjAwKTsKCSRvWydqc19tb3VudCddPSRjdHgoJGpmLCdtb3VudCcsMjAwLDQwMCk7Cgkkb1snanNfcm9vdGlkJ109JGN0eCgkamYsJ3Jvb3QuaWQnLDIwMCwzMDApOwoJJG9bJ2pzX2hlYWQnXT1zdWJzdHIoJGpmLDAsNzAwKTsKCS8vIGVucXVldWUgaG9va3MKCSRvWyd1aV9ob29rcyddPSRjdHgoJHVpLCdhZGRfYWN0aW9uJyw2MCwxMjApOwoJZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'RD (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){o.mkerr=String(mk).slice(0,200);}
o.d=(function(){try{const r=execSync('curl -sk --max-time 55 '+AUTH+' "https://dev.avesa.lt/?ps_rd=S2Kw8Nx"',{maxBuffer:10*1024*1024,timeout:60000}).toString();const i=r.indexOf('{');return i>=0?JSON.parse(r.slice(i)):{raw:r.slice(0,400)};}catch(e){return{err:String(e).slice(0,200)};}})();
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
console.log('PUT:',pr('rd.json',o));
