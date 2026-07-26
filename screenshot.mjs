import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3NjMTAnXSkgfHwgJF9HRVRbJ3BzX3NjMTAnXSE9PSdTYzEweCcpIHJldHVybjsKICAkZD1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlLyc7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsKICBlY2hvIGpzb25fZW5jb2RlKGFycmF5KAogICAgJ3Byb2ZpbGUnPT5zdWJzdHIoaGFzaF9maWxlKCdzaGEyNTYnLCRkLidpbmNsdWRlcy9jbGFzcy1wZXQtcHJvZmlsZS5waHAnKSwwLDE2KSwKICAgICdkYXNoYm9hcmQnPT5zdWJzdHIoaGFzaF9maWxlKCdzaGEyNTYnLCRkLidpbmNsdWRlcy9jbGFzcy1wZXQtZGFzaGJvYXJkLnBocCcpLDAsMTYpLAogICAgJ3BldF9mb3JtJz0+c3Vic3RyKGhhc2hfZmlsZSgnc2hhMjU2JywkZC4nYXNzZXRzL3BldC1mb3JtLmpzJyksMCwxNiksCiAgICAncGV0X3Byb2ZpbGUnPT5zdWJzdHIoaGFzaF9maWxlKCdzaGEyNTYnLCRkLidhc3NldHMvcGV0LXByb2ZpbGUuanMnKSwwLDE2KSwKICApKTsgZXhpdDsKfSk7Cg==';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50e6,timeout:70000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2');}return 'fail';}
const o={}; let sid=null;
try{
  const php = Buffer.from(PHPB64,'base64').toString('utf8');
  const mk=wj('POST','code-snippets/v1/snippets',{name:'SC10 (temp)',code:php,scope:'front-end',active:true,priority:5});
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_sc10=Sc10x"',{maxBuffer:5e6,timeout:60000}).toString();
  const a=r.indexOf('{'),b=r.lastIndexOf('}');
  try{ o.sha=JSON.parse(r.slice(a,b+1)); }catch(e){ o.raw=r.slice(0,200); }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('sc10.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
