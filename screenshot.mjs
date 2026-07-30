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
// pirma deaktyvuoti visus senus TEMP Consent Default snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP Consent Default/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgQ29uc2VudCBEZWZhdWx0IENoZWNrIHYxCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19jcyddKSB8fCAkX0dFVFsncHNfY3MnXSAhPT0gJ0NzNHQnICkgcmV0dXJuOwogICAgZ2xvYmFsICR3cGRiOyAkcj1hcnJheSgpOwogICAgLy8gZnVua2Npam9zIHJlYWxpemFjaWphCiAgICAkZj1uZXcgUmVmbGVjdGlvbkZ1bmN0aW9uKCdwc19nZXRfbWFya2V0aW5nX2NvbnNlbnQnKTsKICAgICRmaWxlPSRmLT5nZXRGaWxlTmFtZSgpOyAkcz0kZi0+Z2V0U3RhcnRMaW5lKCk7ICRlPSRmLT5nZXRFbmRMaW5lKCk7CiAgICAkbGluZXM9ZmlsZSgkZmlsZSk7CiAgICAkclsnaW1wbCddPWltcGxvZGUoJycsYXJyYXlfc2xpY2UoJGxpbmVzLCRzLTEsJGUtJHMrMSkpOwogICAgJHJbJ2ZpbGUnXT1zdHJfcmVwbGFjZShBQlNQQVRILCcnLCRmaWxlKTsKICAgIC8vIENvbnNlbnRfTG9nOjpnZXQgcmVhbGl6YWNpamEgamVpIGt2aWVjaWEKICAgIGlmIChjbGFzc19leGlzdHMoJ1BldHNob3BfQ29uc2VudF9Mb2cnKSAmJiBtZXRob2RfZXhpc3RzKCdQZXRzaG9wX0NvbnNlbnRfTG9nJywnZ2V0X2NvbnNlbnQnKSkgewogICAgICAgICRtPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0NvbnNlbnRfTG9nJywnZ2V0X2NvbnNlbnQnKTsKICAgICAgICAkbGluZXMyPWZpbGUoJG0tPmdldEZpbGVOYW1lKCkpOwogICAgICAgICRyWydsb2dfaW1wbCddPWltcGxvZGUoJycsYXJyYXlfc2xpY2UoJGxpbmVzMiwkbS0+Z2V0U3RhcnRMaW5lKCktMSwkbS0+Z2V0RW5kTGluZSgpLSRtLT5nZXRTdGFydExpbmUoKSsxKSk7CiAgICB9CiAgICAvLyBmYWt0aW5lIHBhdGlrcmEgc3UgVElLUkFJIG5hdWphaXMgYWRyZXNhaXMKICAgICRyWydmcmVzaCddPWFycmF5KCk7CiAgICBmb3JlYWNoIChhcnJheSgnenp6LWZyZXNoLTFAZXhhbXBsZS5jb20nLCd6enotZnJlc2gtMkBleGFtcGxlLmNvbScpIGFzICR4KSB7CiAgICAgICAgJHJbJ2ZyZXNoJ11bJHhdPWFycmF5KAogICAgICAgICAgJ2NvbnNlbnQnPT5wc19nZXRfbWFya2V0aW5nX2NvbnNlbnQoJHgpPzE6MCwKICAgICAgICAgICdwb2xpY3knPT5QZXRzaG9wX0NvbnRhY3RfUG9saWN5Ojpjb21wdXRlKCR4KT8ndHJ1ZSc6J2ZhbHNlJywKICAgICAgICApOwogICAgfQogICAgLy8gYXIgY29uc2VudCBsZW50ZWxlamUgeXJhIGlyYXN1CiAgICAkY3Q9JHdwZGItPnByZWZpeC4ncHNfY29uc2VudF9sb2cnOwogICAgJHJbJ2NvbnNlbnRfcm93cyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRjdCIpOwogICAgJHJbJ2NvbnNlbnRfc2FtcGxlJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZW1haWwsY29uc2VudCxzb3VyY2UsY3JlYXRlZF9hdCBGUk9NICRjdCBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDUiLCBBUlJBWV9BKTsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Consent Default Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_cs=Cs4t"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_cs=Cs4t"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('cs.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
