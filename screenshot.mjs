import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2pvcyddKSB8fCAkX0dFVFsncHNfam9zJ10hPT0nSm9zeCcpIHJldHVybjsKICB3aGlsZShvYl9nZXRfbGV2ZWwoKSkgb2JfZW5kX2NsZWFuKCk7CiAgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgpOwogICRwaWQ9KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIHBvc3RfaWQgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBtZXRhX2tleT0nX3NrdScgQU5EIG1ldGFfdmFsdWU9J0pPUzA0MTInIExJTUlUIDEiKTsKICAkb1sncGlkJ109JHBpZDsKICAkcD13Y19nZXRfcHJvZHVjdCgkcGlkKTsgJG9bJ24nXT0kcD9tYl9zdWJzdHIoJHAtPmdldF9uYW1lKCksMCw2MCk6bnVsbDsKICAkbWFwPSR3cGRiLT5wcmVmaXguJ3BzX2ZlZWRpbmdfbWFwJzsgJHRhYnM9JHdwZGItPnByZWZpeC4ncHNfZmVlZGluZ190YWJsZXMnOyAkcm93cz0kd3BkYi0+cHJlZml4Lidwc19mZWVkaW5nX3Jvd3MnOwogIC8vIDEuIGFyIFlSQSBtYXAgaXJhc2FzIChiZXQga29raW9zIGJ1c2Vub3MpCiAgJG9bJ21hcF9pcmFzYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBmZWVkaW5nX3RhYmxlX2lkLGlzX2FjdGl2ZSBGUk9NICRtYXAgV0hFUkUgcHJvZHVjdF9pZD0lZCIsJHBpZCksQVJSQVlfQSk7CiAgLy8gMi4gYXIgYXByYXN5bWUgeXJhIHNlcmltbyBsZW50ZWxlCiAgJHBvc3Q9Z2V0X3Bvc3QoJHBpZCk7CiAgJGM9JHBvc3Q/JHBvc3QtPnBvc3RfY29udGVudDonJzsKICAkb1snYXByYXN5bW9faWxnaXMnXT1zdHJsZW4oJGMpOwogICRvWydhcHJhc3ltZV9zZXJpbWFzJ109KHN0cmlwb3MoJGMsJ8WhxJdyaW0nKSE9PWZhbHNlfHxzdHJpcG9zKCRjLCdzZXJpbScpIT09ZmFsc2V8fHN0cmlwb3MoJGMsJ25vcm1hJykhPT1mYWxzZSk7CiAgaWYoJG9bJ2FwcmFzeW1lX3NlcmltYXMnXSl7CiAgICAkaT1zdHJpcG9zKCRjLCfFocSXcmltJyk7IGlmKCRpPT09ZmFsc2UpICRpPXN0cmlwb3MoJGMsJ25vcm1hJyk7CiAgICAkb1snYXByYXN5bW9fZnJhZ21lbnRhcyddPW1iX3N1YnN0cihzdHJpcF90YWdzKHN1YnN0cigkYyxtYXgoMCwkaS0yMDApLDkwMCkpLDAsNjAwKTsKICB9CiAgJG9bJ2FwcmFzeW1lX2xlbnRlbGUnXT0oc3RyaXBvcygkYywnPHRhYmxlJykhPT1mYWxzZSk7CiAgLy8gMy4gYXIgeXJhIEpvc2VyYSBsZW50ZWxpdSBhcHNrcml0YWkKICAkb1snam9zZXJhX2xlbnRlbGVzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsYnJhbmQsbGluZSxzY29wZSxzcGVjaWVzLHN0YXR1cyBGUk9NICR0YWJzIFdIRVJFIGJyYW5kIExJS0UgJyVvc2VyJScgTElNSVQgMTAiLEFSUkFZX0EpOwogIC8vIDQuIGtpZWsgSm9zZXJhIHByb2R1a3R1IHR1cmkgbWFwCiAgJG9bJ2pvc2VyYV9zdV9tYXAnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgbS5wcm9kdWN0X2lkKSBGUk9NICRtYXAgbQogICAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBwbSBPTiBwbS5wb3N0X2lkPW0ucHJvZHVjdF9pZCBBTkQgcG0ubWV0YV9rZXk9J19za3UnIEFORCBwbS5tZXRhX3ZhbHVlIExJS0UgJ0pPUyUnIFdIRVJFIG0uaXNfYWN0aXZlPTEiKTsKICAkb1snam9zZXJhX3Zpc28nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBwbQogICAgSk9JTiB7JHdwZGItPnBvc3RzfSBwIE9OIHAuSUQ9cG0ucG9zdF9pZCBBTkQgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJwogICAgV0hFUkUgcG0ubWV0YV9rZXk9J19za3UnIEFORCBwbS5tZXRhX3ZhbHVlIExJS0UgJ0pPUyUnIik7CiAgLy8gNS4gYmVuZHJhcyB2YWl6ZGFzOiBraWVrIHB1Ymxpc2ggc2F1c28gbWFpc3RvIEJFIG1hcAogICRvWydzYXVzb19iZV9tYXAnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgcC5JRCkgRlJPTSB7JHdwZGItPnBvc3RzfSBwCiAgICBKT0lOIHskd3BkYi0+dGVybV9yZWxhdGlvbnNoaXBzfSB0ciBPTiB0ci5vYmplY3RfaWQ9cC5JRAogICAgSk9JTiB7JHdwZGItPnRlcm1fdGF4b25vbXl9IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZCBBTkQgdHQudGF4b25vbXk9J3Byb2R1Y3RfY2F0JwogICAgSk9JTiB7JHdwZGItPnRlcm1zfSB0IE9OIHQudGVybV9pZD10dC50ZXJtX2lkIEFORCB0LnNsdWcgTElLRSAnc2F1c2FzLW1haXN0YXMlJwogICAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJwogICAgICBBTkQgcC5JRCBOT1QgSU4gKFNFTEVDVCBwcm9kdWN0X2lkIEZST00gJG1hcCBXSEVSRSBpc19hY3RpdmU9MSkiKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
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
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'JOS '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  const r=execSync('curl -sk --max-time 80 "https://dev.avesa.lt/?ps_jos=Josx"',{maxBuffer:8e6,timeout:95000}).toString();
  const i=r.indexOf('{'),k=r.lastIndexOf('}');
  if(i>=0&&k>i){ try{ o.result=JSON.parse(r.slice(i,k+1)); }catch(e){ o.rawslice=r.slice(i,i+400); } }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('jos.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
