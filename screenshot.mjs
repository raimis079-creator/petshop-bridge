import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:20e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s469',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:20e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run469-v1'}; let sid=null;
const PHP=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzQ2OSBBViBsYXVrbyBwYXRpa3JhIHBvIFJhaW1pbyBpdmVkaW1vCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19zNDY5J10pIHx8ICRfR0VUWydwc19zNDY5J10gIT09ICdLNDY5cHQnICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBAc2V0X3RpbWVfbGltaXQoMTgwKTsKICAgIGdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7CiAgICAkcj1hcnJheSgnVkVSU0lKQSc9PidzNDY5LXYxJyk7CgogICAgLy8gMSkgVklTT1MgcHJla2VzIHN1IF9vd25fc3RvY2tfcXR5CiAgICAkclsndmlzb3Nfc3VfYXYnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLklELCBwLnBvc3RfdGl0bGUsIG0ubWV0YV92YWx1ZSBhdgogICAgICAgIEZST00geyRwZn1wb3N0bWV0YSBtIEpPSU4geyRwZn1wb3N0cyBwIE9OIHAuSUQ9bS5wb3N0X2lkCiAgICAgICAgV0hFUkUgbS5tZXRhX2tleT0nX293bl9zdG9ja19xdHknIE9SREVSIEJZIHAuSUQiLCBBUlJBWV9BKTsKICAgIC8vIDIpIGtvbmtyZWNpYWkgMTk5MjEgKEpvc2VyYSAxMiw1IGtnIGlzIGVrcmFubykKICAgIGZvcmVhY2goYXJyYXkoMTk5MjEsMTc5NzgpIGFzICRpZCl7CiAgICAgICAgJHJbJ3ByZWtlXycuJGlkXT1hcnJheSgKICAgICAgICAgICdwYXYnPT5tYl9zdWJzdHIoKHN0cmluZylnZXRfdGhlX3RpdGxlKCRpZCksMCw1NSksCiAgICAgICAgICAnX293bl9zdG9ja19xdHknPT5nZXRfcG9zdF9tZXRhKCRpZCwnX293bl9zdG9ja19xdHknLHRydWUpLAogICAgICAgICAgJ3Jhdyc9PiR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskcGZ9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD0lZCBBTkQgbWV0YV9rZXk9J19vd25fc3RvY2tfcXR5JyIsJGlkKSksCiAgICAgICAgICAnenVybmFsYXMnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX293bl9zdG9ja19sb2cnLHRydWUpLAogICAgICAgICAgJ3F0eV9BUEknPT5jbGFzc19leGlzdHMoJ1BldHNob3BfQVZfU3RvY2snKT9QZXRzaG9wX0FWX1N0b2NrOjpxdHkoJGlkKTona2xhc2VzIG5lcmEnLAogICAgICAgICk7CiAgICB9CiAgICAvLyAzKSBhciBzdHVscGVsaXMgcmVnaXN0cnVvdGFzIGlyIGFyIGNhbGxiYWNrIHByaWthYmludGFzCiAgICBnbG9iYWwgJHdwX2ZpbHRlcjsKICAgICRjPWFycmF5KCk7CiAgICBmb3JlYWNoKGFycmF5KCdtYW5hZ2VfZWRpdC1wcm9kdWN0X2NvbHVtbnMnLCdtYW5hZ2VfcHJvZHVjdF9wb3N0c19jdXN0b21fY29sdW1uJywKICAgICAgICAgICAgICAgICAgJ3F1aWNrX2VkaXRfY3VzdG9tX2JveCcsJ3NhdmVfcG9zdF9wcm9kdWN0Jywnd29vY29tbWVyY2VfcHJvY2Vzc19wcm9kdWN0X21ldGEnKSBhcyAkaCl7CiAgICAgICAgJGw9YXJyYXkoKTsKICAgICAgICBpZihpc3NldCgkd3BfZmlsdGVyWyRoXSkpIGZvcmVhY2goJHdwX2ZpbHRlclskaF0tPmNhbGxiYWNrcyBhcyAkcD0+JGNicykgZm9yZWFjaCgkY2JzIGFzICRjYil7CiAgICAgICAgICAgICRmbj0kY2JbJ2Z1bmN0aW9uJ107CiAgICAgICAgICAgICRuPWlzX3N0cmluZygkZm4pPyRmbjooaXNfYXJyYXkoJGZuKT8oaXNfb2JqZWN0KCRmblswXSk/Z2V0X2NsYXNzKCRmblswXSk6JGZuWzBdKS4nOjonLiRmblsxXTonY2xvc3VyZScpOwogICAgICAgICAgICBpZihzdHJpcG9zKCRuLCdBVl9TdG9jaycpIT09ZmFsc2UpICRsW109JHAuJyAnLiRuOwogICAgICAgIH0KICAgICAgICAkY1skaF09JGw7CiAgICB9CiAgICAkclsnbXVzdV9rYWJsaXVrYWknXT0kYzsKICAgICRyWydrbGFzZSddPSBjbGFzc19leGlzdHMoJ1BldHNob3BfQVZfU3RvY2snKT8neXJhJzonTkVSQSc7CiAgICAkclsnZmFpbGFzJ109IGlzX2ZpbGUoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1hdi1zdG9jay5waHAnKT9maWxlc2l6ZShXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWF2LXN0b2NrLnBocCcpOidORVJBJzsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8').replace(/^<\?php\s*/,'');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S469 AV patikra',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 4');
function q(a){const x=sh('curl -sSk --max-time 270 "'+SITE+'/?ps_s469=K469pt&act='+a+'&z='+Math.random()+'"');
 try{return JSON.parse(x);}catch(e){return {raw:String(x).slice(0,500)};}}
const t=sh('curl -sSk --max-time 200 "'+SITE+'/?ps_s469=K469pt&z='+Math.random()+'"');
try{O.rez=JSON.parse(t);}catch(e){O.rez={raw:String(t).slice(0,400)};}
O.svetaine=sh('curl -sSk -o /dev/null -w "%{http_code}" --max-time 30 "'+SITE+'/"').trim();
O.svetaine=sh('curl -sSk -o /dev/null -w "%{http_code}" --max-time 30 "'+SITE+'/"').trim();
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putResult('s469.json', JSON.stringify(O,null,1));
console.log('OK');
