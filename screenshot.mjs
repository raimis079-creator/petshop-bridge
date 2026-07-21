const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfY2F0Z2V0YyddKXx8JF9HRVRbJ3BzX2NhdGdldGMnXSE9PSdTMkt3OE54Jyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCg5MCk7CgkkcGlkcz1hcnJheSgxODYxNywxODUzOSwxODU0MiwxODUzNiwxODUyNCwxODUyNywxODUzMCwxODUzMyk7Cgkkb3V0PWFycmF5KCk7Cglmb3JlYWNoKCRwaWRzIGFzICRwaWQpewoJCSRwPWdldF9wb3N0KCRwaWQpOwoJCWlmKCEkcCl7ICRvdXRbJHBpZF09YXJyYXkoJ2Vycic9Pidub19wb3N0Jyk7IGNvbnRpbnVlOyB9CgkJJGM9JHAtPnBvc3RfY29udGVudDsKCQkkb3V0WyRwaWRdPWFycmF5KAoJCQkndGl0bGUnPT4kcC0+cG9zdF90aXRsZSwKCQkJJ2xlbic9PnN0cmxlbigkYyksCgkJCSdoYXNfdGFibGUnPT4oc3RyaXBvcygkYywnPHRhYmxlJykhPT1mYWxzZSk/MTowLAoJCQknaGFzX2IyYic9PihzdHJpcG9zKCRjLCdiMmItYmxhY2snKSE9PWZhbHNlKT8xOjAsCgkJCSdoYXNfa2lla2lzMjQnPT4oc3RyaXBvcygkYywnS2lla2lzIC8gMjQnKSE9PWZhbHNlKT8xOjAsCgkJCSdoYXNfcmFjaW9uYXMnPT4oc3RyaXBvcygkYywnRElFTk9TIFJBQ0lPTicpIT09ZmFsc2UgfHwgc3RyaXBvcygkYywnZGllbm9zIHJhY2lvbicpIT09ZmFsc2UpPzE6MCwKCQkJJ2hhc19yZWtvbSc9PihzdHJpcG9zKCRjLCdSZWtvbWVuZHVvamFtJykhPT1mYWxzZSk/MTowLAoJCQknaGFzX3Nlcmltbyc9PihzdHJpcG9zKCRjLCfEl3JpbW8nKSE9PWZhbHNlKT8xOjAsCgkJCSdjb250ZW50Jz0+JGMKCQkpOwoJfQoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkb3V0KTsgZXhpdDsKfSk7Cg==';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wbody.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wbody.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024}).toString();}
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'CATGETC (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
o.d=(function(){const r=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/?ps_catgetc=S2Kw8Nx"',{maxBuffer:30*1024*1024}).toString();const i=r.indexOf('{');try{return JSON.parse(r.slice(i));}catch(e){return {raw:r.slice(0,300)};}})();
if(sid){ wj('POST','code-snippets/v1/snippets/'+sid,{active:false}); execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }
console.log('PUT:',pr('catgetc.json',o));
