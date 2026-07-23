const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfY3MnXSl8fCRfR0VUWydwc19jcyddIT09J1MyS3c4TngnKXtyZXR1cm47fQoJQHNldF90aW1lX2xpbWl0KDUwKTsgJEE9V1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9hc3NldHMvJzsgJG89YXJyYXkoKTsKCWZvcmVhY2goYXJyYXkoJ2FjY291bnQuY3NzJywncGV0LWZvcm0uY3NzJykgYXMgJGYpewoJCSRjdXI9QGZpbGVfZ2V0X2NvbnRlbnRzKCRBLiRmKTsKCQkkYmFrcz1hcnJheSgpOyBmb3JlYWNoKHNjYW5kaXIoJEEpIGFzICR4KXsgaWYoc3RycG9zKCR4LCRmLicuYmFrXycpPT09MCAmJiBzdHJwb3MoJHgsJ19jb2wnKSE9PWZhbHNlKSAkYmFrc1tdPSR4OyB9CgkJc29ydCgkYmFrcyk7ICRiaz1jb3VudCgkYmFrcyk/ZW5kKCRiYWtzKTpudWxsOwoJCSRvbGQ9JGJrP0BmaWxlX2dldF9jb250ZW50cygkQS4kYmspOm51bGw7CgkJJG9bJGZdPWFycmF5KCdiYWsnPT4kYmssJ2xlbl9kYWJhcic9PnN0cmxlbigoc3RyaW5nKSRjdXIpLCdsZW5fYmFrJz0+c3RybGVuKChzdHJpbmcpJG9sZCkpOwoJCS8vIGVpbHV0ZXMgc3UgcGFrZWl0aW11CgkJJGxpbmVzPWV4cGxvZGUoIlxuIiwoc3RyaW5nKSRjdXIpOyAkaGl0PWFycmF5KCk7CgkJZm9yZWFjaCgkbGluZXMgYXMgJGk9PiRsKXsgaWYoc3RycG9zKCRsLCctLWZzLWNvbG9yLXByaW1hcnknKSE9PWZhbHNlKXsgJGhpdFtdPSgkaSsxKS4nOiAnLnRyaW0oJGwpOyB9IH0KCQkkb1skZl1bJ2VpbHV0ZXMnXT1hcnJheV9zbGljZSgkaGl0LDAsMTIpOwoJfQoJZWNobyBqc29uX2VuY29kZSgkbywgSlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7Cn0pOwo=';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'CS (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){o.mkerr=String(mk).slice(0,200);}
o.d=(function(){try{const r=execSync('curl -sk --max-time 45 '+AUTH+' "https://dev.avesa.lt/?ps_cs=S2Kw8Nx"',{maxBuffer:10*1024*1024,timeout:50000}).toString();const i=r.indexOf('{');return i>=0?JSON.parse(r.slice(i)):{raw:r.slice(0,300)};}catch(e){return{err:String(e).slice(0,200)};}})();
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
console.log('PUT:',pr('cs.json',o));
