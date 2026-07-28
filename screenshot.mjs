import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2NkJ10pIHx8ICRfR0VUWydwc19jZCddIT09J0NkeCcpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCk7ICRmbT0kd3BkYi0+cHJlZml4Lidwc19mZWVkaW5nX21hcCc7CiAgJHBpZD0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgcHJvZHVjdF9pZCBGUk9NICRmbSBXSEVSRSBpc19hY3RpdmU9MSBPUkRFUiBCWSBwcm9kdWN0X2lkIERFU0MgTElNSVQgMSIpOwogICRwPXdjX2dldF9wcm9kdWN0KCRwaWQpOwogICRvWydwcm9kdWt0YXMnXT1hcnJheSgnaWQnPT4kcGlkLCduJz0+JHA/bWJfc3Vic3RyKCRwLT5nZXRfbmFtZSgpLDAsNTApOm51bGwsCiAgICAna2FpbmEnPT4kcD93Y19nZXRfcHJpY2VfdG9fZGlzcGxheSgkcCk6bnVsbCwKICAgICdwYWt1b3RlJz0+JHA/JHAtPmdldF9hdHRyaWJ1dGUoJ3BhX3Bha3VvdGVzX2R5ZGlzJyk6bnVsbCk7CiAgaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0ZlZWRpbmdfU2VydmljZScpKXsKICAgICRvWydtZXRvZGFpJ109Z2V0X2NsYXNzX21ldGhvZHMoJ1BldHNob3BfRmVlZGluZ19TZXJ2aWNlJyk7CiAgICB0cnl7CiAgICAgICRyPVBldHNob3BfRmVlZGluZ19TZXJ2aWNlOjpjYWxjKGFycmF5KCdwcm9kdWN0X2lkJz0+JHBpZCwnd2VpZ2h0X2tnJz0+MjAuMCwnc3BlY2llc19jb2RlJz0+J2RvZycpKTsKICAgICAgJG9bJ1BJTE5BU19BVFNBS1lNQVMnXT0kcjsKICAgIH1jYXRjaChUaHJvd2FibGUgJHQpeyAkb1snZXJyJ109Z2V0X2NsYXNzKCR0KS4nOiAnLiR0LT5nZXRNZXNzYWdlKCk7IH0KICB9IGVsc2UgeyAkb1sna2xhc2UnXT0nTkVSQSc7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
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
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'CD '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  try{ const r=execSync('curl -sk --max-time 70 "https://dev.avesa.lt/?ps_cd=Cdx"',{maxBuffer:8e6,timeout:85000}).toString();
    const i=r.indexOf('{'),k=r.lastIndexOf('}'); if(i>=0&&k>i) o.result=JSON.parse(r.slice(i,k+1)); else o.raw=r.slice(0,300); }catch(e){ o.e=String(e).slice(0,150); }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('cd.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
