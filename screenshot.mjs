import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3NyMiddKSB8fCAkX0dFVFsncHNfc3IyJ10hPT0nU3IyeCcpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRmbT0kd3BkYi0+cHJlZml4Lidwc19mZWVkaW5nX21hcCc7ICRvPWFycmF5KCk7CiAgLy8gcGFfYmFsdHltdV9zYWx0aW5pcyB0ZXJtaW5haSBNQUlTVE8gc2NvcGUKICAkb1snYmFsdHltYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0Lm5hbWUsIENPVU5UKERJU1RJTkNUIGYucHJvZHVjdF9pZCkgYwogICAgRlJPTSB7JHdwZGItPnRlcm1zfSB0CiAgICBKT0lOIHskd3BkYi0+dGVybV90YXhvbm9teX0gdHQgT04gdHQudGVybV9pZD10LnRlcm1faWQgQU5EIHR0LnRheG9ub215PSdwYV9iYWx0eW11X3NhbHRpbmlzJwogICAgSk9JTiB7JHdwZGItPnRlcm1fcmVsYXRpb25zaGlwc30gdHIgT04gdHIudGVybV90YXhvbm9teV9pZD10dC50ZXJtX3RheG9ub215X2lkCiAgICBKT0lOICRmbSBmIE9OIGYucHJvZHVjdF9pZD10ci5vYmplY3RfaWQgQU5EIGYuaXNfYWN0aXZlPTEKICAgIEdST1VQIEJZIHQudGVybV9pZCBPUkRFUiBCWSBjIERFU0MiLCBBUlJBWV9BKTsKICAvLyBwYV9iZV9ncnVkdSBNQUlTVE8gc2NvcGUKICAkb1snYmVfZ3J1ZHUnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0Lm5hbWUsIENPVU5UKERJU1RJTkNUIGYucHJvZHVjdF9pZCkgYwogICAgRlJPTSB7JHdwZGItPnRlcm1zfSB0CiAgICBKT0lOIHskd3BkYi0+dGVybV90YXhvbm9teX0gdHQgT04gdHQudGVybV9pZD10LnRlcm1faWQgQU5EIHR0LnRheG9ub215PSdwYV9iZV9ncnVkdScKICAgIEpPSU4geyR3cGRiLT50ZXJtX3JlbGF0aW9uc2hpcHN9IHRyIE9OIHRyLnRlcm1fdGF4b25vbXlfaWQ9dHQudGVybV90YXhvbm9teV9pZAogICAgSk9JTiAkZm0gZiBPTiBmLnByb2R1Y3RfaWQ9dHIub2JqZWN0X2lkIEFORCBmLmlzX2FjdGl2ZT0xCiAgICBHUk9VUCBCWSB0LnRlcm1faWQgT1JERVIgQlkgYyBERVNDIiwgQVJSQVlfQSk7CiAgLy8gYXIgeXJhIGtva2lhIG5vcnMgcGllbm8gdGFrc29ub21pamEKICAkb1sncGllbm9fdGVybWluYWknXT0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIENPTkNBVCh0dC50YXhvbm9teSwnID0gJyx0Lm5hbWUpIEZST00geyR3cGRiLT50ZXJtc30gdCBKT0lOIHskd3BkYi0+dGVybV90YXhvbm9teX0gdHQgT04gdHQudGVybV9pZD10LnRlcm1faWQgV0hFUkUgdC5uYW1lIExJS0UgJyVwaWVuJScgT1IgdC5uYW1lIExJS0UgJyVsYWt0b3olJyIpOwogIC8vIGtva2llIGphdXRydW1haSByZWFsaWFpIHByb2ZpbGl1b3NlCiAgJG9bJ3Byb2ZpbGl1X2phdXRydW1haSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHNlbnNpdGl2aXRpZXMgdiwgQ09VTlQoKikgYyBGUk9NIHskd3BkYi0+cHJlZml4fXBzX3BldHMgV0hFUkUgc2Vuc2l0aXZpdGllcyBJUyBOT1QgTlVMTCBBTkQgc2Vuc2l0aXZpdGllczw+JycgR1JPVVAgQlkgc2Vuc2l0aXZpdGllcyBPUkRFUiBCWSBjIERFU0MiLCBBUlJBWV9BKTsKICAvLyBzY29wZSBkeWRpcwogICRvWydtYWlzdG9fc2NvcGUnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgcHJvZHVjdF9pZCkgRlJPTSAkZm0gV0hFUkUgaXNfYWN0aXZlPTEiKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50e6,timeout:70000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const o={}; let sid=null;
try{
  const php = Buffer.from(PHPB64,'base64').toString('utf8');
  const mk=wj('POST','code-snippets/v1/snippets',{name:'SR2 (temp)',code:php,scope:'front-end',active:true,priority:5});
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_sr2=Sr2x"',{maxBuffer:8e6,timeout:60000}).toString();
  const a=r.indexOf('{'),b=r.lastIndexOf('}');
  try{ o.result=JSON.parse(r.slice(a,b+1)); }catch(e){ o.raw=r.slice(0,250); }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('sensrec.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
