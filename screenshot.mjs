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
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUmVmaWxsIEZpeCBWZXJpZnkgUzMwNSB2MQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfdmYnXSkgfHwgJF9HRVRbJ3BzX3ZmJ10gIT09ICdWZjMwNScgKSByZXR1cm47CiAgICAkb3V0ID0gYXJyYXkoKTsKICAgIGlmICggISBjbGFzc19leGlzdHMoJ1BldHNob3BfUmVmaWxsX0VuZ2luZScpICkgeyAkb3V0WydFUlInXT0na2xhc2UgbmVyYXN0YSc7IH0KICAgIGVsc2UgewogICAgICAgICRtID0gbmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfUmVmaWxsX0VuZ2luZScsJ2lzX2Zvb2RfcHJvZHVjdCcpOwogICAgICAgICRtLT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogICAgICAgICRjaGsgPSBmdW5jdGlvbigkcGlkKSB1c2UgKCRtKSB7CiAgICAgICAgICAgIHJldHVybiBhcnJheSgKICAgICAgICAgICAgICAgICdpZCc9PiRwaWQsCiAgICAgICAgICAgICAgICAndGl0bGUnPT5tYl9zdWJzdHIoKHN0cmluZylnZXRfdGhlX3RpdGxlKCRwaWQpLDAsNDYpLAogICAgICAgICAgICAgICAgJ2NhdHMnPT53cF9nZXRfcG9zdF90ZXJtcygkcGlkLCdwcm9kdWN0X2NhdCcsYXJyYXkoJ2ZpZWxkcyc9PidzbHVncycpKSwKICAgICAgICAgICAgICAgICdpc19mb29kJz0+ICRtLT5pbnZva2UobnVsbCwkcGlkKSA/ICdUQUlQJyA6ICdORScsCiAgICAgICAgICAgICk7CiAgICAgICAgfTsKICAgICAgICAvLyBrb25rcmV0dXMgdGVzdGFpCiAgICAgICAgJG91dFsndGVzdHMnXSA9IGFycmF5KCk7CiAgICAgICAgZm9yZWFjaCAoYXJyYXkoMzQyMjYsIDM0NTAwLCAzNDQ4NikgYXMgJHBpZCkgeyAkb3V0Wyd0ZXN0cyddW109JGNoaygkcGlkKTsgfQoKICAgICAgICAvLyBwbyB2aWVuYSBpcyBraWVrdmllbm9zIHN2YXJiaW9zIGthdGVnb3Jpam9zCiAgICAgICAgJHBpY2sgPSBmdW5jdGlvbigkc2x1Zyl7CiAgICAgICAgICAgICRxPW5ldyBXUF9RdWVyeShhcnJheSgncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywncG9zdHNfcGVyX3BhZ2UnPT4xLCdmaWVsZHMnPT4naWRzJywKICAgICAgICAgICAgICAndGF4X3F1ZXJ5Jz0+YXJyYXkoYXJyYXkoJ3RheG9ub215Jz0+J3Byb2R1Y3RfY2F0JywnZmllbGQnPT4nc2x1ZycsJ3Rlcm1zJz0+JHNsdWcsJ2luY2x1ZGVfY2hpbGRyZW4nPT5mYWxzZSkpLCdub19mb3VuZF9yb3dzJz0+dHJ1ZSkpOwogICAgICAgICAgICByZXR1cm4gJHEtPnBvc3RzID8gJHEtPnBvc3RzWzBdIDogMDsKICAgICAgICB9OwogICAgICAgIGZvcmVhY2ggKGFycmF5KCdrb25zZXJ2YWkta2F0ZW1zJywna29uc2VydmFpLXN1bmltcycsJ3NhdXNhcy1tYWlzdGFzLXN1bmltcycsJ3NrYW5lc3RhaS1zdW5pbXMnLCd2aXRhbWluYWktaXItcGFwaWxkYWktc3VuaW1zJywnYWt2YXJpdW1vLXp1dnljaXUtbWFpc3RhcycpIGFzICRzKSB7CiAgICAgICAgICAgICRwaWQ9JHBpY2soJHMpOwogICAgICAgICAgICAkb3V0WydieV9jYXQnXVskc10gPSAkcGlkID8gJGNoaygkcGlkKSA6ICduZXJhIHByZWtpdSc7CiAgICAgICAgfQoKICAgICAgICAvLyBwaWxuYXMgcGVyc2thaWNpYXZpbWFzCiAgICAgICAgJHEgPSBuZXcgV1BfUXVlcnkoYXJyYXkoJ3Bvc3RfdHlwZSc9Pidwcm9kdWN0JywncG9zdF9zdGF0dXMnPT4ncHVibGlzaCcsJ3Bvc3RzX3Blcl9wYWdlJz0+LTEsJ2ZpZWxkcyc9PidpZHMnLCdub19mb3VuZF9yb3dzJz0+dHJ1ZSkpOwogICAgICAgICRwYXNzPTA7ICRmYWlsPTA7CiAgICAgICAgZm9yZWFjaCAoJHEtPnBvc3RzIGFzICRwaWQpIHsgaWYgKCRtLT5pbnZva2UobnVsbCwkcGlkKSkgJHBhc3MrKzsgZWxzZSAkZmFpbCsrOyB9CiAgICAgICAgJG91dFsncHVibGlzaF90b3RhbCddPWNvdW50KCRxLT5wb3N0cyk7CiAgICAgICAgJG91dFsnaXNfZm9vZF9QQVNTX25vdyddPSRwYXNzOwogICAgICAgICRvdXRbJ2lzX2Zvb2RfRkFJTF9ub3cnXT0kZmFpbDsKICAgIH0KICAgIG5vY2FjaGVfaGVhZGVycygpOwogICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJG91dCwgSlNPTl9VTkVTQ0FQRURfU0xBU0hFU3xKU09OX1VORVNDQVBFRF9VTklDT0RFKTsKICAgIGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Refill Fix Verify S305 v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_vf=Vf305"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_vf=Vf305"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('vf.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
