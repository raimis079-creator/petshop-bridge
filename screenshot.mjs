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
// pirma deaktyvuoti visus senus TEMP Cart Schema snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP Cart Schema/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgQ2FydCBTY2hlbWEgKyBDbGVhbnVwIHYxCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19zYyddKSB8fCAkX0dFVFsncHNfc2MnXSAhPT0gJ1NjOWsnICkgcmV0dXJuOwogICAgZ2xvYmFsICR3cGRiOyAkcj1hcnJheSgpOwogICAgJHA9V1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9zY2hlbWFzL2V2ZW50cy9jYXJ0X2FiYW5kb25lZC5zY2hlbWEuanNvbic7CiAgICAkclsnc2NoZW1hJ109ZmlsZV9leGlzdHMoJHApP2pzb25fZGVjb2RlKGZpbGVfZ2V0X2NvbnRlbnRzKCRwKSx0cnVlKTonbmVyYSc7CiAgICAvLyByZWdpc3RyeSBlbWl0IHBhcmFzYXMKICAgIGlmIChjbGFzc19leGlzdHMoJ1BldHNob3BfRXZlbnRfUmVnaXN0cnknKSkgewogICAgICAgICRtPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0V2ZW50X1JlZ2lzdHJ5JywnZW1pdCcpOwogICAgICAgICRwcz1hcnJheSgpOyBmb3JlYWNoKCRtLT5nZXRQYXJhbWV0ZXJzKCkgYXMgJHgpICRwc1tdPSckJy4keC0+Z2V0TmFtZSgpLigkeC0+aXNPcHRpb25hbCgpPyc9b3B0JzonJyk7CiAgICAgICAgJHJbJ2VtaXRfc2lnJ109aW1wbG9kZSgnLCAnLCRwcyk7CiAgICAgICAgJGxpbmVzPWZpbGUoJG0tPmdldEZpbGVOYW1lKCkpOwogICAgICAgICRyWydlbWl0X2hlYWQnXT1pbXBsb2RlKCcnLGFycmF5X3NsaWNlKCRsaW5lcywkbS0+Z2V0U3RhcnRMaW5lKCktMSxtaW4oMzAsJG0tPmdldEVuZExpbmUoKS0kbS0+Z2V0U3RhcnRMaW5lKCkrMSkpKTsKICAgIH0KICAgIC8vIHZhbG9tIGxpa3VzaWEgdGVzdGluZSBlaWx1dGUKICAgICRUPSR3cGRiLT5wcmVmaXguJ3BzX2NhcnRzJzsKICAgICRyWydjYXJ0c19iZWZvcmUnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBjYXJ0X2lkLGVtYWlsLHN0YXR1cyBGUk9NICRUIiwgQVJSQVlfQSk7CiAgICAkclsnZGVsZXRlZCddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSAkVCBXSEVSRSBjYXJ0X2lkPSdjX3BlcnNpc3RfdGVzdCciKTsKICAgICRyWydjYXJ0c19hZnRlciddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRUIik7CiAgICAvLyBjb252ZXJzaW9uIGthYmxpdWthaQogICAgJHJbJ2hvb2tzJ109YXJyYXkoCiAgICAgICd3b29jb21tZXJjZV9jaGVja291dF9vcmRlcl9wcm9jZXNzZWQnPT4xLAogICAgICAnd29vY29tbWVyY2Vfc3RvcmVfYXBpX2NoZWNrb3V0X29yZGVyX3Byb2Nlc3NlZCc9PjEsCiAgICAgICd3b29jb21tZXJjZV9uZXdfb3JkZXInPT4xLAogICAgKTsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Cart Schema Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_sc=Sc9k"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_sc=Sc9k"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('sch.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
