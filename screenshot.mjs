import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3JnJ10pIHx8ICRfR0VUWydwc19yZyddIT09J1JneCcpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCk7CiAgJHJvd3M9JHdwZGItPnByZWZpeC4ncHNfZmVlZGluZ19yb3dzJzsKICAkdGFicz0kd3BkYi0+cHJlZml4Lidwc19mZWVkaW5nX3RhYmxlcyc7CiAgJG1hcD0kd3BkYi0+cHJlZml4Lidwc19mZWVkaW5nX21hcCc7CiAgJG9bJ3Jvd3Nfc3R1bHBlbGlhaSddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkcm93cyIpOwogICRvWyd0YWJsZXNfc3R1bHBlbGlhaSddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkdGFicyIpOwogIC8vIGtpZWsgZWlsdWNpdSB0dXJpIHN2b3JpbyByaWJhcwogICRjb2xzPSRvWydyb3dzX3N0dWxwZWxpYWknXTsKICAkd21pbj1udWxsOyR3bWF4PW51bGw7CiAgZm9yZWFjaCgkY29scyBhcyAkYyl7IGlmKHByZWdfbWF0Y2goJy93ZWlnaHQuKm1pbnxtaW4uKndlaWdodC9pJywkYykpICR3bWluPSRjOyBpZihwcmVnX21hdGNoKCcvd2VpZ2h0LiptYXh8bWF4Lip3ZWlnaHQvaScsJGMpKSAkd21heD0kYzsgfQogICRvWydzdm9yaW9fc3R1bHBlbGlhaSddPWFycmF5KCdtaW4nPT4kd21pbiwnbWF4Jz0+JHdtYXgpOwogIGlmKCR3bWluICYmICR3bWF4KXsKICAgICRvWydlaWx1Y2l1X3Zpc28nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkcm93cyIpOwogICAgJG9bJ2VpbHVjaXVfc3Vfc3Zvcml1J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHJvd3MgV0hFUkUgYCR3bWluYCBJUyBOT1QgTlVMTCIpOwogICAgLy8gcGF2eXpkemlhaTogcHJvZHVrdG8gaW50ZXJ2YWxhcwogICAgJHBpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBwcm9kdWN0X2lkIEZST00gJG1hcCBXSEVSRSBpc19hY3RpdmU9MSBPUkRFUiBCWSBSQU5EKCkgTElNSVQgNiIpOwogICAgZm9yZWFjaCgkcGlkcyBhcyAkcGlkKXsKICAgICAgJHRpZD0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHRhYmxlX2lkIEZST00gJG1hcCBXSEVSRSBwcm9kdWN0X2lkPSVkIEFORCBpc19hY3RpdmU9MSBMSU1JVCAxIiwkcGlkKSk7CiAgICAgICRyPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgTUlOKGAkd21pbmApIG1uLCBNQVgoYCR3bWF4YCkgbXgsIENPVU5UKCopIGMgRlJPTSAkcm93cyBXSEVSRSB0YWJsZV9pZD0lZCIsJHRpZCksQVJSQVlfQSk7CiAgICAgICRwPXdjX2dldF9wcm9kdWN0KCRwaWQpOwogICAgICAkb1sncGF2eXpkemlhaSddW109YXJyYXkoJ2lkJz0+KGludCkkcGlkLCduJz0+JHA/bWJfc3Vic3RyKCRwLT5nZXRfbmFtZSgpLDAsNDIpOm51bGwsCiAgICAgICAgJ3RhYmxlX2lkJz0+KGludCkkdGlkLCdtaW5fa2cnPT4kclsnbW4nXSwnbWF4X2tnJz0+JHJbJ214J10sJ2VpbHVjaXUnPT4oaW50KSRyWydjJ10pOwogICAgfQogICAgLy8ga2llayBwcm9kdWt0dSB0dXJpIHN2YXJiaXUgaW50ZXJ2YWxhCiAgICAkb1sncHJvZHVrdHVfc3VfaW50ZXJ2YWx1J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKERJU1RJTkNUIG0ucHJvZHVjdF9pZCkgRlJPTSAkbWFwIG0KICAgICAgSk9JTiAkcm93cyByIE9OIHIudGFibGVfaWQ9bS50YWJsZV9pZCBXSEVSRSBtLmlzX2FjdGl2ZT0xIEFORCByLmAkd21pbmAgSVMgTk9UIE5VTEwiKTsKICAgICRvWydwcm9kdWt0dV9tYXBfdmlzbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVChESVNUSU5DVCBwcm9kdWN0X2lkKSBGUk9NICRtYXAgV0hFUkUgaXNfYWN0aXZlPTEiKTsKICB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
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
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'RG '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  try{ const r=execSync('curl -sk --max-time 70 "https://dev.avesa.lt/?ps_rg=Rgx"',{maxBuffer:8e6,timeout:85000}).toString();
    const i=r.indexOf('{'),k=r.lastIndexOf('}'); if(i>=0&&k>i) o.result=JSON.parse(r.slice(i,k+1)); else o.raw=r.slice(0,300); }catch(e){ o.e=String(e).slice(0,150); }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('rg.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
