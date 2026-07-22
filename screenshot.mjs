const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfbWtwJ10pfHwkX0dFVFsncHNfbWtwJ10hPT0nUzJLdzhOeCcpe3JldHVybjt9CglAc2V0X3RpbWVfbGltaXQoNDApOyBnbG9iYWwgJHdwZGI7JHBmPSR3cGRiLT5wcmVmaXg7CgkkYWRtaW49Z2V0X3VzZXJzKGFycmF5KCdyb2xlJz0+J2FkbWluaXN0cmF0b3InLCdudW1iZXInPT4xLCdmaWVsZHMnPT4nSUQnKSk7ICRhaWQ9JGFkbWluPyhpbnQpJGFkbWluWzBdOjE7CgkvLyBhciBqYXUgeXJhIHRva3MgdGVzdGluaXM/IGthZCBuZWR1YmxpdW90xbMKCSRleD0oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgaWQgRlJPTSB7JHBmfXBzX3BldHMgV0hFUkUgdXNlcl9pZD0lZCBBTkQgcGV0X25hbWU9JXMgQU5EIGRlbGV0ZWRfYXQgSVMgTlVMTCBMSU1JVCAxIiwkYWlkLCdTa2FpxI1pdW9rbMSXcyB0ZXN0YXMnKSk7CglpZigkZXgpeyAkcGlkPSRleDsgfQoJZWxzZSB7CgkJJHdwZGItPmluc2VydCgkcGYuJ3BzX3BldHMnLGFycmF5KAoJCQkndXNlcl9pZCc9PiRhaWQsJ3BldF9uYW1lJz0+J1NrYWnEjWl1b2tsxJdzIHRlc3RhcycsJ3NwZWNpZXMnPT4nZG9nJywnc3RhdHVzJz0+J2FjdGl2ZScsCgkJCSdwcmltYXJ5X3Byb2R1Y3RfaWQnPT4xODAxNCwncHJpbWFyeV9wcm9kdWN0X25hbWUnPT4nSm9zZXJhIE5hdHVyZSBFbmVyZ2V0aWMgMTIsNSBrZycsCgkJCSdhY3Rpdml0eV9oaW50Jz0+J21vZGVyYXRlJywnY3VycmVudF93ZWlnaHRfa2cnPT5udWxsLAoJCQknY3JlYXRlZF9hdCc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSwndXBkYXRlZF9hdCc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSkpOwoJCSRwaWQ9KGludCkkd3BkYi0+aW5zZXJ0X2lkOwoJfQoJLy8gcHJvZHVrdG8gbGVudGVsxJdzIHBhdGlrcmEKCSRoYXN0YWI9KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwZn1wc19mZWVkaW5nX21hcCBtIEpPSU4geyRwZn1wc19mZWVkaW5nX3RhYmxlcyB0IE9OIHQuaWQ9bS5mZWVkaW5nX3RhYmxlX2lkIFdIRVJFIG0ucHJvZHVjdF9pZD0xODAxNCBBTkQgbS5pc19hY3RpdmU9MSBBTkQgdC5pc19hY3RpdmU9MSBBTkQgdC5zdGF0dXM9J3ZlcmlmaWVkJyIpOwoJZWNobyBqc29uX2VuY29kZShhcnJheSgncGV0X2lkJz0+JHBpZCwnYWRtaW5faWQnPT4kYWlkLCdwcm9kdWN0Jz0+MTgwMTQsJ2hhc190YWJsZSc9PiRoYXN0YWIsJ3VybCc9PndjX2dldF9hY2NvdW50X2VuZHBvaW50X3VybCgnYXVnaW50aW5pcycpKSk7IGV4aXQ7Cn0pOwo=';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'MKP (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){o.mkerr=String(mk).slice(0,200);}
o.d=(function(){try{const r=execSync('curl -sk --max-time 40 '+AUTH+' "https://dev.avesa.lt/?ps_mkp=S2Kw8Nx"',{timeout:45000}).toString();const i=r.indexOf('{');return i>=0?JSON.parse(r.slice(i)):{raw:r.slice(0,200)};}catch(e){return{err:String(e).slice(0,150)};}})();
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
console.log('PUT:',pr('mkp.json',o));
