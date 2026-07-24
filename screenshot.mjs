import { execSync } from 'child_process';
import fs from 'fs';
const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2RnJ10pIHx8ICRfR0VUWydwc19kZyddIT09J0RnMjR4JykgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCk7CiAgJHBpZD0xNjg1NDsKICAkcmVwbz1uZXcgUGV0c2hvcF9GZWVkaW5nX1JlcG9zaXRvcnkoKTsKICAkcnQ9JHJlcG8tPmdldF9mb3JfcHJvZHVjdCgkcGlkKTsKICAkb1sncmVwbyddPWFycmF5KCdzdGF0dXMnPT4kcnRbJ3N0YXR1cyddPz9udWxsLCdzdXBwb3J0Jz0+JHJ0WydzdXBwb3J0J10/P251bGwsJ3JlYXNvbic9PiRydFsncmVhc29uJ10/PygkcnRbJ3JlYXNvbl9jb2RlcyddPz9udWxsKSwncm93cyc9Pmlzc2V0KCRydFsncm93cyddKT9jb3VudCgkcnRbJ3Jvd3MnXSk6MCwna2V5cyc9PmlzX2FycmF5KCRydCk/YXJyYXlfa2V5cygkcnQpOm51bGwpOwogICR0aWQ9KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGZlZWRpbmdfdGFibGVfaWQgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfbWFwIFdIRVJFIHByb2R1Y3RfaWQ9JWQgQU5EIGlzX2FjdGl2ZT0xIiwkcGlkKSk7CiAgJG9bJ3RpZCddPSR0aWQ7CiAgJG5ldz0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUICogRlJPTSB7JHBmfXBzX2ZlZWRpbmdfdGFibGVzIFdIRVJFIGlkPSVkIiwkdGlkKSxBUlJBWV9BKTsgdW5zZXQoJG5ld1sncm93c19iYWNrdXBfanNvbiddKTsKICAkb2xkPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgKiBGUk9NIHskcGZ9cHNfZmVlZGluZ190YWJsZXMgV0hFUkUgaWQ9MSIsQVJSQVlfQSk7IHVuc2V0KCRvbGRbJ3Jvd3NfYmFja3VwX2pzb24nXSk7CiAgJGRpZmY9YXJyYXkoKTsKICBmb3JlYWNoKCRvbGQgYXMgJGs9PiR2KXsgJG52PSRuZXdbJGtdPz9udWxsOyBpZigoc3RyaW5nKSR2IT09KHN0cmluZykkbnYpICRkaWZmWyRrXT1hcnJheSgnc2VuYSh0MSknPT4kdiwnbmF1amEnPT4kbnYpOyB9CiAgJG9bJ3NraXJ0dW1haSddPSRkaWZmOwogICRvWydyb3dzX25ldyddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUICogRlJPTSB7JHBmfXBzX2ZlZWRpbmdfcm93cyBXSEVSRSBmZWVkaW5nX3RhYmxlX2lkPSVkIE9SREVSIEJZIHJvd19vcmRlciBMSU1JVCAzIiwkdGlkKSxBUlJBWV9BKTsKICAkb1sncm93c19vbGQnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00geyRwZn1wc19mZWVkaW5nX3Jvd3MgV0hFUkUgZmVlZGluZ190YWJsZV9pZD0xIE9SREVSIEJZIHJvd19vcmRlciBMSU1JVCAyIixBUlJBWV9BKTsKICAkb1snbWFwX25ldyddPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgKiBGUk9NIHskcGZ9cHNfZmVlZGluZ19tYXAgV0hFUkUgcHJvZHVjdF9pZD0lZCIsJHBpZCksQVJSQVlfQSk7CiAgJG9bJ21hcF9vbGQnXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUICogRlJPTSB7JHBmfXBzX2ZlZWRpbmdfbWFwIFdIRVJFIGZlZWRpbmdfdGFibGVfaWQ9MSBMSU1JVCAxIixBUlJBWV9BKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'DG (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
execSync('sleep 3');
let r='';
try{ r=execSync('curl -sk "https://dev.avesa.lt/?ps_dg=Dg24x"',{maxBuffer:100*1024*1024,timeout:90000}).toString(); }catch(e){ r='ERR '+String(e).slice(0,200); }
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('dg.json', Buffer.from(r).toString('base64'));
console.log('done', r.length);
