import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={}; let sid=null;
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUmVmaWxsIFNvdXJjZSBSZWFkIHYxCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19yZCddKSB8fCAkX0dFVFsncHNfcmQnXSAhPT0gJ1JkNW0nICkgcmV0dXJuOwogICAgaWYgKCAhIGZ1bmN0aW9uX2V4aXN0cygnV1BfUExVR0lOX0RJUicpICYmICEgZGVmaW5lZCgnV1BfUExVR0lOX0RJUicpICkgeyB9CiAgICAkYmFzZSA9IFdQX1BMVUdJTl9ESVIgLiAnL3BldHNob3AtY29yZS9pbmNsdWRlcy8nOwogICAgJHdhbnQgPSBhcnJheSgnY2xhc3MtcmVmaWxsLWVuZ2luZS5waHAnLCdjbGFzcy1wZXQtZGFzaGJvYXJkLnBocCcsJ2NsYXNzLXBldC1wcm9kdWN0cy5waHAnKTsKICAgICRvdXQgPSBhcnJheSgnZmlsZXMnPT5hcnJheSgpKTsKICAgIGZvcmVhY2ggKCAkd2FudCBhcyAkZiApIHsKICAgICAgICAkcCA9ICRiYXNlIC4gJGY7CiAgICAgICAgJG91dFsnZmlsZXMnXVskZl0gPSBmaWxlX2V4aXN0cygkcCkKICAgICAgICAgICAgPyBhcnJheSgnc2l6ZSc9PmZpbGVzaXplKCRwKSwgJ3NoYSc9PnN1YnN0cihoYXNoX2ZpbGUoJ3NoYTI1NicsJHApLDAsMTYpLCAnYjY0Jz0+YmFzZTY0X2VuY29kZShmaWxlX2dldF9jb250ZW50cygkcCkpKQogICAgICAgICAgICA6IGFycmF5KCdtaXNzaW5nJz0+dHJ1ZSk7CiAgICB9CiAgICAvLyB2aXNpIGluY2x1ZGVzIGZhaWxhaQogICAgJGFsbCA9IGdsb2IoJGJhc2UuJyoucGhwJyk7CiAgICAkb3V0WydhbGxfaW5jbHVkZXMnXSA9IGFycmF5X21hcCgnYmFzZW5hbWUnLCAoYXJyYXkpJGFsbCk7CiAgICAvLyBwc19yZWZpbGxfdHJhY2tpbmcgZHVvbWVueXMKICAgIGdsb2JhbCAkd3BkYjsKICAgICR0ID0gJHdwZGItPnByZWZpeC4ncHNfcmVmaWxsX3RyYWNraW5nJzsKICAgICRvdXRbJ3JlZmlsbF9yb3dzJ10gPSAoaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkdCIpOwogICAgJG91dFsncmVmaWxsX2NvbHMnXSA9ICR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkdCIpOwogICAgLy8gYXVnaW50aW5pYWkgcGFnYWwgZmVlZGluZ190eXBlCiAgICAkcCA9ICR3cGRiLT5wcmVmaXguJ3BzX3BldHMnOwogICAgJG91dFsncGV0c19ieV9mZWVkaW5nJ10gPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoCiAgICAgICAgIlNFTEVDVCBmZWVkaW5nX3R5cGUsIENPVU5UKCopIGMgRlJPTSAkcCBHUk9VUCBCWSBmZWVkaW5nX3R5cGUiLCBBUlJBWV9BKTsKICAgIG5vY2FjaGVfaGVhZGVycygpOwogICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJG91dCwgSlNPTl9VTkVTQ0FQRURfU0xBU0hFU3xKU09OX1VORVNDQVBFRF9VTklDT0RFKTsKICAgIGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Refill Source Read v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,200); sh('sleep 4');}
}
O.sid=sid;
if(sid){ sh('sleep 3');
  const g=sh('curl -sSk "'+SITE+'/?ps_rd=Rd5m" -o /tmp/rd.json -w "%{http_code}"');
  O.code=g.out.trim();
  try{ O.data=JSON.parse(fs.readFileSync('/tmp/rd.json','utf8')); }catch(e){ O.raw=String(fs.readFileSync('/tmp/rd.json','utf8')).slice(0,600); }
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
}
putB64('rd.json',Buffer.from(JSON.stringify(O)).toString('base64'));
console.log('done');
