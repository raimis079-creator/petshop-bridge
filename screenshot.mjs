const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfbThwZyddKXx8JF9HRVRbJ3BzX204cGcnXSE9PSdNOEt3OE54Jyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCgzMCk7CglnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgpOwoJLy8gcHVzbGFwaWFpIHN1IHNob3J0Y29kZSBbcGV0c2hvcF9wZXRfZm9ybV0KCSRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHBvc3RfdGl0bGUscG9zdF9uYW1lLHBvc3Rfc3RhdHVzIEZST00geyRwZn1wb3N0cyBXSEVSRSBwb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIHBvc3RfdHlwZT0ncGFnZScgQU5EIHBvc3RfY29udGVudCBMSUtFICclcGV0c2hvcF9wZXRfZm9ybSUnIE9SREVSIEJZIElEIixBUlJBWV9BKTsKCSRvWydzaG9ydGNvZGVfcGFnZXMnXT0kcm93czsKCWZvcmVhY2goJHJvd3MgYXMgJiRyKXsgJHJbJ3VybCddPWdldF9wZXJtYWxpbmsoJHJbJ0lEJ10pOyB9Cgkkb1snc2hvcnRjb2RlX3BhZ2VzJ109JHJvd3M7CgkvLyBNeUFjY291bnQgYXVnaW50aW5pcyBVUkwKCSRvWydteWFjY291bnQnXT13Y19nZXRfcGFnZV9wZXJtYWxpbmsoJ215YWNjb3VudCcpOwoJJG9bJ3BldF9lbmRwb2ludF91cmwnXT0kb1snbXlhY2NvdW50J10uJ2F1Z2ludGluaXMvJzsKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){const b=Buffer.from(JSON.stringify(body)).toString('base64');
  return execSync('echo '+b+'|base64 -d|curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" -d @- "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024}).toString();}
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'pg',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'M8PG (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
o.pg=(function(){const r=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/?ps_m8pg=M8Kw8Nx"',{maxBuffer:20*1024*1024}).toString();const i=r.indexOf('{');try{return JSON.parse(r.slice(i));}catch(e){return {raw:r.slice(0,200)};}})();
if(sid) wj('POST','code-snippets/v1/snippets/'+sid,{active:false});
console.log('PUT:',pr('m8pg.json',o));
