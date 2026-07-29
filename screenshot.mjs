import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3BlcmYnXSkgfHwgJF9HRVRbJ3BzX3BlcmYnXSE9PSdQZXJmeCcpIHJldHVybjsKICB3aGlsZShvYl9nZXRfbGV2ZWwoKSkgb2JfZW5kX2NsZWFuKCk7CiAgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgpOyAkbWFwPSR3cGRiLT5wcmVmaXguJ3BzX2ZlZWRpbmdfbWFwJzsKICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgRElTVElOQ1QgcHJvZHVjdF9pZCBGUk9NICRtYXAgV0hFUkUgaXNfYWN0aXZlPTEgTElNSVQgMjQiKTsKICAkdDA9bWljcm90aW1lKHRydWUpOyAkb2s9MDsgJHJlcz1hcnJheSgpOwogIGZvcmVhY2goJGlkcyBhcyAkcGlkKXsKICAgICRyPVBldHNob3BfRmVlZGluZ19TZXJ2aWNlOjpjYWxjKGFycmF5KCdwcm9kdWN0X2lkJz0+KGludCkkcGlkLCd3ZWlnaHRfa2cnPT4xMy4wLCdzcGVjaWVzX2NvZGUnPT4nZG9nJykpOwogICAgaWYoJHJbJ3N0YXR1cyddPT09J29rJyl7ICRvaysrOyBpZihjb3VudCgkcmVzKTw0KSAkcmVzW109YXJyYXkoKGludCkkcGlkLCgkclsnZGF5c19taW4nXT8/bnVsbCkuJy0nLigkclsnZGF5c19tYXgnXT8/bnVsbCksKCRyWydjb3N0X2RheV9taW4nXT8/bnVsbCkuJy0nLigkclsnY29zdF9kYXlfbWF4J10/P251bGwpKTsgfQogIH0KICAkb1sncGlybWFzX2thcnRhc19tcyddPXJvdW5kKChtaWNyb3RpbWUodHJ1ZSktJHQwKSoxMDAwKTsKICAkb1sncHJla2l1J109Y291bnQoJGlkcyk7ICRvWydvayddPSRvazsgJG9bJ3B2eiddPSRyZXM7CiAgJHQxPW1pY3JvdGltZSh0cnVlKTsKICBmb3JlYWNoKCRpZHMgYXMgJHBpZCkgUGV0c2hvcF9GZWVkaW5nX1NlcnZpY2U6OmNhbGMoYXJyYXkoJ3Byb2R1Y3RfaWQnPT4oaW50KSRwaWQsJ3dlaWdodF9rZyc9PjEzLjAsJ3NwZWNpZXNfY29kZSc9Pidkb2cnKSk7CiAgJG9bJ2FudHJhc19rYXJ0YXNfbXMnXT1yb3VuZCgobWljcm90aW1lKHRydWUpLSR0MSkqMTAwMCk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
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
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'PERF '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 5');
  const r=execSync('curl -sk --max-time 90 "https://dev.avesa.lt/?ps_perf=Perfx"',{maxBuffer:20e6,timeout:110000}).toString();
  const i=r.indexOf('{'),k=r.lastIndexOf('}');
  if(i>=0&&k>i){ try{ o.result=JSON.parse(r.slice(i,k+1)); }catch(e){ o.rawslice=r.slice(i,i+300); } }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('perf.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
