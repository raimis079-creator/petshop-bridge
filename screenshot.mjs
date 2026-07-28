import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2dldCddKSB8fCAkX0dFVFsncHNfZ2V0J10hPT0nR2V0eCcpIHJldHVybjsKICB3aGlsZShvYl9nZXRfbGV2ZWwoKSkgb2JfZW5kX2NsZWFuKCk7CiAgJGY9Z2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCkuJy93b29jb21tZXJjZS9teWFjY291bnQvZm9ybS1sb2dpbi5waHAnOwogICRvPWFycmF5KCd5cmEnPT5maWxlX2V4aXN0cygkZiksJ2tlbGlhcyc9PiRmKTsKICBpZigkb1sneXJhJ10pewogICAgJGM9ZmlsZV9nZXRfY29udGVudHMoJGYpOwogICAgJG9bJ3NoYSddPXN1YnN0cihoYXNoKCdzaGEyNTYnLCRjKSwwLDE2KTsKICAgICRvWydiNjQnXT1iYXNlNjRfZW5jb2RlKCRjKTsKICAgIC8vIGF0c2FyZ2luZSBrb3BpamEKICAgICRiYWs9ZGlybmFtZSgkZikuJy9mb3JtLWxvZ2luLnBocC5iYWtfUzI5Mic7CiAgICBpZighZmlsZV9leGlzdHMoJGJhaykpIHsgZmlsZV9wdXRfY29udGVudHMoJGJhaywkYyk7ICRvWydiYWNrdXAnXT0nc3VrdXJ0YSc7IH0KICAgIGVsc2UgJG9bJ2JhY2t1cCddPSdqYXUgYnV2byc7CiAgICAkb1sncmFzb21hJ109aXNfd3JpdGFibGUoJGYpOwogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
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
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'GET '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  const r=execSync('curl -sk --max-time 70 "https://dev.avesa.lt/?ps_get=Getx"',{maxBuffer:20e6,timeout:85000}).toString();
  const i=r.indexOf('{'),k=r.lastIndexOf('}');
  if(i>=0&&k>i){ try{ o.result=JSON.parse(r.slice(i,k+1)); }catch(e){ o.rawslice=r.slice(i,i+300); } }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('get.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
