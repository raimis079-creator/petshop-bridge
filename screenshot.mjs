import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2ZsJ10pIHx8ICRfR0VUWydwc19mbCddIT09J0ZseCcpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCk7CiAgJG9bJ3ByaWVzJ109Z2V0X29wdGlvbigncGV0c2hvcF9zdWdnZXN0aW9uc19lbmFibGVkJywgJyhORUJVVk8gTlVTVEFUWVRBKScpOwogIC8vIGFpc2tpYWkgaWp1bmdpYW0KICB1cGRhdGVfb3B0aW9uKCdwZXRzaG9wX3N1Z2dlc3Rpb25zX2VuYWJsZWQnLCcxJyk7CiAgJG9bJ3BvJ109Z2V0X29wdGlvbigncGV0c2hvcF9zdWdnZXN0aW9uc19lbmFibGVkJyk7CgogIC8vIFRFU1RBUzogYXIgdmVpa2lhIEtJVElFTVMgdmFydG90b2phbXMsIG5lIHRpayBhZG1pbgogICR0PSR3cGRiLT5wcmVmaXguJ3BzX3BldHMnOwogICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHVzZXJfaWQscGV0X25hbWUsc3BlY2llcyBGUk9NICR0CiAgICBXSEVSRSBzcGVjaWVzIElOICgnZG9nJywnY2F0JykgQU5EIGRlbGV0ZWRfYXQgSVMgTlVMTCBHUk9VUCBCWSB1c2VyX2lkIE9SREVSIEJZIHVzZXJfaWQgQVNDIExJTUlUIDUiKTsKICBmb3JlYWNoKCRyb3dzIGFzICRwKXsKICAgIHdwX3NldF9jdXJyZW50X3VzZXIoKGludCkkcC0+dXNlcl9pZCk7CiAgICAkcj1uZXcgV1BfUkVTVF9SZXF1ZXN0KCdHRVQnKTsgJHItPnNldF9wYXJhbSgnaWQnLCRwLT5pZCk7CiAgICAkcmVzPVBldHNob3BfTThfRm9vZDo6c3VnZ2VzdGlvbnMoJHIpOwogICAgJGQ9aXNfd3BfZXJyb3IoJHJlcyk/YXJyYXkoJ2Vycic9PiRyZXMtPmdldF9lcnJvcl9tZXNzYWdlKCkpOiRyZXMtPmdldF9kYXRhKCk7CiAgICAkb1sndGVzdGFpJ11bXT1hcnJheSgKICAgICAgJ3VzZXJfaWQnPT4oaW50KSRwLT51c2VyX2lkLAogICAgICAncGV0Jz0+JHAtPnBldF9uYW1lLAogICAgICAncnVzaXMnPT4kcC0+c3BlY2llcywKICAgICAgJ3JhZG8nPT5pc3NldCgkZFsncmVzdWx0cyddKT9jb3VudCgkZFsncmVzdWx0cyddKTowLAogICAgICAna2xhaWRhJz0+aXNzZXQoJGRbJ2VyciddKT8kZFsnZXJyJ106bnVsbCwKICAgICk7CiAgfQogIC8vIGtva2lvcyBydXN5cyBhcHNrcml0YWkgdHVyaSBhdWdpbnRpbml1CiAgJG9bJ3J1c3lzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgc3BlY2llcywgQ09VTlQoKikgYyBGUk9NICR0IFdIRVJFIGRlbGV0ZWRfYXQgSVMgTlVMTCBHUk9VUCBCWSBzcGVjaWVzIixBUlJBWV9BKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
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
  for(let a=0;a<2;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'FL (t)',code:php,scope:'front-end',active:true,priority:5}); break; }catch(e){ execSync('sleep 5'); } }
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  try{ const r=execSync('curl -sk --max-time 80 "https://dev.avesa.lt/?ps_fl=Flx"',{maxBuffer:8e6,timeout:95000}).toString();
    const i=r.indexOf('{'),k=r.lastIndexOf('}'); if(i>=0&&k>i) o.result=JSON.parse(r.slice(i,k+1)); else o.raw=r.slice(0,300); }catch(e){ o.e=String(e).slice(0,150); }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('fl.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
