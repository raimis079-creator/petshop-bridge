import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2xnJ10pIHx8ICRfR0VUWydwc19sZyddIT09J0xneCcpIHJldHVybjsKICAkbz1hcnJheSgpOyAkbmVlZGxlPSdQcmlzaWp1bmfEmSBnYWzEl3NpdGUnOwogIC8vIDEuIHNuaXBwZXR1b3NlCiAgZ2xvYmFsICR3cGRiOyAkdD0kd3BkYi0+cHJlZml4LidzbmlwcGV0cyc7CiAgaWYoJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJyR0JyIpKXsKICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGlkLG5hbWUsYWN0aXZlLHNjb3BlIEZST00gJHQgV0hFUkUgY29kZSBMSUtFICVzIiwnJScuJHdwZGItPmVzY19saWtlKCRuZWVkbGUpLiclJyksQVJSQVlfQSk7CiAgICAkb1snc25pcHBldGFpJ109JHJvd3M7CiAgICBpZigkcm93cyl7ICRvWydzbmlwcGV0X2lkJ109JHJvd3NbMF1bJ2lkJ107IH0KICB9CiAgLy8gMi4gZmFpbHVvc2UgKHRlbWEgKyBwbHVnaW5haSkKICAkZGlycz1hcnJheShnZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKSwgZ2V0X3RlbXBsYXRlX2RpcmVjdG9yeSgpLCBXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlJywgV1BNVV9QTFVHSU5fRElSKTsKICAkaGl0cz1hcnJheSgpOwogIGZvcmVhY2goJGRpcnMgYXMgJGQpewogICAgaWYoIWlzX2RpcigkZCkpIGNvbnRpbnVlOwogICAgJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkZCksIFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3I6OlNLSVBfRE9UUyk7CiAgICAkbj0wOwogICAgZm9yZWFjaCgkaXQgYXMgJGYpewogICAgICBpZigkbj4yNTAwKSBicmVhazsKICAgICAgaWYoISRmLT5pc0ZpbGUoKSkgY29udGludWU7CiAgICAgICRlPXN0cnRvbG93ZXIoJGYtPmdldEV4dGVuc2lvbigpKTsKICAgICAgaWYoIWluX2FycmF5KCRlLGFycmF5KCdwaHAnLCdqcycsJ2NzcycpLHRydWUpKSBjb250aW51ZTsgJG4rKzsKICAgICAgJGM9QGZpbGVfZ2V0X2NvbnRlbnRzKCRmLT5nZXRQYXRobmFtZSgpKTsKICAgICAgaWYoJGMgJiYgc3RycG9zKCRjLCRuZWVkbGUpIT09ZmFsc2UpeyAkaGl0c1tdPSRmLT5nZXRQYXRobmFtZSgpOyB9CiAgICB9CiAgfQogICRvWydmYWlsYWknXT0kaGl0czsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
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
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'LG '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  try{ const r=execSync('curl -sk --max-time 90 "https://dev.avesa.lt/?ps_lg=Lgx"',{maxBuffer:8e6,timeout:110000}).toString();
    const i=r.indexOf('{'),k=r.lastIndexOf('}'); if(i>=0&&k>i) o.result=JSON.parse(r.slice(i,k+1)); else o.raw=r.slice(0,300); }catch(e){ o.e=String(e).slice(0,150); }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('lg.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
