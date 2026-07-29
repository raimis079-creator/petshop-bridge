import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2F4cCddKSB8fCAkX0dFVFsncHNfYXhwJ10hPT0nQXhweCcpIHJldHVybjsKICB3aGlsZShvYl9nZXRfbGV2ZWwoKSkgb2JfZW5kX2NsZWFuKCk7CiAgZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoKTsgJFI9JHBmLidwc19mZWVkaW5nX3Jvd3MnOyAkVD0kcGYuJ3BzX2ZlZWRpbmdfdGFibGVzJzsgJE09JHBmLidwc19mZWVkaW5nX21hcCc7CiAgJG1pbmU9JHdwZGItPmdldF9jb2woIlNFTEVDVCBpZCBGUk9NICRUIFdIRVJFIHZlcmlmaWVkX2J5PSdTMzA0IG5vcm1hbGl6YWNpamEgKHNhdmluaW5rbyBwYXR2aXJ0aW50YSknIik7CiAgJGV4PWltcGxvZGUoJywnLGFycmF5X21hcCgnaW50dmFsJywkbWluZSkpOwogIC8vIFZFSUtJQU5DSU9TIGxlbnRlbGVzIHN1IGFnZV9tX2Zyb20gZWlsdXRlbWlzIOKAlCBqdSBheGlzX3Jlc29sdXRpb25fcG9saWN5CiAgJG9bJ3ZlaWtpYW5jaW9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgRElTVElOQ1QgdC5pZCx0LnNoYXBlLHQubG9va3VwX21ldGhvZCBsbSx0LnJvd19kaW1lbnNpb24gcmQsdC5heGlzX3Jlc29sdXRpb25fcG9saWN5IGFycAogICAgRlJPTSAkVCB0IEpPSU4gJFIgciBPTiByLmZlZWRpbmdfdGFibGVfaWQ9dC5pZAogICAgV0hFUkUgci5jb25kaXRpb25fZGltZW5zaW9ucyBMSUtFICclYWdlX21fZnJvbSUnIEFORCB0LmlkIE5PVCBJTiAoJGV4KSBBTkQgdC5zdGF0dXM9J3ZlcmlmaWVkJyBBTkQgdC5pc19hY3RpdmU9MQogICAgTElNSVQgNiIsQVJSQVlfQSk7CiAgLy8gaXIgYXIgYmVudCB2aWVuYSBpcyBqdSBBVFNBS08KICBmb3JlYWNoKCRvWyd2ZWlraWFuY2lvcyddIGFzICRpPT4kdCl7CiAgICAkcGlkPShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwcm9kdWN0X2lkIEZST00gJE0gV0hFUkUgZmVlZGluZ190YWJsZV9pZD0lZCBBTkQgaXNfYWN0aXZlPTEgTElNSVQgMSIsJHRbJ2lkJ10pKTsKICAgIGlmKCEkcGlkKSBjb250aW51ZTsKICAgICRyZz0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIE1JTih3ZWlnaHRfZnJvbV9rZykgd21uLE1BWCh3ZWlnaHRfdG9fa2cpIHdteCBGUk9NICRSIFdIRVJFIGZlZWRpbmdfdGFibGVfaWQ9JWQiLCR0WydpZCddKSxBUlJBWV9BKTsKICAgICRzcD0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHNwZWNpZXMgRlJPTSAkVCBXSEVSRSBpZD0lZCIsJHRbJ2lkJ10pKTsKICAgICR3PXJvdW5kKCgoZmxvYXQpJHJnWyd3bW4nXSsoZmxvYXQpJHJnWyd3bXgnXSkvMiwxKTsKICAgICRyPVBldHNob3BfRmVlZGluZ19TZXJ2aWNlOjpjYWxjKGFycmF5KCdwcm9kdWN0X2lkJz0+JHBpZCwnd2VpZ2h0X2tnJz0+JHc/OjUsJ2FnZV9tb250aHMnPT40LCdzcGVjaWVzX2NvZGUnPT4kc3A/Oidkb2cnKSk7CiAgICAkb1sndmVpa2lhbmNpb3MnXVskaV1bJ3BpZCddPSRwaWQ7CiAgICAkb1sndmVpa2lhbmNpb3MnXVskaV1bJ2NhbGMnXT1hcnJheSgna2cnPT4kdywnc3QnPT4kclsnc3RhdHVzJ10sJ3JjJz0+JHJbJ3JlYXNvbl9jb2RlcyddKTsKICB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
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
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'AXP '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 5');
  const r=execSync('curl -sk --max-time 100 "https://dev.avesa.lt/?ps_axp=Axpx"',{maxBuffer:20e6,timeout:120000}).toString();
  const i=r.indexOf('{'),k=r.lastIndexOf('}');
  if(i>=0&&k>i){ try{ o.result=JSON.parse(r.slice(i,k+1)); }catch(e){ o.rawslice=r.slice(i,i+400); } }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('axp.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
