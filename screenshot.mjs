const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfY212J10pfHwkX0dFVFsncHNfY212J10hPT0nUzJLdzhOeCcpe3JldHVybjt9CglAc2V0X3RpbWVfbGltaXQoOTApOwoJZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoKTsKCS8vIHJlYWxpb3MgbGlmZXN0eWxlL2FjdGl2aXR5X2xldmVsIHJlaWtzbWVzIGZlZWRpbmdfcm93cyBjb25kaXRpb25zCgkkcm93cz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIGNvbmRpdGlvbnMgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfcm93cyBXSEVSRSBjb25kaXRpb25zIElTIE5PVCBOVUxMIEFORCBjb25kaXRpb25zPD4nJyBBTkQgY29uZGl0aW9uczw+J1tdJyBMSU1JVCAzMDAiKTsKCSR2YWxzPWFycmF5KCk7Cglmb3JlYWNoKCRyb3dzIGFzICRjKXsKCQkkZD1qc29uX2RlY29kZSgkYyx0cnVlKTsKCQlpZihpc19hcnJheSgkZCkpeyBmb3JlYWNoKCRkIGFzICRrPT4kdil7IGlmKGluX2FycmF5KCRrLGFycmF5KCdhZ2VfbV9mcm9tJywnYWdlX21fdG8nKSkpY29udGludWU7IGlmKCR2PT09bnVsbHx8JHY9PT0nJyljb250aW51ZTsgJHZhbHNbJGtdWyhzdHJpbmcpJHZdPSgkdmFsc1ska11bKHN0cmluZykkdl0/PzApKzE7IH0gfQoJfQoJJG9bJ2NvbmRpdGlvbl92YWx1ZXMnXT0kdmFsczsKCS8vIGtpZWsgZmVlZGluZyBsZW50ZWxpdSBpcyB2aXNvIHZzIGtpZWsgc3UgY29uZGl0aW9uIGRpbXMKCSRvWyd0b3RhbF9mZWVkaW5nX3RhYmxlcyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcGZ9cHNfZmVlZGluZ190YWJsZXMgV0hFUkUgc3RhdHVzPSdhY3RpdmUnIik7CgkvLyBhciBwc19wZXRzIHR1cmkgYWN0aXZpdHkvbGlmZXN0eWxlIHNhbXByYXRhaSBhcnRpbWEgbGF1a2E/IHByaW1hcnlfbmVlZCByZWlrc21lcwoJJHBuPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgRElTVElOQ1QgcHJpbWFyeV9uZWVkIEZST00geyRwZn1wc19wZXRzIFdIRVJFIHByaW1hcnlfbmVlZCBJUyBOT1QgTlVMTCBBTkQgcHJpbWFyeV9uZWVkPD4nJyIpOwoJJG9bJ3BzX3BldHNfcHJpbWFyeV9uZWVkX3ZhbHVlcyddPSRwbjsKCSRscz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIERJU1RJTkNUIGxpZmVfc3RhZ2UgRlJPTSB7JHBmfXBzX3BldHMgV0hFUkUgbGlmZV9zdGFnZSBJUyBOT1QgTlVMTCBBTkQgbGlmZV9zdGFnZTw+JyciKTsKCSRvWydwc19wZXRzX2xpZmVfc3RhZ2VfdmFsdWVzJ109JGxzOwoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){const b=Buffer.from(JSON.stringify(body)).toString('base64');
  return execSync('echo '+b+'|base64 -d|curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" -d @- "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024}).toString();}
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'CMV (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
o.v=(function(){const r=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/?ps_cmv=S2Kw8Nx"',{maxBuffer:20*1024*1024}).toString();const i=r.indexOf('{');try{return JSON.parse(r.slice(i));}catch(e){return {raw:r.slice(0,300)};}})();
if(sid) wj('POST','code-snippets/v1/snippets/'+sid,{active:false});
console.log('PUT:',pr('cmval.json',o));
