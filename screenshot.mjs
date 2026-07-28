import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2thdCddKSB8fCAkX0dFVFsncHNfa2F0J10hPT0nS2F0eCcpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCk7CiAgJHBpZD0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgcG9zdF9pZCBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IFdIRVJFIG1ldGFfa2V5PSdfc2t1JyBBTkQgbWV0YV92YWx1ZT0nTkdDS0MwMScgTElNSVQgMSIpOwogICRvWydwaWQnXT0kcGlkOwogICRwPXdjX2dldF9wcm9kdWN0KCRwaWQpOyAkb1snbiddPSRwP21iX3N1YnN0cigkcC0+Z2V0X25hbWUoKSwwLDYwKTpudWxsOwogICRtYXA9JHdwZGItPnByZWZpeC4ncHNfZmVlZGluZ19tYXAnOyAkcm93cz0kd3BkYi0+cHJlZml4Lidwc19mZWVkaW5nX3Jvd3MnOyAkdGFicz0kd3BkYi0+cHJlZml4Lidwc19mZWVkaW5nX3RhYmxlcyc7CiAgJHRpZD0oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgZmVlZGluZ190YWJsZV9pZCBGUk9NICRtYXAgV0hFUkUgcHJvZHVjdF9pZD0lZCBBTkQgaXNfYWN0aXZlPTEgTElNSVQgMSIsJHBpZCkpOwogICRvWyd0YWJsZV9pZCddPSR0aWQ7CiAgJG9bJ2xlbnRlbGUnXT0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGJyYW5kLGxpbmUsc2NvcGUsc3BlY2llcyx3ZWlnaHRfYmFzaXMscm93X2RpbWVuc2lvbixzaGFwZSxzdGF0dXMsc3VwcG9ydCBGUk9NICR0YWJzIFdIRVJFIGlkPSVkIiwkdGlkKSxBUlJBWV9BKTsKICAkb1snZWlsdXRlcyddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgKICAgICJTRUxFQ1Qgd2VpZ2h0X2Zyb21fa2cgd2YsIHdlaWdodF90b19rZyB3dCwgYW1vdW50X2Zyb21fZyBhZiwgYW1vdW50X3RvX2cgYXQyLCBjb25kaXRpb25fZGltZW5zaW9ucyBjZCwgY29uZGl0aW9uX3JhdyBjcgogICAgIEZST00gJHJvd3MgV0hFUkUgZmVlZGluZ190YWJsZV9pZD0lZCBPUkRFUiBCWSByb3dfb3JkZXIgTElNSVQgOCIsJHRpZCksQVJSQVlfQSk7CiAgJG9bJ2RpbWVuc2lqb3MnXT0kd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIERJU1RJTkNUIGNvbmRpdGlvbl9kaW1lbnNpb25zIEZST00gJHJvd3MgV0hFUkUgZmVlZGluZ190YWJsZV9pZD0lZCIsJHRpZCkpOwogIC8vIGthIGdyYXppbmEgY2FsYwogIGZvcmVhY2goYXJyYXkoMy43LCAzLjcpIGFzICRpPT4kdyl7CiAgICAkYXJncz1hcnJheSgncHJvZHVjdF9pZCc9PiRwaWQsJ3dlaWdodF9rZyc9PiR3LCdzcGVjaWVzX2NvZGUnPT4nY2F0Jyk7CiAgICAkcj1QZXRzaG9wX0ZlZWRpbmdfU2VydmljZTo6Y2FsYygkYXJncyk7CiAgICAkb1snY2FsYyddW109YXJyYXkoJ2tnJz0+JHcsJ3N0YXR1cyc9PiRyWydzdGF0dXMnXSwncmVhc29uJz0+JHJbJ3JlYXNvbl9jb2RlcyddLAogICAgICAnbXNnJz0+bWJfc3Vic3RyKChzdHJpbmcpKCRyWydtZXNzYWdlX2x0J10/PycnKSwwLDE0MCksCiAgICAgICdub3JtJz0+KCRyWydub3JtX21pbl9nJ10/P251bGwpLictJy4oJHJbJ25vcm1fbWF4X2cnXT8/bnVsbCksCiAgICAgICduYXJyb3dpbmcnPT4kclsnbmFycm93aW5nX2F4ZXMnXT8/bnVsbCwKICAgICAgJ2F2YWlsYWJpbGl0eSc9PiRyWydhdmFpbGFiaWxpdHknXT8/bnVsbCk7CiAgICBicmVhazsKICB9CiAgLy8ga2llayBkYXIgdG9raXUgbGVudGVsaXUgKGFtemlhdXMpCiAgJG9bJ2FtemlhdXNfbGVudGVsaXUnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgZmVlZGluZ190YWJsZV9pZCkgRlJPTSAkcm93cyBXSEVSRSBjb25kaXRpb25fZGltZW5zaW9ucyBMSUtFICclYWdlJScgT1IgY29uZGl0aW9uX2RpbWVuc2lvbnMgTElLRSAnJW1vbnRoJScgT1IgY29uZGl0aW9uX2RpbWVuc2lvbnMgTElLRSAnJWxpZmUlJyIpOwogICRvWydwcm9kdWt0dV9zdV9hbXppYXVzJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKERJU1RJTkNUIG0ucHJvZHVjdF9pZCkgRlJPTSAkcm93cyByIEpPSU4gJG1hcCBtIE9OIG0uZmVlZGluZ190YWJsZV9pZD1yLmZlZWRpbmdfdGFibGVfaWQgQU5EIG0uaXNfYWN0aXZlPTEgV0hFUkUgci5jb25kaXRpb25fZGltZW5zaW9ucyBMSUtFICclYWdlJScgT1Igci5jb25kaXRpb25fZGltZW5zaW9ucyBMSUtFICclbW9udGglJyBPUiByLmNvbmRpdGlvbl9kaW1lbnNpb25zIExJS0UgJyVsaWZlJSciKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
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
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'KAT '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  try{ const r=execSync('curl -sk --max-time 80 "https://dev.avesa.lt/?ps_kat=Katx"',{maxBuffer:8e6,timeout:95000}).toString();
    const i=r.indexOf('{'),k=r.lastIndexOf('}'); if(i>=0&&k>i) o.result=JSON.parse(r.slice(i,k+1)); else o.raw=r.slice(0,300); }catch(e){ o.e=String(e).slice(0,150); }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('kat.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
