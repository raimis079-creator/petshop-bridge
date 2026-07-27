import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2V2J10pIHx8ICRfR0VUWydwc19ldiddIT09J0V2eCcpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRkPVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvJzsgJG89YXJyYXkoKTsKICBmb3JlYWNoKGFycmF5KCdjbGFzcy1ldmVudC1sb2cucGhwJywnY2xhc3MtZXZlbnQtZW1pdHRlcnMucGhwJywnY2xhc3MtZXZlbnQtcmVnaXN0cnkucGhwJykgYXMgJGZuKXsKICAgICRmPSRkLidpbmNsdWRlcy8nLiRmbjsKICAgIGlmKCFmaWxlX2V4aXN0cygkZikpeyAkb1skZm5dPSdORVJBJzsgY29udGludWU7IH0KICAgICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsKICAgIHByZWdfbWF0Y2hfYWxsKCcvKD86cHVibGljfHByaXZhdGV8cHJvdGVjdGVkKVxzK3N0YXRpY1xzK2Z1bmN0aW9uXHMrKFthLXpfMC05XSspL2knLCRjLCRtKTsKICAgIHByZWdfbWF0Y2hfYWxsKCIvQ1JFQVRFIFRBQkxFW15gXSpgPyhbYS16XzAtOXt9XCRdKylgPy9pIiwkYywkdCk7CiAgICAkb1skZm5dPWFycmF5KCdieXRlcyc9PmZpbGVzaXplKCRmKSwnbWV0b2RhaSc9PmFycmF5X3NsaWNlKCRtWzFdLDAsMTQpLCdsZW50ZWxlcyc9PiR0WzFdKTsKICB9CiAgLy8gYXIgeXJhIGl2eWtpdSBsZW50ZWxlCiAgJHRhYnM9JHdwZGItPmdldF9jb2woIlNIT1cgVEFCTEVTIExJS0UgJ3skd3BkYi0+cHJlZml4fXBzXyUnIik7CiAgJG9bJ3BzX2xlbnRlbGVzJ109JHRhYnM7CiAgZm9yZWFjaCgkdGFicyBhcyAkdGIpewogICAgaWYoc3RycG9zKCR0YiwnZXZlbnQnKSE9PWZhbHNlIHx8IHN0cnBvcygkdGIsJ2xvZycpIT09ZmFsc2UpewogICAgICAkb1snaXZ5a2l1X2xlbnRlbGUnXT0kdGI7CiAgICAgICRvWydpdnlraXVfZWlsdWNpdSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0YiIpOwogICAgICAkb1snaXZ5a2l1X3N0dWxwZWxpYWknXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00gJHRiIik7CiAgICAgICRvWydpdnlraXVfdGlwYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00gJHRiIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMyIsQVJSQVlfQSk7CiAgICB9CiAgfQogIC8vIFdvb0NvbW1lcmNlIHV6c2FreW11IGtpZWtpcyAoYXIgYXBza3JpdGFpIHlyYSBrYSBtYXR1b3RpKQogICRvWyd3Y191enNha3ltdSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZT0nc2hvcF9vcmRlciciKTsKICBpZighJG9bJ3djX3V6c2FreW11J10pewogICAgJG9bJ2hwb3NfdXpzYWt5bXUnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnByZWZpeH13Y19vcmRlcnMiKTsKICB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
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
  for(let a=0;a<2;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'EV (temp)',code:php,scope:'front-end',active:true,priority:5}); break; }catch(e){ execSync('sleep 5'); } }
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  try{ const r=execSync('curl -sk --max-time 70 "https://dev.avesa.lt/?ps_ev=Evx"',{maxBuffer:8e6,timeout:85000}).toString();
    const i=r.indexOf('{'),k=r.lastIndexOf('}'); if(i>=0&&k>i) o.result=JSON.parse(r.slice(i,k+1)); else o.raw=r.slice(0,250); }catch(e){ o.e=String(e).slice(0,100); }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('evt.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
