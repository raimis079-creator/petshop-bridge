const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfZnJlcG8nXSl8fCRfR0VUWydwc19mcmVwbyddIT09J1MyS3c4TngnKXtyZXR1cm47fQoJQHNldF90aW1lX2xpbWl0KDkwKTsKCWdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCk7CglpZighY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0ZlZWRpbmdfUmVwb3NpdG9yeScpKXtlY2hvIGpzb25fZW5jb2RlKGFycmF5KCdlcnInPT4ncmVwbyBuZXJhJykpO2V4aXQ7fQoJLy8gcHJvZHVrdGFpIHN1IGFrdHl2aXUgbWFwCgkkcGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIERJU1RJTkNUIHByb2R1Y3RfaWQgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfbWFwIFdIRVJFIGlzX2FjdGl2ZT0xIExJTUlUIDQwIik7Cgkkb1snbWFwcGVkX3Byb2R1Y3RzJ109Y291bnQoJHBpZHMpOwoJJHJlcG89bmV3IFBldHNob3BfRmVlZGluZ19SZXBvc2l0b3J5KCk7Cgkkc3RhdHM9YXJyYXkoKTsgJG9rX3NhbXBsZT1hcnJheSgpOyAkZGltX3N0YXRzPWFycmF5KCk7Cglmb3JlYWNoKCRwaWRzIGFzICRwaWQpewoJCSRydD0kcmVwby0+Z2V0X2Zvcl9wcm9kdWN0KCRwaWQpOwoJCSRzdD0kcnRbJ3N0YXR1cyddPz8nPyc7CgkJJHN0YXRzWyRzdF09KCRzdGF0c1skc3RdPz8wKSsxOwoJCWlmKCRzdD09PSdPSycpewoJCQlpZihjb3VudCgkb2tfc2FtcGxlKTw4KXsKCQkJCSRva19zYW1wbGVbXT1hcnJheSgncGlkJz0+JHBpZCwndGl0bGUnPT5tYl9zdWJzdHIoaHRtbF9lbnRpdHlfZGVjb2RlKGdldF90aGVfdGl0bGUoJHBpZCkpLDAsNDUpLAoJCQkJCSd0YWJsZV9pZCc9PiRydFsndGFibGVfaWQnXT8/bnVsbCwncm93cyc9PmNvdW50KCRydFsncm93cyddPz9hcnJheSgpKSwnd2VpZ2h0X2Jhc2lzJz0+JHJ0Wyd3ZWlnaHRfYmFzaXMnXT8/bnVsbCwKCQkJCQknc3VwcG9ydCc9PiRydFsnc3VwcG9ydCddPz9udWxsKTsKCQkJfQoJCQkvLyBrb2tpYXMgY29uZGl0aW9uIGRpbWVuc2lqYXMgdHVyaQoJCQlpZihjbGFzc19leGlzdHMoJ1BldHNob3BfRmVlZGluZ19DYWxjdWxhdG9yJykpewoJCQkJJHJlcT1QZXRzaG9wX0ZlZWRpbmdfQ2FsY3VsYXRvcjo6cmVxdWlyZWRfY29uZGl0aW9uX2RpbWVuc2lvbnMoJHJ0Wydyb3dzJ10/P2FycmF5KCkpOwoJCQkJJGtleT1lbXB0eSgkcmVxKT8nKG7El3JhKSc6aW1wbG9kZSgnKycsJHJlcSk7CgkJCQkkZGltX3N0YXRzWyRrZXldPSgkZGltX3N0YXRzWyRrZXldPz8wKSsxOwoJCQl9CgkJfQoJfQoJJG9bJ3JlcG9fc3RhdHVzX3N0YXRzJ109JHN0YXRzOwoJJG9bJ29rX3NhbXBsZXMnXT0kb2tfc2FtcGxlOwoJJG9bJ2RpbWVuc2lvbl9zdGF0cyddPSRkaW1fc3RhdHM7CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'FREPO (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
o.r=(function(){const r=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/?ps_frepo=S2Kw8Nx"',{maxBuffer:20*1024*1024}).toString();const i=r.indexOf('{');try{return JSON.parse(r.slice(i));}catch(e){return {raw:r.slice(0,300)};}})();
if(sid) wj('POST','code-snippets/v1/snippets/'+sid,{active:false});
console.log('PUT:',pr('frepo.json',o));
