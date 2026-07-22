const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfcmQyJ10pfHwkX0dFVFsncHNfcmQyJ10hPT0nUzJLdzhOeCcpe3JldHVybjt9CglAc2V0X3RpbWVfbGltaXQoNjApOyAkbz1hcnJheSgpOwoJJGluYz1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2luY2x1ZGVzJzsKCSR1aT1AZmlsZV9nZXRfY29udGVudHMoJGluYy4nL2NsYXNzLXBldC11aS5waHAnKTsKCSRkYj1AZmlsZV9nZXRfY29udGVudHMoJGluYy4nL2NsYXNzLXBldC1kYXNoYm9hcmQucGhwJyk7CgkkcGY9QGZpbGVfZ2V0X2NvbnRlbnRzKCRpbmMuJy9jbGFzcy1wZXQtcHJvZmlsZS5waHAnKTsKCSRvWydzaXplcyddPWFycmF5KCd1aSc9PnN0cmxlbigkdWkpLCdkYXNoJz0+c3RybGVuKCRkYiksJ3Byb2YnPT5zdHJsZW4oJHBmKSk7Cgkkb1sndWlfZnVsbCddPSR1aTsKCSRjdHg9ZnVuY3Rpb24oJGgsJG5lZWRsZSwkYj0zMDAsJGE9NjUwKXsgJG91dD1hcnJheSgpOyAkb2ZmPTA7IGZvcigkaT0wOyRpPDU7JGkrKyl7ICRwPXN0cnBvcygkaCwkbmVlZGxlLCRvZmYpOyBpZigkcD09PWZhbHNlKWJyZWFrOyAkb3V0W109c3Vic3RyKCRoLG1heCgwLCRwLSRiKSwkYiskYSk7ICRvZmY9JHArc3RybGVuKCRuZWVkbGUpOyB9IHJldHVybiAkb3V0OyB9OwoJJG9bJ2RiX3N1a3VydGknXT0kY3R4KCRkYiwnU3VrdXJ0aScpOyAkb1sncGZfc3VrdXJ0aSddPSRjdHgoJHBmLCdTdWt1cnRpJyk7Cgkkb1snZGJfYWN0aW9uJ109JGN0eCgkZGIsJ2FjdGlvbj1jcmVhdGUnKTsgJG9bJ3BmX2FjdGlvbiddPSRjdHgoJHBmLCdhY3Rpb249Y3JlYXRlJyk7Cgkkb1snZGJfUFNfT1BFTiddPSRjdHgoJGRiLCdQU19QRVRfRk9STV9PUEVOJyk7ICRvWydwZl9QU19PUEVOJ109JGN0eCgkcGYsJ1BTX1BFVF9GT1JNX09QRU4nKTsgJG9bJ3VpX1BTX09QRU4nXT0kY3R4KCR1aSwnUFNfUEVUX0ZPUk1fT1BFTicpOwoJJG9bJ2RiX3BzcGV0Zm9ybSddPSRjdHgoJGRiLCdwc3BldC1mb3JtJyk7ICRvWydwZl9wc3BldGZvcm0nXT0kY3R4KCRwZiwncHNwZXQtZm9ybScpOwoJZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wbody.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wbody.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024,timeout:70000}).toString();}
function pr(n,ob){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(JSON.stringify(ob)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2'); }return 'fail';}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'RD2 (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){o.mkerr=String(mk).slice(0,200);}
o.d=(function(){try{const r=execSync('curl -sk --max-time 55 '+AUTH+' "https://dev.avesa.lt/?ps_rd2=S2Kw8Nx"',{maxBuffer:10*1024*1024,timeout:60000}).toString();const i=r.indexOf('{');return i>=0?JSON.parse(r.slice(i)):{raw:r.slice(0,400)};}catch(e){return{err:String(e).slice(0,200)};}})();
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
console.log('PUT:',pr('rd2.json',o));
