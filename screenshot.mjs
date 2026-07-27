import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3NoJ10pIHx8ICRfR0VUWydwc19zaCddIT09J1NoeCcpIHJldHVybjsKICBnbG9iYWwgJHdwX2ZpbHRlcjsgJG89YXJyYXkoKTsKICAvLyAxLiBLYXMga2FiaW5hc2kgYW50IHBhY2thZ2VfcmF0ZXMKICAkY2JzPWFycmF5KCk7CiAgaWYoaXNzZXQoJHdwX2ZpbHRlclsnd29vY29tbWVyY2VfcGFja2FnZV9yYXRlcyddKSl7CiAgICBmb3JlYWNoKCR3cF9maWx0ZXJbJ3dvb2NvbW1lcmNlX3BhY2thZ2VfcmF0ZXMnXS0+Y2FsbGJhY2tzIGFzICRwcmlvPT4kZ3JwKXsKICAgICAgZm9yZWFjaCgkZ3JwIGFzICRrZXk9PiRjYil7CiAgICAgICAgJGY9JGNiWydmdW5jdGlvbiddOyAkZGVzYz0nJzsKICAgICAgICB0cnl7CiAgICAgICAgICBpZihpc19hcnJheSgkZikpeyAkcmM9bmV3IFJlZmxlY3Rpb25NZXRob2QoaXNfb2JqZWN0KCRmWzBdKT9nZXRfY2xhc3MoJGZbMF0pOiRmWzBdLCAkZlsxXSk7ICRkZXNjPShpc19vYmplY3QoJGZbMF0pP2dldF9jbGFzcygkZlswXSk6JGZbMF0pLic6OicuJGZbMV07IH0KICAgICAgICAgIGVsc2VpZigkZiBpbnN0YW5jZW9mIENsb3N1cmUpeyAkcmM9bmV3IFJlZmxlY3Rpb25GdW5jdGlvbigkZik7ICRkZXNjPSdDbG9zdXJlJzsgfQogICAgICAgICAgZWxzZSB7ICRyYz1uZXcgUmVmbGVjdGlvbkZ1bmN0aW9uKCRmKTsgJGRlc2M9KHN0cmluZykkZjsgfQogICAgICAgICAgJGNic1tdPWFycmF5KCdwcmlvJz0+JHByaW8sJ2thcyc9PiRkZXNjLCdmYWlsYXMnPT5iYXNlbmFtZSgkcmMtPmdldEZpbGVOYW1lKCkpLCdlaWwnPT4kcmMtPmdldFN0YXJ0TGluZSgpKTsKICAgICAgICB9Y2F0Y2goRXhjZXB0aW9uICRlKXsgJGNic1tdPWFycmF5KCdwcmlvJz0+JHByaW8sJ2thcyc9Pic/JywnZXJyJz0+MSk7IH0KICAgICAgfQogICAgfQogIH0KICAkb1sncGFja2FnZV9yYXRlcyddPSRjYnM7CiAgLy8gMi4gRnVsZmlsbG1lbnRfU291cmNlIHJlc29sdmUgKyBpc192ZW5pcGFrX29ubHkga29kYXMKICAkcmM9bmV3IFJlZmxlY3Rpb25DbGFzcygnUGV0c2hvcF9GdWxmaWxsbWVudF9Tb3VyY2UnKTsKICAkc3JjPWZpbGUoJHJjLT5nZXRGaWxlTmFtZSgpKTsKICBmb3JlYWNoKGFycmF5KCdyZXNvbHZlJywnaXNfdmVuaXBha19vbmx5JywnZHJvcHNoaXBfbWFwJykgYXMgJG1uKXsKICAgIHRyeXsgJG09JHJjLT5nZXRNZXRob2QoJG1uKTsgJG9bJ2tvZGFzXycuJG1uXT1pbXBsb2RlKCcnLGFycmF5X3NsaWNlKCRzcmMsJG0tPmdldFN0YXJ0TGluZSgpLTEsbWluKDI4LCRtLT5nZXRFbmRMaW5lKCktJG0tPmdldFN0YXJ0TGluZSgpKzEpKSk7IH1jYXRjaChFeGNlcHRpb24gJGUpe30KICB9CiAgLy8gMy4gQ2FydCBob29rJ2FpIGt1ciBtaW5pbWEgc2l1bnRhL3ByaXN0YXR5bWFzCiAgJG9bJ2NhcnRfbm90aWNlcyddPWFycmF5KCk7CiAgZm9yZWFjaChhcnJheSgnd29vY29tbWVyY2VfYmVmb3JlX2NhcnQnLCd3b29jb21tZXJjZV9hZnRlcl9jYXJ0X3RhYmxlJywnd29vY29tbWVyY2VfY2FydF90b3RhbHNfYmVmb3JlX3NoaXBwaW5nJywnd29vY29tbWVyY2VfcmV2aWV3X29yZGVyX2JlZm9yZV9zaGlwcGluZycsJ3dvb2NvbW1lcmNlX2NoZWNrX2NhcnRfaXRlbXMnKSBhcyAkaCl7CiAgICAkb1snY2FydF9ub3RpY2VzJ11bJGhdPSBpc3NldCgkd3BfZmlsdGVyWyRoXSkgPyBjb3VudCgkd3BfZmlsdGVyWyRoXS0+Y2FsbGJhY2tzKSA6IDA7CiAgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50e6,timeout:70000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const o={}; let sid=null;
try{
  const php = Buffer.from(PHPB64,'base64').toString('utf8');
  const mk=wj('POST','code-snippets/v1/snippets',{name:'SH (temp)',code:php,scope:'front-end',active:true,priority:5});
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_sh=Shx"',{maxBuffer:10e6,timeout:70000}).toString();
  const a=r.indexOf('{'),b=r.lastIndexOf('}');
  try{ o.result=JSON.parse(r.slice(a,b+1)); }catch(e){ o.raw=r.slice(0,300); }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('shiprec.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
