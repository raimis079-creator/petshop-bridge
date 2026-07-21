const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfczIxMnJkJ10pfHwkX0dFVFsncHNfczIxMnJkJ10hPT0nUzJLdzhOeCcpe3JldHVybjt9CglAc2V0X3RpbWVfbGltaXQoMzApOwoJJGNvcmU9V1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZSc7Cgkkdz0kX0dFVFsndyddPz8ncmVzJzsKCSRtYXA9YXJyYXkoJ3Jlcyc9PicvaW5jbHVkZXMvY2xhc3MtZmVlZGluZy1wYWNrYWdlLXJlc29sdmVyLnBocCcsJ3Byb3YnPT4nL2luY2x1ZGVzL2NsYXNzLWZlZWRpbmctcGFja2FnZS1wcm92aWRlci5waHAnLCdzdmMnPT4nL2luY2x1ZGVzL2NsYXNzLWZlZWRpbmctc2VydmljZS5waHAnKTsKCWlmKCFpc3NldCgkbWFwWyR3XSkpe2VjaG8gJ3c/JztleGl0O30KCWhlYWRlcignQ29udGVudC1UeXBlOiB0ZXh0L3BsYWluOyBjaGFyc2V0PXV0Zi04Jyk7CgllY2hvIGZpbGVfZ2V0X2NvbnRlbnRzKCRjb3JlLiRtYXBbJHddKTsgZXhpdDsKfSk7Cg==';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'S212RD (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
function get(w){return execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/?ps_s212rd=S2Kw8Nx&w='+w+'"',{maxBuffer:20*1024*1024}).toString();}
pr('s212_res.txt',get('res')); pr('s212_prov.txt',get('prov')); pr('s212_svc.txt',get('svc'));
if(sid) wj('POST','code-snippets/v1/snippets/'+sid,{active:false});
console.log('done');
