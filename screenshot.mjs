import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={}; let sid=null;
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUFAyRCBSZWNvbiB2MQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfcHAnXSkgfHwgJF9HRVRbJ3BzX3BwJ10gIT09ICdSYzlrJyApIHJldHVybjsKICAgICRyID0gYXJyYXkoKTsKICAgICRiYXNlID0gV1BfUExVR0lOX0RJUiAuICcvcGV0c2hvcC1jb3JlJzsKICAgICRmaWxlcyA9IGFycmF5KCk7CiAgICBpZiAoaXNfZGlyKCRiYXNlKSkgewogICAgICAgICRpdCA9IG5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkYmFzZSwgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3I6OlNLSVBfRE9UUykpOwogICAgICAgIGZvcmVhY2ggKCRpdCBhcyAkZikgewogICAgICAgICAgICBpZiAoJGYtPmlzRmlsZSgpICYmIHN1YnN0cigkZi0+Z2V0RmlsZW5hbWUoKSwtNCk9PT0nLnBocCcpIHsKICAgICAgICAgICAgICAgICRmaWxlc1tzdHJfcmVwbGFjZSgkYmFzZS4nLycsICcnLCAkZi0+Z2V0UGF0aG5hbWUoKSldID0gJGYtPmdldFNpemUoKTsKICAgICAgICAgICAgfQogICAgICAgIH0KICAgIH0KICAgIGtzb3J0KCRmaWxlcyk7CiAgICAkclsnY29yZV9waHAnXSA9ICRmaWxlczsKCiAgICAvLyBsYXlvdXQga2xhc2VzIEFQSQogICAgZm9yZWFjaCAoJGZpbGVzIGFzICRyZWw9PiRzeikgewogICAgICAgIGlmIChzdHJwb3MoJHJlbCwnbGF5b3V0JykhPT1mYWxzZSkgewogICAgICAgICAgICAkYyA9IGZpbGVfZ2V0X2NvbnRlbnRzKCRiYXNlLicvJy4kcmVsKTsKICAgICAgICAgICAgcHJlZ19tYXRjaF9hbGwoJy8oPzpwdWJsaWN8cHJvdGVjdGVkfHByaXZhdGUpP1xzKnN0YXRpY1xzK2Z1bmN0aW9uXHMrKFx3KylccypcKChbXildKilcKS8nLCAkYywgJG0pOwogICAgICAgICAgICAkc2lnPWFycmF5KCk7IGZvcmVhY2goJG1bMV0gYXMgJGk9PiRuKXsgJHNpZ1tdPSRuLicoJy50cmltKCRtWzJdWyRpXSkuJyknOyB9CiAgICAgICAgICAgICRyWydsYXlvdXRfZmlsZSddPSRyZWw7ICRyWydsYXlvdXRfbWV0aG9kcyddPSRzaWc7CiAgICAgICAgfQogICAgfQogICAgLy8gc2FibG9udSBrYXRhbG9nYXMKICAgICR0cGwgPSBhcnJheSgpOwogICAgZm9yZWFjaCAoJGZpbGVzIGFzICRyZWw9PiRzeikgeyBpZiAoc3RycG9zKCRyZWwsJ3RlbXBsYXRlJykhPT1mYWxzZSB8fCBzdHJwb3MoJHJlbCwnZW1haWxzLycpIT09ZmFsc2UpICR0cGxbJHJlbF09JHN6OyB9CiAgICAkclsndHBsX2ZpbGVzJ109JHRwbDsKCiAgICAvLyBncmVwOiBwb3N0X3B1cmNoYXNlIGlyIGZsb3cgcmVnaXN0cmFjaWphCiAgICAkaGl0cz1hcnJheSgpOwogICAgZm9yZWFjaCAoJGZpbGVzIGFzICRyZWw9PiRzeikgewogICAgICAgICRjID0gZmlsZV9nZXRfY29udGVudHMoJGJhc2UuJy8nLiRyZWwpOwogICAgICAgIGZvcmVhY2ggKGFycmF5KCdwb3N0X3B1cmNoYXNlJywnZmxvd19jbGFzcycsJ0ZMT1dTJywncmVnaXN0ZXJfZmxvdycsJ3RlbXBsYXRlX21pc3NpbmcnKSBhcyAkaykgewogICAgICAgICAgICBpZiAoc3RycG9zKCRjLCRrKSE9PWZhbHNlKSAkaGl0c1ska11bXT0kcmVsOwogICAgICAgIH0KICAgIH0KICAgICRyWydncmVwX2NvcmUnXT0kaGl0czsKCiAgICAvLyBlc3AgYWRhcHRlcmlzOiByZXBseV90bwogICAgJGVzcCA9IFdQX1BMVUdJTl9ESVIgLiAnL3BldHNob3AtZXNwJzsKICAgICRlcj1hcnJheSgpOwogICAgaWYgKGlzX2RpcigkZXNwKSkgewogICAgICAgICRpdDIgPSBuZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGVzcCwgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3I6OlNLSVBfRE9UUykpOwogICAgICAgIGZvcmVhY2ggKCRpdDIgYXMgJGYpIHsKICAgICAgICAgICAgaWYgKCRmLT5pc0ZpbGUoKSAmJiBzdWJzdHIoJGYtPmdldEZpbGVuYW1lKCksLTQpPT09Jy5waHAnKSB7CiAgICAgICAgICAgICAgICAkYz1maWxlX2dldF9jb250ZW50cygkZi0+Z2V0UGF0aG5hbWUoKSk7CiAgICAgICAgICAgICAgICBpZiAoc3RycG9zKCRjLCdyZXBseV90bycpIT09ZmFsc2UgfHwgc3RycG9zKCRjLCdyZXBseVRvJykhPT1mYWxzZSkgewogICAgICAgICAgICAgICAgICAgIHByZWdfbWF0Y2hfYWxsKCcvLns4MH1yZXBseV8/W1R0XW8uezgwfS9zJywkYywkbW0pOwogICAgICAgICAgICAgICAgICAgICRlcltzdHJfcmVwbGFjZSgkZXNwLicvJywnJywkZi0+Z2V0UGF0aG5hbWUoKSldPWFycmF5X3NsaWNlKCRtbVswXSwwLDQpOwogICAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CiAgICAgICAgfQogICAgfQogICAgJHJbJ2VzcF9yZXBseV90byddPSRlcjsKCiAgICBub2NhY2hlX2hlYWRlcnMoKTsKICAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9QUkVUVFlfUFJJTlQpOwogICAgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP PP2D Recon v1',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 5');
  const d=sh('curl -sSk "'+SITE+'/?ps_pp=Rc9k"');
  try{O.recon=JSON.parse(d.out);}catch(e){O.raw=d.out.slice(0,1500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  sh('sleep 2');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
}
putB64('pp2d_recon.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
