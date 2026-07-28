import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX29vciddKSB8fCAkX0dFVFsncHNfb29yJ10hPT0nT29yeCcpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCk7ICR0PSR3cGRiLT5wcmVmaXguJ3BzX3BldHMnOwogICRwZXQ9JHdwZGItPmdldF9yb3coIlNFTEVDVCAqIEZST00gJHQgV0hFUkUgcGV0X25hbWUgTElLRSAnxaB1bml1cyUnIEFORCBkZWxldGVkX2F0IElTIE5VTEwgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxIik7CiAgaWYoISRwZXQpeyBlY2hvIGpzb25fZW5jb2RlKGFycmF5KCdlcnInPT4nbmVyYXN0YXMnKSk7IGV4aXQ7IH0KICAkb1sncGV0J109YXJyYXkoJ2lkJz0+JHBldC0+aWQsJ3ZhcmRhcyc9PiRwZXQtPnBldF9uYW1lLCdydXNpcyc9PiRwZXQtPnNwZWNpZXMsCiAgICAnc3ZvcmlzJz0+JHBldC0+Y3VycmVudF93ZWlnaHRfa2csJ3Byb2R1a3Rhcyc9PiRwZXQtPnByaW1hcnlfcHJvZHVjdF9pZCk7CiAgJHBpZD0oaW50KSRwZXQtPnByaW1hcnlfcHJvZHVjdF9pZDsKICAkcD13Y19nZXRfcHJvZHVjdCgkcGlkKTsKICAkb1sncHJvZHVrdGFzJ109JHA/bWJfc3Vic3RyKCRwLT5nZXRfbmFtZSgpLDAsNjApOm51bGw7CgogIC8vIGxlbnRlbGVzIGVpbHV0ZXMKICAkbWFwPSR3cGRiLT5wcmVmaXguJ3BzX2ZlZWRpbmdfbWFwJzsgJHJvd3M9JHdwZGItPnByZWZpeC4ncHNfZmVlZGluZ19yb3dzJzsKICAkdGlkPShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBmZWVkaW5nX3RhYmxlX2lkIEZST00gJG1hcCBXSEVSRSBwcm9kdWN0X2lkPSVkIEFORCBpc19hY3RpdmU9MSBMSU1JVCAxIiwkcGlkKSk7CiAgJG9bJ3RhYmxlX2lkJ109JHRpZDsKICAkb1snaW50ZXJ2YWxhcyddPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKAogICAgIlNFTEVDVCBNSU4od2VpZ2h0X2Zyb21fa2cpIG1uLCBNQVgod2VpZ2h0X3RvX2tnKSBteCwgQ09VTlQoKikgYyBGUk9NICRyb3dzIFdIRVJFIGZlZWRpbmdfdGFibGVfaWQ9JWQiLCR0aWQpLEFSUkFZX0EpOwogICRvWydlaWx1dGVzJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKAogICAgIlNFTEVDVCB3ZWlnaHRfZnJvbV9rZyB3Ziwgd2VpZ2h0X3RvX2tnIHd0LCBhbW91bnRfZnJvbV9nIGFmLCBhbW91bnRfdG9fZyBhdDIsIGNlbGxfdHlwZSwgY29uZGl0aW9uX3JhdwogICAgIEZST00gJHJvd3MgV0hFUkUgZmVlZGluZ190YWJsZV9pZD0lZCBPUkRFUiBCWSByb3dfb3JkZXIgTElNSVQgMTIiLCR0aWQpLEFSUkFZX0EpOwoKICAvLyBrYSBncmF6aW5hIGNhbGMgc3UgVElLUlUgc3Zvcml1CiAgJHc9KGZsb2F0KSRwZXQtPmN1cnJlbnRfd2VpZ2h0X2tnOwogIGZvcmVhY2goYXJyYXkoJHcsIDEwLjAsIDEzLjAsIDIwLjApIGFzICR0dyl7CiAgICB0cnl7CiAgICAgICRyPVBldHNob3BfRmVlZGluZ19TZXJ2aWNlOjpjYWxjKGFycmF5KCdwcm9kdWN0X2lkJz0+JHBpZCwnd2VpZ2h0X2tnJz0+JHR3LCdzcGVjaWVzX2NvZGUnPT4kcGV0LT5zcGVjaWVzKSk7CiAgICAgICRvWydjYWxjJ11bXT1hcnJheSgnc3ZvcmlzJz0+JHR3LCdzdGF0dXMnPT4kclsnc3RhdHVzJ10sJ3JlYXNvbic9PiRyWydyZWFzb25fY29kZXMnXSwKICAgICAgICAnbXNnJz0+aXNzZXQoJHJbJ21lc3NhZ2VfbHQnXSk/bWJfc3Vic3RyKChzdHJpbmcpJHJbJ21lc3NhZ2VfbHQnXSwwLDkwKTpudWxsLAogICAgICAgICdub3JtJz0+KCRyWydub3JtX21pbl9nJ10/P251bGwpLictJy4oJHJbJ25vcm1fbWF4X2cnXT8/bnVsbCkpOwogICAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydjYWxjJ11bXT1hcnJheSgnc3ZvcmlzJz0+JHR3LCdlcnInPT4kZS0+Z2V0TWVzc2FnZSgpKTsgfQogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
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
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'OOR '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  try{ const r=execSync('curl -sk --max-time 70 "https://dev.avesa.lt/?ps_oor=Oorx"',{maxBuffer:8e6,timeout:85000}).toString();
    const i=r.indexOf('{'),k=r.lastIndexOf('}'); if(i>=0&&k>i) o.result=JSON.parse(r.slice(i,k+1)); else o.raw=r.slice(0,300); }catch(e){ o.e=String(e).slice(0,150); }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('oor.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
