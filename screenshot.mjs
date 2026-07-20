const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfbWx2J10pfHwkX0dFVFsncHNfbWx2J10hPT0nTThLdzhOeCcpe3JldHVybjt9CglAc2V0X3RpbWVfbGltaXQoMzApOwoJZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoKTsKCSR1c2VyPWdldF91c2VyX2J5KCdlbWFpbCcsJ204ZTJlX3Rlc3RAcGV0c2hvcC5sdCcpOwoJJG9bJ3VzZXJfaWQnXT0kdXNlcj8kdXNlci0+SUQ6bnVsbDsKCWlmKCR1c2VyKXsKCQkkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCxwZXRfbmFtZSxzcGVjaWVzLGxpZmVfc3RhZ2UsZG9nX3NpemUscHJpbWFyeV9uZWVkLGNsaWVudF9yZWYsc3RhdHVzLGNyZWF0ZWRfYXQgRlJPTSB7JHBmfXBzX3BldHMgV0hFUkUgdXNlcl9pZD0lZCBPUkRFUiBCWSBpZCIsJHVzZXItPklEKSxBUlJBWV9BKTsKCQkkb1sncGV0cyddPSRyb3dzOwoJCSRvWydwZXRfY291bnQnXT1jb3VudCgkcm93cyk7Cgl9CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'MLV (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
o.v=(function(){const r=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/?ps_mlv=M8Kw8Nx"',{maxBuffer:20*1024*1024}).toString();const i=r.indexOf('{');try{return JSON.parse(r.slice(i));}catch(e){return {raw:r.slice(0,200)};}})();
if(sid) wj('POST','code-snippets/v1/snippets/'+sid,{active:false});
console.log('PUT:',pr('m8mlv.json',o));
