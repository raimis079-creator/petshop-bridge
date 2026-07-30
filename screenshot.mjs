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
// pirma deaktyvuoti visus senus TEMP Four Checks snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP Four Checks/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgVG9rZW4gUmF3IHYxCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc190MiddKSB8fCAkX0dFVFsncHNfdDInXSAhPT0gJ1QycncnICkgcmV0dXJuOwogICAgJHI9YXJyYXkoKTsKICAgICRyYXcgPSBQZXRzaG9wX0FjdGlvbl9Ub2tlbnM6OmdlbmVyYXRlKGFycmF5KCdwdXJwb3NlJz0+J2NhcnRfcmVjb3ZlcnknLCdyZXNvdXJjZV9pZCc9PidSQVdURVNUMScsJ3R0bF9zZWNvbmRzJz0+OTAwKSk7CiAgICAkclsndG9rZW5fbGVuJ109aXNfc3RyaW5nKCRyYXcpP3N0cmxlbigkcmF3KTowOwogICAgJHJbJ3BlZWtfMSddPVBldHNob3BfQWN0aW9uX1Rva2Vuczo6cGVlaygkcmF3KTsKICAgICRyWydwZWVrXzInXT1QZXRzaG9wX0FjdGlvbl9Ub2tlbnM6OnBlZWsoJHJhdyk7CiAgICAkclsnY29uc3VtZV8xJ109UGV0c2hvcF9BY3Rpb25fVG9rZW5zOjpjb25zdW1lKCRyYXcpOwogICAgJHJbJ2NvbnN1bWVfMiddPVBldHNob3BfQWN0aW9uX1Rva2Vuczo6Y29uc3VtZSgkcmF3KTsKICAgICRyWydwZWVrXzMnXT1QZXRzaG9wX0FjdGlvbl9Ub2tlbnM6OnBlZWsoJHJhdyk7CiAgICAvLyBwYXNpYmFpZ2VzCiAgICAkcmF3MiA9IFBldHNob3BfQWN0aW9uX1Rva2Vuczo6Z2VuZXJhdGUoYXJyYXkoJ3B1cnBvc2UnPT4nY2FydF9yZWNvdmVyeScsJ3Jlc291cmNlX2lkJz0+J1JBV0VYUDEnLCd0dGxfc2Vjb25kcyc9PjYwKSk7CiAgICBnbG9iYWwgJHdwZGI7ICR0dD0kd3BkYi0+cHJlZml4Lidwc19hY3Rpb25fdG9rZW5zJzsKICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiVVBEQVRFICR0dCBTRVQgZXhwaXJlc19hdD0lcyBXSEVSRSByZXNvdXJjZV9pZD0lcyIsIGdtZGF0ZSgnWS1tLWQgSDppOnMnLHRpbWUoKS0zMDApLCdSQVdFWFAxJykpOwogICAgJHJbJ2V4cGlyZWRfcGVlayddPVBldHNob3BfQWN0aW9uX1Rva2Vuczo6cGVlaygkcmF3Mik7CiAgICAkclsnZXhwaXJlZF9jb25zdW1lJ109UGV0c2hvcF9BY3Rpb25fVG9rZW5zOjpjb25zdW1lKCRyYXcyKTsKICAgIC8vIERCIGJ1c2VuYQogICAgJHJbJ2RiJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcHVycG9zZSxyZXNvdXJjZV9pZCxzdGF0dXMsZXhwaXJlc19hdCx1c2VkX2F0IEZST00gJHR0IFdIRVJFIHJlc291cmNlX2lkIElOICgnUkFXVEVTVDEnLCdSQVdFWFAxJykiLCBBUlJBWV9BKTsKICAgICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00gJHR0IFdIRVJFIHJlc291cmNlX2lkIElOICgnUkFXVEVTVDEnLCdSQVdFWFAxJywnVEVTVENBUlQxMjMnLCdFWFBJUkVEMScpIik7CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfU0xBU0hFU3xKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSwgMSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Four Checks Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_t2=T2rw"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_t2=T2rw"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('tok2.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
