import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2FjYyddKSB8fCAkX0dFVFsncHNfYWNjJ10hPT0nQWNjeCcpIHJldHVybjsKICB3aGlsZShvYl9nZXRfbGV2ZWwoKSkgb2JfZW5kX2NsZWFuKCk7CiAgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgpOwogICRwaWQ9MjA0MDM7CiAgJHBvc3Q9Z2V0X3Bvc3QoJHBpZCk7CiAgJGM9JHBvc3Q/JHBvc3QtPnBvc3RfY29udGVudDonJzsKICAkb1snY29udGVudF9pbGdpcyddPXN0cmxlbigkYyk7CiAgLy8gYXIgc2VyaW1vIGxlbnRlbGUgWVJBIHBvc3RfY29udGVudAogICRpPXN0cmlwb3MoJGMsJ8WgxJdyaW1vJyk7CiAgJG9bJ3NlcmltYXNfY29udGVudCddPSgkaSE9PWZhbHNlKTsKICBpZigkaSE9PWZhbHNlKSAkb1snZnJhZ21lbnRhcyddPW1iX3N1YnN0cigkYyxtYXgoMCwkaS0xMDApLDEyMDApOwogIC8vIG1ldGEgbGF1a2FpCiAgJG1ldGE9JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgbWV0YV9rZXksTEVGVChtZXRhX3ZhbHVlLDMwMCkgdiBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IFdIRVJFIHBvc3RfaWQ9JWQgQU5EIChtZXRhX2tleSBMSUtFICclJXNlcmltJSUnIE9SIG1ldGFfa2V5IExJS0UgJyUlZmVlZCUlJyBPUiBtZXRhX2tleSBMSUtFICclJW5vcm0lJScgT1IgbWV0YV92YWx1ZSBMSUtFICclJUtpZWtpcyAvIDI0JSUnKSIsJHBpZCksQVJSQVlfQSk7CiAgJG9bJ21ldGEnXT0kbWV0YTsKICAvLyB2aXNpIG1ldGEgcmFrdGFpCiAgJG9bJ3Zpc2lfcmFrdGFpJ109JHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoIlNFTEVDVCBtZXRhX2tleSBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IFdIRVJFIHBvc3RfaWQ9JWQiLCRwaWQpKTsKICAvLyBrdXIgcGFyc2VyaXMKICAkdD0kd3BkYi0+cHJlZml4LidzbmlwcGV0cyc7CiAgJHNuPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlIEZST00gJHQgV0hFUkUgbmFtZSBMSUtFICclYWNjb3JkaW9uJScgT1IgbmFtZSBMSUtFICclQWtvcmRlb24lJyBPUiBjb2RlIExJS0UgJyXFoMSXcmltbyBpbnN0cnVrY2lqYSUnIExJTUlUIDUiLEFSUkFZX0EpOwogICRvWydzbmlwcGV0YWknXT0kc247CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
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
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'ACC '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  const r=execSync('curl -sk --max-time 70 "https://dev.avesa.lt/?ps_acc=Accx"',{maxBuffer:8e6,timeout:85000}).toString();
  const i=r.indexOf('{'),k=r.lastIndexOf('}');
  if(i>=0&&k>i){ try{ o.result=JSON.parse(r.slice(i,k+1)); }catch(e){ o.rawslice=r.slice(i,i+400); } }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('acc.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
