const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfdDg2diddKXx8JF9HRVRbJ3BzX3Q4NnYnXSE9PSdTMkt3OE54Jyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCg2MCk7CglnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OwoJJHRhYlQ9JHBmLidwc19mZWVkaW5nX3RhYmxlcyc7ICRtYXBUPSRwZi4ncHNfZmVlZGluZ19tYXAnOwoJJHBpZD0xODUzMzsKCSRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgKCQkiU0VMRUNUIHQuaWQsdC5zdGF0dXMsdC5pc19hY3RpdmUsdC5jYW5vbmljYWxfdGFibGVfaGFzaCBJUyBOT1QgTlVMTCBBUyBoYXNfaGFzaCxtLmlzX2FjdGl2ZSBBUyBtYXBfYWN0aXZlCgkJIEZST00geyR0YWJUfSB0IEpPSU4geyRtYXBUfSBtIE9OIG0uZmVlZGluZ190YWJsZV9pZD10LmlkCgkJIFdIRVJFIG0ucHJvZHVjdF9pZD0lZCIsJHBpZCksQVJSQVlfQSk7Cgkkb2tfdGFibGVzPWFycmF5KCk7Cglmb3JlYWNoKCRyb3dzIGFzICRyKXsKCQlpZigkclsnc3RhdHVzJ109PT0ndmVyaWZpZWQnICYmIChpbnQpJHJbJ2lzX2FjdGl2ZSddPT09MSAmJiAoaW50KSRyWydoYXNfaGFzaCddPT09MSAmJiAoaW50KSRyWydtYXBfYWN0aXZlJ109PT0xKXsKCQkJJG9rX3RhYmxlc1tdPSRyWydpZCddOwoJCX0KCX0KCSRyZXBvc2l0b3J5X29rID0gKGNvdW50KCRva190YWJsZXMpPT09MSk7CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOwoJZWNobyBqc29uX2VuY29kZShhcnJheSgncGlkJz0+JHBpZCwnYWxsX21hcHBlZCc9PiRyb3dzLCdva190YWJsZXMnPT4kb2tfdGFibGVzLCdyZXBvc2l0b3J5X29rJz0+JHJlcG9zaXRvcnlfb2spKTsKCWV4aXQ7Cn0pOwo=';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'T86V (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
o.d=(function(){const r=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/?ps_t86v=S2Kw8Nx"',{maxBuffer:20*1024*1024}).toString();const i=r.indexOf('{');try{return JSON.parse(r.slice(i));}catch(e){return {raw:r.slice(0,300)};}})();
if(sid){ wj('POST','code-snippets/v1/snippets/'+sid,{active:false}); execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }
console.log('PUT:',pr('t86verify.json',o));
