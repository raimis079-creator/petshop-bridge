import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKLyoqCiAqIFMzMDFiOiAxNjU4OCB0dXJpIFTEhCBQQVTEriB0dXJpbsSvIGthaXAgMTY3MTIg4oCUIGNoZWNrc3VtIHVuaWthbHVzLCB0YWQgYW50cmEKICogbGVudGVsxJcgbmVrdXJpYW1hLiBUZWlzaW5nYTogcHJpanVuZ3RpIHByaWUgRVNBTU9TICh2aWVuYSBsZW50ZWzElywgZHUgcHJvZHVrdGFpKS4KICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19xMyddKSB8fCAkX0dFVFsncHNfcTMnXSE9PSdRM3gnKSByZXR1cm47CiAgd2hpbGUob2JfZ2V0X2xldmVsKCkpIG9iX2VuZF9jbGVhbigpOwogIGdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCk7CiAgJHNyYz0xNjcxMjsgJGRzdD0xNjU4ODsKICAkdGlkPShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBmZWVkaW5nX3RhYmxlX2lkIEZST00geyRwZn1wc19mZWVkaW5nX21hcCBXSEVSRSBwcm9kdWN0X2lkPSVkIEFORCBpc19hY3RpdmU9MSBMSU1JVCAxIiwkc3JjKSk7CiAgJG9bJ3NhbGluaW9fbGVudGVsZSddPSR0aWQ7CiAgaWYoISR0aWQpeyBlY2hvIGpzb25fZW5jb2RlKCRvK2FycmF5KCdlcnInPT4nbmVyYSBzYWxpbmlvJykpOyBleGl0OyB9CgogIC8vIFBBVElLUkE6IGFyIHR1cmlueXMgdGlrcmFpIHRva3MgcGF0IOKAlCBuZXNpZWphbSBha2xhaQogICR0PSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgYnJhbmQsc3BlY2llcyxzY29wZSxjaGVja3N1bSBGUk9NIHskcGZ9cHNfZmVlZGluZ190YWJsZXMgV0hFUkUgaWQ9JWQiLCR0aWQpLEFSUkFZX0EpOwogICRvWydsZW50ZWxlJ109JHQ7CiAgJHBvc3Q9Z2V0X3Bvc3QoJGRzdCk7CiAgJGM9JHBvc3Q/JHBvc3QtPnBvc3RfY29udGVudDonJzsKICAkaT1zdHJpcG9zKCRjLCdSZWtvbWVuZHVvamFtYXMga2lla2lzIHBlciBwYXInKTsKICAkc2VnPSRpIT09ZmFsc2U/cHJlZ19yZXBsYWNlKCcvXHMrL3UnLCcgJyxodG1sX2VudGl0eV9kZWNvZGUoc3RyaXBfdGFncyhzdWJzdHIoJGMsJGksMTUwMCkpLEVOVF9RVU9URVMsJ1VURi04JykpOicnOwogIHByZWdfbWF0Y2hfYWxsKCcvKFtcZF0rKD86Wy4sXVtcZF0rKT8pXHMqa2dccypbOlwt4oCTXVxzKihbXGRdKyg/OlsuLF1bXGRdKyk/KVxzKig/Olst4oCT4oCUXVxzKihbXGRdKyg/OlsuLF1bXGRdKyk/KSk/XHMqZy9pdScsJHNlZywkbSxQUkVHX1NFVF9PUkRFUik7CiAgJHJvd3M9YXJyYXkoKTsKICBmb3JlYWNoKCRtIGFzICR4KXsKICAgICR3PShmbG9hdClzdHJfcmVwbGFjZSgnLCcsJy4nLCR4WzFdKTsgJGE9KGZsb2F0KXN0cl9yZXBsYWNlKCcsJywnLicsJHhbMl0pOwogICAgJGI9KGlzc2V0KCR4WzNdKSYmJHhbM10hPT0nJyk/KGZsb2F0KXN0cl9yZXBsYWNlKCcsJywnLicsJHhbM10pOiRhOwogICAgJHJvd3NbXT1hcnJheSgkdywkdywkYSwkYixudWxsLG51bGwpOwogIH0KICAkb1snZHN0X2VpbHVjaXUnXT1jb3VudCgkcm93cyk7CiAgJG9bJ2RzdF9jaGVja3N1bSddPWhhc2goJ3NoYTI1NicsanNvbl9lbmNvZGUoJHJvd3MpKTsKICAkb1snc3V0YW1wYSddPSgkb1snZHN0X2NoZWNrc3VtJ109PT0kdFsnY2hlY2tzdW0nXSk7CiAgLy8gaXIgcnVzaXMvc2NvcGUgdHVyaSBzdXRhcHRpCiAgJGNhdHM9d3BfZ2V0X3Bvc3RfdGVybXMoJGRzdCwncHJvZHVjdF9jYXQnLGFycmF5KCdmaWVsZHMnPT4naWRzJykpOwogICRzcD1pbl9hcnJheSg4MSwoYXJyYXkpJGNhdHMpPydjYXQnOidkb2cnOwogICRvWydkc3Rfc3BlY2llcyddPSRzcDsgJG9bJ3J1c2lzX3N1dGFtcGEnXT0oJHNwPT09JHRbJ3NwZWNpZXMnXSk7CgogIGlmKGlzc2V0KCRfR0VUWydjb25maXJtJ10pICYmICRfR0VUWydjb25maXJtJ109PT0nTElOSycgJiYgJG9bJ3N1dGFtcGEnXSAmJiAkb1sncnVzaXNfc3V0YW1wYSddKXsKICAgIGlmKCR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgMSBGUk9NIHskcGZ9cHNfZmVlZGluZ19tYXAgV0hFUkUgcHJvZHVjdF9pZD0lZCBBTkQgaXNfYWN0aXZlPTEiLCRkc3QpKSl7CiAgICAgICRvWydqYXVfc3VzaWV0YXMnXT0xOwogICAgfSBlbHNlIHsKICAgICAgJHI9JHdwZGItPmluc2VydCgkcGYuJ3BzX2ZlZWRpbmdfbWFwJyxhcnJheSgnZmVlZGluZ190YWJsZV9pZCc9PiR0aWQsJ3Byb2R1Y3RfaWQnPT4kZHN0LCdpc19hY3RpdmUnPT4xKSk7CiAgICAgICRvWydzdXNpZXRhJ109JHI/MTowOyAkb1snZXJyMiddPSR3cGRiLT5sYXN0X2Vycm9yOwogICAgfQogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
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
const o={marker:'S301b'}; let sid=null;
try{
  const php = Buffer.from(PHPB64,'base64').toString('utf8');
  let mk=null;
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'S301B '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 5');
  let r=execSync('curl -sk --max-time 60 "https://dev.avesa.lt/?ps_q3=Q3x"',{maxBuffer:20e6}).toString();
  let i=r.indexOf('{'),k=r.lastIndexOf('}');
  if(i>=0&&k>i) o.check=JSON.parse(r.slice(i,k+1));
  execSync('sleep 3');
  r=execSync('curl -sk --max-time 60 "https://dev.avesa.lt/?ps_q3=Q3x&confirm=LINK"',{maxBuffer:20e6}).toString();
  i=r.indexOf('{'); k=r.lastIndexOf('}');
  if(i>=0&&k>i) o.link=JSON.parse(r.slice(i,k+1));
  execSync('sleep 4');
  const call=(b)=>{ fs.writeFileSync('/tmp/cb.json', JSON.stringify(b));
    const x=execSync('curl -sk --max-time 45 -X POST -H "Content-Type: application/json" --data-binary @/tmp/cb.json "https://dev.avesa.lt/wp-json/petshop/v1/feeding-calc"',{maxBuffer:8e6,timeout:60000}).toString();
    try{ return JSON.parse(x); }catch(e){ return {}; } };
  const pick=(r2)=>({st:r2.status,norm:(r2.norm_min_g??null)+'-'+(r2.norm_max_g??null),days:(r2.days_min??null)+'-'+(r2.days_max??null)});
  o.t16588=pick(call({product_id:16588,weight_kg:5,species_code:'cat'}));
  o.t16712=pick(call({product_id:16712,weight_kg:5,species_code:'cat'}));
  if(sid!==null){ try{execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
}catch(e){ o.err=String(e).slice(0,250); }
putB64('s301b.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
