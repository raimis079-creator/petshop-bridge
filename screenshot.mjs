const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfbThyZWFkJ10pfHwkX0dFVFsncHNfbThyZWFkJ10hPT0nTThLdzhOeCcpe3JldHVybjt9CglAc2V0X3RpbWVfbGltaXQoNjApOwoJJGNvcmU9V1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZSc7Cgkkdz0kX0dFVFsndyddPz8nJzsKCSRtYXA9YXJyYXkoCgkJJ3VpJz0+Jy9pbmNsdWRlcy9jbGFzcy1wZXQtdWkucGhwJywKCQkncHJvZmpzJz0+Jy9hc3NldHMvcGV0LXByb2ZpbGUuanMnLAoJCSdmb3JtanMnPT4nL2Fzc2V0cy9wZXQtZm9ybS5qcycsCgkpOwoJaWYoIWlzc2V0KCRtYXBbJHddKSl7ZWNobyBqc29uX2VuY29kZShhcnJheSgnZXJyJz0+J3cnKSk7ZXhpdDt9CgkkYz1maWxlX2dldF9jb250ZW50cygkY29yZS4kbWFwWyR3XSk7CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogdGV4dC9wbGFpbjsgY2hhcnNldD11dGYtOCcpOwoJZWNobyAkYzsgZXhpdDsKfSk7Cg==';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){const b=Buffer.from(JSON.stringify(body)).toString('base64');
  return execSync('echo '+b+'|base64 -d|curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" -d @- "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024}).toString();}
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(o).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'M8READ (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
function get(w){return execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/?ps_m8read=M8Kw8Nx&w='+w+'"',{maxBuffer:30*1024*1024}).toString();}
pr('m8_ui.txt',get('ui'));
pr('m8_profjs.txt',get('profjs'));
pr('m8_formjs.txt',get('formjs'));
if(sid) wj('POST','code-snippets/v1/snippets/'+sid,{active:false});
console.log('done');
