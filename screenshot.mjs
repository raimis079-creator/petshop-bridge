const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfc2NvcGUzJ10pfHwkX0dFVFsncHNfc2NvcGUzJ10hPT0nUzJLdzhOeCcpe3JldHVybjt9CglAc2V0X3RpbWVfbGltaXQoNjApOwoJZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsKCSRvdXQ9YXJyYXkoKTsKCSRpbXBvcnRzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUgRlJPTSB7JHBmfXBteGlfaW1wb3J0cyBPUkRFUiBCWSBpZCIsQVJSQVlfQSk7Cgkkb3V0WydpbXBvcnRzJ109JGltcG9ydHM7CgkvLyBpbXBvcnQgIzIgb3B0aW9ucwoJJHJvdz0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGlkLG5hbWUsb3B0aW9ucyBGUk9NIHskcGZ9cG14aV9pbXBvcnRzIFdIRVJFIGlkPSVkIiwyKSxBUlJBWV9BKTsKCWlmKCRyb3cpewoJCSRvcHQ9bWF5YmVfdW5zZXJpYWxpemUoJHJvd1snb3B0aW9ucyddKTsKCQkka2V5cz1hcnJheSgndXBkYXRlX2NhdGVnb3JpZXMnLCdpc191cGRhdGVfY2F0ZWdvcmllcycsJ3VwZGF0ZV9jYXRlZ29yaWVzX2xvZ2ljJywnY2F0ZWdvcmllc19vbmx5X3RheG9ub21pZXMnLCdpc19rZWVwX2Zvcm1lcl9wb3N0cycsJ3VwZGF0ZV9hbGxfZGF0YScsJ2lzX3VwZGF0ZV9jYXRlZ29yaWVzX2RlbGltJywnY3JlYXRlX25ld19yZWNvcmRzJywnZHVwbGljYXRlX21hdGNoaW5nJywncGlkX2tleScsJ3VuaXF1ZV9rZXknKTsKCQkkc2xpbT1hcnJheSgpOwoJCWZvcmVhY2goJGtleXMgYXMgJGspeyAkc2xpbVska109IGlzc2V0KCRvcHRbJGtdKT8kb3B0WyRrXTonKG7El3JhKSc7IH0KCQkkb3V0WydpbXBvcnQyX25hbWUnXT0kcm93WyduYW1lJ107CgkJJG91dFsnaW1wb3J0Ml9yZWxldmFudCddPSRzbGltOwoJfSBlbHNlIHsgJG91dFsnaW1wb3J0MiddPSdOT1QgRk9VTkQnOyB9CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvdXQpOyBleGl0Owp9KTsK';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'SCOPE3 (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
o.d=(function(){const r=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/?ps_scope3=S2Kw8Nx"',{maxBuffer:20*1024*1024}).toString();const i=r.indexOf('{');try{return JSON.parse(r.slice(i));}catch(e){return {raw:r.slice(0,400)};}})();
if(sid){ wj('POST','code-snippets/v1/snippets/'+sid,{active:false}); execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }
console.log('PUT:',pr('scope3.json',o));
