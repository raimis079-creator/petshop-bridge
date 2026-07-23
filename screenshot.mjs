const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfb2ZmJ10pfHwkX0dFVFsncHNfb2ZmJ10hPT0nUzJLdzhOeCcpe3JldHVybjt9CgkkYj1nZXRfb3B0aW9uKCdwZXRzaG9wX2ZlZWRpbmdfY2FsY19lbmFibGVkJywnLScpOwoJdXBkYXRlX29wdGlvbigncGV0c2hvcF9mZWVkaW5nX2NhbGNfZW5hYmxlZCcsJzAnKTsKCWVjaG8ganNvbl9lbmNvZGUoYXJyYXkoJ2J1dm8nPT4kYiwnZGFiYXInPT5nZXRfb3B0aW9uKCdwZXRzaG9wX2ZlZWRpbmdfY2FsY19lbmFibGVkJyksJ2tpbGwnPT5nZXRfb3B0aW9uKCdwZXRzaG9wX2ZlZWRpbmdfY2FsY19raWxsJywnLScpKSk7IGV4aXQ7Cn0pOwo=';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'OFF (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){o.mkerr=String(mk).slice(0,150);}
o.d=(function(){try{const r=execSync('curl -sk --max-time 40 '+AUTH+' "https://dev.avesa.lt/?ps_off=S2Kw8Nx"',{timeout:45000}).toString();const i=r.indexOf('{');return i>=0?JSON.parse(r.slice(i)):{raw:r.slice(0,200)};}catch(e){return{err:String(e).slice(0,150)};}})();
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
console.log('PUT:',pr('off.json',o));
