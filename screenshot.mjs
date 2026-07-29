import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2JsazInXSkgfHwgJF9HRVRbJ3BzX2JsazInXSE9PSdCbGsyeCcpIHJldHVybjsKICB3aGlsZShvYl9nZXRfbGV2ZWwoKSkgb2JfZW5kX2NsZWFuKCk7CiAgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgpOyAkdD0kd3BkYi0+cHJlZml4Lidwc19wZXRzJzsKICAkcGV0cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCx1c2VyX2lkLHBldF9uYW1lIEZST00gJHQgV0hFUkUgZGVsZXRlZF9hdCBJUyBOVUxMIEFORCBzcGVjaWVzIElOICgnZG9nJywnY2F0JykgT1JERVIgQlkgaWQgREVTQyBMSU1JVCA2IixBUlJBWV9BKTsKICBmb3JlYWNoKCRwZXRzIGFzICRwKXsKICAgIHdwX3NldF9jdXJyZW50X3VzZXIoKGludCkkcFsndXNlcl9pZCddKTsKICAgICRyPW5ldyBXUF9SRVNUX1JlcXVlc3QoJ0dFVCcpOyAkci0+c2V0X3BhcmFtKCdpZCcsJHBbJ2lkJ10pOwogICAgJHJlcz1QZXRzaG9wX1BldF9EYXNoYm9hcmQ6OmhhbmRsZV9kYXNoYm9hcmQoJHIpOwogICAgJGQ9aXNfd3BfZXJyb3IoJHJlcyk/YXJyYXkoKTokcmVzLT5nZXRfZGF0YSgpOwogICAgJEQ9aXNzZXQoJGRbJ2Rhc2hib2FyZCddKT8kZFsnZGFzaGJvYXJkJ106YXJyYXkoKTsKICAgICRvWydwZXRzJ11bXT1hcnJheSgncGV0Jz0+JHBbJ3BldF9uYW1lJ10sCiAgICAgICdyYWt0YWknPT5hcnJheV9rZXlzKChhcnJheSkkRCksCiAgICAgICdyZWZpbGwnPT5pc3NldCgkRFsncmVmaWxsJ10pPyREWydyZWZpbGwnXTpudWxsLAogICAgICAnc2hlbGZfbic9Pmlzc2V0KCREWydzaGVsZiddKT9jb3VudCgoYXJyYXkpJERbJ3NoZWxmJ10pOm51bGwsCiAgICAgICdyaHl0aG0nPT5pc3NldCgkRFsncmh5dGhtJ10pPyREWydyaHl0aG0nXTpudWxsLAogICAgICAncmVtaW5kZXJzX24nPT5pc3NldCgkRFsncmVtaW5kZXJzJ10pP2NvdW50KChhcnJheSkkRFsncmVtaW5kZXJzJ10pOm51bGwpOwogIH0KICAkcnQ9JHdwZGItPnByZWZpeC4ncHNfcmVmaWxsX3RyYWNraW5nJzsKICAkb1sncmVmaWxsX3Zpc29zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NICRydCIsQVJSQVlfQSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
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
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'BLK2 '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 5');
  const r=execSync('curl -sk --max-time 90 "https://dev.avesa.lt/?ps_blk2=Blk2x"',{maxBuffer:20e6,timeout:110000}).toString();
  const i=r.indexOf('{'),k=r.lastIndexOf('}');
  if(i>=0&&k>i){ try{ o.result=JSON.parse(r.slice(i,k+1)); }catch(e){ o.rawslice=r.slice(i,i+400); } }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('blk2.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
