import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2hrJ10pIHx8ICRfR0VUWydwc19oayddIT09J0hreCcpIHJldHVybjsKICBnbG9iYWwgJHdwX2ZpbHRlcjsgJG89YXJyYXkoKTsKICBmb3JlYWNoKGFycmF5KCd3b29jb21tZXJjZV9hY2NvdW50X2Rhc2hib2FyZCcsJ3dvb2NvbW1lcmNlX2FjY291bnRfY29udGVudCcsJ3dvb2NvbW1lcmNlX2JlZm9yZV9hY2NvdW50X25hdmlnYXRpb24nLCd3b29jb21tZXJjZV9hZnRlcl9hY2NvdW50X25hdmlnYXRpb24nKSBhcyAkaCl7CiAgICBpZihlbXB0eSgkd3BfZmlsdGVyWyRoXSkpIHsgJG9bJGhdPSdORVJBJzsgY29udGludWU7IH0KICAgICRsaXN0PWFycmF5KCk7CiAgICBmb3JlYWNoKCR3cF9maWx0ZXJbJGhdLT5jYWxsYmFja3MgYXMgJHByaW89PiRjYnMpewogICAgICBmb3JlYWNoKCRjYnMgYXMgJGlkPT4kY2IpewogICAgICAgICRmPSRjYlsnZnVuY3Rpb24nXTsKICAgICAgICBpZihpc19hcnJheSgkZikpICRuPShpc19vYmplY3QoJGZbMF0pP2dldF9jbGFzcygkZlswXSk6JGZbMF0pLic6OicuJGZbMV07CiAgICAgICAgZWxzZWlmKCRmIGluc3RhbmNlb2YgQ2xvc3VyZSkgJG49J0Nsb3N1cmUnOwogICAgICAgIGVsc2UgJG49KHN0cmluZykkZjsKICAgICAgICAkbGlzdFtdPWFycmF5KCdwcmlvJz0+JHByaW8sJ2NiJz0+JG4pOwogICAgICB9CiAgICB9CiAgICAkb1skaF09JGxpc3Q7CiAgfQogIC8vIGt1ciB5cmEgZGFzaGJvYXJkLnBocCBzYWJsb25hcwogICRvWydzYWJsb25haSddPWFycmF5KCk7CiAgZm9yZWFjaChhcnJheShnZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKSxnZXRfdGVtcGxhdGVfZGlyZWN0b3J5KCkpIGFzICRkKXsKICAgICRwPSRkLicvd29vY29tbWVyY2UvbXlhY2NvdW50L2Rhc2hib2FyZC5waHAnOwogICAgaWYoZmlsZV9leGlzdHMoJHApKSAkb1snc2FibG9uYWknXVtdPSRwOwogIH0KICAkd2M9V1BfUExVR0lOX0RJUi4nL3dvb2NvbW1lcmNlL3RlbXBsYXRlcy9teWFjY291bnQvZGFzaGJvYXJkLnBocCc7CiAgaWYoZmlsZV9leGlzdHMoJHdjKSl7ICRvWydzYWJsb25haSddW109JHdjOyAkb1snd2Nfc2FibG9ub190dXJpbnlzJ109c3Vic3RyKGZpbGVfZ2V0X2NvbnRlbnRzKCR3YyksMCwxMjAwKTsgfQogICRvWyduYXVkb2phbWFzJ109ZnVuY3Rpb25fZXhpc3RzKCd3Y19sb2NhdGVfdGVtcGxhdGUnKT93Y19sb2NhdGVfdGVtcGxhdGUoJ215YWNjb3VudC9kYXNoYm9hcmQucGhwJyk6KGZ1bmN0aW9uX2V4aXN0cygnd2NfZ2V0X3RlbXBsYXRlJyk/J3djX2dldF90ZW1wbGF0ZSB5cmEnOic/Jyk7CiAgaWYoZnVuY3Rpb25fZXhpc3RzKCd3b29jb21tZXJjZV9sb2NhdGVfdGVtcGxhdGUnKSkgJG9bJ25hdWRvamFtYXMnXT13b29jb21tZXJjZV9sb2NhdGVfdGVtcGxhdGUoJ215YWNjb3VudC9kYXNoYm9hcmQucGhwJywnJywnJyk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
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
  for(let a=0;a<2;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'HK (temp)',code:php,scope:'front-end',active:true,priority:5}); break; }catch(e){ execSync('sleep 5'); } }
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  try{ const r=execSync('curl -sk --max-time 70 "https://dev.avesa.lt/?ps_hk=Hkx"',{maxBuffer:8e6,timeout:85000}).toString();
    const i=r.indexOf('{'),k=r.lastIndexOf('}'); if(i>=0&&k>i) o.result=JSON.parse(r.slice(i,k+1)); else o.raw=r.slice(0,250); }catch(e){ o.e=String(e).slice(0,100); }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('hk.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
