const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfZ2V0YyddKXx8JF9HRVRbJ3BzX2dldGMnXSE9PSdTMkt3OE54Jyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCg5MCk7CgkkcGlkcz1hcnJheSgxODU0NSwxODU1MSwyMDk0MSwxODYyMCwKCQkxODU3NSwxODU3OCwxODU4MSwxODU4NCwxODU4NywxODU5MCwxOTg5NiwxOTg5OSwyMDk0MywyMDk3NywKCQkxODU1NCwxODU1NywxODU2MCwxODU2MywxODU2NiwxODU2OSwyMDk0NywyMDk2MSwKCQkyMTEyMywyMTEzNSwyMTEzNywyMTE0OSwyMTE1MSwyMTE1MywyNTIyNywKCQkyMTExNywyMTExOSwyMTEzMSwyMTEzMywyMTE0NSwyMTE0NywKCQkyMTExNSwyMTEyOSwyMTE0Myk7Cgkkb3V0PWFycmF5KCk7Cglmb3JlYWNoKCRwaWRzIGFzICRwaWQpewoJCSRwPWdldF9wb3N0KCRwaWQpOwoJCWlmKCEkcCl7ICRvdXRbJHBpZF09YXJyYXkoJ2Vycic9Pidub19wb3N0Jyk7IGNvbnRpbnVlOyB9CgkJJGM9JHAtPnBvc3RfY29udGVudDsKCQkkb3V0WyRwaWRdPWFycmF5KAoJCQkndGl0bGUnPT4kcC0+cG9zdF90aXRsZSwKCQkJJ3N0YXR1cyc9PiRwLT5wb3N0X3N0YXR1cywKCQkJJ2xlbic9PnN0cmxlbigkYyksCgkJCSdoYXNfc2VyaW0nPT4oc3RyaXBvcygkYywnxJdyaW0nKSE9PWZhbHNlKSwKCQkJJ2hhc190YWJsZSc9PihzdHJpcG9zKCRjLCc8dGFibGUnKSE9PWZhbHNlKSwKCQkJJ2hhc19iMmInPT4oc3RyaXBvcygkYywnYjJiLWJsYWNrJykhPT1mYWxzZSksCgkJCSdjb250ZW50Jz0+JGMKCQkpOwoJfQoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkb3V0KTsgZXhpdDsKfSk7Cg==';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'GETC (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
o.d=(function(){const r=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/?ps_getc=S2Kw8Nx"',{maxBuffer:30*1024*1024}).toString();const i=r.indexOf('{');try{return JSON.parse(r.slice(i));}catch(e){return {raw:r.slice(0,300)};}})();
if(sid) wj('POST','code-snippets/v1/snippets/'+sid,{active:false});
console.log('PUT:',pr('getc.json',o));
