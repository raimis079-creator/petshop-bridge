import { execSync } from 'child_process';
import fs from 'fs';
const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2ludCddKSB8fCAkX0dFVFsncHNfaW50J10hPT0nSW4yNHgnKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoKTsKICAvLyBhciB5cmEgcHJla2l1IHN1ID4xIEdBTElPSkFOQ0lBIGxlbnRlbGUgKFJlcG9zaXRvcnkgaW52YXJpYW50byBwYXplaWRpbWFzKQogICRkdXA9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbS5wcm9kdWN0X2lkLCBDT1VOVCgqKSBjIEZST00geyRwZn1wc19mZWVkaW5nX21hcCBtCiAgICBKT0lOIHskcGZ9cHNfZmVlZGluZ190YWJsZXMgdCBPTiB0LmlkPW0uZmVlZGluZ190YWJsZV9pZAogICAgV0hFUkUgbS5pc19hY3RpdmU9MSBBTkQgdC5pc19hY3RpdmU9MSBBTkQgdC5zdGF0dXM9J3ZlcmlmaWVkJyBBTkQgdC5jYW5vbmljYWxfdGFibGVfaGFzaCBJUyBOT1QgTlVMTAogICAgR1JPVVAgQlkgbS5wcm9kdWN0X2lkIEhBVklORyBjPjEiLCBBUlJBWV9BKTsKICAkb1snZHVibGlhaSddPSRkdXA7CiAgLy8gMTQ3OTEgdGlrcm9qaSBidXNlbmEKICBmb3JlYWNoKGFycmF5KDE0NzkxLDE2ODU0KSBhcyAkcGlkKXsKICAgICRvWydtYXBzJ11bJHBpZF09JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgbS5mZWVkaW5nX3RhYmxlX2lkLCBtLmlzX2FjdGl2ZSBBUyBtYXBfYWt0LCB0LmlzX2FjdGl2ZSBBUyB0YmxfYWt0LCB0LnN0YXR1cywgdC52ZXJpZmllZF9ieSwgKHQuY2Fub25pY2FsX3RhYmxlX2hhc2ggSVMgTk9UIE5VTEwpIEFTIGhhc2gKICAgICAgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfbWFwIG0gSk9JTiB7JHBmfXBzX2ZlZWRpbmdfdGFibGVzIHQgT04gdC5pZD1tLmZlZWRpbmdfdGFibGVfaWQgV0hFUkUgbS5wcm9kdWN0X2lkPSVkIiwkcGlkKSxBUlJBWV9BKTsKICB9CiAgLy8gcmVhbGlhaSBuYXVkb2phbW9zIGxlbnRlbGVzIGVpbHV0ZXMgMTQ3OTEKICAkcmVwbz1uZXcgUGV0c2hvcF9GZWVkaW5nX1JlcG9zaXRvcnkoKTsgJHJ0PSRyZXBvLT5nZXRfZm9yX3Byb2R1Y3QoMTQ3OTEpOwogICRvWycxNDc5MV9yZXBvJ109YXJyYXkoJ3N0YXR1cyc9PiRydFsnc3RhdHVzJ10/P251bGwsJ3N1cHBvcnQnPT4kcnRbJ3N1cHBvcnQnXT8/bnVsbCwnbic9Pmlzc2V0KCRydFsncm93cyddKT9jb3VudCgkcnRbJ3Jvd3MnXSk6MCk7CiAgaWYoaXNzZXQoJHJ0Wydyb3dzJ10pKSAkb1snMTQ3OTFfcm93cyddPWFycmF5X3NsaWNlKGFycmF5X21hcChmdW5jdGlvbigkcil7cmV0dXJuIGFycmF5KCRyWyd3ZWlnaHRfZnJvbV9rZyddLCRyWyd3ZWlnaHRfdG9fa2cnXSwkclsnYW1vdW50X2Zyb21fZyddLCRyWydhbW91bnRfdG9fZyddKTt9LCRydFsncm93cyddKSwwLDYpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'INT (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
execSync('sleep 3');
let r='';
try{ r=execSync('curl -sk "https://dev.avesa.lt/?ps_int=In24x"',{maxBuffer:100*1024*1024,timeout:90000}).toString(); }catch(e){ r='ERR '+String(e).slice(0,200); }
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('int.json', Buffer.from(r).toString('base64'));
console.log('done', r.length);
