const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfcm1wJ10pfHwkX0dFVFsncHNfcm1wJ10hPT0nUzJLdzhOeCcpe3JldHVybjt9CglnbG9iYWwgJHdwZGI7JHBmPSR3cGRiLT5wcmVmaXg7CgkkYWRtaW49Z2V0X3VzZXJzKGFycmF5KCdyb2xlJz0+J2FkbWluaXN0cmF0b3InLCdudW1iZXInPT4xLCdmaWVsZHMnPT4nSUQnKSk7ICRhaWQ9JGFkbWluPyhpbnQpJGFkbWluWzBdOjE7Cgkkbj0kd3BkYi0+ZGVsZXRlKCRwZi4ncHNfcGV0cycsYXJyYXkoJ3VzZXJfaWQnPT4kYWlkLCdwZXRfbmFtZSc9PidTa2FpxI1pdW9rbMSXcyB0ZXN0YXMnKSk7CgkkbGVmdD0oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHBmfXBzX3BldHMgV0hFUkUgdXNlcl9pZD0lZCBBTkQgcGV0X25hbWU9JXMiLCRhaWQsJ1NrYWnEjWl1b2tsxJdzIHRlc3RhcycpKTsKCWVjaG8ganNvbl9lbmNvZGUoYXJyYXkoJ2RlbGV0ZWQnPT4kbiwncmVtYWluaW5nJz0+JGxlZnQpKTsgZXhpdDsKfSk7Cg==';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'RMP (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){o.mkerr=String(mk).slice(0,200);}
o.d=(function(){try{const r=execSync('curl -sk --max-time 35 '+AUTH+' "https://dev.avesa.lt/?ps_rmp=S2Kw8Nx"',{timeout:40000}).toString();const i=r.indexOf('{');return i>=0?JSON.parse(r.slice(i)):{raw:r.slice(0,150)};}catch(e){return{err:String(e).slice(0,120)};}})();
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
console.log('PUT:',pr('rmp.json',o));
