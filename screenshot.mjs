import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3NyYyddKSB8fCAkX0dFVFsncHNfc3JjJ10hPT0nU3JjeCcpIHJldHVybjsKICB3aGlsZShvYl9nZXRfbGV2ZWwoKSkgb2JfZW5kX2NsZWFuKCk7CiAgZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoKTsgJFI9JHBmLidwc19mZWVkaW5nX3Jvd3MnOyAkVD0kcGYuJ3BzX2ZlZWRpbmdfdGFibGVzJzsgJE09JHBmLidwc19mZWVkaW5nX21hcCc7CiAgZm9yZWFjaChhcnJheSgzMDEsMzA0KSBhcyAkdGlkKXsKICAgICR0PSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgaWQsYnJhbmQsbGluZSxzb3VyY2VfdXJsLHdlaWdodF9iYXNpcyx3ZWlnaHRfYmFzaXNfc291cmNlLHJvd19kaW1lbnNpb24sc2hhcGUgRlJPTSAkVCBXSEVSRSBpZD0lZCIsJHRpZCksQVJSQVlfQSk7CiAgICAkcGlkPShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwcm9kdWN0X2lkIEZST00gJE0gV0hFUkUgZmVlZGluZ190YWJsZV9pZD0lZCBBTkQgaXNfYWN0aXZlPTEgTElNSVQgMSIsJHRpZCkpOwogICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1Qgcm93X29yZGVyLHdlaWdodF9mcm9tX2tnIHdmLHdlaWdodF90b19rZyB3dCxhbW91bnRfZnJvbV9nIGFmLGNvbmRpdGlvbl9kaW1lbnNpb25zIGNkLGNvbmRpdGlvbl9yYXcgY3IgRlJPTSAkUiBXSEVSRSBmZWVkaW5nX3RhYmxlX2lkPSVkIE9SREVSIEJZIHJvd19vcmRlciBMSU1JVCA2IiwkdGlkKSxBUlJBWV9BKTsKICAgIC8vIHNla2NpamEgaXMgYXByYXN5bW8KICAgICRjPShzdHJpbmcpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwb3N0X2NvbnRlbnQgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBJRD0lZCIsJHBpZCkpOwogICAgJGZyYWc9bnVsbDsKICAgIGZvcmVhY2goYXJyYXkoJ1Jla29tZW5kdW9qYW1hcyBraWVraXMnLCfFoMSXcmltJywnZXJpbScsJ0tpZWtpcycpIGFzICRuZWVkbGUpewogICAgICAkaT1zdHJpcG9zKCRjLCRuZWVkbGUpOwogICAgICBpZigkaSE9PWZhbHNlKXsgJGZyYWc9cHJlZ19yZXBsYWNlKCcvXHMrL3UnLCcgJyxzdHJpcF90YWdzKHN1YnN0cigkYyxtYXgoMCwkaS0xNTApLDkwMCkpKTsgYnJlYWs7IH0KICAgIH0KICAgICRvWydsZW50ZWxlcyddW109YXJyYXkoJ3QnPT4kdCwncGlkJz0+JHBpZCwnZWlsdXRlcyc9PiRyb3dzLCdhcHJhc3ltYXMnPT5tYl9zdWJzdHIoKHN0cmluZykkZnJhZywwLDcwMCkpOwogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
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
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'SRC '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 5');
  const r=execSync('curl -sk --max-time 80 "https://dev.avesa.lt/?ps_src=Srcx"',{maxBuffer:20e6,timeout:100000}).toString();
  const i=r.indexOf('{'),k=r.lastIndexOf('}');
  if(i>=0&&k>i){ try{ o.result=JSON.parse(r.slice(i,k+1)); }catch(e){ o.rawslice=r.slice(i,i+400); } }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('src.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
