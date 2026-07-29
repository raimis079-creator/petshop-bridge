import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2xpa28nXSkgfHwgJF9HRVRbJ3BzX2xpa28nXSE9PSdMaWtveCcpIHJldHVybjsKICB3aGlsZShvYl9nZXRfbGV2ZWwoKSkgb2JfZW5kX2NsZWFuKCk7CiAgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgpOyAkbWFwPSR3cGRiLT5wcmVmaXguJ3BzX2ZlZWRpbmdfbWFwJzsKICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgRElTVElOQ1QgcC5JRCBGUk9NIHskd3BkYi0+cG9zdHN9IHAKICAgIEpPSU4geyR3cGRiLT50ZXJtX3JlbGF0aW9uc2hpcHN9IHRyIE9OIHRyLm9iamVjdF9pZD1wLklECiAgICBKT0lOIHskd3BkYi0+dGVybV90YXhvbm9teX0gdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIEFORCB0dC50YXhvbm9teT0ncHJvZHVjdF9jYXQnIEFORCB0dC50ZXJtX2lkIElOICg3Miw4MSkKICAgIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcKICAgICAgQU5EIHAuSUQgTk9UIElOIChTRUxFQ1QgcHJvZHVjdF9pZCBGUk9NICRtYXAgV0hFUkUgaXNfYWN0aXZlPTEpIik7CiAgZm9yZWFjaCgkaWRzIGFzICRwaWQpewogICAgJHBpZD0oaW50KSRwaWQ7CiAgICAkYz0oc3RyaW5nKSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgcG9zdF9jb250ZW50IEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgSUQ9JWQiLCRwaWQpKTsKICAgIGlmKCRjPT09JycgfHwgc3RyaXBvcygkYywnUmVrb21lbmR1b2phbWFzIGtpZWtpcyBwZXIgcGFyJyk9PT1mYWxzZSkgY29udGludWU7CiAgICAkcD13Y19nZXRfcHJvZHVjdCgkcGlkKTsKICAgICRpPXN0cmlwb3MoJGMsJ1Jla29tZW5kdW9qYW1hcyBraWVraXMgcGVyIHBhcicpOyAkc2VnPXN1YnN0cigkYywkaSw1MDAwKTsKICAgICR0MT1zdHJpcG9zKCRzZWcsJzx0YWJsZScpOwogICAgJHJlYz1hcnJheSgnaWQnPT4kcGlkLCduJz0+JHA/bWJfc3Vic3RyKCRwLT5nZXRfbmFtZSgpLDAsNDIpOm51bGwsJ3R1cmlfdGFibGUnPT4oJHQxIT09ZmFsc2UpKTsKICAgIGlmKCR0MT09PWZhbHNlKXsKICAgICAgLy8ga2FpcCBhdHJvZG8gc2VrY2lqYSBCRSBsZW50ZWxlcwogICAgICAkcmVjWydmcmFnbWVudGFzJ109bWJfc3Vic3RyKHByZWdfcmVwbGFjZSgnL1xzKy91JywnICcsc3RyaXBfdGFncyhzdWJzdHIoJHNlZywwLDcwMCkpKSwwLDQwMCk7CiAgICB9IGVsc2UgewogICAgICAkdDI9c3RyaXBvcygkc2VnLCc8L3RhYmxlPicpOyAkdGJsPXN1YnN0cigkc2VnLCR0MSwkdDItJHQxKzgpOwogICAgICBwcmVnX21hdGNoX2FsbCgnLzx0cltePl0qPiguKj8pPFwvdHI+L2lzJywkdGJsLCRtcik7CiAgICAgICRyZWNbJ2VpbHVjaXVfaHRtbCddPWNvdW50KCRtclsxXSk7CiAgICAgICRzYW1wbGU9YXJyYXkoKTsKICAgICAgZm9yZWFjaChhcnJheV9zbGljZSgkbXJbMV0sMCw1KSBhcyAkdHIpewogICAgICAgIHByZWdfbWF0Y2hfYWxsKCcvPHRbZGhdW14+XSo+KC4qPyk8XC90W2RoXT4vaXMnLCR0ciwkbXQpOwogICAgICAgICRjZWxscz1hcnJheSgpOwogICAgICAgIGZvcmVhY2goJG10WzFdIGFzICRjYykgJGNlbGxzW109cHJlZ19yZXBsYWNlKCcvXHMrL3UnLCcgJyx0cmltKGh0bWxfZW50aXR5X2RlY29kZShzdHJpcF90YWdzKCRjYyksRU5UX1FVT1RFUywnVVRGLTgnKSkpOwogICAgICAgICRzYW1wbGVbXT1pbXBsb2RlKCcgwqYgJywkY2VsbHMpOwogICAgICB9CiAgICAgICRyZWNbJ3B2eiddPSRzYW1wbGU7CiAgICB9CiAgICAkb1sncHJvZHVrdGFpJ11bXT0kcmVjOwogIH0KICAkb1sndmlzbyddPWlzc2V0KCRvWydwcm9kdWt0YWknXSk/Y291bnQoJG9bJ3Byb2R1a3RhaSddKTowOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
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
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'LIKO '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 5');
  const r=execSync('curl -sk --max-time 90 "https://dev.avesa.lt/?ps_liko=Likox"',{maxBuffer:20e6,timeout:110000}).toString();
  const i=r.indexOf('{'),k=r.lastIndexOf('}');
  if(i>=0&&k>i){ try{ o.result=JSON.parse(r.slice(i,k+1)); }catch(e){ o.rawslice=r.slice(i,i+400); } }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('liko.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
