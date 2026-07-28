import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3JnMiddKSB8fCAkX0dFVFsncHNfcmcyJ10hPT0nUmcyeCcpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCk7CiAgJHJvd3M9JHdwZGItPnByZWZpeC4ncHNfZmVlZGluZ19yb3dzJzsKICAkbWFwPSR3cGRiLT5wcmVmaXguJ3BzX2ZlZWRpbmdfbWFwJzsKICAkb1snbWFwX3N0dWxwZWxpYWknXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00gJG1hcCIpOwogICRvWydlaWx1Y2l1X3Zpc28nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkcm93cyIpOwogICRvWydlaWx1Y2l1X3N1X3N2b3JpdSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRyb3dzIFdIRVJFIHdlaWdodF9mcm9tX2tnIElTIE5PVCBOVUxMIik7CiAgLy8ga29rcyBtYXAgc3R1bHBlbGlzIHJvZG8gaSBsZW50ZWxlCiAgJHRjb2w9bnVsbDsKICBmb3JlYWNoKCRvWydtYXBfc3R1bHBlbGlhaSddIGFzICRjKXsgaWYocHJlZ19tYXRjaCgnL3RhYmxlL2knLCRjKSkgJHRjb2w9JGM7IH0KICAkb1snbWFwX3RhYmxlX3N0dWxwZWxpcyddPSR0Y29sOwogIGlmKCEkdGNvbCl7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiAgJG9bJ3Byb2R1a3R1X3N1X2ludGVydmFsdSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVChESVNUSU5DVCBtLnByb2R1Y3RfaWQpIEZST00gJG1hcCBtCiAgICBKT0lOICRyb3dzIHIgT04gci5mZWVkaW5nX3RhYmxlX2lkPW0uYCR0Y29sYCBXSEVSRSBtLmlzX2FjdGl2ZT0xIEFORCByLndlaWdodF9mcm9tX2tnIElTIE5PVCBOVUxMIik7CiAgJG9bJ3Byb2R1a3R1X21hcF92aXNvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKERJU1RJTkNUIHByb2R1Y3RfaWQpIEZST00gJG1hcCBXSEVSRSBpc19hY3RpdmU9MSIpOwogICRwaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgcHJvZHVjdF9pZCBGUk9NICRtYXAgV0hFUkUgaXNfYWN0aXZlPTEgT1JERVIgQlkgUkFORCgpIExJTUlUIDgiKTsKICBmb3JlYWNoKCRwaWRzIGFzICRwaWQpewogICAgJHRpZD0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGAkdGNvbGAgRlJPTSAkbWFwIFdIRVJFIHByb2R1Y3RfaWQ9JWQgQU5EIGlzX2FjdGl2ZT0xIExJTUlUIDEiLCRwaWQpKTsKICAgICRyPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgTUlOKHdlaWdodF9mcm9tX2tnKSBtbiwgTUFYKHdlaWdodF90b19rZykgbXgsIENPVU5UKCopIGMKICAgICAgRlJPTSAkcm93cyBXSEVSRSBmZWVkaW5nX3RhYmxlX2lkPSVkIEFORCB3ZWlnaHRfZnJvbV9rZyBJUyBOT1QgTlVMTCIsJHRpZCksQVJSQVlfQSk7CiAgICAkcD13Y19nZXRfcHJvZHVjdCgkcGlkKTsKICAgICRvWydwYXZ5emR6aWFpJ11bXT1hcnJheSgnbic9PiRwP21iX3N1YnN0cigkcC0+Z2V0X25hbWUoKSwwLDQ0KTpudWxsLAogICAgICAnbWluX2tnJz0+JHJbJ21uJ10sJ21heF9rZyc9PiRyWydteCddLCdlaWx1Y2l1Jz0+KGludCkkclsnYyddKTsKICB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk --max-time 150 '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50e6,timeout:170000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const o={}; let sid=null;
try{
  const php = Buffer.from(PHPB64,'base64').toString('utf8');
  let mk=null;
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'RG2 '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  try{ const r=execSync('curl -sk --max-time 70 "https://dev.avesa.lt/?ps_rg2=Rg2x"',{maxBuffer:8e6,timeout:85000}).toString();
    const i=r.indexOf('{'),k=r.lastIndexOf('}'); if(i>=0&&k>i) o.result=JSON.parse(r.slice(i,k+1)); else o.raw=r.slice(0,300); }catch(e){ o.e=String(e).slice(0,150); }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('rg2.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
