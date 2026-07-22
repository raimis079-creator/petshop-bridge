const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfY2hrJ10pfHwkX0dFVFsncHNfY2hrJ10hPT0nUzJLdzhOeCcpe3JldHVybjt9CgkkcGF0aD1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2Fzc2V0cy9wZXQtcHJvZmlsZS5qcyc7CgkkYz1AZmlsZV9nZXRfY29udGVudHMoJHBhdGgpOwoJJGRpcj1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2Fzc2V0cyc7CgkkYmFrcz1hcnJheSgpOyBmb3JlYWNoKHNjYW5kaXIoJGRpcikgYXMgJGYpeyBpZihzdHJwb3MoJGYsJ3BldC1wcm9maWxlLmpzLmJhaycpPT09MHx8c3RycG9zKCRmLCdwZXQtcHJvZmlsZS5qcy5iYWtfJykhPT1mYWxzZSkgJGJha3NbXT0kZjsgaWYocHJlZ19tYXRjaCgnL3BldC1wcm9maWxlXC5qc1wuYmFrLycsJGYpKSAkYmFrc1tdPSRmOyB9CgllY2hvIGpzb25fZW5jb2RlKGFycmF5KAoJCSdsZW4nPT5zdHJsZW4oJGMpLCdtZDUnPT5tZDUoJGMpLAoJCSdoYXNfZmMnPT4oc3RycG9zKCRjLCdyZW5kZXJGZWVkaW5nQ29zdCcpIT09ZmFsc2UpLAoJCSdoYXNfZm9ycGV0Jz0+KHN0cnBvcygkYywnZmVlZGluZy1jYWxjLWZvci1wZXQnKSE9PWZhbHNlKSwKCQknYmFrcyc9PmFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJGJha3MpKSwKCSkpOyBleGl0Owp9KTsK';
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
o.home=(function(){try{return execSync('curl -sk -o /dev/null -w "%{http_code}" "https://dev.avesa.lt/"',{timeout:40000}).toString().trim();}catch(e){return 'ERR';}})();
o.jshttp=(function(){try{return execSync('curl -sk -o /dev/null -w "%{http_code}" "https://dev.avesa.lt/wp-content/plugins/petshop-core/assets/pet-profile.js"',{timeout:40000}).toString().trim();}catch(e){return 'ERR';}})();
const mk=wj('POST','code-snippets/v1/snippets',{name:'CHK (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){o.mkerr=String(mk).slice(0,200);}
o.d=(function(){try{const r=execSync('curl -sk --max-time 40 '+AUTH+' "https://dev.avesa.lt/?ps_chk=S2Kw8Nx"',{timeout:45000}).toString();const i=r.indexOf('{');return i>=0?JSON.parse(r.slice(i)):{raw:r.slice(0,200)};}catch(e){return{err:String(e).slice(0,150)};}})();
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
console.log('PUT:',pr('chk.json',o));
