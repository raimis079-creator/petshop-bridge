const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfcGF0dHInXSl8fCRfR0VUWydwc19wYXR0ciddIT09J1MyS3c4TngnKXtyZXR1cm47fQoJQHNldF90aW1lX2xpbWl0KDQwKTsKCSRwaWRzPWFycmF5KDE0NjIzLDE0NDk3LDM0NDg0LDEyNTc2LDI2ODk5KTsgLy8gcmV2ZXJ0ZWQsIGZhcm1pbmEtdG9kYXksIGV4Y2x1c2lvbi10b2RheSwgbW9uZ2UtZGVjaW1hbC1oZWxkLCBqb3NlcmEtYm9udXMtaGVsZAoJJG91dD1hcnJheSgpOwoJZm9yZWFjaCgkcGlkcyBhcyAkcGlkKXsKCQkkcGE9Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfcHJvZHVjdF9hdHRyaWJ1dGVzJyx0cnVlKTsKCQkka2V5cz1pc19hcnJheSgkcGEpP2FycmF5X2tleXMoJHBhKTphcnJheSgpOwoJCSRoYXNfcGtnPWluX2FycmF5KCdwYV9wYWt1b3Rlc19keWRpcycsJGtleXMpPzE6MDsKCQkkZGV0YWlsPW51bGw7CgkJaWYoJGhhc19wa2cgJiYgaXNzZXQoJHBhWydwYV9wYWt1b3Rlc19keWRpcyddKSl7ICRkZXRhaWw9JHBhWydwYV9wYWt1b3Rlc19keWRpcyddOyB1bnNldCgkZGV0YWlsWyd2YWx1ZSddKTsgfQoJCSRvdXRbJHBpZF09YXJyYXkoJ2F0dHJfa2V5cyc9PiRrZXlzLCdoYXNfcGtnX3JlZ2lzdGVyZWQnPT4kaGFzX3BrZywncGtnX2F0dHInPT4kZGV0YWlsLCdjdXJfdGVybSc9PndwX2dldF9wb3N0X3Rlcm1zKCRwaWQsJ3BhX3Bha3VvdGVzX2R5ZGlzJyxhcnJheSgnZmllbGRzJz0+J25hbWVzJykpKTsKCX0KCWVjaG8ganNvbl9lbmNvZGUoJG91dCk7IGV4aXQ7Cn0pOwo=';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wbody.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wbody.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024,timeout:60000}).toString();}
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2'); }return 'fail';}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'PATTR (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
o.d=(function(){try{const r=execSync('curl -sk --max-time 35 '+AUTH+' "https://dev.avesa.lt/?ps_pattr=S2Kw8Nx"',{maxBuffer:10*1024*1024,timeout:45000}).toString();const i=r.indexOf('{');return JSON.parse(r.slice(i));}catch(e){return {err:String(e).slice(0,220)};}})();
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
console.log('PUT:',pr('pattr.json',o));
