import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2FnciddKSB8fCAkX0dFVFsncHNfYWdyJ10hPT0nQWdyeCcpIHJldHVybjsKICB3aGlsZShvYl9nZXRfbGV2ZWwoKSkgb2JfZW5kX2NsZWFuKCk7CiAgZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoKTsKICAkUj0kcGYuJ3BzX2ZlZWRpbmdfcm93cyc7ICRUPSRwZi4ncHNfZmVlZGluZ190YWJsZXMnOyAkTT0kcGYuJ3BzX2ZlZWRpbmdfbWFwJzsKICAvLyAxLiBrb2tpb3MgUkVJS1NNRVMgbmF1ZG9qYW1vcyBhZ2VfcmFuZ2UKICAkb1snYWdlX3JhbmdlX3JlaWtzbWVzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgY29uZGl0aW9uX2RpbWVuc2lvbnMgY2QsIENPVU5UKCopIGMKICAgIEZST00gJFIgV0hFUkUgY29uZGl0aW9uX2RpbWVuc2lvbnMgTElLRSAnJWFnZV9yYW5nZSUnIEdST1VQIEJZIGNvbmRpdGlvbl9kaW1lbnNpb25zIE9SREVSIEJZIGMgREVTQyBMSU1JVCAyMCIsQVJSQVlfQSk7CiAgLy8gMi4gcGFseWdpbmltdWkg4oCUIGthaXAgYXRyb2RvIFBBTEFJS09NQVMgYWdlX21fZnJvbS90bwogICRvWydhZ2VfbV9yZWlrc21lcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGNvbmRpdGlvbl9kaW1lbnNpb25zIGNkLCBDT1VOVCgqKSBjCiAgICBGUk9NICRSIFdIRVJFIGNvbmRpdGlvbl9kaW1lbnNpb25zIExJS0UgJyVhZ2VfbV9mcm9tJScgR1JPVVAgQlkgY29uZGl0aW9uX2RpbWVuc2lvbnMgT1JERVIgQlkgYyBERVNDIExJTUlUIDgiLEFSUkFZX0EpOwogIC8vIDMuIHBhdnl6ZGluZSBhZ2VfcmFuZ2UgbGVudGVsZSBzdSBlaWx1dGVtaXMKICAkdGlkPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCB0LmlkIEZST00gJFQgdCBKT0lOICRSIHIgT04gci5mZWVkaW5nX3RhYmxlX2lkPXQuaWQKICAgIFdIRVJFIHIuY29uZGl0aW9uX2RpbWVuc2lvbnMgTElLRSAnJWFnZV9yYW5nZSUnIEFORCB0LnN0YXR1cz0ndmVyaWZpZWQnIEFORCB0LmlzX2FjdGl2ZT0xCiAgICBHUk9VUCBCWSB0LmlkIE9SREVSIEJZIENPVU5UKCopIERFU0MgTElNSVQgMSIpOwogICRvWydwdnpfdGlkJ109JHRpZDsKICBpZigkdGlkKXsKICAgICRvWydwdnpfbGVudGVsZSddPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgYnJhbmQsbGluZSxzcGVjaWVzLHNjb3BlLHNoYXBlLGxvb2t1cF9tZXRob2Qscm93X2RpbWVuc2lvbiBGUk9NICRUIFdIRVJFIGlkPSVkIiwkdGlkKSxBUlJBWV9BKTsKICAgICRvWydwdnpfZWlsdXRlcyddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgKICAgICAgIlNFTEVDVCByb3dfb3JkZXIsd2VpZ2h0X2Zyb21fa2cgd2Ysd2VpZ2h0X3RvX2tnIHd0LGFtb3VudF9mcm9tX2cgYWYsYW1vdW50X3RvX2cgYXQyLGNvbmRpdGlvbl9kaW1lbnNpb25zIGNkLGNvbmRpdGlvbl9yYXcgY3IKICAgICAgIEZST00gJFIgV0hFUkUgZmVlZGluZ190YWJsZV9pZD0lZCBPUkRFUiBCWSByb3dfb3JkZXIgTElNSVQgMTIiLCR0aWQpLEFSUkFZX0EpOwogICAgJG9bJ3B2el9wcm9kdWt0YWknXT0kd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHByb2R1Y3RfaWQgRlJPTSAkTSBXSEVSRSBmZWVkaW5nX3RhYmxlX2lkPSVkIEFORCBpc19hY3RpdmU9MSBMSU1JVCA1IiwkdGlkKSk7CiAgfQogIC8vIDQuIGFyIGFnZV9yYW5nZSBpciBhZ2VfbV9mcm9tIGthcnR1PwogICRvWydhYmlfa2FydHUnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkUiBXSEVSRSBjb25kaXRpb25fZGltZW5zaW9ucyBMSUtFICclYWdlX3JhbmdlJScgQU5EIGNvbmRpdGlvbl9kaW1lbnNpb25zIExJS0UgJyVhZ2VfbV9mcm9tJSciKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
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
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'AGR '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 5');
  const r=execSync('curl -sk --max-time 90 "https://dev.avesa.lt/?ps_agr=Agrx"',{maxBuffer:20e6,timeout:110000}).toString();
  const i=r.indexOf('{'),k=r.lastIndexOf('}');
  if(i>=0&&k>i){ try{ o.result=JSON.parse(r.slice(i,k+1)); }catch(e){ o.rawslice=r.slice(i,i+400); } }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('agr.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
