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
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUFAyRCBFMkUgdjEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX2UyJ10pICkgcmV0dXJuOwogICAgJGFjdCA9ICRfR0VUWydwc19lMiddOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBnbG9iYWwgJHdwZGI7CiAgICAkRUogPSAkd3BkYi0+cHJlZml4IC4gJ3BzX2VtYWlsX2pvYnMnOwogICAgJEFMTE9XID0gYXJyYXkoJ3RlcnJhQGd5dnVuYWkubHQnLCdyYWltdW5kYXNAZ3l2dW5haS5sdCcsJ3RlcnJhQHBldHNob3AubHQnKTsKICAgICRyID0gYXJyYXkoKTsKCiAgICAvLyBTQVVHSUtMSVM6IGpva3Mgd3BfbWFpbCBuZXByYWVpbmEgcGVyIHZpc2Egc2kgcHJhc2EKICAgIGFkZF9maWx0ZXIoJ3ByZV93cF9tYWlsJywgZnVuY3Rpb24oJG4sJGEpeyByZXR1cm4gdHJ1ZTsgfSwgMSwgMik7CgogICAgaWYgKCRhY3QgPT09ICdaeDRyZWNvbicpIHsKICAgICAgICAkclsnb3JkZXJzJ10gPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoCiAgICAgICAgICAgICJTRUxFQ1Qgby5pZCwgby5zdGF0dXMsIG8uYmlsbGluZ19lbWFpbCwgby5kYXRlX2NyZWF0ZWRfZ210LAogICAgICAgICAgICAgICAgICAgIChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskd3BkYi0+cHJlZml4fXdjX29yZGVyc19tZXRhIG0KICAgICAgICAgICAgICAgICAgICAgIFdIRVJFIG0ub3JkZXJfaWQ9by5pZCBBTkQgbS5tZXRhX2tleT0nX3BzX2NvbXBsZXRlZF9hdCcgTElNSVQgMSkgQVMgc3RhbXAKICAgICAgICAgICAgICAgRlJPTSB7JHdwZGItPnByZWZpeH13Y19vcmRlcnMgbwogICAgICAgICAgICAgIFdIRVJFIG8uc3RhdHVzPSd3Yy1jb21wbGV0ZWQnCiAgICAgICAgICAgICAgT1JERVIgQlkgby5pZCBERVNDIExJTUlUIDMwIiwgQVJSQVlfQSk7CiAgICAgICAgJHJbJ2pvYnNfcHAyZCddID0gJHdwZGItPmdldF9yZXN1bHRzKAogICAgICAgICAgICAiU0VMRUNUIGlkLCBqb2Jfa2V5LCBzdGF0dXMsIHJlY2lwaWVudF9lbWFpbCwgcHJvdmlkZXJfbWVzc2FnZV9pZCwgc2tpcF9yZWFzb24sIGNyZWF0ZWRfYXQKICAgICAgICAgICAgICAgRlJPTSAkRUogV0hFUkUgZmxvdz0ncG9zdF9wdXJjaGFzZV8yZCcgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxMCIsIEFSUkFZX0EpOwogICAgICAgICRyWyd0cGxfZXhpc3RzJ10gPSBmaWxlX2V4aXN0cyhQRVRTSE9QX0NPUkVfRElSLid0ZW1wbGF0ZXMvZW1haWxzL3Bvc3QtcHVyY2hhc2UtMmQucGhwJyk7CiAgICB9CgogICAgaWYgKCRhY3QgPT09ICdaeDRydW4nKSB7CiAgICAgICAgJG9pZCA9IGlzc2V0KCRfR0VUWydvaWQnXSkgPyAoaW50KSAkX0dFVFsnb2lkJ10gOiAwOwogICAgICAgICRvcmRlciA9ICRvaWQgPyB3Y19nZXRfb3JkZXIoJG9pZCkgOiBudWxsOwogICAgICAgIGlmICghJG9yZGVyKSB7IGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2Vycic9PiduZXJhIHV6c2FreW1vJykpOyBleGl0OyB9CiAgICAgICAgJGVtID0gc3RydG9sb3dlcih0cmltKCRvcmRlci0+Z2V0X2JpbGxpbmdfZW1haWwoKSkpOwogICAgICAgIGlmICghaW5fYXJyYXkoJGVtLCAkQUxMT1csIHRydWUpKSB7IGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2Vycic9PiduZSBhbGxvd2xpc3Q6ICcuJGVtKSk7IGV4aXQ7IH0KCiAgICAgICAgLy8gMSkgenltYSBpIHByYWVpdGkgKFRJSyBtZXRhLCBzdGF0dXNvIE5FS0VJQ0lBTSkKICAgICAgICAkb3JkZXItPnVwZGF0ZV9tZXRhX2RhdGEoJ19wc19jb21wbGV0ZWRfYXQnLCBnbWRhdGUoJ1ktbS1kIEg6aTpzJywgdGltZSgpIC0gMyo4NjQwMCkpOwogICAgICAgICRvcmRlci0+c2F2ZSgpOwogICAgICAgICRyWydzdGFtcCddID0gJG9yZGVyLT5nZXRfbWV0YSgnX3BzX2NvbXBsZXRlZF9hdCcsIHRydWUpOwoKICAgICAgICAvLyAyKSBzZW5hcyBqb2InYXMgc2FsaW5hbWFzLCBrYWQgZGVkdXAgbmV0cnVrZHl0dSB0ZXN0dWkKICAgICAgICAkclsnZGVsZXRlZF9vbGQnXSA9ICR3cGRiLT5kZWxldGUoJEVKLCBhcnJheSgnam9iX2tleSc9Pidwb3N0X3B1cmNoYXNlXzJkOicuJG9pZCkpOwoKICAgICAgICAvLyAzKSBkZXRla3Rvcml1cwogICAgICAgICRyWydkZXRlY3QnXSA9IFBldHNob3BfUG9zdF9QdXJjaGFzZTo6ZGV0ZWN0XzJkKGZhbHNlKTsKCiAgICAgICAgLy8gNCkgam9iJ2FzIFBSSUVTCiAgICAgICAgJHJbJ2pvYl9iZWZvcmUnXSA9ICR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKAogICAgICAgICAgICAiU0VMRUNUIGlkLGZsb3csZmxvd19jbGFzcyxzdGF0dXMscmVjaXBpZW50X2VtYWlsLHN1YmplY3QscHJvdmlkZXJfbWVzc2FnZV9pZCxza2lwX3JlYXNvbixzY2hlZHVsZWRfYXQKICAgICAgICAgICAgICAgRlJPTSAkRUogV0hFUkUgam9iX2tleT0lcyIsICdwb3N0X3B1cmNoYXNlXzJkOicuJG9pZCksIEFSUkFZX0EpOwoKICAgICAgICAvLyA1KSBUSUtSQVMgZGlzcGF0Y2gKICAgICAgICAkclsncHJvY2VzcyddID0gUGV0c2hvcF9FbWFpbF9EaXNwYXRjaDo6cHJvY2Vzc19wZW5kaW5nKDUsIGZhbHNlKTsKCiAgICAgICAgLy8gNikgam9iJ2FzIFBPCiAgICAgICAgJHJbJ2pvYl9hZnRlciddID0gJHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoCiAgICAgICAgICAgICJTRUxFQ1QgaWQsZmxvdyxzdGF0dXMscmVjaXBpZW50X2VtYWlsLHN1YmplY3QscHJvdmlkZXJfbWVzc2FnZV9pZCxza2lwX3JlYXNvbixzZW50X2F0CiAgICAgICAgICAgICAgIEZST00gJEVKIFdIRVJFIGpvYl9rZXk9JXMiLCAncG9zdF9wdXJjaGFzZV8yZDonLiRvaWQpLCBBUlJBWV9BKTsKICAgIH0KICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFU3xKU09OX1BSRVRUWV9QUklOVCk7CiAgICBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP PP2D E2E v1',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 5');
  O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  const d=sh('curl -sSk -m 90 "'+SITE+'/?ps_e2=Zx4run&oid=34720"');
  try{O.e2e=JSON.parse(d.out);}catch(e){O.raw=d.out.slice(0,1500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  sh('sleep 2');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
}
putB64('pp2d_e2e_run.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
