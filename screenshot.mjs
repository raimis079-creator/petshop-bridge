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
// pirma deaktyvuoti visus senus TEMP S313 Recon snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP S313 Recon/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzMxMyBSZWNvbiB2MQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfcjEzJ10pIHx8ICRfR0VUWydwc19yMTMnXSAhPT0gJ1IxM3gnICkgcmV0dXJuOwogICAgJHI9YXJyYXkoKTsKICAgIC8vIDEpIGt1ciBtaW5ldGkgYmVuZHJpbmlhaSB0cmFja2luZyBsaW5rYWkKICAgICRuZWVkbGVzID0gYXJyYXkoJ3ZlbmlwYWsuY29tL2x0L3NpdW50b3Mtc2VraW1hcycsJ3Bvc3QubHQvc2l1bnR1LXNla2ltYXMnLCdTaXVudG9zIHNla2ltYXMnKTsKICAgICRoaXRzPWFycmF5KCk7CiAgICAkZGlycyA9IGFycmF5KAogICAgICAgIGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLAogICAgICAgIGdldF90ZW1wbGF0ZV9kaXJlY3RvcnkoKSwKICAgICAgICBXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlJywKICAgICAgICBXUF9QTFVHSU5fRElSLicvcGV0c2hvcC14bWwnLAogICAgICAgIFdQTVVfUExVR0lOX0RJUiwKICAgICk7CiAgICBmb3JlYWNoICgkZGlycyBhcyAkZCkgewogICAgICAgIGlmICghaXNfZGlyKCRkKSkgY29udGludWU7CiAgICAgICAgJHJpaT1uZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGQsIEZpbGVzeXN0ZW1JdGVyYXRvcjo6U0tJUF9ET1RTKSk7CiAgICAgICAgZm9yZWFjaCAoJHJpaSBhcyAkZikgewogICAgICAgICAgICBpZiAoISRmLT5pc0ZpbGUoKSkgY29udGludWU7CiAgICAgICAgICAgICRleHQ9c3RydG9sb3dlcihwYXRoaW5mbygkZi0+Z2V0RmlsZW5hbWUoKSxQQVRISU5GT19FWFRFTlNJT04pKTsKICAgICAgICAgICAgaWYgKCFpbl9hcnJheSgkZXh0LGFycmF5KCdwaHAnLCdodG1sJyksdHJ1ZSkpIGNvbnRpbnVlOwogICAgICAgICAgICAkYz1AZmlsZV9nZXRfY29udGVudHMoJGYtPmdldFBhdGhuYW1lKCkpOwogICAgICAgICAgICBpZiAoJGM9PT1mYWxzZSkgY29udGludWU7CiAgICAgICAgICAgIGZvcmVhY2ggKCRuZWVkbGVzIGFzICRuKSB7CiAgICAgICAgICAgICAgICBpZiAoc3RyaXBvcygkYywkbikhPT1mYWxzZSkgewogICAgICAgICAgICAgICAgICAgICRoaXRzW3N0cl9yZXBsYWNlKEFCU1BBVEgsJycsJGYtPmdldFBhdGhuYW1lKCkpXVtdPSRuOwogICAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CiAgICAgICAgfQogICAgfQogICAgJHJbJ2ZpbGVfaGl0cyddPSRoaXRzOwoKICAgIC8vIDIpIENvZGUgU25pcHBldHMgc3UgdGFpcyBwYcSNaWFpcyB0ZWtzdGFpcwogICAgZ2xvYmFsICR3cGRiOwogICAgJHN0PSR3cGRiLT5wcmVmaXguJ3NuaXBwZXRzJzsKICAgIGlmICgkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAnJHN0JyIpKSB7CiAgICAgICAgJHJbJ3NuaXBwZXRzJ109JHdwZGItPmdldF9yZXN1bHRzKAogICAgICAgICAgIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSBGUk9NICRzdCBXSEVSRSBjb2RlIExJS0UgJyVzaXVudG9zLXNla2ltYXMlJyBPUiBjb2RlIExJS0UgJyVTaXVudG9zIHNla2ltYXMlJyBPUiBjb2RlIExJS0UgJyVzaXVudHUtc2VraW1hcyUnIiwgQVJSQVlfQSk7CiAgICB9CiAgICAvLyAzKSBXQyBlbWFpbCBzYWJsb25haSB0ZW1vamUKICAgICR0aD1nZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKS4nL3dvb2NvbW1lcmNlL2VtYWlscy8nOwogICAgJHJbJ3RoZW1lX2VtYWlscyddPWlzX2RpcigkdGgpP2FycmF5X21hcCgnYmFzZW5hbWUnLChhcnJheSlnbG9iKCR0aC4nKi5waHAnKSk6J25lcmEnOwogICAgLy8gNCkgbG9nb3RpcGFzCiAgICAkaW1nPWdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX2VtYWlsX2hlYWRlcl9pbWFnZScpOwogICAgJHJbJ2hlYWRlcl9pbWFnZSddPSRpbWc7CiAgICAkclsnYXR0YWNobWVudF9pZCddPSRpbWc/YXR0YWNobWVudF91cmxfdG9fcG9zdGlkKCRpbWcpOjA7CiAgICBpZiAoISRyWydhdHRhY2htZW50X2lkJ10gJiYgJGltZykgewogICAgICAgIC8vIGJhbmRvbSBwZXIgaHR0cHMgdmFyaWFudGEKICAgICAgICAkclsnYXR0YWNobWVudF9pZCddPWF0dGFjaG1lbnRfdXJsX3RvX3Bvc3RpZChzdHJfcmVwbGFjZSgnaHR0cDovLycsJ2h0dHBzOi8vJywkaW1nKSk7CiAgICB9CiAgICBpZiAoJHJbJ2F0dGFjaG1lbnRfaWQnXSkgewogICAgICAgICRyWydhdHRhY2htZW50X3VybF9ub3cnXT13cF9nZXRfYXR0YWNobWVudF9pbWFnZV91cmwoJHJbJ2F0dGFjaG1lbnRfaWQnXSwnZnVsbCcpOwogICAgfQogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S313 Recon Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_r13=R13x"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_r13=R13x"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('rec13.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
