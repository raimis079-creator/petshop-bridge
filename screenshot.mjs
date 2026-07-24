import { execSync } from 'child_process';
import fs from 'fs';
const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3NwJ10pIHx8ICRfR0VUWydwc19zcCddIT09J1NwMjR4JykgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCk7CiAgZm9yZWFjaChhcnJheSgxNjg1NCwxNDcxNSwxNDI4MSwxNDc5MSwxNzI4MykgYXMgJHBpZCl7CiAgICAkdGlkPShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBmZWVkaW5nX3RhYmxlX2lkIEZST00geyRwZn1wc19mZWVkaW5nX21hcCBXSEVSRSBwcm9kdWN0X2lkPSVkIEFORCBpc19hY3RpdmU9MSIsJHBpZCkpOwogICAgaWYoISR0aWQpIGNvbnRpbnVlOwogICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1Qgd2VpZ2h0X2Zyb21fa2csd2VpZ2h0X3RvX2tnLGFtb3VudF9mcm9tX2csYW1vdW50X3RvX2csY29uZGl0aW9uX3JhdyBGUk9NIHskcGZ9cHNfZmVlZGluZ19yb3dzIFdIRVJFIGZlZWRpbmdfdGFibGVfaWQ9JWQgT1JERVIgQlkgcm93X29yZGVyIExJTUlUIDkiLCR0aWQpLEFSUkFZX0EpOwogICAgJG49KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00geyRwZn1wc19mZWVkaW5nX3Jvd3MgV0hFUkUgZmVlZGluZ190YWJsZV9pZD0lZCIsJHRpZCkpOwogICAgJG9bXT1hcnJheSgncGlkJz0+JHBpZCwndCc9Pmh0bWxfZW50aXR5X2RlY29kZShnZXRfdGhlX3RpdGxlKCRwaWQpKSwndXJsJz0+Z2V0X3Blcm1hbGluaygkcGlkKSwndGlkJz0+JHRpZCwnbic9PiRuLCdyb3dzJz0+JHJvd3MpOwogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024,timeout:70000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50*1024*1024}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50*1024*1024}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2');}return 'fail';}
const mk=wj('POST','code-snippets/v1/snippets',{name:'SP (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
execSync('sleep 3');
let r='';
try{ r=execSync('curl -sk "https://dev.avesa.lt/?ps_sp=Sp24x"',{maxBuffer:100*1024*1024,timeout:90000}).toString(); }catch(e){ r='ERR '+String(e).slice(0,200); }
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('sp.json', Buffer.from(r).toString('base64'));
console.log('done', r.length);
