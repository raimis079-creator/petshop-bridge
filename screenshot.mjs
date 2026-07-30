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
// pirma deaktyvuoti visus senus TEMP Event Dump snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP Event Dump/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgRXZlbnQgRW1pdHRlcnMgRHVtcCB2MQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfZTInXSkgfHwgJF9HRVRbJ3BzX2UyJ10gIT09ICdFMmRtJyApIHJldHVybjsKICAgICRyPWFycmF5KCk7CiAgICAkcCA9IFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvY2xhc3MtZXZlbnQtZW1pdHRlcnMucGhwJzsKICAgICRyWydlbWl0dGVyc19iNjQnXSA9IGZpbGVfZXhpc3RzKCRwKSA/IGJhc2U2NF9lbmNvZGUoZmlsZV9nZXRfY29udGVudHMoJHApKSA6IG51bGw7CiAgICAvLyBrdXIgZGFyIGt2aWVjaWFtYXMgZW1pdAogICAgJGhpdHM9YXJyYXkoKTsKICAgICRyaWkgPSBuZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoV1BfUExVR0lOX0RJUikpOwogICAgZm9yZWFjaCAoJHJpaSBhcyAkZikgewogICAgICAgIGlmICghJGYtPmlzRmlsZSgpIHx8IHN1YnN0cigkZi0+Z2V0RmlsZW5hbWUoKSwtNCkhPT0nLnBocCcpIGNvbnRpbnVlOwogICAgICAgICRwYXRoPSRmLT5nZXRQYXRobmFtZSgpOwogICAgICAgIGlmIChzdHJwb3MoJHBhdGgsJy9wZXRzaG9wLScpPT09ZmFsc2UpIGNvbnRpbnVlOwogICAgICAgIGlmIChzdHJwb3MoJHBhdGgsJy5iYWsnKSE9PWZhbHNlKSBjb250aW51ZTsKICAgICAgICAkYz1maWxlX2dldF9jb250ZW50cygkcGF0aCk7CiAgICAgICAgaWYgKHN0cnBvcygkYywncHNfZW1pdF9ldmVudCcpIT09ZmFsc2UgfHwgc3RycG9zKCRjLCdlbWl0X2V2ZW50JykhPT1mYWxzZSkgewogICAgICAgICAgICAkbGluZXM9YXJyYXkoKTsKICAgICAgICAgICAgZm9yZWFjaCAoZXhwbG9kZSgiXG4iLCRjKSBhcyAkaT0+JGxuKSB7CiAgICAgICAgICAgICAgICBpZiAoc3RycG9zKCRsbiwnZW1pdF9ldmVudCcpIT09ZmFsc2UpICRsaW5lc1tdPSgkaSsxKS4nOiAnLnRyaW0obWJfc3Vic3RyKCRsbiwwLDE0MCkpOwogICAgICAgICAgICB9CiAgICAgICAgICAgICRoaXRzW3N0cl9yZXBsYWNlKFdQX1BMVUdJTl9ESVIuJy8nLCcnLCRwYXRoKV09YXJyYXlfc2xpY2UoJGxpbmVzLDAsMTIpOwogICAgICAgIH0KICAgIH0KICAgICRyWydlbWl0X2NhbGxzJ109JGhpdHM7CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Event Dump Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_e2=E2dm"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_e2=E2dm"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('ee2.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
