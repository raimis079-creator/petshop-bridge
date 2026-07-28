import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2NtcCddKSB8fCAkX0dFVFsncHNfY21wJ10hPT0nQ21weCcpIHJldHVybjsKICB3aGlsZShvYl9nZXRfbGV2ZWwoKSkgb2JfZW5kX2NsZWFuKCk7CiAgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgpOwogICR0YWJzPSR3cGRiLT5wcmVmaXguJ3BzX2ZlZWRpbmdfdGFibGVzJzsgJG1hcD0kd3BkYi0+cHJlZml4Lidwc19mZWVkaW5nX21hcCc7CiAgLy8gbWFubyBzdWt1cnRhCiAgJG1pbmU9JHdwZGItPmdldF9yb3coIlNFTEVDVCAqIEZST00gJHRhYnMgV0hFUkUgaW1wb3J0X2JhdGNoX2lkIExJS0UgJ1MyOTUlJyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDEiLEFSUkFZX0EpOwogIC8vIHZlaWtpYW50aSAoRXhjbHVzaW9uIDE4NjIwKQogICR3dGlkPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBmZWVkaW5nX3RhYmxlX2lkIEZST00gJG1hcCBXSEVSRSBwcm9kdWN0X2lkPTE4NjIwIEFORCBpc19hY3RpdmU9MSBMSU1JVCAxIik7CiAgJHdvcms9JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCAqIEZST00gJHRhYnMgV0hFUkUgaWQ9JWQiLCR3dGlkKSxBUlJBWV9BKTsKICAkZGlmZj1hcnJheSgpOwogIGZvcmVhY2goJHdvcmsgYXMgJGs9PiR2KXsKICAgICRtdiA9IGlzc2V0KCRtaW5lWyRrXSk/JG1pbmVbJGtdOm51bGw7CiAgICBpZigoc3RyaW5nKSRtdiAhPT0gKHN0cmluZykkdikgJGRpZmZbJGtdPWFycmF5KCd2ZWlraWEnPT5pc19zdHJpbmcoJHYpP3N1YnN0cigkdiwwLDQwKTokdiwnbWFubyc9PmlzX3N0cmluZygkbXYpP3N1YnN0cigkbXYsMCw0MCk6JG12KTsKICB9CiAgJG9bJ3NraXJ0dW1haSddPSRkaWZmOwogICRvWydtYW5vX2lkJ109JG1pbmU/JG1pbmVbJ2lkJ106bnVsbDsKICAkb1sndmVpa2lhX2lkJ109JHd0aWQ7CiAgJG9bJ21hbm9fYmF0Y2hfa2llayddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0YWJzIFdIRVJFIGltcG9ydF9iYXRjaF9pZCBMSUtFICdTMjk1JSciKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
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
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'CMP '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 5');
  const r=execSync('curl -sk --max-time 70 "https://dev.avesa.lt/?ps_cmp=Cmpx"',{maxBuffer:20e6}).toString();
  const i=r.indexOf('{'),k=r.lastIndexOf('}');
  if(i>=0&&k>i){ try{ o.result=JSON.parse(r.slice(i,k+1)); }catch(e){ o.rawslice=r.slice(i,i+300); } }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('cmp.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
