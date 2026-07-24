import { execSync } from 'child_process';
import fs from 'fs';
const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2xiJ10pIHx8ICRfR0VUWydwc19sYiddIT09J0xiMjR4JykgcmV0dXJuOwogICRvPWFycmF5KCk7CiAgZm9yZWFjaChhcnJheSgxNDM2NywxMjUzMiwxNjIwNykgYXMgJHBpZCl7CiAgICAkYz1nZXRfcG9zdCgkcGlkKS0+cG9zdF9jb250ZW50OwogICAgbGlieG1sX3VzZV9pbnRlcm5hbF9lcnJvcnModHJ1ZSk7ICRkb2M9bmV3IERPTURvY3VtZW50KCk7ICRkb2MtPmxvYWRIVE1MKCc8P3htbCBlbmNvZGluZz0iVVRGLTgiPjxkaXY+Jy4kYy4nPC9kaXY+Jyk7IGxpYnhtbF9jbGVhcl9lcnJvcnMoKTsKICAgIGZvcmVhY2goJGRvYy0+Z2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RhYmxlJykgYXMgJHRiKXsKICAgICAgJHR4dD0kdGItPnRleHRDb250ZW50OyBpZighcHJlZ19tYXRjaCgnL2tnL2l1JywkdHh0KSkgY29udGludWU7CiAgICAgICRnPWFycmF5KCk7CiAgICAgIGZvcmVhY2goJHRiLT5nZXRFbGVtZW50c0J5VGFnTmFtZSgndHInKSBhcyAkdHIpewogICAgICAgICRyPWFycmF5KCk7CiAgICAgICAgZm9yZWFjaCgkdHItPmNoaWxkTm9kZXMgYXMgJGNuKXsgaWYoJGNuLT5ub2RlVHlwZSE9PVhNTF9FTEVNRU5UX05PREUpIGNvbnRpbnVlOyAkbj1zdHJ0b2xvd2VyKCRjbi0+bm9kZU5hbWUpOyBpZigkbiE9PSd0ZCcmJiRuIT09J3RoJykgY29udGludWU7ICRyW109dHJpbShwcmVnX3JlcGxhY2UoJy9ccysvdScsJyAnLCRjbi0+dGV4dENvbnRlbnQpKTsgfQogICAgICAgIGlmKCRyKSAkZ1tdPSRyOwogICAgICB9CiAgICAgIGlmKGNvdW50KCRnKT49Mil7ICRvWyRwaWRdPWFycmF5KCdoZHInPT5hcnJheV9zbGljZSgkZ1swXSwwLDYpLCdsYWJlbHMnPT5hcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiBpc3NldCgkeFswXSk/bWJfc3Vic3RyKCR4WzBdLDAsMjgpOicnO30sYXJyYXlfc2xpY2UoJGcsMSw4KSkpOyBicmVhazsgfQogICAgfQogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'LB (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
execSync('sleep 3');
let r='';
try{ r=execSync('curl -sk "https://dev.avesa.lt/?ps_lb=Lb24x"',{maxBuffer:100*1024*1024,timeout:90000}).toString(); }catch(e){ r='ELB '+String(e).slice(0,200); }
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('lb.json', Buffer.from(r).toString('base64'));
console.log('done', r.length);
