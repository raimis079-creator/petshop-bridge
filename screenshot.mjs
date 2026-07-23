const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfYTQnXSl8fCRfR0VUWydwc19hNCddIT09J1MyS3c4TngnKXtyZXR1cm47fQoJQHNldF90aW1lX2xpbWl0KDUwKTsgZ2xvYmFsICR3cGRiOyRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgpOwoJJGY9V1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9pbmNsdWRlcy9jbGFzcy1wZXQtZGFzaGJvYXJkLnBocCc7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsKCSRvWydkYXNoX2I2NCddPWJhc2U2NF9lbmNvZGUoJGMpOyAkb1snZGFzaF9tZDUnXT1tZDUoJGMpOwoJJGQ9V1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9hc3NldHMvaW1hZ2VzJzsKCSRvWydpbWFnZXMnXT1pc19kaXIoJGQpP2FycmF5X3ZhbHVlcyhhcnJheV9kaWZmKHNjYW5kaXIoJGQpLGFycmF5KCcuJywnLi4nKSkpOm51bGw7Cgkkb1sncmVmaWxsX3Jvd3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCx1c2VyX2lkLHBldF9pZCxwcm9kdWN0X2lkLHN0YXR1cyBGUk9NIHskcGZ9cHNfcmVmaWxsX3RyYWNraW5nIixBUlJBWV9BKTsKCSRvWydwZXRzX2xpc3QnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxwZXRfbmFtZSxzcGVjaWVzLHByaW1hcnlfcHJvZHVjdF9pZCxjdXJyZW50X2Zvb2RfYnJhbmQsY3VycmVudF93ZWlnaHRfa2cgRlJPTSB7JHBmfXBzX3BldHMgV0hFUkUgZGVsZXRlZF9hdCBJUyBOVUxMIEFORCBzdGF0dXM9J2FjdGl2ZScgT1JERVIgQlkgaWQgREVTQyBMSU1JVCA4IixBUlJBWV9BKTsKCWVjaG8ganNvbl9lbmNvZGUoJG8sIEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0Owp9KTsK';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wbody.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wbody.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024,timeout:70000}).toString();}
function pr(n,ob){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(JSON.stringify(ob)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2'); }return 'fail';}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'A4 (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){o.mkerr=String(mk).slice(0,200);}
o.d=(function(){try{const r=execSync('curl -sk --max-time 50 '+AUTH+' "https://dev.avesa.lt/?ps_a4=S2Kw8Nx"',{maxBuffer:20*1024*1024,timeout:55000}).toString();const i=r.indexOf('{');return i>=0?JSON.parse(r.slice(i)):{raw:r.slice(0,300)};}catch(e){return{err:String(e).slice(0,200)};}})();
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
console.log('PUT:',pr('a4.json',o));
