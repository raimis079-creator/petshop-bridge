const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfaW1wMyddKXx8JF9HRVRbJ3BzX2ltcDMnXSE9PSdTMkt3OE54Jyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCg0MCk7CglnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkb3V0PWFycmF5KCk7Cglmb3JlYWNoKGFycmF5KDIsMykgYXMgJGlpZCl7CgkJJHJvdz0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIG9wdGlvbnMgRlJPTSB7JHBmfXBteGlfaW1wb3J0cyBXSEVSRSBpZD0lZCIsJGlpZCksQVJSQVlfQSk7CgkJaWYoISRyb3cpeyAkb3V0WyRpaWRdPSdOT1QgRk9VTkQnOyBjb250aW51ZTsgfQoJCSRvPW1heWJlX3Vuc2VyaWFsaXplKCRyb3dbJ29wdGlvbnMnXSk7ICRzPWFycmF5KCk7CgkJZm9yZWFjaChhcnJheSgnaXNfdXBkYXRlX2F0dHJpYnV0ZXMnLCd1cGRhdGVfYXR0cmlidXRlc19sb2dpYycsJ2lzX3VwZGF0ZV9jYXRlZ29yaWVzJywnaXNfdXBkYXRlX2N1c3RvbV9maWVsZHMnLCd1cGRhdGVfY3VzdG9tX2ZpZWxkc19sb2dpYycsJ3VwZGF0ZV9hbGxfZGF0YScsJ2lzX2tlZXBfZm9ybWVyX3Bvc3RzJywnaXNfdXBkYXRlX2NvbnRlbnQnLCdpc191cGRhdGVfdGl0bGUnLCd1cGRhdGVfY2F0ZWdvcmllc19sb2dpYycpIGFzICRrKXsgJHNbJGtdPWlzc2V0KCRvWyRrXSk/KGlzX2FycmF5KCRvWyRrXSk/anNvbl9lbmNvZGUoJG9bJGtdKTokb1ska10pOicobsSXcmEpJzsgfQoJCSRvdXRbJGlpZF09JHM7Cgl9CgkvLyBjcm9uIHNjaGVkdWxlIGZvciBpbXBvcnRzCgkkY3JvbnM9YXJyYXkoKTsgJGM9X2dldF9jcm9uX2FycmF5KCk7Cglmb3JlYWNoKCRjIGFzICR0cz0+JGhvb2tzKXsgZm9yZWFjaCgkaG9va3MgYXMgJGhvb2s9PiRldil7IGlmKHN0cmlwb3MoJGhvb2ssJ2ltcG9ydCcpIT09ZmFsc2V8fHN0cmlwb3MoJGhvb2ssJ3BteGknKSE9PWZhbHNlfHxzdHJpcG9zKCRob29rLCd3cGFpJykhPT1mYWxzZSl7ICRjcm9uc1tdPWFycmF5KCdob29rJz0+JGhvb2ssJ25leHQnPT5kYXRlKCdZLW0tZCBIOmknLCR0cykpOyB9IH0gfQoJJG91dFsnaW1wb3J0X2Nyb25zJ109YXJyYXlfc2xpY2UoJGNyb25zLDAsMTUpOwoJZWNobyBqc29uX2VuY29kZSgkb3V0KTsgZXhpdDsKfSk7Cg==';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'IMP3 (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
o.d=(function(){try{const r=execSync('curl -sk --max-time 35 '+AUTH+' "https://dev.avesa.lt/?ps_imp3=S2Kw8Nx"',{maxBuffer:10*1024*1024,timeout:45000}).toString();const i=r.indexOf('{');return JSON.parse(r.slice(i));}catch(e){return {err:String(e).slice(0,220)};}})();
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
console.log('PUT:',pr('imp3.json',o));
