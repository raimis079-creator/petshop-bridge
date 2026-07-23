import { execSync } from 'child_process';
import fs from 'fs';
const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX21wNCddKSB8fCAkX0dFVFsncHNfbXA0J10hPT0nTXMyM3gnKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgpOwogIC8vIDEpIERQIHBha2FpIChwYWdhbCBtZXRhIGFyYmEgcGF2YWRpbmltYSkg4oCUIGFyIHR1cmkgcGFfcGFrdW90ZXNfZHlkaXMKICAkZHA9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcC5JRCxwLnBvc3RfdGl0bGUgRlJPTSB7JHdwZGItPnBvc3RzfSBwCiAgICBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnCiAgICBBTkQgKEVYSVNUUyhTRUxFQ1QgMSBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IG0gV0hFUkUgbS5wb3N0X2lkPXAuSUQgQU5EIG0ubWV0YV9rZXkgTElLRSAnJWRwJWJhc2UlJykKICAgICAgICAgT1IgcC5wb3N0X3RpdGxlIFJFR0VYUCAnWzAtOV1bWzpzcGFjZTpdXSooeHxYKVtbOnNwYWNlOl1dKlswLTldJykiLCBBUlJBWV9BKTsKICAkbWlzcz1hcnJheSgpOwogIGZvcmVhY2goJGRwIGFzICRyKXsKICAgICR0PXdwX2dldF9wb3N0X3Rlcm1zKCRyWydJRCddLCdwYV9wYWt1b3Rlc19keWRpcycsYXJyYXkoJ2ZpZWxkcyc9PiduYW1lcycpKTsKICAgIGlmKCEkdCkgJG1pc3NbXT1hcnJheSgnaWQnPT4oaW50KSRyWydJRCddLCd0Jz0+bWJfc3Vic3RyKCRyWydwb3N0X3RpdGxlJ10sMCw2MCkpOwogIH0KICAkb1snZHBfYmVfdGVybWlubyddPSRtaXNzOyAkb1snZHBfdmlzbyddPWNvdW50KCRkcCk7CiAgLy8gMikgY2F0NzIvODEgcHVibGlzaCBpbnN0b2NrIGJlIGpva2lvIHBha3VvdGVzIHRlcm1pbm8KICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLklELHAucG9zdF90aXRsZSBGUk9NIHskd3BkYi0+cG9zdHN9IHAKICAgIEpPSU4geyR3cGRiLT50ZXJtX3JlbGF0aW9uc2hpcHN9IHRyIE9OIHRyLm9iamVjdF9pZD1wLklECiAgICBKT0lOIHskd3BkYi0+dGVybV90YXhvbm9teX0gdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIEFORCB0dC50YXhvbm9teT0ncHJvZHVjdF9jYXQnIEFORCB0dC50ZXJtX2lkIElOICg3Miw4MSkKICAgIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgR1JPVVAgQlkgcC5JRCIsIEFSUkFZX0EpOwogICRuPTA7ICRub25lPWFycmF5KCk7CiAgZm9yZWFjaCgkcm93cyBhcyAkcil7CiAgICAkdD13cF9nZXRfcG9zdF90ZXJtcygkclsnSUQnXSwncGFfcGFrdW90ZXNfZHlkaXMnLGFycmF5KCdmaWVsZHMnPT4nbmFtZXMnKSk7CiAgICBpZighJHQpeyAkbisrOyBpZihjb3VudCgkbm9uZSk8MTUpICRub25lW109YXJyYXkoJ2lkJz0+KGludCkkclsnSUQnXSwndCc9Pm1iX3N1YnN0cigkclsncG9zdF90aXRsZSddLDAsNTUpKTsgfQogIH0KICAkb1snbWFpc3Rhc192aXNvJ109Y291bnQoJHJvd3MpOyAkb1snYmVfcGFrdW90ZXNfbiddPSRuOyAkb1snYmVfcGFrdW90ZXNfcHZ6J109JG5vbmU7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'MP4 (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
execSync('sleep 3');
let r='';
try{ r=execSync('curl -sk "https://dev.avesa.lt/?ps_mp4=Ms23x"',{maxBuffer:100*1024*1024,timeout:90000}).toString(); }catch(e){ r='ERR '+String(e).slice(0,200); }
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('mp4.json', Buffer.from(r).toString('base64'));
console.log('done', r.length);
