const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfbWxnZW4nXSl8fCRfR0VUWydwc19tbGdlbiddIT09J004S3c4TngnKXtyZXR1cm47fQoJQHNldF90aW1lX2xpbWl0KDMwKTsKCSRvPWFycmF5KCk7CgkkZW1haWw9J204ZTJlX3Rlc3RAcGV0c2hvcC5sdCc7CgkvLyB0ZXN0IHZhcnRvdG9qYXMgKHN1a3VyaWFtIGplaSBuZXJhKQoJJHVzZXI9Z2V0X3VzZXJfYnkoJ2VtYWlsJywkZW1haWwpOwoJaWYoISR1c2VyKXsKCQkkdWlkPXdwX2luc2VydF91c2VyKGFycmF5KCd1c2VyX2xvZ2luJz0+J204ZTJlX3Rlc3QnLCd1c2VyX2VtYWlsJz0+JGVtYWlsLCd1c2VyX3Bhc3MnPT53cF9nZW5lcmF0ZV9wYXNzd29yZCgyNCksJ3JvbGUnPT4nY3VzdG9tZXInLCdkaXNwbGF5X25hbWUnPT4nTTggRTJFJykpOwoJCSR1c2VyPWdldF91c2VyX2J5KCdpZCcsJHVpZCk7CgkJJG9bJ2NyZWF0ZWRfdXNlciddPXRydWU7Cgl9IGVsc2UgeyAkb1snY3JlYXRlZF91c2VyJ109ZmFsc2U7IH0KCSRvWyd1c2VyX2lkJ109JHVzZXItPklEOwoJLy8gaXN2YWxvbSBzZW51cyB0ZXN0IGF1Z2ludGluaXVzIChzdmFydXMgc3RhcnRhcykKCWdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7CgkkZGVsPSR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00geyRwZn1wc19wZXRzIFdIRVJFIHVzZXJfaWQ9JWQiLCR1c2VyLT5JRCkpOwoJJG9bJ2RlbGV0ZWRfb2xkX3BldHMnXT0kZGVsOwoJLy8gZ2VuZXJ1b2phbSBtYWdpYyB0b2tlbiAoY29udGV4dD1wZXQpCglpZihmdW5jdGlvbl9leGlzdHMoJ3BzX2dlbmVyYXRlX3Rva2VuJykpewoJCSR0b2tlbj1wc19nZW5lcmF0ZV90b2tlbihhcnJheSgncHVycG9zZSc9PidtYWdpY19sb2dpbicsJ3N1YmplY3RfaWQnPT4kdXNlci0+SUQsJ2VtYWlsJz0+JGVtYWlsLCd0dGxfc2Vjb25kcyc9PjkwMCwnYWN0aW9uJz0+J3BldCcpKTsKCQkkb1sndG9rZW4nXT0kdG9rZW47CgkJJG9bJ2xvZ2luX3VybCddPWhvbWVfdXJsKCcvcGV0c2hvcC1sb2dpbj90b2tlbj0nLnJhd3VybGVuY29kZSgkdG9rZW4pKTsKCX0gZWxzZSB7ICRvWydlcnInXT0ncHNfZ2VuZXJhdGVfdG9rZW4gbmVyYSc7IH0KCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'MLGEN (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
try{o.snip_id=JSON.parse(mk).id;}catch(e){o.mk=mk.slice(0,150);}
o.gen=(function(){const r=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/?ps_mlgen=M8Kw8Nx"',{maxBuffer:20*1024*1024}).toString();const i=r.indexOf('{');try{return JSON.parse(r.slice(i));}catch(e){return {raw:r.slice(0,200)};}})();
if(o.snip_id) wj('POST','code-snippets/v1/snippets/'+o.snip_id,{active:false});
console.log('PUT:',pr('m8mlgen.json',o));
