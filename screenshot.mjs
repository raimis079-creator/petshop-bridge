import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2ZpbmQnXSkgfHwgJF9HRVRbJ3BzX2ZpbmQnXSE9PSdGaW5keCcpIHJldHVybjsKICB3aGlsZShvYl9nZXRfbGV2ZWwoKSkgb2JfZW5kX2NsZWFuKCk7CiAgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgpOwogICR0PSR3cGRiLT5wcmVmaXguJ3NuaXBwZXRzJzsKICBpZigkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAnJHQnIikpewogICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUsTEVOR1RIKGNvZGUpIGxlbiBGUk9NICR0CiAgICAgIFdIRVJFIGNvZGUgTElLRSAnJWNhbm9uaWNhbF90YWJsZV9oYXNoJScgT1IgY29kZSBMSUtFICclY2hhc2hfdjElJyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDEwIixBUlJBWV9BKTsKICAgICRvWydzbmlwcGV0YWknXT0kcm93czsKICAgIGlmKCRyb3dzKXsKICAgICAgJGNvZGU9JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBjb2RlIEZST00gJHQgV0hFUkUgaWQ9JWQiLCRyb3dzWzBdWydpZCddKSk7CiAgICAgICRpPXN0cnBvcygkY29kZSwnY2Fub25pY2FsX3RhYmxlX2hhc2gnKTsKICAgICAgaWYoJGk9PT1mYWxzZSkgJGk9c3RycG9zKCRjb2RlLCdjaGFzaF92MScpOwogICAgICAkb1snZnJhZ21lbnRhcyddPXN1YnN0cigkY29kZSxtYXgoMCwkaS0xNTAwKSwyNTAwKTsKICAgIH0KICB9CiAgLy8gaXIgTVUgcGx1Z2ludW9zZQogICRoaXRzPWFycmF5KCk7CiAgZm9yZWFjaChhcnJheShXUE1VX1BMVUdJTl9ESVIsIFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUnKSBhcyAkZCl7CiAgICBpZighaXNfZGlyKCRkKSkgY29udGludWU7CiAgICBmb3JlYWNoKGdsb2IoJGQuJy8qLnBocCcpIGFzICRmKXsKICAgICAgJGM9QGZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsKICAgICAgaWYoJGMgJiYgKHN0cnBvcygkYywnY2Fub25pY2FsX3RhYmxlX2hhc2gnKSE9PWZhbHNlIHx8IHN0cnBvcygkYywnY2hhc2hfdjEnKSE9PWZhbHNlKSkgJGhpdHNbXT1iYXNlbmFtZSgkZik7CiAgICB9CiAgICBmb3JlYWNoKGdsb2IoJGQuJy8qLyoucGhwJykgYXMgJGYpewogICAgICAkYz1AZmlsZV9nZXRfY29udGVudHMoJGYpOwogICAgICBpZigkYyAmJiAoc3RycG9zKCRjLCdjYW5vbmljYWxfdGFibGVfaGFzaCcpIT09ZmFsc2UgfHwgc3RycG9zKCRjLCdjaGFzaF92MScpIT09ZmFsc2UpKSAkaGl0c1tdPXN0cl9yZXBsYWNlKCRkLicvJywnJywkZik7CiAgICB9CiAgfQogICRvWydmYWlsYWknXT0kaGl0czsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
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
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'FIND '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 5');
  const r=execSync('curl -sk --max-time 70 "https://dev.avesa.lt/?ps_find=Findx"',{maxBuffer:20e6}).toString();
  const i=r.indexOf('{'),k=r.lastIndexOf('}');
  if(i>=0&&k>i){ try{ o.result=JSON.parse(r.slice(i,k+1)); }catch(e){ o.rawslice=r.slice(i,i+300); } }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('find.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
