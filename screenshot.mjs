const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfZnJ6J10pfHwkX0dFVFsncHNfZnJ6J10hPT0nUzJLdzhOeCcpe3JldHVybjt9CglAc2V0X3RpbWVfbGltaXQoNjApOyBnbG9iYWwgJHdwZGI7JHBmPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCk7Cgkkb1snZnJlZXplX3NyYyddPUBmaWxlX2dldF9jb250ZW50cyhXUF9DT05URU5UX0RJUi4nL211LXBsdWdpbnMvcGV0c2hvcC1wcy1wZXRzLW1pZ3JhdGlvbi1mcmVlemUucGhwJyk7Cgkkb1snY29scyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JHBmfXBzX3BldHMiKTsKCSRvWydoYXNfYWN0aXZpdHlfaGludCddPWluX2FycmF5KCdhY3Rpdml0eV9oaW50Jywkb1snY29scyddLHRydWUpOwoJJG9bJ2NvdW50J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwZn1wc19wZXRzIik7Cgkkb1snZW5naW5lJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBFTkdJTkUgRlJPTSBpbmZvcm1hdGlvbl9zY2hlbWEuVEFCTEVTIFdIRVJFIFRBQkxFX1NDSEVNQT1EQVRBQkFTRSgpIEFORCBUQUJMRV9OQU1FPSd7JHBmfXBzX3BldHMnIik7CgkvLyBlc2FtaSBiYWsgbGVudGVsxJdzCgkkb1snYmFrX3RhYmxlcyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIFRBQkxFUyBMSUtFICd7JHBmfXBzX3BldHMlYmFrJSciKTsKCS8vIGtlbGkgc2FtcGxlIHJvd3MgKGlkICsga2VsaWUgbGF1a2FpKSDigJQgcGFseWdpbmltdWkgcG8gbWlncmFjaWpvcwoJJG9bJ3NhbXBsZSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHBldF9uYW1lLHNwZWNpZXMsY3VycmVudF93ZWlnaHRfa2csc3RhdHVzLHVwZGF0ZWRfYXQgRlJPTSB7JHBmfXBzX3BldHMgT1JERVIgQlkgaWQgTElNSVQgNSIsQVJSQVlfQSk7CgllY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'FRZ (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){o.mkerr=String(mk).slice(0,200);}
o.d=(function(){try{const r=execSync('curl -sk --max-time 50 '+AUTH+' "https://dev.avesa.lt/?ps_frz=S2Kw8Nx"',{maxBuffer:10*1024*1024,timeout:55000}).toString();const i=r.indexOf('{');return i>=0?JSON.parse(r.slice(i)):{raw:r.slice(0,400)};}catch(e){return{err:String(e).slice(0,200)};}})();
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
console.log('PUT:',pr('frz.json',o));
