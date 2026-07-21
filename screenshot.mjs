const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfZmFjdCddKXx8JF9HRVRbJ3BzX2ZhY3QnXSE9PSdTMkt3OE54Jyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCg5MCk7CglnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgpOwoJLy8gaXNfYWN0aXZlIHBhc2lza2lyc3R5bWFzIHRhYmxlcwoJJG9bJ3RhYmxlc19pc19hY3RpdmUnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpc19hY3RpdmUsQ09VTlQoKikgYyBGUk9NIHskcGZ9cHNfZmVlZGluZ190YWJsZXMgR1JPVVAgQlkgaXNfYWN0aXZlIixBUlJBWV9BKTsKCS8vIG1hcCBpc19hY3RpdmUgcGFzaXNraXJzdHltYXMKCSRvWydtYXBfaXNfYWN0aXZlJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaXNfYWN0aXZlLENPVU5UKCopIGMgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfbWFwIEdST1VQIEJZIGlzX2FjdGl2ZSIsQVJSQVlfQSk7CgkvLyB2ZXJpZmllZCArIGlzX2FjdGl2ZSBrcnl6bWluZQoJJG9bJ3ZlcmlmaWVkX2FjdGl2ZSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHN0YXR1cyxpc19hY3RpdmUsQ09VTlQoKikgYyBGUk9NIHskcGZ9cHNfZmVlZGluZ190YWJsZXMgR1JPVVAgQlkgc3RhdHVzLGlzX2FjdGl2ZSBPUkRFUiBCWSBzdGF0dXMsaXNfYWN0aXZlIixBUlJBWV9BKTsKCS8vIFJlcG9zaXRvcnkgbG9naWthOiBrYWlwIGdldF9mb3JfcHJvZHVjdCBudXN0YXRvIGFrdHl2dW1hPyBTa2FpdG9tIFJlcG9zaXRvcnkKCSRyZXBvPWZpbGVfZ2V0X2NvbnRlbnRzKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvY2xhc3MtZmVlZGluZy1yZXBvc2l0b3J5LnBocCcpOwoJLy8gaXN0cmF1a2lhbSBrdXIgbmF1ZG9qYSBpc19hY3RpdmUgLyBhY3RpdmUgLyBzdGF0dXMKCXByZWdfbWF0Y2hfYWxsKCcvLiooaXNfYWN0aXZlfGFjdGl2ZXxOT19BQ1RJVkV8c3RhdHVzKS4qL2knLCRyZXBvLCRtKTsKCSRvWydyZXBvX2FjdGl2ZV9saW5lcyddPWFycmF5X3NsaWNlKCRtWzBdLDAsMjUpOwoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'FACT (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
o.a=(function(){const r=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/?ps_fact=S2Kw8Nx"',{maxBuffer:20*1024*1024}).toString();const i=r.indexOf('{');try{return JSON.parse(r.slice(i));}catch(e){return {raw:r.slice(0,300)};}})();
if(sid) wj('POST','code-snippets/v1/snippets/'+sid,{active:false});
console.log('PUT:',pr('fact.json',o));
