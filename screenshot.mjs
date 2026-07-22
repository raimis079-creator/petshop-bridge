const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfcmQzJ10pfHwkX0dFVFsncHNfcmQzJ10hPT0nUzJLdzhOeCcpe3JldHVybjt9CglAc2V0X3RpbWVfbGltaXQoNjApOyAkbz1hcnJheSgpOwoJJGFzPVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvYXNzZXRzJzsKCSRwcD1AZmlsZV9nZXRfY29udGVudHMoJGFzLicvcGV0LXByb2ZpbGUuanMnKTsKCSRqZj1AZmlsZV9nZXRfY29udGVudHMoJGFzLicvcGV0LWZvcm0uanMnKTsKCSRvWydzaXplcyddPWFycmF5KCdwZXQtcHJvZmlsZS5qcyc9PnN0cmxlbigkcHApLCdwZXQtZm9ybS5qcyc9PnN0cmxlbigkamYpKTsKCSRjdHg9ZnVuY3Rpb24oJGgsJG5lZWRsZSwkYj0yNTAsJGE9NzAwKXsgJG91dD1hcnJheSgpOyAkb2ZmPTA7IGZvcigkaT0wOyRpPDU7JGkrKyl7ICRwPXN0cnBvcygkaCwkbmVlZGxlLCRvZmYpOyBpZigkcD09PWZhbHNlKWJyZWFrOyAkb3V0W109c3Vic3RyKCRoLG1heCgwLCRwLSRiKSwkYiskYSk7ICRvZmY9JHArc3RybGVuKCRuZWVkbGUpOyB9IHJldHVybiAkb3V0OyB9OwoJLy8gcGV0LXByb2ZpbGUuanM6IGVtcHR5LXN0YXRlICsgY3JlYXRlIGJ1dHRvbgoJJG9bJ3BwX2NyZWF0ZV91cmwnXT0kY3R4KCRwcCwnY3JlYXRlLXVybCcpOyAkb1sncHBfY3JlYXRlVXJsJ109JGN0eCgkcHAsJ2NyZWF0ZVVybCcpOwoJJG9bJ3BwX3N1a3VydGknXT0kY3R4KCRwcCwnU3VrdXJ0aScpOyAkb1sncHBfaHJlZiddPSRjdHgoJHBwLCdocmVmJyk7Cgkkb1sncHBfZW1wdHknXT0kY3R4KCRwcCwnZW1wdHknKTsgJG9bJ3BwX3BzcGV0cHJvZmlsZSddPSRjdHgoJHBwLCdwc3BldC1wcm9maWxlJyk7CgkvLyBwZXQtZm9ybS5qczogTXlBY2NvdW50IGJlIGFjdGlvbj1jcmVhdGUgxaFha2EgKHBvIGluaXQgaWYgUFNfUEVUX0ZPUk1fT1BFTikKCSRvWydqZl9pbml0X3RhaWwnXT0kY3R4KCRqZiwnTXlBY2NvdW50JywzMDAsOTAwKTsKCSRvWydqZl9kYXRhX2NyZWF0ZSddPSRjdHgoJGpmLCdjcmVhdGUtdXJsJywyNTAsNjAwKTsKCWVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'RD3 (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){o.mkerr=String(mk).slice(0,200);}
o.d=(function(){try{const r=execSync('curl -sk --max-time 55 '+AUTH+' "https://dev.avesa.lt/?ps_rd3=S2Kw8Nx"',{maxBuffer:10*1024*1024,timeout:60000}).toString();const i=r.indexOf('{');return i>=0?JSON.parse(r.slice(i)):{raw:r.slice(0,400)};}catch(e){return{err:String(e).slice(0,200)};}})();
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
console.log('PUT:',pr('rd3.json',o));
