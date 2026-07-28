import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX29vciddKSB8fCAkX0dFVFsncHNfb29yJ10hPT0nT29yeCcpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCk7ICR0PSR3cGRiLT5wcmVmaXguJ3BzX3BldHMnOwogICRwZXQ9JHdwZGItPmdldF9yb3coIlNFTEVDVCAqIEZST00gJHQgV0hFUkUgcGV0X25hbWUgTElLRSAnxaB1bml1cyUnIEFORCBkZWxldGVkX2F0IElTIE5VTEwgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxIik7CiAgaWYoISRwZXQpeyAkcGV0PSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgKiBGUk9NICR0IFdIRVJFIHNwZWNpZXM9J2RvZycgQU5EIHByaW1hcnlfcHJvZHVjdF9pZCBJUyBOT1QgTlVMTCBBTkQgZGVsZXRlZF9hdCBJUyBOVUxMIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMSIpOyB9CiAgJG9bJ3BldCddPWFycmF5KCdpZCc9PiRwZXQtPmlkLCd2YXJkYXMnPT4kcGV0LT5wZXRfbmFtZSwnc3ZvcmlzJz0+JHBldC0+Y3VycmVudF93ZWlnaHRfa2csCiAgICAncHJvZHVrdGFzJz0+JHBldC0+cHJpbWFyeV9wcm9kdWN0X2lkLCdha3R5dnVtYXMnPT4kcGV0LT5hY3Rpdml0eV9oaW50ID8/IG51bGwpOwogICRwaWQ9KGludCkkcGV0LT5wcmltYXJ5X3Byb2R1Y3RfaWQ7CiAgJHA9d2NfZ2V0X3Byb2R1Y3QoJHBpZCk7CiAgJG9bJ3Byb2R1a3RhcyddPWFycmF5KCdpZCc9PiRwaWQsJ24nPT4kcD9tYl9zdWJzdHIoJHAtPmdldF9uYW1lKCksMCw1MCk6bnVsbCk7CgogIC8vIGxlbnRlbGVzIGVpbHV0ZXMKICAkbWFwPSR3cGRiLT5wcmVmaXguJ3BzX2ZlZWRpbmdfbWFwJzsgJHJvd3M9JHdwZGItPnByZWZpeC4ncHNfZmVlZGluZ19yb3dzJzsKICAkdGlkPShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBmZWVkaW5nX3RhYmxlX2lkIEZST00gJG1hcCBXSEVSRSBwcm9kdWN0X2lkPSVkIEFORCBpc19hY3RpdmU9MSBMSU1JVCAxIiwkcGlkKSk7CiAgJG9bJ3RhYmxlX2lkJ109JHRpZDsKICAkb1snaW50ZXJ2YWxhcyddPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgTUlOKHdlaWdodF9mcm9tX2tnKSBtbiwgTUFYKHdlaWdodF90b19rZykgbXgsIENPVU5UKCopIGMgRlJPTSAkcm93cyBXSEVSRSBmZWVkaW5nX3RhYmxlX2lkPSVkIiwkdGlkKSxBUlJBWV9BKTsKICAkb1snZWlsdXRlcyddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHdlaWdodF9mcm9tX2tnLHdlaWdodF90b19rZyxhbW91bnRfZnJvbV9nLGFtb3VudF90b19nLGNlbGxfdHlwZSxjb25kaXRpb25fcmF3IEZST00gJHJvd3MgV0hFUkUgZmVlZGluZ190YWJsZV9pZD0lZCBPUkRFUiBCWSByb3dfb3JkZXIgTElNSVQgMTIiLCR0aWQpLEFSUkFZX0EpOwoKICAvLyBrYSBncmF6aW5hIGNhbGMKICBmb3JlYWNoKGFycmF5KChmbG9hdCkkcGV0LT5jdXJyZW50X3dlaWdodF9rZywgMTMuMCwgMjAuMCkgYXMgJHcpewogICAgJHI9UGV0c2hvcF9GZWVkaW5nX1NlcnZpY2U6OmNhbGMoYXJyYXkoJ3Byb2R1Y3RfaWQnPT4kcGlkLCd3ZWlnaHRfa2cnPT4kdywnc3BlY2llc19jb2RlJz0+J2RvZycpKTsKICAgICRvWydjYWxjJ11bXT1hcnJheSgnc3ZvcmlzJz0+JHcsJ3N0YXR1cyc9PiRyWydzdGF0dXMnXT8/bnVsbCwncmVhc29ucyc9PiRyWydyZWFzb25fY29kZXMnXT8/bnVsbCwKICAgICAgJ21zZyc9Pmlzc2V0KCRyWydtZXNzYWdlX2x0J10pP21iX3N1YnN0cigkclsnbWVzc2FnZV9sdCddLDAsODApOm51bGwsCiAgICAgICdub3JtJz0+KCRyWydub3JtX21pbl9nJ10/P251bGwpLictJy4oJHJbJ25vcm1fbWF4X2cnXT8/bnVsbCkpOwogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
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
