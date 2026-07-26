import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2pzYyddKSB8fCAkX0dFVFsncHNfanNjJ10hPT0nSnNjeCcpIHJldHVybjsKICAkZD1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlLyc7ICRvPWFycmF5KCk7CiAgJGY9JGQuJ2Fzc2V0cy9wZXQtZm9ybS5qcyc7CiAgJGM9ZmlsZV9nZXRfY29udGVudHMoJGYpOwogICRvWydmYWlsYXNfc2VydmVyeWplJ109YXJyYXkoCiAgICAnc2hhJz0+c3Vic3RyKGhhc2hfZmlsZSgnc2hhMjU2JywkZiksMCwxNiksCiAgICAnYnl0ZXMnPT5maWxlc2l6ZSgkZiksCiAgICAnZmlsZW10aW1lJz0+ZmlsZW10aW1lKCRmKSwKICAgICdkYXRhJz0+ZGF0ZSgnWS1tLWQgSDppOnMnLCBmaWxlbXRpbWUoJGYpKSwKICApOwogICRvWyd0dXJpbnlzJ109YXJyYXkoCiAgICAnZmVlZEZpZWxkJz0+c3RycG9zKCRjLCdmdW5jdGlvbiBmZWVkRmllbGQoKScpIT09ZmFsc2UsCiAgICAnd2V0QW1vdW50QmxvY2snPT5zdHJwb3MoJGMsJ2Z1bmN0aW9uIHdldEFtb3VudEJsb2NrKCknKSE9PWZhbHNlLAogICAgJ0ZFRURTX21hc3l2YXMnPT5zdHJwb3MoJGMsJ3ZhciBGRUVEUyA9IFsnKSE9PWZhbHNlLAogICAgJ1NhdXN1X2lyX3NsYXBpdSc9PnN0cnBvcygkYywnU2F1c3UgaXIgxaFsYXBpdSBtYWlzdHUnKSE9PWZhbHNlLAogICAgJ1dFVF9RVUlDSyc9PnN0cnBvcygkYywnV0VUX1FVSUNLJykhPT1mYWxzZSwKICAgICdTRU5BU19EYXVnaWF1c2lhX3NhdXNhcyc9PnN0cnBvcygkYywibGFiZWw6J0RhdWdpYXVzaWEgc2F1c2FzJyIpIT09ZmFsc2UsCiAgKTsKICAvLyBrYWlwIGVucXVldWUnaW5hbWFzIC0ga29rcyB2ZXIKICAkdWk9JGQuJ2luY2x1ZGVzL2NsYXNzLXBldC11aS5waHAnOwogICR1Yz1maWxlX2dldF9jb250ZW50cygkdWkpOwogICRvWydlbnF1ZXVlX2ZpbGVtdGltZSddPXN0cnBvcygkdWMsJ2Fzc2V0X3ZlcicpIT09ZmFsc2U7CiAgLy8gcmVhbHVzIFVSTCBrdXJpIGdhdXR1IG5hcnN5a2xlCiAgJG9bJ2Fzc2V0X3VybCddPXBsdWdpbnNfdXJsKCdhc3NldHMvcGV0LWZvcm0uanMnLCdwZXRzaG9wLWNvcmUvcGV0c2hvcC1jb3JlLnBocCcpOwogICRvWydzaXRldXJsJ109Z2V0X29wdGlvbignc2l0ZXVybCcpOwogICRvWydob21lJ109Z2V0X29wdGlvbignaG9tZScpOwogIC8vIGFyIGZhaWxhcyBwYXNpZWtpYW1hcyBwZXIgSFRUUCBpciBhciBqYW1lIHlyYSBuYXVqYXMga29kYXMKICBmb3JlYWNoKGFycmF5KCdodHRwJywnaHR0cHMnKSBhcyAkc2NoKXsKICAgICR1PXByZWdfcmVwbGFjZSgnI15odHRwcz86Ly8jJywkc2NoLic6Ly8nLCRvWydhc3NldF91cmwnXSk7CiAgICAkcj13cF9yZW1vdGVfZ2V0KCR1LGFycmF5KCd0aW1lb3V0Jz0+MjUsJ3NzbHZlcmlmeSc9PmZhbHNlKSk7CiAgICBpZighaXNfd3BfZXJyb3IoJHIpKXsKICAgICAgJGJvZHk9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpOwogICAgICAkb1sncGVyXycuJHNjaF09YXJyYXkoJ2tvZGFzJz0+d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpLCdieXRlcyc9PnN0cmxlbigkYm9keSksJ3R1cmlfZmVlZEZpZWxkJz0+c3RycG9zKCRib2R5LCdmdW5jdGlvbiBmZWVkRmllbGQoKScpIT09ZmFsc2UpOwogICAgfSBlbHNlIHsgJG9bJ3Blcl8nLiRzY2hdPWFycmF5KCdlcnInPT4kci0+Z2V0X2Vycm9yX21lc3NhZ2UoKSk7IH0KICB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
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
  const mk=wj('POST','code-snippets/v1/snippets',{name:'JSC (temp)',code:php,scope:'front-end',active:true,priority:5});
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_jsc=Jscx"',{maxBuffer:5e6,timeout:60000}).toString();
  const a=r.indexOf('{'),b=r.lastIndexOf('}');
  try{ o.result=JSON.parse(r.slice(a,b+1)); }catch(e){ o.raw=r.slice(0,250); }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('jscheck.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
