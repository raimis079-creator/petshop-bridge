const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfZHBmaW5kJ10pfHwkX0dFVFsncHNfZHBmaW5kJ10hPT0nUzJLdzhOeCcpe3JldHVybjt9CglAc2V0X3RpbWVfbGltaXQoNTApOwoJZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsgJG91dD1hcnJheSgpOwoJLy8gc25pcHBldHMgY29udGFpbmluZyBEUCBmb3JtIG1hcmtlcnMKCSRzbmlwcz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSxMRU5HVEgoY29kZSkgbGVuIEZST00geyRwZn1zbmlwcGV0cyBXSEVSRSBjb2RlIExJS0UgJyVwZXRzaG9wLWRwLWZvcm1hJScgT1IgY29kZSBMSUtFICclZHAtZm9ybWElJyBPUiBjb2RlIExJS0UgJyVEYXVnaWF1PXBpZ2lhdSUnIE9SIGNvZGUgTElLRSAnJURQIHBha2FzJScgT1IgbmFtZSBMSUtFICclcGlnaWF1JScgT1IgbmFtZSBMSUtFICclRFAgJScgT1IgbmFtZSBMSUtFICclcmlua2luJSciLEFSUkFZX0EpOwoJJG91dFsnc25pcHBldHMnXT0kc25pcHM7CgkvLyBwbHVnaW5zIGFjdGl2ZSAobWF5YmUgcGV0c2hvcC1kcCBwbHVnaW4pCgkkYWN0aXZlPWdldF9vcHRpb24oJ2FjdGl2ZV9wbHVnaW5zJyk7Cgkkb3V0WydwZXRzaG9wX3BsdWdpbnMnXT1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKCRhY3RpdmUsZnVuY3Rpb24oJHApe3JldHVybiBzdHJpcG9zKCRwLCdwZXRzaG9wJykhPT1mYWxzZXx8c3RyaXBvcygkcCwnZHAnKSE9PWZhbHNlfHxzdHJpcG9zKCRwLCdwaWdpYXUnKSE9PWZhbHNlO30pKTsKCS8vIGFkbWluIHBhZ2UgaG9vayBjaGVjazogaXMgdGhlcmUgYSBtZW51IHJlZ2lzdGVyZWQ/Cgkkb3V0Wydub3RlJ109J2llc2thdSBrdXIgcmVnaXN0cnVvamFtYXMgcGFnZT1wZXRzaG9wLWRwLWZvcm1hJzsKCS8vIG1ldGEga2V5cyB1c2VkIGJ5IERQIChzYW1wbGUgYSBEUCBwcm9kdWN0IGlmIGV4aXN0cykKCSRkcD0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIHBvc3RfaWQgRlJPTSB7JHBmfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSdfc2t1JyBBTkQgbWV0YV92YWx1ZSBMSUtFICdEUC0lJyBMSU1JVCAzIik7Cgkkb3V0WydkcF9zYW1wbGVfcGlkcyddPSRkcDsKCWlmKCRkcCl7ICRtaz0kd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIERJU1RJTkNUIG1ldGFfa2V5IEZST00geyRwZn1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPSVkIEFORCBtZXRhX2tleSBMSUtFICdcXyUnIiwkZHBbMF0pKTsgJG91dFsnZHBfbWV0YV9rZXlzJ109JG1rOyB9CgllY2hvIGpzb25fZW5jb2RlKCRvdXQpOyBleGl0Owp9KTsK';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wbody.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wbody.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024,timeout:60000}).toString();}
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2'); }return 'fail';}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'DPFIND (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
o.d=(function(){try{const r=execSync('curl -sk --max-time 45 '+AUTH+' "https://dev.avesa.lt/?ps_dpfind=S2Kw8Nx"',{maxBuffer:20*1024*1024,timeout:55000}).toString();const i=r.indexOf('{');return JSON.parse(r.slice(i));}catch(e){return {err:String(e).slice(0,220)};}})();
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
console.log('PUT:',pr('dpfind.json',o));
