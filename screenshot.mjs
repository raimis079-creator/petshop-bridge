import { execSync } from 'child_process';
import fs from 'fs';
const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3NjaDInXSkgfHwgJF9HRVRbJ3BzX3NjaDInXSE9PSdTZDI0eCcpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgpOwogICRvWyd0MjQzJ109JHdwZGItPmdldF9yb3coIlNFTEVDVCAqIEZST00geyRwZn1wc19mZWVkaW5nX3RhYmxlcyBXSEVSRSBpZD0yNDMiLEFSUkFZX0EpOwogIHVuc2V0KCRvWyd0MjQzJ11bJ3Jvd3NfYmFja3VwX2pzb24nXSk7CiAgJHI9JHdwZGItPmdldF9yb3coIlNFTEVDVCAqIEZST00geyRwZn1wc19mZWVkaW5nX3Jvd3MgV0hFUkUgY29uZGl0aW9uX2RpbWVuc2lvbnMgSVMgTk9UIE5VTEwgQU5EIGNvbmRpdGlvbl9kaW1lbnNpb25zPD4nJyBMSU1JVCAxIixBUlJBWV9BKTsKICAkb1snY29uZF9yb3cnXT0kcjsKICBpZigkcil7ICRvWydjb25kX3RibCddPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgaWQsYnJhbmQsbGluZSxzY29wZSxzcGVjaWVzLHJvd19kaW1lbnNpb24sc2hhcGUsc3RhdHVzLGxvb2t1cF9tZXRob2QscmVzb2x1dGlvbl9wb2xpY3ksYXhpc19yZXNvbHV0aW9uX3BvbGljeSxiX3BhdGhfc3RhdHVzLHNvdXJjZV9zdHJ1Y3R1cmUsdmFsdWVfcm93X2NvdW50LHJvd19jb3VudCBGUk9NIHskcGZ9cHNfZmVlZGluZ190YWJsZXMgV0hFUkUgaWQ9JWQiLCRyWydmZWVkaW5nX3RhYmxlX2lkJ10pLEFSUkFZX0EpOwogICAgJG9bJ2NvbmRfcm93c19hbGwnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCB3ZWlnaHRfZnJvbV9rZyx3ZWlnaHRfdG9fa2csYW1vdW50X2Zyb21fZyxhbW91bnRfdG9fZyxjb25kaXRpb25fZGltZW5zaW9ucyxjb25kaXRpb25fcmF3LGNlbGxfdHlwZSBGUk9NIHskcGZ9cHNfZmVlZGluZ19yb3dzIFdIRVJFIGZlZWRpbmdfdGFibGVfaWQ9JWQgT1JERVIgQlkgcm93X29yZGVyIExJTUlUIDYiLCRyWydmZWVkaW5nX3RhYmxlX2lkJ10pLEFSUkFZX0EpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'SCH2 (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
execSync('sleep 3');
let r='';
try{ r=execSync('curl -sk "https://dev.avesa.lt/?ps_sch2=Sd24x"',{maxBuffer:100*1024*1024,timeout:90000}).toString(); }catch(e){ r='ERR '+String(e).slice(0,200); }
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('sch2.json', Buffer.from(r).toString('base64'));
console.log('done', r.length);
