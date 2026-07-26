import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2NsJ10pIHx8ICRfR0VUWydwc19jbCddIT09J0NsMTUweCcpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICR0PSR3cGRiLT5wcmVmaXguJ3BzX3BldHMnOyAkbz1hcnJheSgpOwogICRvWydwcmllcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHBldF9uYW1lLGlzX3Rlc3QgRlJPTSAkdCBXSEVSRSBwZXRfbmFtZSBJTiAoJ1paVEVTVCcsJ1paVEVTVFBOJykiLEFSUkFZX0EpOwogICRvWydpc3RyaW50YSddPSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00gJHQgV0hFUkUgcGV0X25hbWUgSU4gKCdaWlRFU1QnLCdaWlRFU1RQTicpIik7CiAgJG9bJ2lzX3Rlc3RfMF9saWtvJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQscGV0X25hbWUsdXNlcl9pZCBGUk9NICR0IFdIRVJFIGlzX3Rlc3Q9MCIsQVJSQVlfQSk7CiAgJG9bJ2lzX3Rlc3RfMSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0IFdIRVJFIGlzX3Rlc3Q9MSIpOwogICRvWyd2aXNvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHQiKTsKICAkb1snYWt0eXZ1cyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0IFdIRVJFIGRlbGV0ZWRfYXQgSVMgTlVMTCIpOwogICRvWydwcmltYXJ5X25lZWRfcGFzaXNraXJzdHltYXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRk5VTEwocHJpbWFyeV9uZWVkLCdOVUxMJykgdixDT1VOVCgqKSBjIEZST00gJHQgV0hFUkUgZGVsZXRlZF9hdCBJUyBOVUxMIEdST1VQIEJZIHByaW1hcnlfbmVlZCBPUkRFUiBCWSBjIERFU0MiLEFSUkFZX0EpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50e6,timeout:70000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2');}return 'fail';}
const o={}; let sid=null;
try{
  const php = Buffer.from(PHPB64,'base64').toString('utf8');
  const mk=wj('POST','code-snippets/v1/snippets',{name:'CL150 (temp)',code:php,scope:'front-end',active:true,priority:5});
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_cl=Cl150x"',{maxBuffer:5e6,timeout:60000}).toString();
  const a=r.indexOf('{'),b=r.lastIndexOf('}');
  try{ o.result=JSON.parse(r.slice(a,b+1)); }catch(e){ o.raw=r.slice(0,250); }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('clean150.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
