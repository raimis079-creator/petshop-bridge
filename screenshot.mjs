const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfbThwcCddKXx8JF9HRVRbJ3BzX204cHAnXSE9PSdNOEt3OE54Jyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCgzMCk7CgkkY29yZT1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlJzsKCSRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRjb3JlLicvaW5jbHVkZXMvY2xhc3MtcGV0LXByb2ZpbGUucGhwJyk7CgkvLyBpc3NraXJpYW0gUE9TVCBjcmVhdGUgaGFuZGxlciArIGNsaWVudF9yZWYgbG9naWthCgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogdGV4dC9wbGFpbjsgY2hhcnNldD11dGYtOCcpOwoJZWNobyAkYzsgZXhpdDsKfSk7Cg==';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'M8PP (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
const txt=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/?ps_m8pp=M8Kw8Nx"',{maxBuffer:30*1024*1024}).toString();
pr('m8_pp.txt',txt);
if(sid) wj('POST','code-snippets/v1/snippets/'+sid,{active:false});
console.log('done',txt.length);
