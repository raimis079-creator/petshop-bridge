import { execSync } from 'child_process';
import fs from 'fs';
const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3JyJ10pIHx8ICRfR0VUWydwc19yciddIT09J1JyMjR4JykgcmV0dXJuOwogICRvPWFycmF5KCk7CiAgJHVybD1nZXRfcGVybWFsaW5rKDE0MjgxKTsKICAkcj13cF9yZW1vdGVfZ2V0KCR1cmwsYXJyYXkoJ3RpbWVvdXQnPT4yNSwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsKICAkaD1pc193cF9lcnJvcigkcik/Jyc6d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpOwogICRvWydodHRwJ109aXNfd3BfZXJyb3IoJHIpPyRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpOndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKTsKICAkb1snbGVuJ109c3RybGVuKCRoKTsKICAkb1sncm9kb19wYXJvc19ub3JtYSddPShtYl9zdHJwb3MoJGgsJ1Bhcm9zIG5vcm1hJykhPT1mYWxzZSk7CiAgJG9bJ3JvZG9fMzVfMTEwJ109KG1iX3N0cnBvcygkaCwnMzXigJMxMTAnKSE9PWZhbHNlIHx8IG1iX3N0cnBvcygkaCwnMzUtMTEwJykhPT1mYWxzZSk7CiAgJHA9bWJfc3RycG9zKCRoLCdQYXJvcyBub3JtYScpOwogIGlmKCRwIT09ZmFsc2UpewogICAgLy8ga29raW9qZSBzZWtjaWpvamU6IGllc2tvIGFydGltaWF1c2lvcyBhbnRyYXN0ZXMgcHJpZXMKICAgICRwcmU9bWJfc3Vic3RyKCRoLG1heCgwLCRwLTMwMDApLDMwMDApOwogICAgcHJlZ19tYXRjaF9hbGwoJy88aFsyLTVdW14+XSo+KC4qPyk8XC9oWzItNV0+fGNsYXNzPSJbXiJdKmFjY29yZGlvbi10aXRsZVteIl0qIltePl0qPiguKj8pPC9pcycsJHByZSwkbSk7CiAgICAkbGFzdD0nJzsgZm9yZWFjaCgkbVswXSBhcyAkeCl7ICRsYXN0PXRyaW0oc3RyaXBfdGFncygkeCkpOyB9CiAgICAkb1snc2VrY2lqYSddPSRsYXN0OwogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024,timeout:70000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50*1024*1024}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50*1024*1024}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2');}return 'fail';}
const mk=wj('POST','code-snippets/v1/snippets',{name:'RR (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
execSync('sleep 3');
let r='';
try{ r=execSync('curl -sk "https://dev.avesa.lt/?ps_rr=Rr24x"',{maxBuffer:100*1024*1024,timeout:90000}).toString(); }catch(e){ r='ERR '+String(e).slice(0,200); }
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('rr.json', Buffer.from(r).toString('base64'));
console.log('done', r.length);
