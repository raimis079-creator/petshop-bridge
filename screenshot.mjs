const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfY2F0ZHVtcCddKXx8JF9HRVRbJ3BzX2NhdGR1bXAnXSE9PSdTMkt3OE54Jyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCg2MCk7CglnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OwoJJHRpZHM9YXJyYXkoODMsODQsODUsMjAwLDg2KTsKCSRvdXQ9YXJyYXkoKTsKCWZvcmVhY2goJHRpZHMgYXMgJHRpZCl7CgkJJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1Qgd2VpZ2h0X2Zyb21fa2csd2VpZ2h0X3RvX2tnLGFtb3VudF9mcm9tX2csYW1vdW50X3RvX2cscm93X29yZGVyLGNlbGxfdHlwZSxjb25kaXRpb25fZGltZW5zaW9ucyBGUk9NIHskcGZ9cHNfZmVlZGluZ19yb3dzIFdIRVJFIGZlZWRpbmdfdGFibGVfaWQ9JWQgT1JERVIgQlkgcm93X29yZGVyIiwkdGlkKSxBUlJBWV9BKTsKCQkkbWFwcz0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwcm9kdWN0X2lkLGlzX2FjdGl2ZSBGUk9NIHskcGZ9cHNfZmVlZGluZ19tYXAgV0hFUkUgZmVlZGluZ190YWJsZV9pZD0lZCIsJHRpZCksQVJSQVlfQSk7CgkJJG1ldGE9JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBicmFuZCxsaW5lLHNwZWNpZXMsc3RhdHVzLGlzX2FjdGl2ZSxzb3VyY2Vfa2luZCxzb3VyY2VfdXJsIEZST00geyRwZn1wc19mZWVkaW5nX3RhYmxlcyBXSEVSRSBpZD0lZCIsJHRpZCksQVJSQVlfQSk7CgkJJHRpdGxlcz1hcnJheSgpOwoJCWZvcmVhY2goJG1hcHMgYXMgJG0peyAkcD1nZXRfcG9zdCgoaW50KSRtWydwcm9kdWN0X2lkJ10pOyBpZigkcCkgJHRpdGxlc1skbVsncHJvZHVjdF9pZCddXT0kcC0+cG9zdF90aXRsZTsgfQoJCSRvdXRbJHRpZF09YXJyYXkoJ21ldGEnPT4kbWV0YSwncm93cyc9PiRyb3dzLCdtYXBzJz0+JG1hcHMsJ3RpdGxlcyc9PiR0aXRsZXMpOwoJfQoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkb3V0KTsgZXhpdDsKfSk7Cg==';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'CATDUMP (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
o.d=(function(){const r=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/?ps_catdump=S2Kw8Nx"',{maxBuffer:20*1024*1024}).toString();const i=r.indexOf('{');try{return JSON.parse(r.slice(i));}catch(e){return {raw:r.slice(0,300)};}})();
if(sid){ wj('POST','code-snippets/v1/snippets/'+sid,{active:false}); execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }
console.log('PUT:',pr('catdump.json',o));
