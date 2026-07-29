import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2NoazInXSkgfHwgJF9HRVRbJ3BzX2NoazInXSE9PSdDaGsyeCcpIHJldHVybjsKICB3aGlsZShvYl9nZXRfbGV2ZWwoKSkgb2JfZW5kX2NsZWFuKCk7CiAgZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoKTsgJFI9JHBmLidwc19mZWVkaW5nX3Jvd3MnOyAkVD0kcGYuJ3BzX2ZlZWRpbmdfdGFibGVzJzsKICAkdGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIGlkIEZST00gJFQgV0hFUkUgdmVyaWZpZWRfYnk9J1MzMDQgbm9ybWFsaXphY2lqYSAoc2F2aW5pbmtvIHBhdHZpcnRpbnRhKSciKTsKICAkb1snbWFub19yZWlrc21lcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERJU1RJTkNUIGNvbmRpdGlvbl9kaW1lbnNpb25zIGNkIEZST00gJFIKICAgIFdIRVJFIGZlZWRpbmdfdGFibGVfaWQgSU4gKCIuaW1wbG9kZSgnLCcsYXJyYXlfbWFwKCdpbnR2YWwnLCR0aWRzKSkuIikgTElNSVQgOCIsQVJSQVlfQSk7CiAgLy8gcGFseWdpbmltdWkg4oCUIFNFTk9TIHZlaWtpYW5jaW9zCiAgJG9bJ3ZlaWtpYW5jaW9zX3JlaWtzbWVzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgRElTVElOQ1QgY29uZGl0aW9uX2RpbWVuc2lvbnMgY2QgRlJPTSAkUgogICAgV0hFUkUgY29uZGl0aW9uX2RpbWVuc2lvbnMgTElLRSAnJWFnZV9tX2Zyb20lJwogICAgICBBTkQgZmVlZGluZ190YWJsZV9pZCBOT1QgSU4gKCIuaW1wbG9kZSgnLCcsYXJyYXlfbWFwKCdpbnR2YWwnLCR0aWRzKSkuIikgTElNSVQgOCIsQVJSQVlfQSk7CiAgLy8gYXIgdmVpa2lhbnRpIGxlbnRlbGUgYXBza3JpdGFpIEFUU0FLTyBzdSBhbXppdW1pCiAgJG9rPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgbS5wcm9kdWN0X2lkIHBpZCwgdC5pZCB0aWQsIHQuc3BlY2llcyBzcCwgdC5zaGFwZSwgdC5sb29rdXBfbWV0aG9kIGxtLCB0LnJvd19kaW1lbnNpb24gcmQKICAgIEZST00geyRwZn1wc19mZWVkaW5nX21hcCBtIEpPSU4gJFQgdCBPTiB0LmlkPW0uZmVlZGluZ190YWJsZV9pZAogICAgSk9JTiAkUiByIE9OIHIuZmVlZGluZ190YWJsZV9pZD10LmlkIEFORCByLmNvbmRpdGlvbl9kaW1lbnNpb25zIExJS0UgJyVhZ2VfbV9mcm9tJScKICAgIFdIRVJFIG0uaXNfYWN0aXZlPTEgQU5EIHQuc3RhdHVzPSd2ZXJpZmllZCcgQU5EIHQuaWQgTk9UIElOICgiLmltcGxvZGUoJywnLGFycmF5X21hcCgnaW50dmFsJywkdGlkcykpLiIpCiAgICBMSU1JVCAxIixBUlJBWV9BKTsKICAkb1snZXRhbG9uYXMnXT0kb2s7CiAgaWYoJG9rKXsKICAgICRyPVBldHNob3BfRmVlZGluZ19TZXJ2aWNlOjpjYWxjKGFycmF5KCdwcm9kdWN0X2lkJz0+KGludCkkb2tbJ3BpZCddLCd3ZWlnaHRfa2cnPT40LjAsJ2FnZV9tb250aHMnPT4zLCdzcGVjaWVzX2NvZGUnPT4kb2tbJ3NwJ10pKTsKICAgICRvWydldGFsb25vX2NhbGMnXT1hcnJheSgnc3QnPT4kclsnc3RhdHVzJ10sJ3JjJz0+JHJbJ3JlYXNvbl9jb2RlcyddLCdub3JtJz0+KCRyWydub3JtX21pbl9nJ10/P251bGwpLictJy4oJHJbJ25vcm1fbWF4X2cnXT8/bnVsbCkpOwogIH0KICAvLyBtYW5vIGxlbnRlbGVzIG1ldGFkdW9tZW55cwogICRvWydtYW5vX2xlbnRlbGVzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsc2hhcGUsbG9va3VwX21ldGhvZCxyb3dfZGltZW5zaW9uLHN0YXR1cyxheGlzX3Jlc29sdXRpb25fcG9saWN5IGFycCxyZXNvbHV0aW9uX3BvbGljeSBycAogICAgRlJPTSAkVCBXSEVSRSBpZCBJTiAoIi5pbXBsb2RlKCcsJyxhcnJheV9tYXAoJ2ludHZhbCcsJHRpZHMpKS4iKSBMSU1JVCA0IixBUlJBWV9BKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
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
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'CHK2 '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 5');
  const r=execSync('curl -sk --max-time 90 "https://dev.avesa.lt/?ps_chk2=Chk2x"',{maxBuffer:20e6,timeout:110000}).toString();
  const i=r.indexOf('{'),k=r.lastIndexOf('}');
  if(i>=0&&k>i){ try{ o.result=JSON.parse(r.slice(i,k+1)); }catch(e){ o.rawslice=r.slice(i,i+400); } }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('chk2.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
