import { execSync } from 'child_process';
import fs from 'fs';
const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2RpYWcyMjAnXSkgfHwgJF9HRVRbJ3BzX2RpYWcyMjAnXSE9PSdEZzIyMHgnKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgpOwogICRwaWQ9JHdwZGItPmdldF92YXIoIlNFTEVDVCBJRCBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgcG9zdF90aXRsZSBMSUtFICdPbnRhcmlvIEFkdWx0IExhcmdlIExhbWIlMTIga2clJyBMSU1JVCAxIik7CiAgaWYoISRwaWQpICRwaWQ9JHdwZGItPmdldF92YXIoIlNFTEVDVCBJRCBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgcG9zdF90aXRsZSBMSUtFICdPbnRhcmlvIEFkdWx0IExhcmdlJScgTElNSVQgMSIpOwogICRvWydwcm9kdWN0X2lkJ109KGludCkkcGlkOwogICRvWyd0aXRsZSddPSRwaWQ/Z2V0X3RoZV90aXRsZSgkcGlkKTpudWxsOwogIGlmKCRwaWQgJiYgY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0ZlZWRpbmdfU2VydmljZScpKXsKICAgIGZvcmVhY2goYXJyYXkoCiAgICAgIGFycmF5KCdwcm9kdWN0X2lkJz0+KGludCkkcGlkLCd3ZWlnaHRfa2cnPT4yNi41LCdzcGVjaWVzX2NvZGUnPT4nZG9nJyksCiAgICAgIGFycmF5KCdwcm9kdWN0X2lkJz0+KGludCkkcGlkLCd3ZWlnaHRfa2cnPT4yNi41LCdzcGVjaWVzX2NvZGUnPT4nZG9nJywnYWN0aXZpdHlfY29kZSc9Pidtb2RlcmF0ZScpLAogICAgKSBhcyAkaT0+JGFyZ3MpewogICAgICAkcj1QZXRzaG9wX0ZlZWRpbmdfU2VydmljZTo6Y2FsYygkYXJncyk7CiAgICAgICRvWydjYWxjJy4kaV09aXNfYXJyYXkoJHIpP2FycmF5X2ludGVyc2VjdF9rZXkoJHIsYXJyYXlfZmxpcChhcnJheSgnc3RhdHVzJywnYXZhaWxhYmlsaXR5JywncmVhc29uX2NvZGVzJywnbWVzc2FnZV9sdCcsJ25vcm1fbWluX2cnLCdub3JtX21heF9nJywnYWN0aXZpdHlfbW9kZScsJ2Jhc2lzJywnZGF5c19taW4nLCdkYXlzX21heCcsJ2Nvc3RfZGF5X21pbicpKSk6JHI7CiAgICB9CiAgICAvLyByZXBvIGxlbnRlbGUgc2lhbSBwcm9kdWt0dWkKICAgICRtYXA9JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCAqIEZST00geyR3cGRiLT5wcmVmaXh9cHNfZmVlZGluZ19tYXAgV0hFUkUgcHJvZHVjdF9pZD0lZCIsJHBpZCksQVJSQVlfQSk7CiAgICAkb1snbWFwJ109JG1hcDsKICAgIGlmKCRtYXApeyAkb1sndGFibGUnXT0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGlkLGlzX2FjdGl2ZSx2ZXJpZmllZCxzcGVjaWVzLGFjdGl2aXR5X2xldmVscyBGUk9NIHskd3BkYi0+cHJlZml4fXBzX2ZlZWRpbmdfdGFibGVzIFdIRVJFIGlkPSVkIiwkbWFwWydmZWVkaW5nX3RhYmxlX2lkJ10pLEFSUkFZX0EpOyB9CiAgfSBlbHNlIHsgJG9bJ25vdGUnXT0nbm8gc2VydmljZSBjbGFzcyBvciBwcm9kdWN0JzsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'DIAG220 (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
execSync('sleep 3');
let r='';
try{ r=execSync('curl -sk "https://dev.avesa.lt/?ps_diag220=Dg220x"',{maxBuffer:100*1024*1024,timeout:90000}).toString(); }catch(e){ r='ERR '+String(e).slice(0,200); }
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('diag220.json', Buffer.from(r).toString('base64'));
console.log('done', r.length);
