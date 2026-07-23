import { execSync } from 'child_process';
import fs from 'fs';
const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2NtYXAnXSkgfHwgJF9HRVRbJ3BzX2NtYXAnXSE9PSdDbTIzeCcpIHJldHVybjsKICAkYWxsPWdldF90ZXJtcyhhcnJheSgndGF4b25vbXknPT4ncHJvZHVjdF9jYXQnLCdoaWRlX2VtcHR5Jz0+ZmFsc2UpKTsKICAkbz1hcnJheSgpOwogIGZvcmVhY2goJGFsbCBhcyAkdCl7CiAgICBpZihwcmVnX21hdGNoKCcvc2thbnzFvmFpc2x8emFpc2x8cHJpZcW+acWrcnxwcmlleml1cnxwYXBpbGR8Z3VvbHxhbnRrYWtsfHBhdmFkxJdsfGhpZ2llbnxraXJwfMWhYW1wxatufHNhbXB1bi9pdScsJHQtPm5hbWUpKXsKICAgICAgJHA9JHQtPnBhcmVudD9nZXRfdGVybSgkdC0+cGFyZW50LCdwcm9kdWN0X2NhdCcpOm51bGw7CiAgICAgICRvW109JHQtPnRlcm1faWQuJzonLiR0LT5uYW1lLicgKHTEl3ZhczogJy4oJHA/JHAtPm5hbWU6Jy0nKS4nKScuJyBbJy4kdC0+Y291bnQuJ10nOwogICAgfQogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'CMAP (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
execSync('sleep 3');
let r='';
try{ r=execSync('curl -sk "https://dev.avesa.lt/?ps_cmap=Cm23x"',{maxBuffer:100*1024*1024,timeout:90000}).toString(); }catch(e){ r='ERR '+String(e).slice(0,200); }
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('cmap.json', Buffer.from(r).toString('base64'));
console.log('done', r.length);
