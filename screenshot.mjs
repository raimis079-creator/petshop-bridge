import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2NvdjInXSkgfHwgJF9HRVRbJ3BzX2NvdjInXSE9PSdDb3YyeCcpIHJldHVybjsKICB3aGlsZShvYl9nZXRfbGV2ZWwoKSkgb2JfZW5kX2NsZWFuKCk7CiAgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgpOwogICRtYXA9JHdwZGItPnByZWZpeC4ncHNfZmVlZGluZ19tYXAnOwogICRuZWVkbGU9J1Jla29tZW5kdW9qYW1hcyBraWVraXMgcGVyIHBhcic7CiAgLy8gc2F1c2FzIG1haXN0YXMKICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgRElTVElOQ1QgcC5JRCBGUk9NIHskd3BkYi0+cG9zdHN9IHAKICAgIEpPSU4geyR3cGRiLT50ZXJtX3JlbGF0aW9uc2hpcHN9IHRyIE9OIHRyLm9iamVjdF9pZD1wLklECiAgICBKT0lOIHskd3BkYi0+dGVybV90YXhvbm9teX0gdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIEFORCB0dC50YXhvbm9teT0ncHJvZHVjdF9jYXQnCiAgICBKT0lOIHskd3BkYi0+dGVybXN9IHQgT04gdC50ZXJtX2lkPXR0LnRlcm1faWQgQU5EIHQuc2x1ZyBMSUtFICdzYXVzYXMtbWFpc3RhcyUnCiAgICBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIik7CiAgJG9bJ3NhdXNvX3Zpc28nXT1jb3VudCgkaWRzKTsKICAkbWFwcGVkPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgRElTVElOQ1QgcHJvZHVjdF9pZCBGUk9NICRtYXAgV0hFUkUgaXNfYWN0aXZlPTEiKTsKICAkbWFwcGVkPWFycmF5X2ZsaXAoYXJyYXlfbWFwKCdpbnR2YWwnLCRtYXBwZWQpKTsKICAkYmU9MDsgJGJlX3N1X2xlbnRlbGU9MDsgJHB2ej1hcnJheSgpOyAkYW50cmFzdGVzPWFycmF5KCk7CiAgZm9yZWFjaCgkaWRzIGFzICRwaWQpewogICAgJHBpZD0oaW50KSRwaWQ7CiAgICBpZihpc3NldCgkbWFwcGVkWyRwaWRdKSkgY29udGludWU7CiAgICAkYmUrKzsKICAgICRjPShzdHJpbmcpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwb3N0X2NvbnRlbnQgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBJRD0lZCIsJHBpZCkpOwogICAgaWYoJGM9PT0nJykgY29udGludWU7CiAgICBpZihzdHJpcG9zKCRjLCRuZWVkbGUpIT09ZmFsc2UpewogICAgICAkYmVfc3VfbGVudGVsZSsrOwogICAgICBpZihjb3VudCgkcHZ6KTw2KXsKICAgICAgICAkcD13Y19nZXRfcHJvZHVjdCgkcGlkKTsKICAgICAgICAkcHZ6W109YXJyYXkoJ2lkJz0+JHBpZCwnbic9PiRwP21iX3N1YnN0cigkcC0+Z2V0X25hbWUoKSwwLDQwKTpudWxsKTsKICAgICAgfQogICAgfSBlbHNlIHsKICAgICAgLy8ga29raWEgYW50cmFzdGUgbmF1ZG9qYW1hIHZpZXRvaiB0bwogICAgICBpZihwcmVnX21hdGNoX2FsbCgnLzxoNFtePl0qPiguKj8pPFwvaDQ+L2lzJywkYywkbSkpewogICAgICAgIGZvcmVhY2goJG1bMV0gYXMgJGgpeyAkaD10cmltKHN0cmlwX3RhZ3MoJGgpKTsgaWYoJGghPT0nJykgeyBpZighaXNzZXQoJGFudHJhc3Rlc1skaF0pKSAkYW50cmFzdGVzWyRoXT0wOyAkYW50cmFzdGVzWyRoXSsrOyB9IH0KICAgICAgfQogICAgfQogIH0KICAkb1snYmVfbWFwJ109JGJlOwogICRvWydiZV9tYXBfQkVUX3N1X2xlbnRlbGVfYXByYXN5bWUnXT0kYmVfc3VfbGVudGVsZTsKICAkb1sncHZ6J109JHB2ejsKICBhcnNvcnQoJGFudHJhc3Rlcyk7CiAgJG9bJ2tpdG9zX2FudHJhc3RlcyddPWFycmF5X3NsaWNlKCRhbnRyYXN0ZXMsMCwxMCx0cnVlKTsKICAvLyBpciB0YXJwIEpBVSB0dXJpbmNpdSBtYXAg4oCUIGFyIGp1IGFwcmFzeW1lIGlyZ2kgeXJhCiAgJHN1PTA7CiAgZm9yZWFjaChhcnJheV9zbGljZShhcnJheV9rZXlzKCRtYXBwZWQpLDAsMzAwKSBhcyAkcGlkKXsKICAgICRjPShzdHJpbmcpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwb3N0X2NvbnRlbnQgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBJRD0lZCIsJHBpZCkpOwogICAgaWYoJGMhPT0nJyAmJiBzdHJpcG9zKCRjLCRuZWVkbGUpIT09ZmFsc2UpICRzdSsrOwogIH0KICAkb1snc3VfbWFwX2lyX2FwcmFzeW1lJ109JHN1LicgLyAzMDAgdGlrcmludHUnOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
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
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'COV2 '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 5');
  const r=execSync('curl -sk --max-time 150 "https://dev.avesa.lt/?ps_cov2=Cov2x"',{maxBuffer:20e6,timeout:170000}).toString();
  const i=r.indexOf('{'),k=r.lastIndexOf('}');
  if(i>=0&&k>i){ try{ o.result=JSON.parse(r.slice(i,k+1)); }catch(e){ o.rawslice=r.slice(i,i+400); } }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('cov2.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
