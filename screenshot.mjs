const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfYzInXSl8fCRfR0VUWydwc19jMiddIT09J1MyS3c4TngnKXtyZXR1cm47fQoJQHNldF90aW1lX2xpbWl0KDUwKTsgJG89YXJyYXkoKTsKCSRvWydzdHlsZXNoZWV0J109KHN0cmluZylnZXRfc3R5bGVzaGVldCgpOyAkb1sndGVtcGxhdGUnXT0oc3RyaW5nKWdldF90ZW1wbGF0ZSgpOwoJZm9yZWFjaChhcnJheSgncGV0LWZvcm0uY3NzJywnYWNjb3VudC5jc3MnKSBhcyAkZil7CgkJJHg9QGZpbGVfZ2V0X2NvbnRlbnRzKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvYXNzZXRzLycuJGYpOwoJCWlmKCEkeCl7ICRvWydtOF8nLiRmXT0nTkVSQSc7IGNvbnRpbnVlOyB9CgkJcHJlZ19tYXRjaF9hbGwoJy8jWzAtOWEtZkEtRl17Myw4fVxiLycsJHgsJG0pOwoJCSRjbnQ9YXJyYXlfY291bnRfdmFsdWVzKCRtWzBdKTsgYXJzb3J0KCRjbnQpOwoJCSRvWydtOF8nLiRmXT1hcnJheSgnbGVuJz0+c3RybGVuKCR4KSwnaGV4Jz0+YXJyYXlfc2xpY2UoJGNudCwwLDE2LHRydWUpKTsKCQkkcD1zdHJwb3MoJHgsJzpyb290Jyk7IGlmKCRwIT09ZmFsc2UpeyAkb1sncm9vdF8nLiRmXT1iYXNlNjRfZW5jb2RlKHN1YnN0cigkeCwkcCw4MDApKTsgfQoJfQoJLy8gY2hpbGQgdGVtb3Mgc3R5bGUuY3NzCgkkc2Q9Z2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCk7ICRjc3M9QGZpbGVfZ2V0X2NvbnRlbnRzKCRzZC4nL3N0eWxlLmNzcycpOwoJJG9bJ2NoaWxkX2RpciddPWJhc2VuYW1lKChzdHJpbmcpJHNkKTsgJG9bJ2NoaWxkX2xlbiddPXN0cmxlbigoc3RyaW5nKSRjc3MpOwoJaWYoJGNzcyl7IHByZWdfbWF0Y2hfYWxsKCcvI1swLTlhLWZBLUZdezZ9XGIvJywkY3NzLCRtMik7ICRjMj1hcnJheV9jb3VudF92YWx1ZXMoJG0yWzBdKTsgYXJzb3J0KCRjMik7ICRvWydjaGlsZF9oZXgnXT1hcnJheV9zbGljZSgkYzIsMCwxMix0cnVlKTsgfQoJZWNobyBqc29uX2VuY29kZSgkbywgSlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7Cn0pOwo=';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'C2 (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){o.mkerr=String(mk).slice(0,200);}
o.d=(function(){try{const r=execSync('curl -sk --max-time 45 '+AUTH+' "https://dev.avesa.lt/?ps_c2=S2Kw8Nx"',{maxBuffer:10*1024*1024,timeout:50000}).toString();const i=r.indexOf('{');return i>=0?JSON.parse(r.slice(i)):{raw:r.slice(0,300)};}catch(e){return{err:String(e).slice(0,200)};}})();
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
console.log('PUT:',pr('c2.json',o));
