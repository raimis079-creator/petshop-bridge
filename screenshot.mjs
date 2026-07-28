import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3RwJ10pIHx8ICRfR0VUWydwc190cCddIT09J1RweCcpIHJldHVybjsKICAkbz1hcnJheSgpOwogICRuZWVkbGU9J3RlbXBvcmFyeSBwYXNzd29yZCc7CiAgLy8gMS4gV29vQ29tbWVyY2UgZmFpbGUKICAkd2M9V1BfUExVR0lOX0RJUi4nL3dvb2NvbW1lcmNlLyc7CiAgJGhpdHM9YXJyYXkoKTsKICAkaXQ9bmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCR3Yy4naW5jbHVkZXMnKSk7CiAgJG49MDsKICBmb3JlYWNoKCRpdCBhcyAkZil7CiAgICBpZigkbj4xNTAwKSBicmVhazsKICAgIGlmKCEkZi0+aXNGaWxlKCl8fCRmLT5nZXRFeHRlbnNpb24oKSE9PSdwaHAnKSBjb250aW51ZTsgJG4rKzsKICAgICRjPUBmaWxlX2dldF9jb250ZW50cygkZi0+Z2V0UGF0aG5hbWUoKSk7CiAgICBpZigkYyAmJiBzdHJpcG9zKCRjLCRuZWVkbGUpIT09ZmFsc2UpewogICAgICAkaGl0c1tdPSRmLT5nZXRQYXRobmFtZSgpOwogICAgICAvLyBpc3RyYXVraWFtIGVpbHV0ZQogICAgICBmb3JlYWNoKGV4cGxvZGUoIlxuIiwkYykgYXMgJGk9PiRsbil7IGlmKHN0cmlwb3MoJGxuLCRuZWVkbGUpIT09ZmFsc2UpeyAkb1snZWlsdXRlcyddW109YmFzZW5hbWUoJGYtPmdldFBhdGhuYW1lKCkpLic6Jy4oJGkrMSkuJyAnLnRyaW0oc3Vic3RyKCRsbiwwLDIyMCkpOyB9IH0KICAgIH0KICB9CiAgJG9bJ2ZhaWxhaSddPSRoaXRzOwogIC8vIDIuIGFyIHZhcnRvdG9qYXMgdHVyaSBkZWZhdWx0X3Bhc3N3b3JkX25hZwogIGdsb2JhbCAkd3BkYjsKICAkb1snc3VfbmFnJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdS5JRCwgdS51c2VyX2xvZ2luIEZST00geyR3cGRiLT51c2Vyc30gdQogICAgSk9JTiB7JHdwZGItPnVzZXJtZXRhfSBtIE9OIG0udXNlcl9pZD11LklEIEFORCBtLm1ldGFfa2V5PSdkZWZhdWx0X3Bhc3N3b3JkX25hZycgQU5EIG0ubWV0YV92YWx1ZT0nMScgTElNSVQgNSIsQVJSQVlfQSk7CiAgJG9bJ3N1X25hZ19raWVrJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT51c2VybWV0YX0gV0hFUkUgbWV0YV9rZXk9J2RlZmF1bHRfcGFzc3dvcmRfbmFnJyBBTkQgbWV0YV92YWx1ZT0nMSciKTsKICAvLyAzLiBrdXIga2FiaW5hc2kgcHJhbmVzaW1hcwogIGdsb2JhbCAkd3BfZmlsdGVyOwogIGZvcmVhY2goYXJyYXkoJ3dvb2NvbW1lcmNlX2FjY291bnRfY29udGVudCcsJ3dvb2NvbW1lcmNlX2JlZm9yZV9hY2NvdW50X25hdmlnYXRpb24nLCd3b29jb21tZXJjZV9hY2NvdW50X2Rhc2hib2FyZCcpIGFzICRoKXsKICAgICRsPWFycmF5KCk7CiAgICBpZighZW1wdHkoJHdwX2ZpbHRlclskaF0pKSBmb3JlYWNoKCR3cF9maWx0ZXJbJGhdLT5jYWxsYmFja3MgYXMgJHByaW89PiRjYnMpIGZvcmVhY2goJGNicyBhcyAkY2IpewogICAgICAkZj0kY2JbJ2Z1bmN0aW9uJ107CiAgICAgICRubT1pc19hcnJheSgkZik/KChpc19vYmplY3QoJGZbMF0pP2dldF9jbGFzcygkZlswXSk6JGZbMF0pLic6OicuJGZbMV0pOigkZiBpbnN0YW5jZW9mIENsb3N1cmU/J0Nsb3N1cmUnOihzdHJpbmcpJGYpOwogICAgICAkbFtdPSRwcmlvLic6Jy4kbm07CiAgICB9CiAgICAkb1sna2FibGl1a2FpJ11bJGhdPSRsOwogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
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
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'TP '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  try{ const r=execSync('curl -sk --max-time 80 "https://dev.avesa.lt/?ps_tp=Tpx"',{maxBuffer:8e6,timeout:95000}).toString();
    const i=r.indexOf('{'),k=r.lastIndexOf('}'); if(i>=0&&k>i) o.result=JSON.parse(r.slice(i,k+1)); else o.raw=r.slice(0,300); }catch(e){ o.e=String(e).slice(0,150); }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('tp.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
