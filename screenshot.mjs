import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3NwJ10pIHx8ICRfR0VUWydwc19zcCddIT09J1NweCcpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCk7CiAgJG9bJ2ZsYWcnXT1nZXRfb3B0aW9uKCdwZXRzaG9wX3N1Z2dlc3Rpb25zX2VuYWJsZWQnLCcobmVudXN0YXR5dGFzLCBudW1hdHl0YWkgMSknKTsKICAvLyBrb2tpb3MgcnVzeXMgcHJvZmlsaXVvc2UKICAkdD0kd3BkYi0+cHJlZml4Lidwc19wZXRzJzsKICAkb1sncnVzeXNfcHJvZmlsaXVvc2UnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzcGVjaWVzIHYsQ09VTlQoKikgYyBGUk9NICR0IFdIRVJFIGRlbGV0ZWRfYXQgSVMgTlVMTCBHUk9VUCBCWSBzcGVjaWVzIE9SREVSIEJZIGMgREVTQyIsQVJSQVlfQSk7CiAgLy8ga2FuZGlkYXRpbmVzIGthdGVnb3Jpam9zIGtpdG9tcyBydXNpbXMKICAkdGVybXM9Z2V0X3Rlcm1zKGFycmF5KCd0YXhvbm9teSc9Pidwcm9kdWN0X2NhdCcsJ2hpZGVfZW1wdHknPT5mYWxzZSkpOwogICRoaXRzPWFycmF5KCk7CiAgZm9yZWFjaCgkdGVybXMgYXMgJHRtKXsKICAgIGlmKHByZWdfbWF0Y2goJy9za2FufGRlbGlrYXRlc3xrcmFtdHxwYXBpbGR8dml0YW1pbnxsZXNhbHxtYWlzdC9pdScsJHRtLT5uYW1lKSl7CiAgICAgICRoaXRzW109YXJyYXkoJ3NsdWcnPT4kdG0tPnNsdWcsJ25hbWUnPT4kdG0tPm5hbWUsJ2NvdW50Jz0+JHRtLT5jb3VudCk7CiAgICB9CiAgfQogICRvWydrYXRlZ29yaWpvcyddPSRoaXRzOwogIC8vIHBhX2d5dnVub19ydXNpcyB0ZXJtaW5haQogICRvWydydXNpZXNfdGVybWluYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0Lm5hbWUsdC5zbHVnLHR0LmNvdW50IEZST00geyR3cGRiLT50ZXJtc30gdAogICAgSk9JTiB7JHdwZGItPnRlcm1fdGF4b25vbXl9IHR0IE9OIHR0LnRlcm1faWQ9dC50ZXJtX2lkIEFORCB0dC50YXhvbm9teT0ncGFfZ3l2dW5vX3J1c2lzJyBPUkRFUiBCWSB0dC5jb3VudCBERVNDIixBUlJBWV9BKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
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
  for(let a=0;a<2;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'SP (t)',code:php,scope:'front-end',active:true,priority:5}); break; }catch(e){ execSync('sleep 5'); } }
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  try{ const r=execSync('curl -sk --max-time 70 "https://dev.avesa.lt/?ps_sp=Spx"',{maxBuffer:8e6,timeout:85000}).toString();
    const i=r.indexOf('{'),k=r.lastIndexOf('}'); if(i>=0&&k>i) o.result=JSON.parse(r.slice(i,k+1)); else o.raw=r.slice(0,250); }catch(e){ o.e=String(e).slice(0,100); }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('sp.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
